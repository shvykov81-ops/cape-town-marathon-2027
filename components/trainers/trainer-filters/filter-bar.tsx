"use client";

import { useState, useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { FilterPill } from "./filter-pill";

interface FilterBarProps {
  specialties: string[];
  languages: string[];
  activeSpecialty: string | null;
  activeLanguage: string | null;
  activeSort: string;
  searchQuery: string;
  onSpecialtyChange: (specialty: string | null) => void;
  onLanguageChange: (language: string | null) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

const SORT_OPTIONS = ["rating", "experience", "newest", "popular"] as const;

export function FilterBar({
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
  totalResults,
}: FilterBarProps) {
  const t = useTranslations("trainersPage");
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = activeSpecialty || activeLanguage || searchQuery;

  const clearFilters = useCallback(() => {
    onSpecialtyChange(null);
    onLanguageChange(null);
    onSearchChange("");
  }, [onSpecialtyChange, onLanguageChange, onSearchChange]);

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5a5a6a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("filters.search_placeholder")}
            className="w-full bg-[#111118] border border-[#1e1e2e] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5a5a6a] focus:outline-none focus:border-[#4a9eff]/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a5a6a] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#111118] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#4a9eff]/50 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {t(`filters.sort_${opt}`)}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? "bg-[#4a9eff]/10 border-[#4a9eff]/30 text-[#4a9eff]"
                : "bg-[#111118] border-[#1e1e2e] text-[#8b8b9a] hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t("filters.filters")}
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#ff6b35]" />
            )}
          </button>
        </div>
      </div>

      {/* Specialty filters */}
      {showFilters && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <p className="text-xs text-[#5a5a6a] mb-2 uppercase tracking-wider">{t("filters.specialties")}</p>
            <div className="flex flex-wrap gap-2">
              <FilterPill
                label={t("filters.all")}
                isActive={!activeSpecialty}
                onClick={() => onSpecialtyChange(null)}
              />
              {specialties.map((s) => (
                <FilterPill
                  key={s}
                  label={s}
                  isActive={activeSpecialty === s}
                  onClick={() => onSpecialtyChange(activeSpecialty === s ? null : s)}
                />
              ))}
            </div>
          </div>

          {languages.length > 0 && (
            <div>
              <p className="text-xs text-[#5a5a6a] mb-2 uppercase tracking-wider">{t("filters.languages")}</p>
              <div className="flex flex-wrap gap-2">
                <FilterPill
                  label={t("filters.all")}
                  isActive={!activeLanguage}
                  onClick={() => onLanguageChange(null)}
                />
                {languages.map((l) => (
                  <FilterPill
                    key={l}
                    label={l}
                    isActive={activeLanguage === l}
                    onClick={() => onLanguageChange(activeLanguage === l ? null : l)}
                  />
                ))}
              </div>
            </div>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#ff6b35] hover:text-[#ff6b35]/80 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              {t("filters.clear")}
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-[#5a5a6a]">
        {t("grid.showing", { count: totalResults })}
      </p>
    </div>
  );
}
