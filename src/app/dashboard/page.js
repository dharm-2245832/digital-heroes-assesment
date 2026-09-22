import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <div className="mt-auto pt-4">
             {!isActive && (
               <Link href="/dashboard/subscribe">
                 <Button size="sm" className="w-full">Subscribe</Button>
               </Link>
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

      {isActive && user.scores.length < 5 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-yellow-500 font-medium">Complete Your Entry</p>
            <p className="text-gray-400 text-sm">You need 5 scores to participate in the monthly draw.</p>
          </div>
          <Link href="/dashboard/scores">
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">Add Scores</Button>
          </Link>
        </div>
      )}
      {isActive && user.scores.length === 5 && (
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-center justify-between">
          <div>
            <p className="text-green-500 font-medium">Ready for Draw</p>
            <p className="text-gray-400 text-sm">Your 5 scores are locked in for the upcoming monthly draw. Good luck!</p>
          </div>
        </div>
      )}
    </div>
  );
}
