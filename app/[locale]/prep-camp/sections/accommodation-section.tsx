"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Hotel, Utensils, Heart, Bus } from "lucide-react";

const FEATURES = [
  { icon: Hotel, key: "hotel" },
  { icon: Utensils, key: "nutrition" },
  { icon: Heart, key: "spa" },
  { icon: Bus, key: "transport" },
] as const;

export function AccommodationSection() {
  const t = useTranslations("prepCampPage.accommodation");

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

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-700 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-teal-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">
                {t(`features.${feature.key}.title`)}
              </h3>
              <p className="text-neutral-400 leading-relaxed">
                {t(`features.${feature.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
