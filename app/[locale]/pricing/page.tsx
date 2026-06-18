"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Users, Crown, ArrowRight, Shield, Clock, HeartPulse } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const tierKeys = ["starter", "premium", "elite"] as const;
const badgeKeys = ["secureBooking", "freeCancellation", "medicalSupport"] as const;

const tierIcons: Record<string, React.ElementType> = {
  starter: Zap,
  premium: Crown,
  elite: Users,
};

const tierAccents: Record<string, string> = {
  starter: "from-teal-500/20 to-transparent",
  premium: "from-amber-500/20 to-transparent",
  elite: "from-rose-500/20 to-transparent",
};

const tierPopular: Record<string, boolean> = {
  starter: false,
  premium: true,
  elite: false,
};

const tierPrices: Record<string, number> = {
  starter: 1299,
  premium: 2499,
  elite: 4999,
};

const trustIcons: Record<string, React.ElementType> = {
  secureBooking: Shield,
  freeCancellation: Clock,
  medicalSupport: HeartPulse,
};

export default function PricingPage() {
  const t = useTranslations("pricing");
  const [groupSize, setGroupSize] = useState(1);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const discount = groupSize >= 5 ? 0.15 : groupSize >= 3 ? 0.1 : 0;

  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-20">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            {t("badge")}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("title")}{" "}
            <span className="gradient-text">{t("titleHighlight")}</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {badgeKeys.map((key) => {
            const Icon = trustIcons[key];
            return (
              <div
                key={key}
                className="flex items-center gap-3 px-5 py-3 rounded-xl glass-card"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t(`trustBadges.${key}.label`)}</p>
                  <p className="text-xs text-neutral-500">{t(`trustBadges.${key}.desc`)}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Group Discount Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md mx-auto mb-16 p-6 rounded-2xl glass-card"
        >
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-neutral-300">
              {t("groupCalculator.label")}
            </label>
            <span className="text-2xl font-bold text-teal-400">{groupSize}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={groupSize}
            onChange={(e) => setGroupSize(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-2">
            <span>{t("groupCalculator.min")}</span>
            <span>{t("groupCalculator.max")}</span>
          </div>
          <AnimatePresence>
            {discount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
              >
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <Users className="w-5 h-5" />
                  {t("groupCalculator.discountApplied", { discount: Math.round(discount * 100) })}
                </div>
                <p className="text-sm text-neutral-400 mt-1">
                  {t("groupCalculator.saveOnPremium", { amount: Math.round(tierPrices.premium * groupSize * discount) })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {tierKeys.map((key, i) => {
            const Icon = tierIcons[key];
            const price = tierPrices[key];
            const finalPrice = Math.round(price * (1 - discount));
            const isHovered = hoveredTier === key;
            const isPopular = tierPopular[key];
            const accent = tierAccents[key];
            const features = t.raw(`tiers.${key}.features`) as string[];

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                onMouseEnter={() => setHoveredTier(key)}
                onMouseLeave={() => setHoveredTier(null)}
                className={`relative rounded-2xl overflow-hidden ${
                  isPopular ? "md:-mt-4 md:mb-4" : ""
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute top-0 left-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold text-center py-2 uppercase tracking-wider">
                      {t(`tiers.${key}.popularBadge`)}
                    </div>
                  </div>
                )}

                <div
                  className={`h-full p-8 rounded-2xl glass-card transition-all duration-300 ${
                    isHovered ? "glass-card-hover scale-[1.02]" : ""
                  } ${isPopular ? "border-amber-500/30" : ""}`}
                >
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${accent} opacity-0 transition-opacity duration-300 ${
                      isHovered ? "opacity-100" : ""
                    }`}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                        isPopular
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-teal-500/20 text-teal-400"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Name & Description */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t(`tiers.${key}.name`)}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-6">
                      {t(`tiers.${key}.description`)}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        {discount > 0 && (
                          <span className="text-lg text-neutral-500 line-through">
                            ${price.toLocaleString()}
                          </span>
                        )}
                        <span className="text-4xl font-bold text-white">
                          ${finalPrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1">
                        {t("perPerson", { duration: t(`tiers.${key}.duration`) })}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {features.map((feature, fi) => (
                        <li
                          key={fi}
                          className="flex items-start gap-3 text-sm text-neutral-300"
                        >
                          <Check
                            className={`w-5 h-5 shrink-0 mt-0.5 ${
                              isPopular ? "text-amber-400" : "text-teal-400"
                            }`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      href={`/booking?package=${key}`}
                      className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                        isPopular
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-500/25"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                      }`}
                    >
                      {t(`tiers.${key}.cta`)}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <p className="text-neutral-500">
            {t("faqTeaser")}{" "}
            <Link
              href="/faq"
              className="text-teal-400 hover:text-teal-300 animated-underline"
            >
              {t("faqLink")}
            </Link>
            {" "}{t("or")}{" "}
            <Link
              href="/contact"
              className="text-teal-400 hover:text-teal-300 animated-underline"
            >
              {t("contactLink")}
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
