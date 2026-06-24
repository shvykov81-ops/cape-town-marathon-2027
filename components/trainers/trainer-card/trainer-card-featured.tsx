"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Award, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface TrainerWithStats {
  id: string;
  slug: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  headline: string | null;
  bio: string;
  photoUrl: string | null;
  photos: string[];
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  experienceYears: number | null;
  profileViews: number;
}

interface TrainerCardFeaturedProps {
  trainer: TrainerWithStats;
}

export function TrainerCardFeatured({ trainer }: TrainerCardFeaturedProps) {
  const t = useTranslations("trainersPage");
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  // Priority: photos[0] → photoUrl → fallback
  const imageUrl = trainer.photos?.[0] || trainer.photoUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative col-span-full lg:col-span-2"
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6b35]/20 via-[#4a9eff]/20 to-[#00d4aa]/20 rounded-2xl blur-xl opacity-60" />

      <Link href={`/trainers/${trainer.slug}`}>
        <div className="relative bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden hover:border-[#ff6b35]/40 transition-all duration-300 group">
          <div className="flex flex-col lg:flex-row">
            {/* Photo */}
            <div className="relative w-full lg:w-80 h-64 lg:h-auto flex-shrink-0">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 320px"
                  priority
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.parentElement?.querySelector(".img-fallback") as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="img-fallback absolute inset-0 bg-gradient-to-br from-[#1a1a25] to-[#0a0a0f] flex items-center justify-center"
                style={{ display: imageUrl ? "none" : "flex" }}
              >
                <span className="text-6xl font-bold text-[#ff6b35]/30">
                  {name[0]?.toUpperCase()}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-[#ff6b35] text-white text-xs font-bold rounded-full">
                  {t("card.featured")}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-white">{name}</h3>
                  {trainer.experienceYears && (
                    <span className="flex items-center gap-1 text-xs text-[#00d4aa] bg-[#00d4aa]/10 px-2 py-0.5 rounded-full">
                      <Award className="w-3 h-3" />
                      {trainer.experienceYears}+ {t("card.years")}
                    </span>
                  )}
                </div>

                {trainer.headline && (
                  <p className="text-[#4a9eff] text-sm font-medium mb-3">{trainer.headline}</p>
                )}

                <p className="text-[#8b8b9a] text-sm line-clamp-3 mb-4">
                  {trainer.bio}
                </p>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(trainer.rating)
                          ? "text-[#ff6b35] fill-[#ff6b35]"
                          : "text-[#5a5a6a]"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-[#8b8b9a] ml-2">
                    {trainer.rating.toFixed(1)} ({trainer.reviewCount} {t("card.reviews")})
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {trainer.specialties.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="text-xs px-3 py-1 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] border border-[#ff6b35]/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-[#5a5a6a]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {trainer.languages.slice(0, 3).join(", ")}
                  </span>
                  <span>{trainer.profileViews.toLocaleString()} {t("card.views")}</span>
                </div>
                <span className="flex items-center gap-1 text-[#ff6b35] text-sm font-medium group-hover:gap-2 transition-all">
                  {t("card.viewProfile")} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
