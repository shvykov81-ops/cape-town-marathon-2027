"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Star, ArrowUpRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { Trainer } from "./bento-grid";

interface BentoTrainerCardProps {
  trainer: Trainer;
  index?: number;
  layout?: string;
}

export function BentoTrainerCard({ trainer, index = 0, layout = "col-span-1 row-span-1" }: BentoTrainerCardProps) {
  const locale = useLocale();
  const t = useTranslations("trainersPage");
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const imageUrl = trainer.photos?.[0] || trainer.photoUrl || null;
  const isLarge = layout.includes("row-span-2") && layout.includes("col-span-2");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      className={layout}
    >
      <Link
        href={`/${locale}/trainers/${trainer.slug}`}
        className="group relative block h-full rounded-3xl bg-white/[0.03] border border-white/[0.08] overflow-hidden hover:border-teal-500/30 transition-all duration-500"
      >
        {/* Spotlight gradient on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-amber-500/10" />
        </div>

        {/* Shine sweep on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>

        {/* Image container */}
        <div className="relative w-full h-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              sizes={isLarge ? "800px" : "400px"}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-amber-500/20 flex items-center justify-center">
              <span className="text-5xl font-bold text-white/20">{name[0]?.toUpperCase()}</span>
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
          {isLarge && <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />}

          {/* Featured badge for first item */}
          {index === 0 && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-400 text-sm font-medium">
              {t("card.featured")}
            </div>
          )}

          {/* Arrow icon */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
            <div className="flex items-end justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-white group-hover:text-teal-400 transition-colors truncate ${isLarge ? "text-2xl md:text-3xl" : "text-lg"}`}>
                  {name}
                </h3>

                {trainer.headline && (
                  <p className={`text-white/50 mt-1 line-clamp-1 ${isLarge ? "max-w-md" : ""}`}>
                    {trainer.headline}
                  </p>
                )}

                {trainer.experienceYears && (
                  <p className="text-white/40 text-sm mt-1">
                    {trainer.experienceYears}+ {t("card.years")}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-white">{trainer.rating.toFixed(1)}</span>
                    <span className="text-sm text-white/50">({trainer.reviewCount})</span>
                  </div>
                </div>

                {/* Specialties - only on large cards */}
                {isLarge && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {trainer.specialties.slice(0, 4).map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Languages & views */}
                <div className={`flex items-center gap-3 mt-3 text-xs text-white/40 ${isLarge ? "text-sm" : ""}`}>
                  <span>{trainer.languages.slice(0, 3).join(", ")}</span>
                  <span>·</span>
                  <span>{trainer.profileViews.toLocaleString()} {t("card.views")}</span>
                </div>
              </div>

              {/* CTA buttons - only on large cards */}
              {isLarge && (
                <div className="hidden md:flex flex-col gap-2">
                  <Link
                    href={`/${locale}/trainers/${trainer.slug}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    {t("card.viewProfile")}
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/${locale}/booking?trainer=${trainer.slug}`}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-500 text-black font-semibold hover:bg-teal-400 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    {t("card.bookSession")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Glow border on hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_30px_rgba(45,212,191,0.08)]" />
      </Link>
    </motion.div>
  );
}
