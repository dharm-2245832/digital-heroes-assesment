import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8 mt-20">
          <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
          <p className="text-gray-400 text-lg">
            Digital Heroes is built to connect passion with purpose. We believe that your hobbies and activities can have a positive impact on the world. By combining performance tracking with a robust charitable donation system, we create a community where everyone wins.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
