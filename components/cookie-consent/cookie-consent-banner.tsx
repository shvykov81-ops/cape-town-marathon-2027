"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CookieConsentProps {
  locale: string;
}

const CONSENT_KEY = "cookie-consent";

export function CookieConsentBanner({ locale }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
    if ((window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    }
  };

  const acceptEssential = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
    if ((window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }
  };

  if (!showBanner) return null;

  const isRu = locale === "ru";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#111118] border-t border-[#1e1e2e] p-4 md:p-6"
      role="dialog"
      aria-label={isRu ? "Согласие на использование cookies" : "Cookie consent"}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-[#8b8b9a]">
            {isRu
              ? "Мы используем cookies для аналитики и основного функционала. Вы можете настроить предпочтения."
              : "We use cookies for analytics and essential functionality. You can customize your preferences."}
          </p>
          <div className="mt-2 flex gap-4 text-xs text-[#5a5a6a]">
            <Link href={`/${locale}/privacy`} className="hover:text-[#ff6b35] underline">
              {isRu ? "Политика конфиденциальности" : "Privacy Policy"}
            </Link>
            <Link href={`/${locale}/cookies`} className="hover:text-[#ff6b35] underline">
              Cookies
            </Link>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={acceptEssential}
            className="border-[#1e1e2e] text-[#8b8b9a] hover:bg-[#1a1a25]"
          >
            {isRu ? "Только необходимые" : "Essential only"}
          </Button>
          <Button
            size="sm"
            onClick={acceptAll}
            className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white"
          >
            {isRu ? "Принять все" : "Accept all"}
          </Button>
        </div>
      </div>
    </div>
  );
}
