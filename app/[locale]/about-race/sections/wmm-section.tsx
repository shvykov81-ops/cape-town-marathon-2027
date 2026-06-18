"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const MAJORS = [
  { key: "tokyo", color: "from-red-500/20 to-red-600/10" },
  { key: "boston", color: "from-blue-500/20 to-blue-600/10" },
  { key: "london", color: "from-purple-500/20 to-purple-600/10" },
  { key: "sydney", color: "from-cyan-500/20 to-cyan-600/10" },
  { key: "berlin", color: "from-yellow-500/20 to-yellow-600/10" },
  { key: "chicago", color: "from-orange-500/20 to-orange-600/10" },
  { key: "newYork", color: "from-green-500/20 to-green-600/10" },
  { key: "capeTown", color: "from-teal-500/20 to-amber-500/10" },
] as const;

export function WmmSection() {
  const t = useTranslations("aboutRace.wmm");

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
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            {t("title")}{" "}
            <span className="text-teal-400">{t("titleHighlight")}</span>
          </h2>
          <p className="text-neutral-400 max-w-3xl mx-auto text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {MAJORS.map((major, index) => (
            <motion.div
              key={major.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${major.color} border border-white/5 backdrop-blur-sm ${
                major.key === "capeTown"
                  ? "ring-2 ring-teal-500/30 scale-105"
                  : ""
              }`}
            >
              <div className="text-white font-bold text-lg">
                {t(`members.${major.key}`)}
              </div>
              {major.key === "capeTown" && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-teal-500 text-white text-[10px] font-bold rounded-full uppercase">
                  2027
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="https://www.worldmarathonmajors.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors"
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
