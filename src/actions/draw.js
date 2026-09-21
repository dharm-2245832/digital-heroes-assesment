"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Weighted random sampling implementation
function getWeightedRandom(items) {
  let totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    random -= items[i].weight;
    if (random <= 0) {
      return items[i].value;
    }
  }
  return items[items.length - 1].value;
}

export async function simulateDraw(formData) {
  const session = await getServerSession(authOptions);
  if (session?.role !== "ADMIN") return { error: "Unauthorized" };

  const mode = formData.get("mode"); // "RANDOM" or "ALGORITHM"

  try {
    // 1. Get all users with ACTIVE subscriptions
    const activeSubscribers = await prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      select: { userId: true }
    });

    const activeUserIds = activeSubscribers.map(sub => sub.userId);

    // 2. Get their scores
    const userScoresData = await prisma.user.findMany({
      where: { id: { in: activeUserIds } },
      select: {
        id: true,
        scores: {
          orderBy: { date: 'desc' },
          take: 5
        }
      }
    });

    // Filter users who actually have 5 scores
    const eligibleUsers = userScoresData.filter(u => u.scores.length === 5);

    let drawnNumbers = [];

    if (mode === "ALGORITHM") {
      // Algorithmic mode: Weight numbers based on frequency
      const frequencies = {};
      for (let i = 1; i <= 45; i++) frequencies[i] = 0.1; // Base small weight for all

      eligibleUsers.forEach(user => {
        user.scores.forEach(scoreObj => {
          frequencies[scoreObj.score] += 1;
        });
      });

      const items = Object.keys(frequencies).map(num => ({
        value: parseInt(num),
        weight: frequencies[num]
      }));

      while (drawnNumbers.length < 5) {
        const num = getWeightedRandom(items);
        if (!drawnNumbers.includes(num)) {
          drawnNumbers.push(num);
        }
      }
    } else {
      // Random mode: purely random 1-45
      while (drawnNumbers.length < 5) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!drawnNumbers.includes(num)) {
          drawnNumbers.push(num);
        }
      }
    }

    // 3. Calculate simulated winners
    let matches3 = 0, matches4 = 0, matches5 = 0;

    eligibleUsers.forEach(user => {
      const userNumbers = user.scores.map(s => s.score);
      const matchCount = userNumbers.filter(n => drawnNumbers.includes(n)).length;

      if (matchCount === 3) matches3++;
      if (matchCount === 4) matches4++;
      if (matchCount === 5) matches5++;
    });

    // Note: To simplify the flow, we'll store the simulation in the DB with status "SIMULATED"
    // so it can be previewed or published later.
    const month = new Date();
    month.setDate(1);
    month.setHours(0,0,0,0);

    // Remove any existing simulated draw for the month
    await prisma.draw.deleteMany({
      where: {
        month: month,
        status: "SIMULATED"
      }
    });

    const newDraw = await prisma.draw.create({
      data: {
        month: month,
        numbers: drawnNumbers,
        mode: mode,
        status: "SIMULATED"
      }
    });

    return {
      success: true,
      drawId: newDraw.id,
      numbers: drawnNumbers,
      participants: eligibleUsers.length,
      matches3,
      matches4,
      matches5,
    };
  } catch (error) {
    console.error("Simulation error:", error);
    return { error: "Failed to simulate draw" };
  }
}

export async function publishDraw(drawId) {
  const session = await getServerSession(authOptions);
  if (session?.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    const draw = await prisma.draw.findUnique({ where: { id: drawId } });
    if (!draw || draw.status === "PUBLISHED") {
      return { error: "Draw not found or already published" };
    }

    // Mark as published
    await prisma.draw.update({
      where: { id: drawId },
      data: { status: "PUBLISHED" }
    });

    // Re-calculate winners and create DB records
    const activeSubscribers = await prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      select: { userId: true }
    });

    const activeUserIds = activeSubscribers.map(sub => sub.userId);
    const eligibleUsers = await prisma.user.findMany({
      where: { id: { in: activeUserIds } },
      select: {
        id: true,
        scores: { orderBy: { date: 'desc' }, take: 5 }
      }
    });

    const totalPrizePool = activeUserIds.length * 5; // Example: $5 from each sub goes to pool

    const drawnNumbers = draw.numbers;
    const winnersToCreate = [];

    let count5 = 0, count4 = 0, count3 = 0;
    const userMatches = eligibleUsers.map(user => {
      if (user.scores.length === 5) {
        const userNumbers = user.scores.map(s => s.score);
        const matchCount = userNumbers.filter(n => drawnNumbers.includes(n)).length;
        if (matchCount === 5) count5++;
        if (matchCount === 4) count4++;
        if (matchCount === 3) count3++;
        return { userId: user.id, userNumbers, matchCount };
      }
      return null;
    }).filter(Boolean);

    // Prize calculations
    const pool5 = totalPrizePool * 0.40;
    const pool4 = totalPrizePool * 0.35;
    const pool3 = totalPrizePool * 0.25;

    for (const data of userMatches) {
      // Record their entry regardless
      await prisma.drawEntry.create({
        data: {
          drawId: draw.id,
          userId: data.userId,
          scores: data.userNumbers,
          matches: data.matchCount
        }
      });

      if (data.matchCount >= 3) {
        let amount = 0;
        if (data.matchCount === 5) amount = pool5 / count5;
        if (data.matchCount === 4) amount = pool4 / count4;
        if (data.matchCount === 3) amount = pool3 / count3;

        winnersToCreate.push({
          drawId: draw.id,
          userId: data.userId,
          matchType: data.matchCount,
          prizeAmount: amount,
          status: "PENDING"
        });
      }
    }

    if (winnersToCreate.length > 0) {
      await prisma.winner.createMany({
        data: winnersToCreate
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Publish error:", error);
    return { error: "Failed to publish draw" };
  }
}
