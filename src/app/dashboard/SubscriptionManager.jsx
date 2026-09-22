"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelSubscription } from "@/actions/subscriptionStatus";
import { Button } from "@/components/ui/button";

export function SubscriptionManager({ plan, status }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will lose access to draws and score tracking.")) return;

    setLoading(true);
    await cancelSubscription();
    router.refresh();
    setLoading(false);
  };

  if (status !== "ACTIVE") return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCancel}
      disabled={loading}
      className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
    >
      Cancel Subscription
    </Button>
  );
}
