"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Mountain } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-race", label: "About the Race" },
  { href: "/prep-camp", label: "Prep Camp" },
  { href: "/race-week", label: "Race Week" },
  { href: "/cape-town-guide", label: "Cape Town Guide" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Mountain className="w-8 h-8 text-teal-400 group-hover:text-teal-300 transition-colors" />
            <span className="text-xl font-bold tracking-tight">
              Cape Town <span className="text-teal-400">Marathon</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-neutral-300 hover:text-white rounded-md hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/account"
              className="text-sm text-neutral-300 hover:text-white transition-colors"
            >
              My Account
            </Link>
            <Link
              href="/booking"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-full transition-all hover:scale-105"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-neutral-950 border-b border-white/10"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-neutral-300 hover:text-white hover:bg-white/5 rounded-md transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-neutral-300 hover:text-white"
                >
                  My Account
                </Link>
                <Link
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 bg-teal-600 text-white text-center rounded-full font-semibold"
                >
                  Book Now
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
