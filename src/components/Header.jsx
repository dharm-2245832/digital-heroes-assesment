"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950 text-white relative z-50">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-gray-300">
          Digital Heroes
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-6 text-sm">
        <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
        <Link href="/how-it-works" className="hover:text-gray-300 transition-colors">How It Works</Link>
        <Link href="/charities" className="hover:text-gray-300 transition-colors">Charities</Link>
        <Link href="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
      </nav>

      <div className="hidden md:flex space-x-4">
        <Link href="/login">
          <Button variant="ghost">Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button>Get Started</Button>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-400 hover:text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 border-b border-gray-800 p-4 flex flex-col space-y-4 md:hidden">
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white px-2 py-1">About</Link>
          <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white px-2 py-1">How It Works</Link>
          <Link href="/charities" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white px-2 py-1">Charities</Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white px-2 py-1">Pricing</Link>
          <div className="border-t border-gray-800 pt-4 flex flex-col space-y-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
