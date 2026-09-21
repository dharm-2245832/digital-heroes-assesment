"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_example",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_secret_example",
});

export async function createRazorpayOrder(planType) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const amount = planType === "YEARLY" ? 15000 : 1500; // in cents (INR paise typically, but assuming cents for USD display)

  try {
    const order = await razorpay.orders.create({
      amount: amount,
      currency: "USD",
      receipt: `receipt_${session.user.id}_${Date.now()}`,
    });

    return { orderId: order.id, amount, currency: order.currency };
  } catch (error) {
    console.error("Razorpay order error:", error);
    throw new Error("Failed to create order");
  }
}

export async function verifyPayment(data) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = data;
  const session = await getServerSession(authOptions);

  if (!session?.user) return { success: false, error: "Unauthorized" };

  const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_example";
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const periodEnd = new Date();
    if (planType === "YEARLY") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        plan: planType,
        status: "ACTIVE",
        razorpayOrderId: razorpay_order_id,
        currentPeriodEnd: periodEnd,
      },
      create: {
        userId: session.user.id,
        plan: planType,
        status: "ACTIVE",
        razorpayOrderId: razorpay_order_id,
        currentPeriodEnd: periodEnd,
      },
    });

    return { success: true };
  } else {
    return { success: false, error: "Invalid signature" };
  }
}
