import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubscriptionManager } from "./SubscriptionManager";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      charity: true,
      scores: {
        orderBy: { date: 'desc' }
      },
      winnings: true
    }
  });

  const isActive = user?.subscription?.status === "ACTIVE";
  const totalWinnings = user.winnings.reduce((sum, win) => sum + win.prizeAmount, 0);

  const nextDrawDate = new Date();
  nextDrawDate.setMonth(nextDrawDate.getMonth() + 1);
  nextDrawDate.setDate(1);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-gray-400 mt-2">Here is what is happening with your account today.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col">
          <h3 className="text-gray-400 text-sm font-medium">Subscription</h3>
          <p className="mt-2 text-2xl font-bold">
            {isActive ? (
              <span className="text-green-500">{user.subscription.plan}</span>
            ) : (
              <span className="text-red-500">Inactive</span>
            )}
          </p>
          <div className="mt-auto pt-4 space-y-2">
             {!isActive ? (
               <Link href="/dashboard/subscribe">
                 <Button size="sm" className="w-full">Subscribe</Button>
               </Link>
             ) : (
               <SubscriptionManager plan={user.subscription.plan} status={user.subscription.status} />
             )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col">
          <h3 className="text-gray-400 text-sm font-medium">Recorded Scores</h3>
          <p className="mt-2 text-2xl font-bold">{user.scores.length} / 5</p>
          <div className="mt-auto pt-4">
            <Link href="/dashboard/scores">
              <Button size="sm" variant="outline" className="w-full">Manage Scores</Button>
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col">
          <h3 className="text-gray-400 text-sm font-medium">Charity Impact</h3>
          <p className="mt-2 text-xl font-bold truncate">
            {user.charity ? user.charity.name : "None"}
          </p>
          <p className="text-blue-500 text-sm font-medium">{user.contributionPercentage}% contribution</p>
          <div className="mt-auto pt-4">
            <Link href="/dashboard/charity">
              <Button size="sm" variant="outline" className="w-full">Change Cause</Button>
            </Link>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col">
          <h3 className="text-gray-400 text-sm font-medium">Total Winnings</h3>
          <p className="mt-2 text-2xl font-bold text-green-500">${totalWinnings.toFixed(2)}</p>
          <div className="mt-auto pt-4">
            <Link href="/dashboard/winnings">
              <Button size="sm" variant="outline" className="w-full">View Details</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Draw Participation Section */}
      <h2 className="text-xl font-bold tracking-tight pt-4">Next Draw Participation</h2>
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-gray-400 mb-1">Expected Draw Date</p>
            <p className="text-xl font-bold">{nextDrawDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="flex-1 max-w-lg w-full">
            <p className="text-gray-400 mb-2">Your Current Draw Numbers</p>
            {user.scores.length === 5 ? (
              <div className="flex gap-3">
                {user.scores.map(s => (
                  <div key={s.id} className="w-12 h-12 rounded bg-blue-900/40 border border-blue-500/50 flex flex-col items-center justify-center text-blue-400">
                    <span className="text-lg font-bold">{s.score}</span>
                  </div>
                ))}
              </div>
            ) : (
               <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded flex items-center justify-between">
                 <p className="text-yellow-500 text-sm">You need {5 - user.scores.length} more scores to enter.</p>
                 <Link href="/dashboard/scores">
                   <Button size="sm" variant="outline" className="text-yellow-500 border-yellow-500 hover:bg-yellow-500/20">Add Scores</Button>
                 </Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
