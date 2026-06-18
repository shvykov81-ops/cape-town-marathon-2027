"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Trophy, Clock, Star } from "lucide-react";

const RECORDS = [
  { type: "men", icon: Trophy, color: "text-amber-400", bg: "bg-amber-500/10" },
  { type: "women", icon: Star, color: "text-teal-400", bg: "bg-teal-500/10" },
  { type: "legend", icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10" },
] as const;

export function RecordsSection() {
  const t = useTranslations("aboutRace.records");

  return (
    <section className="py-24 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4">
            {t("title")}{" "}
            <span className="text-teal-400">{t("titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {RECORDS.map((record, index) => (
            <motion.div
              key={record.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-colors"
            >
              <div className={`w-12 h-12 ${record.bg} rounded-xl flex items-center justify-center mb-6`}>
                <record.icon className={`w-6 h-6 ${record.color}`} />
              </div>

              <div className="text-neutral-500 text-sm font-semibold uppercase tracking-wider mb-2">
                {t(`${record.type}Title`)}
              </div>

              <div className="text-4xl font-bold text-white font-mono mb-2">
                {t(`${record.type}Time`)}
              </div>

              <div className="text-white font-semibold mb-1">
                {t(`${record.type}Name`)}
              </div>

              <div className="text-neutral-500 text-sm mb-4">
                {t(`${record.type}Year`)}
              </div>

              <p className="text-neutral-400 text-sm leading-relaxed">
                {t(`${record.type}Desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
