import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CharityForm } from "./CharityForm";

export default async function DashboardCharityPage() {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true }
  });

  const charities = await prisma.charity.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">Your Charity Impact</h1>
      <p className="text-gray-400">Select the cause you want to support. A minimum of 10% of your subscription goes directly to them.</p>

      <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl">
        <CharityForm
          charities={charities}
          currentSelection={user.charityId}
          currentPercentage={user.contributionPercentage}
        />
      </div>
    </div>
  );
}
