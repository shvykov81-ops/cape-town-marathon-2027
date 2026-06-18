"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Check, ArrowRight, Star } from "lucide-react";

const PACKAGES = ["essential", "pro", "elite"] as const;

export function PricingSection() {
  const t = useTranslations("prepCampPage.pricing");
  const locale = useLocale();

  return (
    <section className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">
            {t("badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            {t("title")}{" "}
            <span className="text-amber-400">{t("titleHighlight")}</span>
          </h2>
          <p className="text-neutral-400 max-w-3xl mx-auto text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative bg-neutral-900 border rounded-2xl p-8 ${
                pkg === "pro"
                  ? "border-teal-500/30 ring-1 ring-teal-500/20 scale-105"
                  : "border-neutral-800"
              }`}
            >
              {pkg === "pro" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-full uppercase flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {t("popular")}
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">
                {t(`${pkg}.name`)}
              </h3>
              <div className="text-4xl font-bold text-teal-400 font-mono mb-4">
                {t(`${pkg}.price`)}
              </div>
              <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
                {t(`${pkg}.desc`)}
              </p>

              <ul className="space-y-3 mb-8">
                {[0, 1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-300">
                      {t(`${pkg}.features.${i}`)}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/booking?package=${pkg}`}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  pkg === "pro"
                    ? "bg-teal-600 hover:bg-teal-500 text-white hover:scale-105"
                    : "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                }`}
              >
                {t("cta")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
