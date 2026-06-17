"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const t = useTranslations("locale");

    const handleChange = (newLocale: string) => {
        // Replace current locale in pathname with new one
        const segments = pathname.split("/");
        segments[1] = newLocale;
        const newPath = segments.join("/");

        // Set cookie and do full page reload for proper locale switch
        document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
        window.location.href = newPath;
    };

    return (
        <div className="relative flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-400" />
            <select
                value={locale}
                onChange={(e) => handleChange(e.target.value)}
                className="appearance-none bg-transparent text-sm text-neutral-300 hover:text-white focus:outline-none cursor-pointer pr-4"
            >
                <option value="en">{t("en")}</option>
                <option value="ru">{t("ru")}</option>
            </select>
            <div className="absolute right-0 pointer-events-none">
                <svg className="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}