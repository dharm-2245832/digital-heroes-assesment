import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ScoreForm } from "./ScoreForm";
import { ScoreList } from "./ScoreList";

export default async function ScoresPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true }
  });

  const isActive = user?.subscription?.status === "ACTIVE";

  const scores = await prisma.golfScore.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" }
  });

  if (!isActive) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Score Management</h1>
        <p className="text-gray-400">Please subscribe to unlock score tracking.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Score Management</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-medium mb-4">Add New Score</h2>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <ScoreForm currentCount={scores.length} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium mb-4">Your Recent Scores ({scores.length}/5)</h2>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <ScoreList scores={scores} />
          </div>
        </div>
      </div>
    </div>
  );
}
