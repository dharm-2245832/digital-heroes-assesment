import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
        <div className="mb-8 font-bold text-xl tracking-tight text-blue-500">Admin Panel</div>
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded hover:bg-gray-800 text-sm">Overview</Link>
          <Link href="/admin/draws" className="block px-4 py-2 rounded hover:bg-gray-800 text-sm">Draw Management</Link>
          <Link href="/admin/winners" className="block px-4 py-2 rounded hover:bg-gray-800 text-sm">Winner Verification</Link>
          <Link href="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800 text-sm mt-8 text-gray-400">Exit Admin</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
