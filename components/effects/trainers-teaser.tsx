"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Star, MapPin, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface Trainer {
  id: string;
  slug: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  headline: string | null;
  photoUrl: string | null;
  photos: string[];
  specialties: string[];
  languages: string[];
  experienceYears: number | null;
  rating: number;
  reviewCount: number;
  profileViews: number;
}

/* ─── 3D Tilt Card ─────────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Trainer Card with Premium Effects ──────────────────────── */
function TrainerCard({ trainer, index }: { trainer: Trainer; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const locale = useLocale();

  // Use first gallery photo as primary, fallback to photoUrl, then initials
  const imageUrl = trainer.photos?.[0] || trainer.photoUrl;
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="h-full">
        <Link
          href={`/${locale}/trainers/${trainer.slug}`}
          className="group relative block h-full overflow-hidden rounded-2xl bg-neutral-900/60 border border-white/[0.06] backdrop-blur-sm transition-all duration-500 hover:border-teal-500/30 hover:shadow-[0_0_40px_rgba(20,184,166,0.15)]"
        >
          {/* ── Photo Container with Premium Effects ── */}
          <div className="relative aspect-[4/5] overflow-hidden">
            {/* Animated gradient border glow */}
            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-teal-500/20 via-transparent to-transparent" />
            </div>

            {/* Image with premium effects */}
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                {/* Hidden fallback */}
                <div 
                  className="hidden w-full h-full bg-gradient-to-br from-teal-500/20 to-amber-500/20 items-center justify-center"
                >
                  <span className="text-4xl font-bold text-white/40">
                    {trainer.firstName[0]}{trainer.lastName[0]}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-500/20 to-amber-500/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-white/40">
                  {trainer.firstName[0]}{trainer.lastName[0]}
                </span>
              </div>
            )}

            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

            {/* Premium shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>

            {/* Rating badge — floating */}
            <motion.div
              className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-amber-500/30"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-amber-400">{trainer.rating.toFixed(1)}</span>
            </motion.div>

            {/* Experience badge */}
            {trainer.experienceYears && (
              <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-500/30">
                <span className="text-xs font-medium text-teal-300">{trainer.experienceYears}+ yrs</span>
              </div>
            )}

            {/* Bottom info overlay */}
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
              <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                {name}
              </h3>
              {trainer.headline && (
                <p className="text-sm text-neutral-400 mt-0.5 line-clamp-1">{trainer.headline}</p>
              )}
            </div>
          </div>

          {/* ── Content ── */}
          <div className="p-4 space-y-3">
            {/* Specialties */}
            <div className="flex flex-wrap gap-1.5">
              {trainer.specialties.slice(0, 3).map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-0.5 text-xs rounded-full bg-white/[0.04] text-neutral-400 border border-white/[0.06]"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Languages + Reviews */}
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>{trainer.languages.join(" · ")}</span>
              <span>{trainer.reviewCount} reviews</span>
            </div>

            {/* CTA */}
            <div className="pt-2 flex items-center gap-2 text-sm font-medium text-teal-400 group-hover:text-teal-300 transition-colors">
              <span>View Profile</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}

/* ─── Skeleton Card ────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-neutral-900/40 border border-white/[0.04] overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-neutral-800/50" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-neutral-800/50 rounded w-2/3" />
        <div className="h-3 bg-neutral-800/50 rounded w-full" />
        <div className="flex gap-1.5">
          <div className="h-5 bg-neutral-800/50 rounded-full w-16" />
          <div className="h-5 bg-neutral-800/50 rounded-full w-14" />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */
export function TrainersTeaser() {
  const t = useTranslations("trainers");
  const locale = useLocale();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data) => {
        const top = (data.trainers || [])
          .sort((a: Trainer, b: Trainer) => b.rating - a.rating)
          .slice(0, 4);
        setTrainers(top);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            {t("cta.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            {t("list.noTrainers")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer, i) => (
              <TrainerCard key={trainer.id} trainer={trainer} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href={`/${locale}/trainers`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]"
          >
            {t("list.allTrainers")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
