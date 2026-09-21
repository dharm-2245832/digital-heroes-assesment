"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRazorpayOrder, verifyPayment } from "@/actions/subscription";
import { Button } from "@/components/ui/button";
import Script from "next/script";

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (planType) => {
    setLoading(true);
    setError("");

    try {
      const order = await createRazorpayOrder(planType);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_example", // Fallback for MVP display purposes
        amount: order.amount,
        currency: order.currency,
        name: "Digital Heroes",
        description: `${planType} Subscription`,
        order_id: order.orderId,
        handler: async function (response) {
          const res = await verifyPayment({
            ...response,
            planType,
          });

          if (res.success) {
            router.push("/dashboard?subscribed=true");
            router.refresh();
          } else {
            setError(res.error || "Payment verification failed");
            setLoading(false);
          }
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        setError("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-3xl font-bold tracking-tight text-white">Choose Your Subscription</h1>

      {error && <div className="p-4 bg-red-500/10 text-red-500 rounded">{error}</div>}

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-medium text-gray-300">Monthly Plan</h2>
          <p className="mt-4 text-4xl font-bold text-white">$15/mo</p>
          <ul className="mt-6 space-y-3 text-sm text-gray-400 mb-8">
             <li>✓ 10% goes to charity</li>
             <li>✓ Enter monthly draw</li>
          </ul>
          <Button
            className="w-full"
            onClick={() => handleSubscribe("MONTHLY")}
            disabled={loading}
          >
            {loading ? "Processing..." : "Select Monthly"}
          </Button>
        </div>

        <div className="bg-gray-900 border border-blue-500 rounded-xl p-8 relative">
          <div className="absolute top-0 right-0 bg-blue-500 text-xs font-bold px-3 py-1 rounded-bl-lg text-white">POPULAR</div>
          <h2 className="text-xl font-medium text-blue-400">Yearly Plan</h2>
          <p className="mt-4 text-4xl font-bold text-white">$150/yr</p>
          <ul className="mt-6 space-y-3 text-sm text-gray-400 mb-8">
             <li>✓ Save $30</li>
             <li>✓ 10% goes to charity</li>
             <li>✓ Enter monthly draw</li>
          </ul>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => handleSubscribe("YEARLY")}
            disabled={loading}
          >
            {loading ? "Processing..." : "Select Yearly"}
          </Button>
        </div>
      </div>
    </div>
  );
}
