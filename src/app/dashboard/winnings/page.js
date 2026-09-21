import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProofUploadForm } from "./ProofUploadForm";

export default async function WinningsPage() {
  const session = await getServerSession(authOptions);

  const winnings = await prisma.winner.findMany({
    where: { userId: session.user.id },
    include: { draw: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Winnings</h1>

      {winnings.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl text-center">
          <p className="text-gray-400">You haven't won any draws yet. Keep your scores updated!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {winnings.map(win => (
            <div key={win.id} className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">{win.matchType} Matches</span>
                  <span className="text-gray-400 text-sm">{new Date(win.draw.month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} Draw</span>
                </div>
                <p className="text-3xl font-bold text-green-500">${win.prizeAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-400 mt-1">Status: <span className="text-white font-medium">{win.status}</span></p>
              </div>

              <div className="w-full md:w-auto">
                {win.status === "PENDING" && !win.proofUrl && (
                   <ProofUploadForm winnerId={win.id} />
                )}
                {win.proofUrl && win.status === "PENDING" && (
                  <p className="text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded">Proof uploaded. Awaiting admin review.</p>
                )}
                {win.status === "APPROVED" && (
                   <p className="text-sm text-blue-500 bg-blue-500/10 p-3 rounded">Approved! Payout is being processed.</p>
                )}
                 {win.status === "PAID" && (
                   <p className="text-sm text-green-500 bg-green-500/10 p-3 rounded">Payout completed successfully.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
