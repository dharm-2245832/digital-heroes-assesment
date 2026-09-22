import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const revalidate = 60; // ISR

export default async function CharitiesPage() {
  const charities = await prisma.charity.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto mt-12 space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-center">Charity Directory</h1>
          <p className="text-center text-gray-400 max-w-2xl mx-auto">Explore the incredible organizations we support. When you subscribe, you choose where your impact goes.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {charities.map((charity) => (
              <div key={charity.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{charity.name}</h3>
                  <p className="mt-3 text-sm text-gray-400 line-clamp-3">{charity.description}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <Link href={`/charities/${charity.id}`}>
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
