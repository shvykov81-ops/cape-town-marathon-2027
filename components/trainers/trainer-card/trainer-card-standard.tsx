"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Star, MapPin, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { Trainer } from "@/components/trainers/trainers-container";

interface TrainerCardStandardProps {
  trainer: Trainer;
  index?: number;
}

export function TrainerCardStandard({ trainer, index = 0 }: TrainerCardStandardProps) {
  const locale = useLocale();
  const t = useTranslations("trainers");
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const imageUrl = trainer.photos?.[0] || trainer.photoUrl || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="relative h-full rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden group hover:border-teal-500/30 transition-colors duration-500">
        {/* Shine sweep effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Photo */}
        <Link href={`/${locale}/trainers/${trainer.slug}`} className="block relative aspect-[4/3] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-amber-500/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-white/30">{name[0]?.toUpperCase()}</span>
            </div>
          )}
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Rating badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-white">{trainer.rating.toFixed(1)}</span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5">
          <Link href={`/${locale}/trainers/${trainer.slug}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
              {name}
            </h3>
          </Link>

          {trainer.headline && (
            <p className="text-sm text-white/50 mt-1 line-clamp-1">{trainer.headline}</p>
          )}

          <div className="flex items-center gap-1 mt-3 text-sm text-white/60">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-white/80">{trainer.rating.toFixed(1)}</span>
            <span>({trainer.reviewCount} {t("list.reviews")})</span>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {trainer.specialties.slice(0, 3).map((s) => (
              <span key={s} className="px-2 py-1 rounded-full text-xs bg-white/5 text-white/60 border border-white/10">
                {s}
              </span>
            ))}
          </div>

          {/* Languages */}
          {trainer.languages && trainer.languages.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-white/40">
              <MapPin className="w-3 h-3" />
              {trainer.languages.slice(0, 3).join(", ")}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-2 mt-4">
            <Link
              href={`/${locale}/trainers/${trainer.slug}`}
              className="flex-1 text-center py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              {t("card.viewProfile")}
            </Link>
            <Link
              href={`/${locale}/booking?trainer=${trainer.slug}`}
              className="flex-1 text-center py-2.5 rounded-xl bg-teal-500 text-sm font-medium text-black hover:bg-teal-400 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              {t("card.bookSession")}
            </Link>
          </div>
        </div>

        {/* Glow border on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_30px_rgba(45,212,191,0.1)]" />
      </div>
    </motion.div>
  );
}
