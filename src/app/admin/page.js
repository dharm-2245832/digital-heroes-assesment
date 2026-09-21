import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const userCount = await prisma.user.count();
  const subCount = await prisma.subscription.count({ where: { status: 'ACTIVE' } });
  const charityCount = await prisma.charity.count();
  const winnerCount = await prisma.winner.count();

  // Simple Analytics
  const totalPrizePoolSimulated = subCount * 5;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold mt-2">{userCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Active Subs</p>
          <p className="text-3xl font-bold mt-2 text-green-500">{subCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Est. Next Prize Pool</p>
          <p className="text-3xl font-bold mt-2 text-blue-500">${totalPrizePoolSimulated}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm">Total Winners</p>
          <p className="text-3xl font-bold mt-2">{winnerCount}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link href="/admin/draws">
              <Button variant="outline" className="w-full justify-start">Run Monthly Draw</Button>
            </Link>
            <Link href="/admin/winners">
              <Button variant="outline" className="w-full justify-start">Verify Winner Proofs</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
