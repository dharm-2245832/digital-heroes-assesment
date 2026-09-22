import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <Header />
      <main className="flex-1">
        <section className="relative px-6 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-950 -z-10" />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl">
            Play. Win. <span className="text-blue-500">Make an Impact.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Join a community where your golf performance translates into real-world charitable contributions and exciting monthly prize draws.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg">Subscribe Now</Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg">Learn More</Button>
            </Link>
          </div>
        </section>

        <section className="px-6 py-20 bg-gray-900/50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto text-blue-500 font-bold text-xl">1</div>
              <h3 className="text-xl font-bold">Track Your Scores</h3>
              <p className="text-gray-400 text-sm">Enter your last 5 golf scores. We use your performance to create your unique entry for the monthly draw.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto text-blue-500 font-bold text-xl">2</div>
              <h3 className="text-xl font-bold">Support a Charity</h3>
              <p className="text-gray-400 text-sm">Choose a charity. A portion of your subscription fee goes directly to a cause you care about.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto text-blue-500 font-bold text-xl">3</div>
              <h3 className="text-xl font-bold">Win Prizes</h3>
              <p className="text-gray-400 text-sm">Participate in monthly draws. Match your scores with the drawn numbers to win from the prize pool.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
