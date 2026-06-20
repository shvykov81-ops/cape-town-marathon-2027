"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Trainer {
  id: string;
  slug: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
}

interface TrainerCardCompactProps {
  trainer: Trainer;
  index: number;
}

export function TrainerCardCompact({ trainer, index }: TrainerCardCompactProps) {
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Link href={`/trainers/${trainer.slug}`}>
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg p-3 hover:border-[#4a9eff]/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#1e1e2e]">
              {trainer.photoUrl ? (
                <Image
                  src={trainer.photoUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="48px"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-[#1a1a25] flex items-center justify-center">
                  <span className="text-sm font-bold text-[#4a9eff]/40">{name[0]?.toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{name}</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-[#ff6b35] fill-[#ff6b35]" />
                <span className="text-xs text-[#8b8b9a]">{trainer.rating.toFixed(1)}</span>
                <span className="text-xs text-[#5a5a6a]">({trainer.reviewCount})</span>
              </div>
            </div>

            {/* Specialty badge */}
            {trainer.specialties[0] && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4a9eff]/10 text-[#4a9eff] border border-[#4a9eff]/20 flex-shrink-0 hidden sm:block">
                {trainer.specialties[0]}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
