"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UserCircle,
  ImageIcon,
  CalendarDays,
  Settings,
  ChevronRight,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainerDashboardNavProps {
  status?: string;
}

const navItems = [
  { key: "overview", href: "", icon: LayoutDashboard },
  { key: "profile", href: "/profile", icon: UserCircle },
  { key: "photos", href: "/photos", icon: ImageIcon },
  { key: "calendar", href: "/calendar", icon: CalendarDays },
  { key: "settings", href: "/settings", icon: Settings },
];

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  DRAFT: { label: "status.draft", color: "text-yellow-400", dot: "bg-yellow-400" },
  PENDING: { label: "status.pending", color: "text-blue-400", dot: "bg-blue-400" },
  PUBLISHED: { label: "status.published", color: "text-emerald-400", dot: "bg-emerald-400" },
  REJECTED: { label: "status.rejected", color: "text-red-400", dot: "bg-red-400" },
  SUSPENDED: { label: "status.suspended", color: "text-gray-400", dot: "bg-gray-400" },
};

export function TrainerDashboardNav({ status = "DRAFT" }: TrainerDashboardNavProps) {
  const t = useTranslations("trainerDashboard");
  const locale = useLocale();
  const pathname = usePathname();

  const basePath = `/${locale}/trainer-dashboard`;
  const statusInfo = statusConfig[status] || statusConfig.DRAFT;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="lg:sticky lg:top-24 space-y-6">
        {/* Brand */}
        <div className="px-4 py-3 rounded-xl bg-[#111118] border border-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#ff6b35]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{t("nav.brand")}</p>
              <p className="text-xs text-[#5a5a6a]">{t("nav.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="px-4 py-3 rounded-xl bg-[#111118] border border-[#1e1e2e]">
          <p className="text-xs text-[#5a5a6a] mb-2">{t("status.label")}</p>
          <div className="flex items-center gap-2">
            <span className={cn("relative flex h-2.5 w-2.5", status === "PENDING" && "animate-pulse")}>
              <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", statusInfo.dot)} />
              <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", statusInfo.dot)} />
            </span>
            <span className={cn("text-sm font-medium", statusInfo.color)}>
              {t(statusInfo.label)}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const fullPath = `${basePath}${item.href}`;
            const isActive = pathname === fullPath || pathname.startsWith(`${fullPath}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={fullPath}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                  isActive
                    ? "bg-[#ff6b35]/10 text-[#ff6b35] font-medium"
                    : "text-[#8b8b9a] hover:text-white hover:bg-[#1a1a25]"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{t(`nav.${item.key}`)}</span>
                {isActive && (
                  <motion.div layoutId="activeNav" className="w-1 h-4 rounded-full bg-[#ff6b35]" />
                )}
                <ChevronRight className={cn("w-3.5 h-3.5 opacity-0 transition-opacity", isActive && "opacity-100")} />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
