"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function cancelSubscription() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Unauthorized" };

  try {
    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { status: "CANCELLED" }
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to cancel subscription" };
  }
}
