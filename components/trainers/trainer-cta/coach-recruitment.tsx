"use client";

import { motion } from "framer-motion";
import { ArrowRight, Dumbbell } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function CoachRecruitment() {
  const t = useTranslations("trainersPage.cta");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff6b35]/10 via-[#4a9eff]/10 to-[#00d4aa]/10 border border-[#1e1e2e] p-8 lg:p-12"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b35]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4a9eff]/5 rounded-full blur-3xl" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#ff8f5a] flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{t("title")}</h3>
            <p className="text-sm text-[#8b8b9a] mt-1">{t("subtitle")}</p>
          </div>
        </div>

        <Link
          href="/contact?subject=coach"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white font-medium rounded-lg transition-colors group"
        >
          {t("button")}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
