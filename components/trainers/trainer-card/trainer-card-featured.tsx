"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Star, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Trainer } from "@/components/trainers/trainers-container";

interface TrainerCardFeaturedProps {
  trainer: Trainer;
  index?: number;
}

export function TrainerCardFeatured({ trainer, index = 0 }: TrainerCardFeaturedProps) {
  const locale = useLocale();
  const t = useTranslations("trainers");
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const imageUrl = trainer.photos?.[0] || trainer.photoUrl || null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="md:col-span-2 md:row-span-2"
    >
      <Link
        href={`/${locale}/trainers/${trainer.slug}`}
        className="group block relative h-full rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-teal-500/30 transition-all duration-500"
      >
        {/* Photo */}
        <div className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-amber-500/30 flex items-center justify-center">
              <span className="text-6xl font-bold text-white/20">{name[0]?.toUpperCase()}</span>
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Featured badge */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-400 text-sm font-medium">
            {t("card.featured")}
          </div>

          {/* Arrow */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  {name}
                </h3>

                {trainer.experienceYears && (
                  <p className="text-white/60 mt-1">
                    {trainer.experienceYears}+ {t("card.years")}
                  </p>
                )}

                {trainer.headline && (
                  <p className="text-white/50 mt-2 max-w-md">{trainer.headline}</p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-white">{trainer.rating.toFixed(1)}</span>
                    <span className="text-white/60">({trainer.reviewCount} {t("card.reviews")})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {trainer.specialties.slice(0, 4).map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80 border border-white/10">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-white/50">
                  <span>{trainer.languages.slice(0, 3).join(", ")}</span>
                  <span>{trainer.profileViews.toLocaleString()} {t("card.views")}</span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-500 text-black font-semibold hover:bg-teal-400 transition-colors">
                {t("card.viewProfile")}
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
