import prisma from "@/lib/prisma";
import { CharityAdminClient } from "./CharityAdminClient";

export default async function AdminCharitiesPage() {
  const charities = await prisma.charity.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Charity Management</h1>
      <CharityAdminClient initialCharities={charities} />
    </div>
  );
}
