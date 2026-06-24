"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowLeft,
  Eye,
  MapPin,
  Globe,
  Instagram,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Users,
  MessageSquare,
} from "lucide-react";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  slug: string;
  headline: string | null;
  bio: string | null;
  bioHtml: string | null;
  credentials: string | null;
  photoUrl: string | null;
  photos: string[];
  videoUrl: string | null;
  videoThumbnail: string | null;
  instagramUrl: string | null;
  stravaUrl: string | null;
  tripsterUrl: string | null;
  websiteUrl: string | null;
  specialties: string[];
  languages: string[];
  experienceYears: number | null;
  rating: number;
  reviewCount: number;
  profileViews: number;
  maxClientsPerMonth: number | null;
  reviews: Array<{
    id: string;
    rating: number;
    text: string | null;
    createdAt: string;
    user: { name: string | null };
  }>;
}

interface TrainerProfilePageProps {
  trainer: Trainer;
  locale: string;
}

function t(key: string, locale: string) {
  const dict: Record<string, Record<string, string>> = {
    en: {
      "profile.back": "Back to trainers",
      "profile.about": "About",
      "profile.specialties": "Specialties",
      "profile.languages": "Languages",
      "profile.rating": "Reviews",
      "profile.bookWith": "Book with",
      "profile.certified": "Certified Coach",
      "profile.yearsExp": "years exp.",
      "profile.views": "views",
      "profile.reviews": "reviews",
      "profile.noBio": "No bio yet",
      "profile.credentials": "Credentials",
      "profile.gallery": "Gallery",
      "profile.readyToTrain": "Ready to train?",
      "profile.bookSession": "Book a personal session with this coach",
      "profile.viewInstagram": "View Instagram",
      "profile.viewStrava": "View Strava",
      "profile.viewTripster": "View Tripster",
      "profile.viewWebsite": "View Website",
      "profile.verified": "Verified Coach",
      "profile.sessions": "sessions",
      "profile.perMonth": "per month",
    },
    ru: {
      "profile.back": "← Назад к тренерам",
      "profile.about": "О тренере",
      "profile.specialties": "Специализации",
      "profile.languages": "Языки",
      "profile.rating": "Отзывы",
      "profile.bookWith": "Забронировать с",
      "profile.certified": "Сертифицированный тренер",
      "profile.yearsExp": "лет опыта",
      "profile.views": "просмотров",
      "profile.reviews": "отзывов",
      "profile.noBio": "Биография пока не заполнена",
      "profile.credentials": "Квалификация",
      "profile.gallery": "Галерея",
      "profile.readyToTrain": "Готовы тренироваться?",
      "profile.bookSession": "Забронируйте персональную сессию с этим тренером",
      "profile.viewInstagram": "Открыть Instagram",
      "profile.viewStrava": "Открыть Strava",
      "profile.viewTripster": "Открыть Tripster",
      "profile.viewWebsite": "Открыть сайт",
      "profile.verified": "Проверенный тренер",
      "profile.sessions": "сессий",
      "profile.perMonth": "в месяц",
    },
  };
  return dict[locale]?.[key] || key;
}

function reviewLabel(count: number, locale: string) {
  if (locale === "ru") {
    if (count % 10 === 1 && count % 100 !== 11) return "отзыв";
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "отзыва";
    return "отзывов";
  }
  return count === 1 ? "review" : "reviews";
}

export function TrainerProfilePage({ trainer, locale }: TrainerProfilePageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const firstName = trainer.firstName;

  // ─── FIX: Use first photo from photos as fallback for photoUrl ───
  const heroPhoto = trainer.photoUrl || (trainer.photos && trainer.photos.length > 0 ? trainer.photos[0] : null);
  const allPhotos = [heroPhoto, ...(trainer.photos || [])].filter(Boolean) as string[];
  // Remove duplicates
  const uniquePhotos = [...new Set(allPhotos)];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => setLightboxIndex((prev) => (prev + 1) % uniquePhotos.length);
  const prevPhoto = () => setLightboxIndex((prev) => (prev - 1 + uniquePhotos.length) % uniquePhotos.length);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* ─── HERO SECTION ─── */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        {uniquePhotos.length > 0 ? (
          <div className="absolute inset-0">
            <Image
              src={uniquePhotos[0]}
              alt={name}
              fill
              className="object-cover"
              priority
              unoptimized={uniquePhotos[0].startsWith("http")}
              onLoad={() => setImageLoaded((p) => ({ ...p, 0: true }))}
            />
            {/* Premium gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 to-amber-900/20 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500/20 to-amber-500/20 flex items-center justify-center text-6xl font-bold text-white/30">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

        {/* Back button - floating glassmorphism */}
        <Link
          href={`/${locale}/trainers`}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm text-white/80 hover:bg-white/20 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("profile.back", locale)}
        </Link>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm mb-4">
              <Award className="w-4 h-4" />
              {locale === "ru" ? "Сертифицированный тренер" : "Certified Coach"}
            </div>

            {/* Name */}
            <h1 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight">
              {name}
            </h1>

            {/* Headline */}
            {trainer.headline && (
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-6 leading-relaxed">
                {trainer.headline}
              </p>
            )}

            {/* Quick stats row */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-lg font-semibold">{trainer.rating.toFixed(1)}</span>
                <span className="text-white/50">
                  ({trainer.reviewCount} {reviewLabel(trainer.reviewCount, locale)})
                </span>
              </div>

              {/* Experience */}
              {trainer.experienceYears && (
                <div className="flex items-center gap-1.5 text-white/70">
                  <Clock className="w-5 h-5 text-teal-400" />
                  <span>{trainer.experienceYears} {locale === "ru" ? "лет опыта" : "years exp."}</span>
                </div>
              )}

              {/* Views */}
              <div className="flex items-center gap-1.5 text-white/50">
                <Eye className="w-5 h-5" />
                <span>{trainer.profileViews.toLocaleString()} {t("profile.views", locale)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          </div>
        </motion.div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-teal-400" />
                {t("profile.about", locale)}
              </h2>
              {trainer.bioHtml ? (
                <div
                  className="prose prose-invert prose-lg max-w-none leading-relaxed text-white/80"
                  dangerouslySetInnerHTML={{ __html: trainer.bioHtml }}
                />
              ) : trainer.bio ? (
                <div className="prose prose-invert prose-lg max-w-none leading-relaxed text-white/80 whitespace-pre-line">
                  {trainer.bio}
                </div>
              ) : (
                <p className="text-white/40 italic">{t("profile.noBio", locale)}</p>
              )}
            </section>

            {/* Credentials */}
            {trainer.credentials && (
              <section>
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  {locale === "ru" ? "Квалификация" : "Credentials"}
                </h3>
                <p className="text-white/70 leading-relaxed">{trainer.credentials}</p>
              </section>
            )}

            {/* Reviews */}
            {trainer.reviews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-400" />
                  {t("profile.rating", locale)} ({trainer.reviewCount} {reviewLabel(trainer.reviewCount, locale)})
                </h2>
                <div className="space-y-4">
                  {trainer.reviews.map((review, i) => (
                    <div
                      key={review.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={`w-4 h-4 ${
                              j < review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-white/80 mb-3 leading-relaxed">{review.text || ""}</p>
                      <div className="flex items-center gap-2 text-sm text-white/40">
                        <span>{review.user.name || "Anonymous"}</span>
                        <span>·</span>
                        <span>{new Date(review.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-GB")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-8">
            {/* Photo Gallery - Premium Grid */}
            {uniquePhotos.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  {locale === "ru" ? "Галерея" : "Gallery"}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {uniquePhotos.slice(0, 3).map((photo, i) => (
                    <motion.div
                      key={i}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${
                        i === 0 ? "col-span-2 aspect-[16/10]" : ""
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => openLightbox(i)}
                    >
                      <Image
                        src={photo}
                        alt={`${name} photo ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={photo.startsWith("http")}
                        onLoad={() => setImageLoaded((p) => ({ ...p, [i]: true }))}
                      />
                      {!imageLoaded[i] && (
                        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {/* Photo counter badge */}
                      {i === 2 && uniquePhotos.length > 3 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">+{uniquePhotos.length - 3}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Info Card */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
              {/* Specialties */}
              <div>
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                  {t("profile.specialties", locale)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm"
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
                    {t("profile.languages", locale)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.languages.map((l) => (
                      <span
                        key={l}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                  {locale === "ru" ? "Ссылки" : "Links"}
                </h3>
                <div className="space-y-2">
                  {trainer.instagramUrl && (
                    <a
                      href={trainer.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                    >
                      <Instagram className="w-5 h-5 text-pink-400" />
                      <span className="text-sm">{t("profile.viewInstagram", locale)}</span>
                      <ExternalLink className="w-4 h-4 ml-auto text-white/30" />
                    </a>
                  )}
                  {trainer.stravaUrl && (
                    <a
                      href={trainer.stravaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                    >
                      <ExternalLink className="w-5 h-5 text-orange-400" />
                      <span className="text-sm">{t("profile.viewStrava", locale)}</span>
                      <ExternalLink className="w-4 h-4 ml-auto text-white/30" />
                    </a>
                  )}
                  {trainer.tripsterUrl && (
                    <a
                      href={trainer.tripsterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                    >
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">{t("profile.viewTripster", locale)}</span>
                      <ExternalLink className="w-4 h-4 ml-auto text-white/30" />
                    </a>
                  )}
                  {trainer.websiteUrl && (
                    <a
                      href={trainer.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white/80 hover:text-white"
                    >
                      <Globe className="w-5 h-5 text-teal-400" />
                      <span className="text-sm">{t("profile.viewWebsite", locale)}</span>
                      <ExternalLink className="w-4 h-4 ml-auto text-white/30" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Book CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/20 to-amber-500/10 border border-teal-500/20">
              <h3 className="text-lg font-bold mb-2">
                {locale === "ru" ? "Готовы тренироваться?" : "Ready to train?"}
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {locale === "ru"
                  ? "Забронируйте персональную сессию с этим тренером"
                  : "Book a personal session with this coach"}
              </p>
              <Link
                href={`/${locale}/booking?trainer=${trainer.slug}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-semibold transition-colors"
              >
                <Users className="w-5 h-5" />
                {t("profile.bookWith", locale)} {trainer.firstName}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── LIGHTBOX ─── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            {uniquePhotos.length > 1 && (
              <>
                <button
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevPhoto();
                  }}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextPhoto();
                  }}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">
              {lightboxIndex + 1} / {uniquePhotos.length}
            </div>

            {/* Image */}
            <motion.div
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={uniquePhotos[lightboxIndex]}
                alt={`${name} photo ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                unoptimized={uniquePhotos[lightboxIndex].startsWith("http")}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
