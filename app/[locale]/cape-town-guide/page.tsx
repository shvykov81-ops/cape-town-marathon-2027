"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  MapPin, Sun, Thermometer, Droplets, Wind,
  Footprints, Heart, Camera, Coffee, ShoppingBag,
  Mountain, Waves
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Mountain, ShoppingBag, MapPin, Waves, Heart, Camera,
  Sun, Thermometer, Wind, Footprints, Coffee, Droplets,
};

const attractions = [
  { key: "tableMountain", icon: "Mountain" },
  { key: "vaWaterfront", icon: "ShoppingBag" },
  { key: "capePoint", icon: "MapPin" },
  { key: "bouldersBeach", icon: "Waves" },
  { key: "kirstenbosch", icon: "Heart" },
  { key: "boKaap", icon: "Camera" },
];

const months = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

const runnerTips = [
  { key: "sunProtection", icon: "Sun" },
  { key: "hydration", icon: "Droplets" },
  { key: "capeDoctor", icon: "Wind" },
  { key: "temperature", icon: "Thermometer" },
  { key: "trailRunning", icon: "Footprints" },
  { key: "coffee", icon: "Coffee" },
];

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CapeTownGuidePage() {
  const t = useTranslations("capeTownGuide");
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <div className="pt-20">
      {/* Hero with Image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <Image
            src="/images/cape-town-table-mountain.jpg"
            alt={t("hero.imageAlt")}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase bg-teal-950/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
              {t("hero.badge")}
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-6 mb-6 drop-shadow-lg">
              {t("hero.title")}{" "}
              <span className="text-teal-400">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="text-neutral-300 text-lg max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Attractions */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("attractions.title")}</h2>
            <p className="text-neutral-400">{t("attractions.subtitle")}</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attr, i) => {
              const Icon = iconMap[attr.icon];
              return (
                <FadeIn key={attr.key} delay={i * 0.1}>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-teal-500/30 transition-all hover:bg-white/[0.07] group h-full">
                    <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">
                      {t(`attractions.items.${attr.key}.name`)}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-4">
                      {t(`attractions.items.${attr.key}.desc`)}
                    </p>
                    <div className="flex items-start gap-2 text-xs text-teal-300/70">
                      <span className="text-teal-400 flex-shrink-0 font-semibold">
                        {t("attractions.tipLabel")}:
                      </span>
                      {t(`attractions.items.${attr.key}.tip`)}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Weather Table */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("weather.title")}</h2>
            <p className="text-neutral-400">{t("weather.subtitle")}</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">
                      {t("weather.month")}
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">
                      {t("weather.temp")}
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">
                      {t("weather.rainfall")}
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">
                      {t("weather.wind")}
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">
                      {t("weather.notes")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((m, i) => (
                    <motion.tr
                      key={m}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        m === "oct" ? "bg-teal-500/10" : ""
                      }`}
                    >
                      <td className="py-4 px-4 font-semibold">
                        {t(`weather.months.${m}.label`)}
                      </td>
                      <td className="py-4 px-4 text-neutral-300">
                        {t(`weather.months.${m}.temp`)}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            t(`weather.months.${m}.rain`) === "Low"
                              ? "bg-green-500/20 text-green-400"
                              : t(`weather.months.${m}.rain`) === "Moderate"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          <Droplets className="w-3 h-3" />
                          {t(`weather.months.${m}.rain`)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-neutral-300">
                        {t(`weather.months.${m}.wind`)}
                      </td>
                      <td className="py-4 px-4 text-sm text-neutral-400">
                        {t(`weather.months.${m}.note`)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Runner Tips */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">
              {t("runnerTips.badge")}
            </span>
            <h2 className="text-4xl font-bold mt-4 mb-4">
              {t("runnerTips.title")}
            </h2>
            <p className="text-neutral-400">{t("runnerTips.subtitle")}</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {runnerTips.map((tip, i) => {
              const Icon = iconMap[tip.icon];
              return (
                <FadeIn key={tip.key} delay={i * 0.1}>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-teal-500/30 transition-all hover:bg-white/[0.07]">
                    <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="font-bold mb-2">
                      {t(`runnerTips.items.${tip.key}.title`)}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {t(`runnerTips.items.${tip.key}.desc`)}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
