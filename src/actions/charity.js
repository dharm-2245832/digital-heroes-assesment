"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateUserCharity(formData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };

  const charityId = formData.get("charityId");
  const contributionPercentage = parseInt(formData.get("contributionPercentage"));

  if (!charityId) {
    return { error: "Charity selection is required" };
  }

  if (isNaN(contributionPercentage) || contributionPercentage < 10 || contributionPercentage > 100) {
    return { error: "Contribution must be between 10% and 100%" };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        charityId,
        contributionPercentage,
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Update charity error:", error);
    return { error: "Failed to update charity preferences" };
  }
}
