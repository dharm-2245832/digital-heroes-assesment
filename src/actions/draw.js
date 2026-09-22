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

  const mode = formData.get("mode");

  try {
    const activeSubscribers = await prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      select: { userId: true }
    });

    const activeUserIds = activeSubscribers.map(sub => sub.userId);

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

    const eligibleUsers = userScoresData.filter(u => u.scores.length === 5);

    let drawnNumbers = [];

    if (mode === "ALGORITHM") {
      const frequencies = {};
      for (let i = 1; i <= 45; i++) frequencies[i] = 0.1;

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
      while (drawnNumbers.length < 5) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!drawnNumbers.includes(num)) {
          drawnNumbers.push(num);
        }
      }
    }

    let matches3 = 0, matches4 = 0, matches5 = 0;

    eligibleUsers.forEach(user => {
      const userNumbers = user.scores.map(s => s.score);
      const matchCount = userNumbers.filter(n => drawnNumbers.includes(n)).length;

      if (matchCount === 3) matches3++;
      if (matchCount === 4) matches4++;
      if (matchCount === 5) matches5++;
    });

    const month = new Date();
    month.setDate(1);
    month.setHours(0,0,0,0);

    await prisma.draw.deleteMany({
      where: {
        month: month,
        status: "SIMULATED"
      }
    });

    // Check if there was a previous jackpot rollover
    const lastDraw = await prisma.draw.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { month: "desc" }
    });

    // For MVP, we calculate the estimated rollover pool size.
    // Example: If last draw had 0 5-match winners, 40% of its pool rolled over.
    // For simulation we just note the theoretical jackpot rollover logic requirement.

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

    await prisma.draw.update({
      where: { id: drawId },
      data: { status: "PUBLISHED" }
    });

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

    // Determine current month prize pool contribution
    let totalPrizePool = activeUserIds.length * 5; // $5 per sub

    // Jackpot Rollover Logic
    // Find the last published draw before this one
    const prevDraw = await prisma.draw.findFirst({
      where: {
        status: "PUBLISHED",
        month: { lt: draw.month }
      },
      orderBy: { month: 'desc' }
    });

    let rolloverAmount = 0;
    if (prevDraw) {
      // Check if previous draw had any 5-match winners
      const prevWinners5 = await prisma.winner.count({
        where: { drawId: prevDraw.id, matchType: 5 }
      });
      if (prevWinners5 === 0) {
        // If no winners, 40% of previous total pool rolls over.
        // For MVP, since we don't store historical total active users easily without complex tables,
        // we'll simulate a static rollover amount from the previous draw or recalculate based on current users.
        rolloverAmount = (activeUserIds.length * 5) * 0.40;
      }
    }

    const pool5 = (totalPrizePool * 0.40) + rolloverAmount;
    const pool4 = totalPrizePool * 0.35;
    const pool3 = totalPrizePool * 0.25;

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

    for (const data of userMatches) {
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
