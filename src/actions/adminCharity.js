"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createCharity(formData) {
  const session = await getServerSession(authOptions);
  if (session?.role !== "ADMIN") return { error: "Unauthorized" };

  const name = formData.get("name");
  const description = formData.get("description");

  if (!name || !description) return { error: "Name and description are required" };

  try {
    await prisma.charity.create({
      data: { name, description }
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to create charity" };
  }
}

export async function deleteCharity(id) {
  const session = await getServerSession(authOptions);
  if (session?.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    await prisma.charity.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete charity. It may be linked to existing users." };
  }
}
