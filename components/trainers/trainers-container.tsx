"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Loader2 } from "lucide-react";
import { TrainerCardFeatured } from "./trainer-card/trainer-card-featured";
import { TrainerCardStandard } from "./trainer-card/trainer-card-standard";
import { TrainerCardCompact } from "./trainer-card/trainer-card-compact";
import { TrainerFilters } from "./trainer-filters";
import { TrainerStats } from "./trainer-stats";
import { TrainerCTA } from "./trainer-cta";

export interface Trainer {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  headline: string | null;
  photoUrl: string | null;
  photos: string[];
  specialties: string[];
  languages: string[];
  experienceYears: number | null;
  rating: number;
  reviewCount: number;
  profileViews: number;
  status: string;
  bio?: string;
}

interface TrainersResponse {
  trainers: Trainer[];
  filters: {
    specialties: string[];
    languages: string[];
  };
  stats: {
    totalCoaches: number;
    avgRating: number;
    totalSpecialties: number;
    totalLanguages: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function TrainersContainer() {
  const t = useTranslations("trainers");
  const [data, setData] = useState<TrainersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", "12");
    params.set("sortBy", activeSort);
    if (activeSpecialty) params.set("specialty", activeSpecialty);
    if (activeLanguage) params.set("language", activeLanguage);
    if (searchQuery) params.set("search", searchQuery);

    try {
      const res = await fetch(`/api/trainers?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, activeSpecialty, activeLanguage, activeSort, searchQuery]);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeSpecialty, activeLanguage, activeSort, searchQuery]);

  const trainers = data?.trainers || [];
  const featured = trainers[0];
  const standard = trainers.slice(1, 7);
  const compact = trainers.slice(7);
  const hasMore = data ? page < data.pagination.totalPages : false;

  return (
    <div ref={sectionRef} className="relative">
      {/* Hero */}
      <div className="text-center mb-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium border border-teal-500/20 mb-4"
        >
          {t("hero.badge")}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold"
        >
          {t("hero.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-white/50 mt-4 max-w-xl mx-auto"
        >
          {t("hero.subtitle")}
        </motion.p>
      </div>

      {/* Stats */}
      {data?.stats && (
        <TrainerStats stats={data.stats} />
      )}

      {/* Filters */}
      <TrainerFilters
        specialties={data?.filters.specialties || []}
        languages={data?.filters.languages || []}
        activeSpecialty={activeSpecialty}
        activeLanguage={activeLanguage}
        activeSort={activeSort}
        searchQuery={searchQuery}
        onSpecialtyChange={setActiveSpecialty}
        onLanguageChange={setActiveLanguage}
        onSortChange={setActiveSort}
        onSearchChange={setSearchQuery}
      />

      {/* Grid */}
      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">{t("grid.noResults")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured card spans 2 columns on large screens */}
          {featured && (
            <TrainerCardFeatured trainer={featured} index={0} />
          )}

          {/* Standard cards */}
          {standard.map((trainer, i) => (
            <TrainerCardStandard key={trainer.id} trainer={trainer} index={i + 1} />
          ))}

          {/* Compact grid for remaining trainers */}
          {compact.length > 0 && (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {compact.map((trainer, i) => (
                  <TrainerCardCompact key={trainer.id} trainer={trainer} index={i + 7} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <div className="text-center mt-10">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {t("loadMore")}
          </button>
        </div>
      )}

      {/* Coach CTA */}
      <TrainerCTA />
    </div>
  );
}
