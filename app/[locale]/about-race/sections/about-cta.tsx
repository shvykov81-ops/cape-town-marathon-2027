"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight, Package } from "lucide-react";

export function AboutCta() {
  const t = useTranslations("aboutRace.cta");
  const locale = useLocale();

  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("title")}{" "}
            <span className="text-teal-400">{t("titleHighlight")}</span>
          </h2>

          <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/booking`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full transition-all hover:scale-105"
            >
              {t("button")}
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href={`/${locale}/pricing`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-full transition-all border border-neutral-700"
            >
              <Package className="w-5 h-5" />
              {t("secondary")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
