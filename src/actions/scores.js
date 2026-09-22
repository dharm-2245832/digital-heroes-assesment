"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function addScore(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };

  const score = parseInt(formData.get("score"));
  const dateStr = formData.get("date");

  if (isNaN(score) || score < 1 || score > 45) {
    return { error: "Score must be between 1 and 45" };
  }

  if (!dateStr) {
    return { error: "Date is required" };
  }

  const date = new Date(dateStr);
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  try {
    const existing = await prisma.golfScore.findFirst({
      where: {
        userId: session.user.id,
        date: startOfDay,
      }
    });

    if (existing) {
      return { error: "A score for this date already exists" };
    }

    const currentScores = await prisma.golfScore.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "asc" }
    });

    if (currentScores.length >= 5) {
      // Remove the oldest score(s) to make room
      const toDelete = currentScores.slice(0, currentScores.length - 4);
      for (const s of toDelete) {
        await prisma.golfScore.delete({ where: { id: s.id } });
      }
    }

    await prisma.golfScore.create({
      data: {
        userId: session.user.id,
        score,
        date: startOfDay,
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Score entry error:", error);
    return { error: "Failed to add score" };
  }
}

export async function deleteScore(scoreId) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };

  try {
    await prisma.golfScore.delete({
      where: {
        id: scoreId,
        userId: session.user.id
      }
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete score" };
  }
}
