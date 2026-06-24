"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Loader2, Search, SlidersHorizontal, Star, Users, Award, Globe } from "lucide-react";
import { TrainerCardFeatured } from "./trainer-card/trainer-card-featured";
import { TrainerCardStandard } from "./trainer-card/trainer-card-standard";
import { TrainerCardCompact } from "./trainer-card/trainer-card-compact";

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

function InlineStats({ stats }: { stats: TrainersResponse["stats"] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      {[
        { icon: Users, value: stats.totalCoaches, label: "Coaches" },
        { icon: Star, value: stats.avgRating.toFixed(1), label: "Avg Rating" },
        { icon: Award, value: stats.totalSpecialties, label: "Specialties" },
        { icon: Globe, value: stats.totalLanguages, label: "Languages" },
      ].map(({ icon: Icon, value, label }) => (
        <div key={label} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
          <Icon className="w-5 h-5 text-teal-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/40 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}

function InlineFilters({
  specialties,
  languages,
  activeSpecialty,
  activeLanguage,
  activeSort,
  searchQuery,
  onSpecialtyChange,
  onLanguageChange,
  onSortChange,
  onSearchChange,
}: {
  specialties: string[];
  languages: string[];
  activeSpecialty: string | null;
  activeLanguage: string | null;
  activeSort: string;
  searchQuery: string;
  onSpecialtyChange: (v: string | null) => void;
  onLanguageChange: (v: string | null) => void;
  onSortChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search trainers..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border transition-colors ${
            showFilters ? "border-teal-500/40 bg-teal-500/10 text-teal-400" : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4 mb-4"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-white/40">Sort:</span>
            {["rating", "experience", "reviews"].map((sort) => (
              <button
                key={sort}
                onClick={() => onSortChange(sort)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  activeSort === sort
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                }`}
              >
                {sort}
              </button>
            ))}
          </div>

          {specialties.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-white/40">Specialty:</span>
              <button
                onClick={() => onSpecialtyChange(null)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  !activeSpecialty
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                }`}
              >
                All
              </button>
              {specialties.map((s) => (
                <button
                  key={s}
                  onClick={() => onSpecialtyChange(s)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    activeSpecialty === s
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                      : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {languages.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-white/40">Language:</span>
              <button
                onClick={() => onLanguageChange(null)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  !activeLanguage
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                }`}
              >
                All
              </button>
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => onLanguageChange(l)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    activeLanguage === l
                      ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                      : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function InlineCTA() {
  const t = useTranslations("trainers");
  return (
    <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-teal-500/10 to-amber-500/10 border border-white/10 text-center">
      <h3 className="text-2xl font-bold mb-3">{t("cta.title")}</h3>
      <p className="text-white/50 max-w-md mx-auto mb-6">{t("cta.subtitle")}</p>
      <a
        href="/apply-trainer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 text-black font-semibold hover:bg-teal-400 transition-colors"
      >
        {t("cta.button")}
      </a>
    </div>
  );
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

      {data?.stats && <InlineStats stats={data.stats} />}

      <InlineFilters
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

      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">{t("list.noTrainers")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured && <TrainerCardFeatured trainer={featured} index={0} />}
          {standard.map((trainer, i) => (
            <TrainerCardStandard key={trainer.id} trainer={trainer} index={i + 1} />
          ))}
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

      {hasMore && !loading && (
        <div className="text-center mt-10">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {t("list.loadMore")}
          </button>
        </div>
      )}

      <InlineCTA />
    </div>
  );
}
