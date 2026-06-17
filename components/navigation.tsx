"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, User } from "lucide-react";
import { LocaleSwitcher } from "./locale-switcher";

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations("navigation");

    const navLinks = [
        { href: `/${locale}/about-race`, label: t("about") },
        { href: `/${locale}/prep-camp`, label: t("prepCamp") },
        { href: `/${locale}/race-week`, label: t("raceWeek") },
        { href: `/${locale}/cape-town-guide`, label: t("capeTownGuide") },
        { href: `/${locale}/trainers`, label: t("trainers") },
        { href: `/${locale}/pricing`, label: t("pricing") },
        { href: `/${locale}/blog`, label: t("blog") },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={`/${locale}`} className="flex items-center gap-2">
                        <span className="text-xl font-bold gradient-text">RUN & Travel</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${isActive(link.href)
                                        ? "text-teal-400"
                                        : "text-neutral-400 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <LocaleSwitcher />
                        <Link
                            href={`/${locale}/booking`}
                            className="px-4 py-2 bg-teal-500 text-neutral-950 font-semibold text-sm rounded-full hover:bg-teal-400 transition-colors"
                        >
                            {t("booking")}
                        </Link>
                        <Link
                            href={`/${locale}/account`}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <User className="w-5 h-5 text-neutral-300" />
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg bg-white/5"
                    >
                        {isOpen ? (
                            <X className="w-5 h-5 text-white" />
                        ) : (
                            <Menu className="w-5 h-5 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-white/5">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2 rounded-lg text-sm font-medium ${isActive(link.href)
                                        ? "bg-teal-500/10 text-teal-400"
                                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="px-4 py-2">
                            <LocaleSwitcher />
                        </div>
                        <Link
                            href={`/${locale}/booking`}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 bg-teal-500 text-neutral-950 font-semibold text-sm rounded-full text-center"
                        >
                            {t("booking")}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}