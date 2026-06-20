"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Eye, MessageSquare, Star, CalendarCheck, ArrowRight,
  UserCircle, ImageIcon, CalendarDays, AlertCircle,
  CheckCircle2, Clock, XCircle, PauseCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  profileViews: number;
  bookingInquiries: number;
  totalBookings: number;
  rating: number;
  reviewCount: number;
  status: string;
}

const statusConfig: Record<string, { icon: typeof AlertCircle; color: string; bg: string; title: string; desc: string }> = {
  DRAFT: { icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", title: "overview.draftTitle", desc: "overview.draftDesc" },
  PENDING: { icon: Clock, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", title: "overview.pendingTitle", desc: "overview.pendingDesc" },
  PUBLISHED: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", title: "overview.publishedTitle", desc: "overview.publishedDesc" },
  REJECTED: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", title: "overview.rejectedTitle", desc: "overview.draftDesc" },
  SUSPENDED: { icon: PauseCircle, color: "text-gray-400", bg: "bg-gray-400/10 border-gray-400/20", title: "overview.rejectedTitle", desc: "overview.pendingDesc" },
};

export default function TrainerDashboardPage() {
  const t = useTranslations("trainerDashboard");
  const locale = useLocale();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trainer/me/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#1e1e2e] rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[#111118] rounded-xl border border-[#1e1e2e] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-[#5a5a6a] mx-auto mb-4" />
        <p className="text-[#8b8b9a]">{t("overview.noProfile")}</p>
      </div>
    );
  }

  const statusInfo = statusConfig[stats.status] || statusConfig.DRAFT;
  const StatusIcon = statusInfo.icon;

  const statCards = [
    { key: "views", value: stats.profileViews, icon: Eye, color: "text-[#4a9eff]" },
    { key: "inquiries", value: stats.bookingInquiries, icon: MessageSquare, color: "text-[#ff6b35]" },
    { key: "rating", value: stats.rating.toFixed(1), icon: Star, color: "text-yellow-400" },
    { key: "bookings", value: stats.totalBookings, icon: CalendarCheck, color: "text-[#00d4aa]" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">{t("overview.greeting", { name: "Coach" })}</h1>
        <p className="text-[#8b8b9a]">{t("overview.subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] hover:border-[#2a2a3e] transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-lg bg-[#0a0a0f]", card.color)}><Icon className={cn("w-4 h-4", card.color)} /></div>
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-[#5a5a6a] mt-1">{t(`overview.${card.key}`)}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn("p-4 rounded-xl border", statusInfo.bg)}>
        <div className="flex items-start gap-3">
          <StatusIcon className={cn("w-5 h-5 mt-0.5", statusInfo.color)} />
          <div>
            <p className={cn("font-semibold", statusInfo.color)}>{t(statusInfo.title)}</p>
            <p className="text-sm text-[#8b8b9a] mt-1">{t(statusInfo.desc)}</p>
            {stats.status === "DRAFT" && (
              <Link href={`/${locale}/trainer-dashboard/profile`} className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[#ff6b35] hover:text-[#ff6b35]/80 transition-colors">
                {t("overview.editProfile")}<ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {stats.status === "REJECTED" && (
              <Link href={`/${locale}/trainer-dashboard/profile`} className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[#ff6b35] hover:text-[#ff6b35]/80 transition-colors">
                {t("overview.editAndResubmit")}<ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {stats.status === "PUBLISHED" && (
              <Link href={`/${locale}/trainers`} className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-emerald-400 hover:text-emerald-400/80 transition-colors">
                {t("overview.viewPublic")}<ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">{t("overview.quickActions")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "actionProfile", icon: UserCircle, href: "/profile" },
            { key: "actionPhotos", icon: ImageIcon, href: "/photos" },
            { key: "actionCalendar", icon: CalendarDays, href: "/calendar" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.key} href={`/${locale}/trainer-dashboard${action.href}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#111118] border border-[#1e1e2e] hover:border-[#ff6b35]/30 hover:bg-[#1a1a25] transition-all group">
                <div className="p-3 rounded-lg bg-[#0a0a0f] group-hover:bg-[#ff6b35]/10 transition-colors">
                  <Icon className="w-5 h-5 text-[#8b8b9a] group-hover:text-[#ff6b35] transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t(`overview.${action.key}`)}</p>
                  <p className="text-xs text-[#5a5a6a] mt-0.5">{t(`overview.${action.key}Desc`)}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#5a5a6a] ml-auto group-hover:text-[#ff6b35] transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
