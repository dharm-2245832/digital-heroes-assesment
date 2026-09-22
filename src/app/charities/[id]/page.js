import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default async function CharityDetailsPage({ params }) {
  const { id } = await params;
  const charity = await prisma.charity.findUnique({
    where: { id }
  });

  if (!charity) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto mt-20 space-y-8">
          <Link href="/charities" className="text-blue-500 hover:underline text-sm flex items-center">
            &larr; Back to Directory
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">{charity.name}</h1>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-4">About this Cause</h2>
            <p className="text-gray-300 leading-relaxed">{charity.description}</p>
          </div>
          <div className="flex justify-center mt-12">
             <Link href="/signup">
               <Button size="lg">Support this Charity</Button>
             </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
