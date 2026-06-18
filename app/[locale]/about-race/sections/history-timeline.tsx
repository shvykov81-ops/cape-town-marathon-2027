"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const TIMELINE_KEYS = ["1994", "2014", "2024", "2026", "2027"] as const;

export function HistoryTimeline() {
  const t = useTranslations("aboutRace.history");

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
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4">
            {t("title")}{" "}
            <span className="text-amber-400">{t("titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/50 via-amber-500/50 to-transparent md:-translate-x-px" />

          <div className="space-y-12">
            {TIMELINE_KEYS.map((key, index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-start gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-teal-400 rounded-full ring-4 ring-neutral-950 md:-translate-x-1.5 mt-2" />

                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                  }`}
                >
                  <span className="text-amber-400 text-3xl font-bold font-mono">
                    {t(`timeline.${key}.year`)}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-2">
                    {t(`timeline.${key}.title`)}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {t(`timeline.${key}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
