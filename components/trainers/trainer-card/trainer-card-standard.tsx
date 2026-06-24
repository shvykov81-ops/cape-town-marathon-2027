"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Languages, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";

interface Trainer {
  id: string;
  slug: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  headline: string | null;
  photoUrl: string | null;
  photos: string[];
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  experienceYears: number | null;
}

interface TrainerCardStandardProps {
  trainer: Trainer;
  index: number;
  accentColor?: string;
}

const ACCENT_COLORS = [
  "#ff6b35", "#4a9eff", "#00d4aa", "#f59e0b", "#ec4899", "#8b5cf6",
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => { x.set(0.5); y.set(0.5); };

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

export function TrainerCardStandard({ trainer, index, accentColor }: TrainerCardStandardProps) {
  const t = useTranslations("trainersPage");
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const color = accentColor || ACCENT_COLORS[index % ACCENT_COLORS.length];
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = trainer.photos?.[0] || trainer.photoUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard>
        <Link href={`/trainers/${trainer.slug}`}>
          <div
            className="bg-[#111118] border rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full flex flex-col"
            style={{ borderColor: isHovered ? `${color}40` : "#1e1e2e" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Photo */}
            <div className="relative w-full h-48 overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading={index < 6 ? "eager" : "lazy"}
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
                <span className="text-4xl font-bold" style={{ color: `${color}40` }}>
                  {name[0]?.toUpperCase()}
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent" />

              <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-[#ff6b35] fill-[#ff6b35]" />
                <span className="text-xs text-white font-medium">{trainer.rating.toFixed(1)}</span>
              </div>

              {trainer.experienceYears && (
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-teal-500/15 backdrop-blur-sm border border-teal-500/25">
                  <span className="text-xs font-semibold text-teal-300">{trainer.experienceYears}+ yrs</span>
                </div>
              )}

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-base font-bold text-white mb-1 truncate">{name}</h3>
              {trainer.headline && (
                <p className="text-xs font-medium mb-2 truncate" style={{ color }}>
                  {trainer.headline}
                </p>
              )}

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(trainer.rating)
                        ? "text-[#ff6b35] fill-[#ff6b35]"
                        : "text-[#5a5a6a]"
                    }`}
                  />
                ))}
                <span className="text-xs text-[#5a5a6a] ml-1">({trainer.reviewCount})</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {trainer.specialties.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${color}10`,
                      color,
                      borderColor: `${color}20`,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {trainer.languages && trainer.languages.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-[#5a5a6a] mt-auto">
                  <Languages className="w-3 h-3" />
                  {trainer.languages.slice(0, 3).join(", ")}
                </div>
              )}

              {/* ─── FIX B-01: Book button on trainer card ───────────── */}
              <div className="mt-3 pt-3 border-t border-white/5">
                <Link
                  href={`/booking?trainer=${trainer.slug}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-300 text-xs font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Users className="w-3.5 h-3.5" />
                  Book Session
                </Link>
              </div>
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}
