"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addScore } from "@/actions/scores";
import { Button } from "@/components/ui/button";

export function ScoreForm({ currentCount }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await addScore(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      e.currentTarget.reset();
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {currentCount >= 5 && (
        <div className="text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded">
          You have 5 scores. Adding a new one will replace your oldest score.
        </div>
      )}
      {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded">{error}</div>}

      <div>
        <label className="text-sm font-medium text-gray-300">Stableford Score (1-45)</label>
        <input
          name="score"
          type="number"
          min="1"
          max="45"
          required
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300">Date Played</label>
        <input
          name="date"
          type="date"
          required
          max={new Date().toISOString().split("T")[0]}
          className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Score"}
      </Button>
    </form>
  );
}
