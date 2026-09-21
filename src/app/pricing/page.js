import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto mt-20 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Simple Pricing. Real Impact.</h1>
          <p className="text-gray-400 text-lg">Choose a plan that works for you. Every plan includes charity contributions.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col">
            <h3 className="text-xl font-medium text-gray-300">Monthly</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              $15<span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
            </div>
            <p className="mt-4 text-sm text-gray-400">Perfect for getting started and trying out the platform.</p>
            <ul className="mt-8 space-y-4 flex-1">
              <li className="flex items-center text-sm text-gray-300"><span className="mr-3 text-blue-500">✓</span> Minimum 10% to charity</li>
              <li className="flex items-center text-sm text-gray-300"><span className="mr-3 text-blue-500">✓</span> Monthly prize draw entry</li>
              <li className="flex items-center text-sm text-gray-300"><span className="mr-3 text-blue-500">✓</span> Score tracking dashboard</li>
            </ul>
            <Link href="/signup" className="mt-8 block">
              <Button className="w-full">Subscribe Monthly</Button>
            </Link>
          </div>

          <div className="bg-gradient-to-b from-blue-900/40 to-gray-900 border border-blue-500/30 rounded-2xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <h3 className="text-xl font-medium text-blue-400">Yearly</h3>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              $150<span className="ml-1 text-xl font-medium text-gray-500">/yr</span>
            </div>
            <p className="mt-4 text-sm text-gray-400">Save $30 compared to the monthly plan and make a year-long impact.</p>
            <ul className="mt-8 space-y-4 flex-1">
              <li className="flex items-center text-sm text-gray-300"><span className="mr-3 text-blue-500">✓</span> Minimum 10% to charity</li>
              <li className="flex items-center text-sm text-gray-300"><span className="mr-3 text-blue-500">✓</span> Monthly prize draw entry</li>
              <li className="flex items-center text-sm text-gray-300"><span className="mr-3 text-blue-500">✓</span> Score tracking dashboard</li>
            </ul>
            <Link href="/signup" className="mt-8 block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Subscribe Yearly</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
