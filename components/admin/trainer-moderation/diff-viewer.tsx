"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface DiffField {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

interface DiffViewerProps {
  changes: DiffField[];
  title?: string;
}

export function DiffViewer({ changes, title }: DiffViewerProps) {
  const t = useTranslations("adminModeration");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (field: string) => {
    setExpanded((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const diffs = changes.filter((c) => c.oldValue !== c.newValue);

  if (diffs.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-neutral-500 text-sm">
        {t("history.noChanges")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title && <h3 className="text-sm font-medium text-neutral-400 mb-3">{title}</h3>}
      {diffs.map((diff) => {
        const isExpanded = expanded[diff.field];
        const oldShort = diff.oldValue?.substring(0, 120) || "";
        const newShort = diff.newValue?.substring(0, 120) || "";
        const isLong = (diff.oldValue?.length || 0) > 120 || (diff.newValue?.length || 0) > 120;

        return (
          <div key={diff.field} className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <button
              onClick={() => isLong && toggle(diff.field)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left",
                isLong && "hover:bg-white/[0.02] transition-colors"
              )}
            >
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider shrink-0 w-24">
                {diff.field}
              </span>
              <div className="flex-1 flex items-center gap-3 min-w-0">
                <span className={cn(
                  "text-sm text-neutral-400 truncate",
                  !diff.oldValue && "text-neutral-600 italic"
                )}>
                  {oldShort || "—"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
                <span className={cn(
                  "text-sm text-white truncate",
                  !diff.newValue && "text-neutral-600 italic"
                )}>
                  {newShort || "—"}
                </span>
              </div>
              {isLong && (
                <span className="text-neutral-600">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              )}
            </button>
            {isExpanded && isLong && (
              <div className="px-4 pb-4 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <p className="text-xs text-red-400/70 mb-1">{t("history.before")}</p>
                  <p className="text-sm text-neutral-400 whitespace-pre-wrap">{diff.oldValue || "—"}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <p className="text-xs text-emerald-400/70 mb-1">{t("history.after")}</p>
                  <p className="text-sm text-white whitespace-pre-wrap">{diff.newValue || "—"}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
