"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Star, ChevronRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { Trainer } from "@/components/trainers/trainers-container";

interface TrainerCardCompactProps {
  trainer: Trainer;
  index?: number;
}

export function TrainerCardCompact({ trainer, index = 0 }: TrainerCardCompactProps) {
  const locale = useLocale();
  const t = useTranslations("trainers");
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const imageUrl = trainer.photos?.[0] || trainer.photoUrl || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/40 hover:bg-white/[0.07] transition-all duration-300">
        <Link href={`/${locale}/trainers/${trainer.slug}`} className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-teal-500/20 to-amber-500/20">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="56px"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.parentElement?.querySelector(".avatar-fallback") as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="avatar-fallback absolute inset-0 items-center justify-center text-lg font-bold text-white/80"
            style={{ display: imageUrl ? "none" : "flex" }}
          >
            {name[0]?.toUpperCase()}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/${locale}/trainers/${trainer.slug}`}>
            <h4 className="font-semibold text-white truncate group-hover:text-teal-400 transition-colors">
              {name}
            </h4>
          </Link>
          <div className="flex items-center gap-1 text-sm text-white/60 mt-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-white/80 font-medium">{trainer.rating.toFixed(1)}</span>
            <span>({trainer.reviewCount})</span>
          </div>
          {trainer.specialties[0] && (
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20">
              {trainer.specialties[0]}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={`/${locale}/trainers/${trainer.slug}`}
            className="text-white/20 group-hover:text-teal-400/60 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link
            href={`/${locale}/booking?trainer=${trainer.slug}`}
            className="text-teal-400/60 hover:text-teal-400 transition-colors"
            title={t("card.bookSession")}
          >
            <BookOpen className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
