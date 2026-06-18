"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";

const DAYS = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"] as const;

export function ProgramSection() {
  const t = useTranslations("prepCampPage.program");

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DAYS.map((day, index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-teal-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-teal-400" />
                </div>
                <span className="text-teal-400 text-sm font-semibold uppercase tracking-wider">
                  {t(`days.${day}.label`)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {t(`days.${day}.title`)}
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {t(`days.${day}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
