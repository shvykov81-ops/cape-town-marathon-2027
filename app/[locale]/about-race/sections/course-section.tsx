"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MapPin, TrendingUp, Thermometer, Droplets } from "lucide-react";

const STATS = [
  { icon: MapPin, key: "distance" },
  { icon: TrendingUp, key: "elevation" },
  { icon: Thermometer, key: "temperature" },
  { icon: Droplets, key: "aidStations" },
] as const;

const CHECKPOINTS = [
  "start", "districtSix", "woodstock", "seaPoint", "clifton", "finish",
] as const;

export function CourseSection() {
  const t = useTranslations("aboutRace.course");

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center backdrop-blur-sm"
            >
              <stat.icon className="w-6 h-6 text-teal-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">
                {t(`stats.${stat.key}Value`)}
              </div>
              <div className="text-sm text-neutral-500">
                {t(`stats.${stat.key}`)}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative bg-neutral-900/30 border border-neutral-800 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500/50 via-amber-500/50 to-teal-500/50 -translate-y-1/2" />

            {CHECKPOINTS.map((cp, index) => (
              <motion.div
                key={cp}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative z-10 text-center flex-1"
              >
                <div
                  className={`w-4 h-4 rounded-full mx-auto mb-3 ${
                    cp === "start" || cp === "finish"
                      ? "bg-amber-400 ring-4 ring-amber-400/20"
                      : "bg-teal-400 ring-4 ring-teal-400/20"
                  }`}
                />
                <div className="text-white font-semibold text-sm">
                  {t(`checkpoints.${cp}.label`)}
                </div>
                <div className="text-neutral-500 text-xs mt-1">
                  {t(`checkpoints.${cp}.desc`)}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center text-neutral-400 text-sm mt-8 italic"
          >
            {t("note")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
