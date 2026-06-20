"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Star, Languages, MapPin, Award, Calendar, Eye,
  Instagram, ExternalLink, ArrowLeft, Globe, Dumbbell,
  ChevronLeft, ChevronRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  text: string | null;
  createdAt: string;
  user: { name: string | null };
}

interface TrainerProfilePageProps {
  trainer: {
    id: string;
    slug: string;
    displayName: string | null;
    firstName: string;
    lastName: string;
    headline: string | null;
    bio: string | null;
    bioHtml: string | null;
    credentials: string | null;
    photoUrl: string | null;
    photos: string[];
    videoUrl: string | null;
    videoThumbnail: string | null;
    stravaUrl: string | null;
    websiteUrl: string | null;
    instagramUrl: string | null;
    tripsterUrl: string | null;
    specialties: string[];
    languages: string[];
    experienceYears: number | null;
    maxClientsPerMonth: number | null;
    rating: number;
    reviewCount: number;
    profileViews: number;
    publishedAt: string | null;
    createdAt: string;
    reviews: Review[];
  };
  locale: string;
}

export function TrainerProfilePage({ trainer, locale }: TrainerProfilePageProps) {
  const t = useTranslations("trainersPage");
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const allPhotos = [trainer.photoUrl, ...trainer.photos].filter(Boolean) as string[];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const reviewLabel = (count: number) => {
    if (count === 0) return t("profile.reviews");
    if (count === 1) return t("profile.review");
    return t("profile.reviews");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111118] to-[#0a0a0f]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          {/* Back link */}
          <Link
            href={`/${locale}/trainers`}
            className="inline-flex items-center text-sm text-[#8b8b9a] hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("profile.back")}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Photo & Quick Stats */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#111118] border border-[#1e1e2e]">
                  {allPhotos.length > 0 ? (
                    <Image
                      src={allPhotos[selectedPhoto]}
                      alt={name}
                      fill
                      className="object-cover cursor-pointer"
                      onClick={() => openLightbox(selectedPhoto)}
                      sizes="(max-width: 1024px) 100vw, 400px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#5a5a6a]">
                      <Dumbbell className="w-16 h-16" />
                    </div>
                  )}
                </div>

                {/* Photo thumbnails */}
                {allPhotos.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {allPhotos.map((photo, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedPhoto(i)}
                        className={cn(
                          "relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors",
                          selectedPhoto === i ? "border-[#ff6b35]" : "border-[#1e1e2e] hover:border-[#4a9eff]/50"
                        )}
                      >
                        <Image src={photo} alt="" fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#8b8b9a]">
                    <Eye className="w-4 h-4 text-[#4a9eff]" />
                    <span>{trainer.profileViews.toLocaleString()} {t("card.views")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#8b8b9a]">
                    <Calendar className="w-4 h-4 text-[#00d4aa]" />
                    <span>{t("profile.memberSince")} {new Date(trainer.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-GB", { month: "short", year: "numeric" })}</span>
                  </div>
                  {trainer.experienceYears && (
                    <div className="flex items-center gap-3 text-sm text-[#8b8b9a]">
                      <Award className="w-4 h-4 text-[#ff6b35]" />
                      <span>{trainer.experienceYears} {t("card.years")}</span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {trainer.instagramUrl && (
                    <a
                      href={trainer.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors text-sm"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  {trainer.stravaUrl && (
                    <a
                      href={trainer.stravaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Strava
                    </a>
                  )}
                  {trainer.websiteUrl && (
                    <a
                      href={trainer.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors text-sm"
                    >
                      <Globe className="w-4 h-4" />
                      {t("profile.website")}
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right: Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white">{name}</h1>
                    {trainer.headline && (
                      <p className="text-lg text-[#8b8b9a] mt-1">{trainer.headline}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-[#111118] border border-[#1e1e2e] rounded-xl px-4 py-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-bold text-white">{trainer.rating.toFixed(1)}</span>
                    <span className="text-sm text-[#5a5a6a]">({trainer.reviewCount})</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {trainer.specialties.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="bg-[#ff6b35]/10 text-[#ff6b35] border-[#ff6b35]/20"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>

                {/* Languages */}
                {trainer.languages.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 text-sm text-[#8b8b9a]">
                    <Languages className="w-4 h-4" />
                    {trainer.languages.join(", ")}
                  </div>
                )}
              </motion.div>

              {/* Bio */}
              {trainer.bioHtml && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: trainer.bioHtml }}
                />
              )}
              {!trainer.bioHtml && trainer.bio && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-[#8b8b9a] leading-relaxed whitespace-pre-wrap"
                >
                  {trainer.bio}
                </motion.div>
              )}

              {/* Credentials */}
              {trainer.credentials && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e]"
                >
                  <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#ff6b35]" />
                    {t("profile.credentials")}
                  </h3>
                  <p className="text-sm text-[#8b8b9a]">{trainer.credentials}</p>
                </motion.div>
              )}

              {/* Booking CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href={`/${locale}/booking?trainer=${trainer.slug}`}>
                  <Button className="w-full sm:w-auto bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white text-lg px-8 py-6 rounded-xl">
                    {t("profile.bookWith")} {trainer.firstName}
                  </Button>
                </Link>
              </motion.div>

              {/* Reviews */}
              {trainer.reviews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-white">
                    {t("profile.rating")} ({trainer.reviewCount} {reviewLabel(trainer.reviewCount)})
                  </h3>
                  <div className="space-y-3">
                    {trainer.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 rounded-xl bg-[#111118] border border-[#1e1e2e]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-3.5 h-3.5",
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-[#1e1e2e]"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#5a5a6a]">
                            {review.user.name || "Anonymous"} · {new Date(review.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-GB")}
                          </span>
                        </div>
                        <p className="text-sm text-[#8b8b9a]">{review.text || ""}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 text-white/70 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          {lightboxIndex < allPhotos.length - 1 && (
            <button
              className="absolute right-4 text-white/70 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
          <Image
            src={allPhotos[lightboxIndex]}
            alt=""
            width={1200}
            height={800}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
