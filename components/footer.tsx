"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TelegramIcon } from "@/components/icons/telegram-icon";

const footerLinks = {
  event: [
    { label: "About the Race", href: "/about-race" },
    { label: "Prep Camp", href: "/prep-camp" },
    { label: "Race Week", href: "/race-week" },
    { label: "Cape Town Guide", href: "/cape-town-guide" },
  ],
  services: [
    { label: "Pricing", href: "/pricing" },
    { label: "Book Now", href: "/booking" },
    { label: "Trainers", href: "/trainers" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const TELEGRAM_PUBLIC_URL = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL || "https://t.me/capetownmarathon2027";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold text-white">
                RUN <span className="text-teal-500">&</span> Travel
              </span>
            </Link>
            <p className="mt-4 text-sm text-neutral-400">
              Africa's first Abbott World Marathon Majors candidate event.
            </p>
            <div className="mt-4">
              <a
                href={TELEGRAM_PUBLIC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#229ED9] hover:text-[#1a8bc2] transition-colors"
              >
                <TelegramIcon size={18} />
                <span>Join us on Telegram</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Event</h3>
            <ul className="space-y-3">
              {footerLinks.event.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-teal-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-teal-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-neutral-400 hover:text-teal-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Cape Town Marathon 2027. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={TELEGRAM_PUBLIC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-[#229ED9] hover:bg-[#229ED9]/10 transition-colors"
              aria-label="Telegram"
            >
              <TelegramIcon size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
