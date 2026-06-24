"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TrainerCardFeatured } from "./trainer-card/trainer-card-featured";
import { TrainerCardStandard } from "./trainer-card/trainer-card-standard";
import { TrainerCardCompact } from "./trainer-card/trainer-card-compact";
import { TrainerCardSkeleton } from "./trainer-card/trainer-card-skeleton";
import { FilterBar } from "./trainer-filters/filter-bar";
import { StatsBar } from "./trainer-stats/stats-bar";
import { CoachRecruitment } from "./trainer-cta/coach-recruitment";
import { ChevronDown } from "lucide-react";

interface Trainer {
  id: string;
  slug: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  headline: string | null;
  bio: string;
  credentials: string;
  photoUrl: string | null;
  photos: string[];
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  experienceYears: number | null;
  profileViews: number;
  status: string;
  createdAt: string;
}

interface ApiResponse {
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

interface TrainersContainerProps {
  locale: string;
}

export function TrainersContainer({ locale }: TrainersContainerProps) {
  const t = useTranslations("trainersPage");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeSpecialty, setActiveSpecialty] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState("rating");
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <span className="inline-block px-3 py-1 bg-[#ff6b35]/10 text-[#ff6b35] text-xs font-bold rounded-full mb-4 border border-[#ff6b35]/20">
          {t("hero.badge")}
        </span>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          {t("hero.title")}
        </h1>
        <p className="text-lg text-[#8b8b9a] max-w-2xl mx-auto">
          {t("hero.subtitle")}
        </p>
      </motion.div>

      {/* Stats */}
      {data?.stats && (
        <div className="mb-8">
          <StatsBar
            totalCoaches={data.stats.totalCoaches}
            totalSpecialties={data.stats.totalSpecialties}
            totalLanguages={data.stats.totalLanguages}
            avgRating={data.stats.avgRating}
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-8">
        <FilterBar
          specialties={data?.filters?.specialties || []}
          languages={data?.filters?.languages || []}
          activeSpecialty={activeSpecialty}
          activeLanguage={activeLanguage}
          activeSort={activeSort}
          searchQuery={searchQuery}
          onSpecialtyChange={setActiveSpecialty}
          onLanguageChange={setActiveLanguage}
          onSortChange={setActiveSort}
          onSearchChange={setSearchQuery}
          totalResults={data?.pagination?.total || 0}
        />
      </div>

      {/* Grid */}
      {loading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TrainerCardSkeleton count={6} />
        </div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-[#5a5a6a]">{t("grid.noResults")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured card spans 2 columns on large screens */}
            {featured && (
              <TrainerCardFeatured trainer={featured} />
            )}

            {/* Standard cards */}
            {standard.map((trainer, i) => (
              <TrainerCardStandard
                key={trainer.id}
                trainer={trainer}
                index={i}
              />
            ))}
          </div>

          {/* Compact grid for remaining trainers */}
          {compact.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {compact.map((trainer, i) => (
                <TrainerCardCompact
                  key={trainer.id}
                  trainer={trainer}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-[#111118] border border-[#1e1e2e] rounded-lg text-sm text-[#8b8b9a] hover:text-white hover:border-[#4a9eff]/30 transition-colors"
          >
            {t("loadMore")}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Coach CTA */}
      <div className="mt-16">
        <CoachRecruitment />
      </div>
    </div>
  );
}
