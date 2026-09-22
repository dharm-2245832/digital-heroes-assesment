import prisma from "@/lib/prisma";
import { DrawSimulator } from "./DrawSimulator";

export default async function AdminDrawsPage() {
  const latestDraw = await prisma.draw.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Draw Management</h1>
      <p className="text-gray-400 max-w-2xl">
        Simulate the monthly draw using pure randomness or our weighted algorithm based on user scores.
        Once satisfied, publish the draw to calculate real winners and prize pools.
      </p>

      <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl">
        <DrawSimulator latestDraw={latestDraw} />
      </div>
    </div>
  );
}
