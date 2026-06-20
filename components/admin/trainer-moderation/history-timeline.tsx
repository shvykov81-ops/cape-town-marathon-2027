"use client";

import { useTranslations } from "next-intl";

import { Clock, Edit, Plus, Trash2, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  changeType: string;
  fieldName: string | null;
  oldValue: string | null;
  newValue: string | null;
  changedBy: string;
  createdAt: string;
}

interface HistoryTimelineProps {
  changes: HistoryItem[];
}

const typeConfig: Record<string, { icon: typeof Plus; color: string; bg: string; border: string }> = {
  CREATE: { icon: Plus, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  UPDATE: { icon: Edit, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  DELETE: { icon: Trash2, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

export function HistoryTimeline({ changes }: HistoryTimelineProps) {
  const t = useTranslations("adminModeration");

  if (changes.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p className="text-sm">{t("history.noChanges")}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/[0.06]" />
      <div className="space-y-6">
        {changes.map((change, index) => {
          const config = typeConfig[change.changeType] || typeConfig.UPDATE;
          const Icon = config.icon;
          const isAdmin = change.changedBy === "admin" || change.changedBy === "system";

          return (
            <div key={change.id} className="relative flex gap-4">
              <div className={cn(
                "relative z-10 w-8 h-8 rounded-full border flex items-center justify-center shrink-0",
                config.bg, config.border
              )}>
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-xs font-medium", config.color)}>
                    {change.changeType}
                  </span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {change.changedBy}
                  </span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-xs text-neutral-500">
                    {new Date(change.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
                {change.fieldName && (
                  <p className="text-sm text-neutral-400 mb-1">
                    <span className="text-neutral-500">{change.fieldName}:</span>{" "}
                    {change.oldValue && (
                      <span className="line-through text-neutral-600 mr-1">{change.oldValue.substring(0, 100)}{change.oldValue.length > 100 ? "..." : ""}</span>
                    )}
                    <span className="text-white">{change.newValue?.substring(0, 100)}{change.newValue && change.newValue.length > 100 ? "..." : ""}</span>
                  </p>
                )}
                {!change.fieldName && change.newValue && (
                  <p className="text-sm text-neutral-400">{change.newValue.substring(0, 200)}{change.newValue.length > 200 ? "..." : ""}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
