"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sun, Cloud, Moon } from "lucide-react";

const PERIODS = [
  { icon: Sun, key: "morning" },
  { icon: Cloud, key: "afternoon" },
  { icon: Moon, key: "evening" },
] as const;

export function ScheduleSection() {
  const t = useTranslations("prepCampPage.schedule");

  return (
    <section className="py-24 bg-neutral-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">
            {t("badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            {t("title")}{" "}
            <span className="text-teal-400">{t("titleHighlight")}</span>
          </h2>
          <p className="text-neutral-400 max-w-3xl mx-auto text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="space-y-6">
          {PERIODS.map((period, index) => (
            <motion.div
              key={period.key}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 md:p-8 flex items-start gap-6"
            >
              <div className="w-14 h-14 bg-teal-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <period.icon className="w-7 h-7 text-teal-400" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {t(period.key)}
                  </h3>
                  <span className="text-amber-400 font-mono text-sm font-semibold">
                    {t(`${period.key}Time`)}
                  </span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  {t(`${period.key}Desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
