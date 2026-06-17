"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { TelegramIcon } from "./icons/telegram-icon";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");

  const footerLinks = {
    event: [
      { href: `/${locale}/about-race`, label: t("event") },
      { href: `/${locale}/race-week`, label: "Race Week" },
      { href: `/${locale}/cape-town-guide`, label: "Cape Town Guide" },
    ],
    services: [
      { href: `/${locale}/trainers`, label: t("services") },
      { href: `/${locale}/prep-camp`, label: "Prep Camp" },
      { href: `/${locale}/pricing`, label: "Pricing" },
    ],
    support: [
      { href: `/${locale}/contact`, label: t("support") },
      { href: `/${locale}/faq`, label: "FAQ" },
      { href: `/${locale}/terms`, label: "Terms" },
    ],
  };

  return (
    <footer className="bg-neutral-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold gradient-text mb-4">{t("brand")}</h3>
            <p className="text-sm text-neutral-500 mb-6">{t("tagline")}</p>
            <a
              href={process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/20 text-[#0088cc] text-sm font-medium hover:bg-[#0088cc]/20 transition-colors"
            >
              <TelegramIcon className="w-4 h-4" />
              {t("telegram")}
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t("event")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.event.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t("services")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t("support")}
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-teal-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-600">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
