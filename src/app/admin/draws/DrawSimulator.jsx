"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { simulateDraw, publishDraw } from "@/actions/draw";
import { Button } from "@/components/ui/button";

export function DrawSimulator({ latestDraw }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [simulation, setSimulation] = useState(null);

  const handleSimulate = async (mode) => {
    setLoading(true);
    setError("");
    setSimulation(null);

    const formData = new FormData();
    formData.append("mode", mode);

    const result = await simulateDraw(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setSimulation(result);
    }
    setLoading(false);
  };

  const handlePublish = async () => {
    if (!simulation) return;
    setLoading(true);
    const result = await publishDraw(simulation.drawId);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSimulation(null);
      router.refresh();
      setLoading(false);
    }
  };

  const isPublished = latestDraw?.status === "PUBLISHED" &&
    new Date(latestDraw.month).getMonth() === new Date().getMonth();

  if (isPublished && !simulation) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-bold text-green-500 mb-2">Draw Already Published for this Month</h3>
        <p className="text-gray-400">Winning numbers: {latestDraw.numbers.join(", ")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && <div className="p-3 bg-red-500/10 text-red-500 rounded">{error}</div>}

      {!simulation ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-700 p-6 rounded-lg text-center">
            <h3 className="font-bold text-lg mb-2">Random Mode</h3>
            <p className="text-sm text-gray-400 mb-6">Pure random selection of 5 numbers between 1 and 45.</p>
            <Button onClick={() => handleSimulate("RANDOM")} disabled={loading} className="w-full">
              Simulate Random Draw
            </Button>
          </div>
          <div className="border border-blue-500/30 bg-blue-900/10 p-6 rounded-lg text-center">
            <h3 className="font-bold text-lg mb-2 text-blue-400">Algorithm Mode</h3>
            <p className="text-sm text-gray-400 mb-6">Weights numbers based on the frequency they appear in active users' scores.</p>
            <Button onClick={() => handleSimulate("ALGORITHM")} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              Simulate Algorithm Draw
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Simulation Results</h3>
            <div className="flex justify-center gap-4 mb-8">
              {simulation.numbers.map((num, i) => (
                <div key={i} className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                  {num}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 bg-gray-950 p-6 rounded-lg text-center">
            <div>
              <p className="text-gray-500 text-sm">Participants</p>
              <p className="text-xl font-bold">{simulation.participants}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Jackpot (5)</p>
              <p className="text-xl font-bold text-yellow-500">{simulation.matches5}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tier 2 (4)</p>
              <p className="text-xl font-bold">{simulation.matches4}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Tier 3 (3)</p>
              <p className="text-xl font-bold">{simulation.matches3}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button variant="outline" onClick={() => setSimulation(null)} disabled={loading} className="flex-1">
              Discard & Re-simulate
            </Button>
            <Button onClick={handlePublish} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
              {loading ? "Publishing..." : "Publish Results Official"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
