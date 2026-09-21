"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateWinnerStatus } from "@/actions/verification";
import { Button } from "@/components/ui/button";

export function WinnerActionButtons({ winnerId, currentStatus, hasProof }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    setLoading(true);
    await updateWinnerStatus(winnerId, status);
    router.refresh();
    setLoading(false);
  };

  if (currentStatus === "PENDING" && hasProof) {
    return (
      <div className="flex gap-2">
        <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={loading} onClick={() => handleAction("APPROVED")}>Approve</Button>
        <Button size="sm" variant="destructive" disabled={loading} onClick={() => handleAction("REJECTED")}>Reject</Button>
      </div>
    );
  }

  if (currentStatus === "APPROVED") {
    return (
      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" disabled={loading} onClick={() => handleAction("PAID")}>Mark as Paid</Button>
    );
  }

  return <span className="text-gray-500 text-xs">No actions</span>;
}
