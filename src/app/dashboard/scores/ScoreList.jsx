"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteScore } from "@/actions/scores";
import { Button } from "@/components/ui/button";

export function ScoreList({ scores }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState(null);

  const handleDelete = async (id) => {
    setLoadingId(id);
    await deleteScore(id);
    router.refresh();
    setLoadingId(null);
  };

  if (!scores || scores.length === 0) {
    return <p className="text-gray-400 text-sm">No scores recorded yet. Add your first score to participate in the draw.</p>;
  }

  return (
    <ul className="space-y-3">
      {scores.map((score) => (
        <li key={score.id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
          <div>
            <p className="font-bold text-lg text-blue-400">{score.score} pts</p>
            <p className="text-xs text-gray-400">{new Date(score.date).toLocaleDateString()}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={() => handleDelete(score.id)}
            disabled={loadingId === score.id}
          >
            {loadingId === score.id ? "..." : "Delete"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
