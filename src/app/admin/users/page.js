import prisma from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      subscription: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">User & Subscription Management</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Subscription Status</th>
              <th className="px-6 py-4 font-medium">Plan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-white">{user.name || "N/A"}</td>
                <td className="px-6 py-4 text-gray-400">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded text-xs font-medium ${
                     user.subscription?.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' :
                     user.subscription?.status === 'CANCELLED' ? 'bg-yellow-500/20 text-yellow-500' :
                     'bg-red-500/20 text-red-500'
                   }`}>
                     {user.subscription?.status || "NO SUBSCRIPTION"}
                   </span>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {user.subscription?.plan || "-"}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
