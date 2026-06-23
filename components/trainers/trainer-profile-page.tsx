"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Globe,
  Instagram,
  Award,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainerProfilePageProps {
  trainer: {
    id: string;
    slug: string;
    firstName: string;
    lastName: string;
    displayName: string;
    headline: string | null;
    bio: string | null;
    bioHtml: string | null;
    photoUrl: string | null;
    photos: string[];
    specialties: string[];
    languages: string[];
    credentials: string | null;
    experienceYears: number | null;
    rating: number;
    reviewCount: number;
    profileViews: number;
    instagramUrl: string | null;
    stravaUrl: string | null;
    tripsterUrl: string | null;
    websiteUrl: string | null;
    createdAt: string;
    reviews: Array<{
      id: string;
      rating: number;
      text: string | null;
      createdAt: string;
      user: { name: string | null };
    }>;
  };
}

function reviewLabel(count: number, locale: string): string {
  if (locale === "ru") {
    if (count % 10 === 1 && count % 100 !== 11) return "отзыв";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "отзыва";
    return "отзывов";
  }
  return count === 1 ? "review" : "reviews";
}

export function TrainerProfilePage({ trainer }: TrainerProfilePageProps) {
  const t = useTranslations("trainersPage");
  const locale = useLocale();
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`.trim();
  const allPhotos = trainer.photoUrl
    ? [trainer.photoUrl, ...trainer.photos.filter((p) => p !== trainer.photoUrl)]
    : trainer.photos;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const goToPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((i) => (i > 0 ? i - 1 : allPhotos.length - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((i) => (i < allPhotos.length - 1 ? i + 1 : 0));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
        {/* Background with parallax effect */}
        <div className="absolute inset-0">
          {allPhotos.length > 0 ? (
            <Image
              src={allPhotos[0]}
              alt={name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0f3460]" />
          )}
          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-transparent to-[#0a0a0f]/40" />
          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Back button - floating glassmorphism */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-6 left-4 lg:left-8 z-20"
        >
          <Link
            href={`/${locale}/trainers`}
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] text-white/80 hover:text-white hover:bg-white/[0.12] hover:border-white/[0.2] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">{t("profile.back")}</span>
          </Link>
        </motion.div>

        {/* Content overlay */}
        <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-32 lg:pt-40 pb-12">
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/20 text-[#00d4aa] text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Award className="w-3.5 h-3.5" />
              {locale === "ru" ? "Сертифицированный тренер" : "Certified Coach"}
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
            >
              {name}
            </motion.h1>

            {/* Headline */}
            {trainer.headline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg lg:text-xl text-white/60 mb-6 max-w-2xl leading-relaxed"
              >
                {trainer.headline}
              </motion.p>
            )}

            {/* Quick stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 lg:gap-6"
            >
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold text-lg">{trainer.rating.toFixed(1)}</span>
                <span className="text-white/40 text-sm">
                  ({trainer.reviewCount} {reviewLabel(trainer.reviewCount, locale)})
                </span>
              </div>

              {/* Experience */}
              {trainer.experienceYears && (
                <div className="flex items-center gap-1.5 text-white/60">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {trainer.experienceYears} {locale === "ru" ? "лет опыта" : "years exp."}
                  </span>
                </div>
              )}

              {/* Views */}
              <div className="flex items-center gap-1.5 text-white/60">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">
                  {trainer.profileViews.toLocaleString()} {t("card.views")}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-white/40 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-7 space-y-8">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#00d4aa]" />
                {t("profile.about")}
              </h2>
              <div className="prose prose-invert prose-lg max-w-none">
                {trainer.bioHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: trainer.bioHtml }} />
                ) : trainer.bio ? (
                  <p className="text-white/70 leading-relaxed whitespace-pre-line">{trainer.bio}</p>
                ) : (
                  <p className="text-white/40 italic">{locale === "ru" ? "Биография пока не заполнена" : "No bio yet"}</p>
                )}
              </div>
            </motion.div>

            {/* Credentials */}
            {trainer.credentials && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#111118] to-[#0d0d14] border border-white/[0.06]"
              >
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#00d4aa]" />
                  {locale === "ru" ? "Квалификация" : "Credentials"}
                </h3>
                <p className="text-white/60 leading-relaxed">{trainer.credentials}</p>
              </motion.div>
            )}

            {/* Reviews */}
            {trainer.reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-[#00d4aa]" />
                  {t("profile.rating")} ({trainer.reviewCount} {reviewLabel(trainer.reviewCount, locale)})
                </h2>
                <div className="space-y-4">
                  {trainer.reviews.map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                    >
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={cn(
                              "w-4 h-4",
                              j < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-white/10"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed mb-3">
                        {review.text || ""}
                      </p>
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <Users className="w-3.5 h-3.5" />
                        <span>{review.user.name || "Anonymous"}</span>
                        <span>·</span>
                        <span>{new Date(review.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-GB")}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Photo Gallery - Premium Grid */}
            {allPhotos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#00d4aa]" />
                  {locale === "ru" ? "Галерея" : "Gallery"}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {allPhotos.slice(0, 3).map((photo, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={cn(
                        "relative overflow-hidden rounded-xl cursor-pointer group",
                        i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"
                      )}
                      onClick={() => openLightbox(i)}
                    >
                      <Image
                        src={photo}
                        alt={`${name} — ${locale === "ru" ? "фото" : "photo"} ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes={i === 0 ? "(max-width: 1024px) 100vw, 500px" : "(max-width: 1024px) 50vw, 250px"}
                        onLoad={() => setImageLoaded((p) => ({ ...p, [i]: true }))}
                      />
                      {!imageLoaded[i] && (
                        <div className="absolute inset-0 bg-[#111118] animate-pulse" />
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-75 group-hover:scale-100" />
                      </div>
                      {/* Photo counter badge */}
                      {i === 2 && allPhotos.length > 3 && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                          +{allPhotos.length - 3}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#111118] to-[#0d0d14] border border-white/[0.06] space-y-5"
            >
              {/* Specialties */}
              <div>
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                  {t("profile.specialties")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-full text-sm bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages */}
              {trainer.languages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                    {t("profile.languages")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.languages.map((l) => (
                      <span
                        key={l}
                        className="px-3 py-1.5 rounded-full text-sm bg-white/[0.05] text-white/70 border border-white/[0.08]"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="pt-4 border-t border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                  {locale === "ru" ? "Ссылки" : "Links"}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {trainer.instagramUrl && (
                    <a
                      href={trainer.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 hover:border-purple-500/40 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  )}
                  {trainer.stravaUrl && (
                    <a
                      href={trainer.stravaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 text-orange-300 hover:border-orange-500/40 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-medium">Strava</span>
                    </a>
                  )}
                  {trainer.tripsterUrl && (
                    <a
                      href={trainer.tripsterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-300 hover:border-blue-500/40 transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Tripster</span>
                    </a>
                  )}
                  {trainer.websiteUrl && (
                    <a
                      href={trainer.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 text-teal-300 hover:border-teal-500/40 transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-medium">Website</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Book CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#00d4aa]/10 to-[#00d4aa]/5 border border-[#00d4aa]/20"
            >
              <h3 className="text-lg font-bold text-white mb-2">
                {locale === "ru" ? "Готовы тренироваться?" : "Ready to train?"}
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {locale === "ru"
                  ? "Забронируйте персональную сессию с этим тренером"
                  : "Book a personal session with this coach"}
              </p>
              <Link
                href={`/${locale}/booking?trainer=${trainer.slug}`}
                className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-xl bg-[#00d4aa] hover:bg-[#00b894] text-[#0a0a0f] font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#00d4aa]/20"
              >
                <Calendar className="w-5 h-5" />
                {t("profile.bookWith")} {trainer.firstName}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── LIGHTBOX ─── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-4 lg:left-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 lg:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
              {lightboxIndex + 1} / {allPhotos.length}
            </div>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={allPhotos[lightboxIndex]}
                alt={`${name} — ${locale === "ru" ? "фото" : "photo"} ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Icon component for gallery
function ImageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}
