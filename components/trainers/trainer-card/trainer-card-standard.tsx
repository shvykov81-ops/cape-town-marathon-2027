"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Trainer {
  id: string;
  slug: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  headline: string | null;
  photoUrl: string | null;
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

export function TrainerCardStandard({ trainer, index, accentColor }: TrainerCardStandardProps) {
  const t = useTranslations("trainersPage");
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const color = accentColor || ACCENT_COLORS[index % ACCENT_COLORS.length];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/trainers/${trainer.slug}`}>
        <div
          className="bg-[#111118] border rounded-xl overflow-hidden hover:-translate-y-1 transition-all duration-200 group cursor-pointer h-full flex flex-col"
          style={{ borderColor: isHovered ? `${color}40` : "#1e1e2e" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Photo */}
          <div className="relative w-full h-48 overflow-hidden">
            {trainer.photoUrl ? (
              <Image
                src={trainer.photoUrl}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading={index < 6 ? "eager" : "lazy"}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1a1a25] to-[#0a0a0f] flex items-center justify-center">
                <span className="text-4xl font-bold" style={{ color: `${color}40` }}>
                  {name[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent" />

            {/* Rating badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-3 h-3 text-[#ff6b35] fill-[#ff6b35]" />
              <span className="text-xs text-white font-medium">{trainer.rating.toFixed(1)}</span>
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
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
