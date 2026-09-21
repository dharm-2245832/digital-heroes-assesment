import prisma from "@/lib/prisma";
import { WinnerActionButtons } from "./WinnerActionButtons";

export default async function AdminWinnersPage() {
  const winners = await prisma.winner.findMany({
    include: {
      user: true,
      draw: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Winner Verification</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Draw Month</th>
              <th className="px-6 py-4 font-medium">Match & Prize</th>
              <th className="px-6 py-4 font-medium">Proof</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {winners.map(winner => (
              <tr key={winner.id} className="hover:bg-gray-800/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{winner.user.name}</p>
                  <p className="text-gray-500">{winner.user.email}</p>
                </td>
                <td className="px-6 py-4">
                  {new Date(winner.draw.month).toLocaleDateString(undefined, {month: 'short', year: 'numeric'})}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-xs mr-2">{winner.matchType} Match</span>
                  <span className="font-bold text-green-500">${winner.prizeAmount.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  {winner.proofUrl ? (
                    <a href={winner.proofUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">View Proof</a>
                  ) : (
                    <span className="text-gray-500">Not uploaded</span>
                  )}
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded text-xs font-medium ${
                     winner.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                     winner.status === 'APPROVED' ? 'bg-blue-500/20 text-blue-500' :
                     winner.status === 'PAID' ? 'bg-green-500/20 text-green-500' :
                     'bg-red-500/20 text-red-500'
                   }`}>
                     {winner.status}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <WinnerActionButtons winnerId={winner.id} currentStatus={winner.status} hasProof={!!winner.proofUrl} />
                </td>
              </tr>
            ))}
            {winners.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No winners found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
