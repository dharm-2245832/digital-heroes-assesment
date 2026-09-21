import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true }
  });

  const isActive = user?.subscription?.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
        <div className="mb-8 font-bold text-xl tracking-tight">Dashboard</div>
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800 text-sm">Overview</Link>
          <Link href="/dashboard/scores" className="block px-4 py-2 rounded hover:bg-gray-800 text-sm">Scores</Link>
          <Link href="/dashboard/charity" className="block px-4 py-2 rounded hover:bg-gray-800 text-sm">Charity</Link>
          <Link href="/dashboard/winnings" className="block px-4 py-2 rounded hover:bg-gray-800 text-sm">Winnings</Link>
        </nav>
        <div className="mt-8 pt-8 border-t border-gray-800">
          <Link href="/api/auth/signout" className="block px-4 py-2 text-sm text-gray-400 hover:text-white">Sign Out</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {!isActive && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div>
              <p className="font-medium text-blue-400">Subscription Inactive</p>
              <p className="text-sm text-gray-400">Subscribe to unlock score tracking and monthly draws.</p>
            </div>
            <Link href="/dashboard/subscribe" className="px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700 whitespace-nowrap">Subscribe Now</Link>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
