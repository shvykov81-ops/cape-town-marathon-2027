"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

interface ModerationPanelProps {
  trainerId: string;
  currentStatus: string;
  onModerate: (action: "APPROVE" | "REJECT" | "SUSPEND", reason: string) => Promise<void>;
}

export function ModerationPanel({ trainerId, currentStatus, onModerate }: ModerationPanelProps) {
  const t = useTranslations("adminModeration");
  const [action, setAction] = useState<"APPROVE" | "REJECT" | "SUSPEND" | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!action) return;
    setLoading(true);
    try {
      await onModerate(action, reason);
      setAction(null);
      setReason("");
    } catch {
      // error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      key: "APPROVE" as const,
      label: t("action.approve"),
      description: t("action.approveDesc"),
      icon: CheckCircle,
      color: "emerald",
      bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      disabled: currentStatus === "PUBLISHED",
    },
    {
      key: "REJECT" as const,
      label: t("action.reject"),
      description: t("action.rejectDesc"),
      icon: XCircle,
      color: "red",
      bg: "bg-red-500/10 hover:bg-red-500/15",
      border: "border-red-500/20",
      text: "text-red-400",
      disabled: currentStatus === "REJECTED",
    },
    {
      key: "SUSPEND" as const,
      label: t("action.suspend"),
      description: t("action.suspendDesc"),
      icon: AlertTriangle,
      color: "orange",
      bg: "bg-orange-500/10 hover:bg-orange-500/15",
      border: "border-orange-500/20",
      text: "text-orange-400",
      disabled: currentStatus === "SUSPENDED",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-white">{t("moderation.title")}</h3>
        <StatusBadge status={currentStatus} size="md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          const isSelected = action === a.key;
          return (
            <button
              key={a.key}
              onClick={() => !a.disabled && setAction(a.key)}
              disabled={a.disabled || loading}
              className={cn(
                "relative p-4 rounded-xl border text-left transition-all duration-200",
                a.disabled
                  ? "opacity-40 cursor-not-allowed border-white/[0.06]"
                  : "cursor-pointer hover:scale-[1.02]",
                isSelected
                  ? `ring-2 ring-${a.color}-500/50 ${a.bg} ${a.border}`
                  : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
              )}
            >
              <div className={cn("flex items-center gap-2 mb-2", a.text)}>
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{a.label}</span>
              </div>
              <p className="text-xs text-neutral-500">{a.description}</p>
              {a.disabled && (
                <span className="absolute top-2 right-2 text-[10px] text-neutral-600 uppercase tracking-wider">
                  {t("action.current")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {action && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <MessageSquare className="w-4 h-4" />
                <span>{t("moderation.reasonLabel")}</span>
              </div>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("moderation.reasonPlaceholder")}
                rows={3}
                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-neutral-600 focus:border-white/[0.15] resize-none"
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setAction(null); setReason(""); }}
                  disabled={loading}
                  className="border-white/[0.08] text-neutral-400 hover:text-white hover:bg-white/5"
                >
                  {t("action.cancel")}
                </Button>
                <Button
                  onClick={handleAction}
                  disabled={loading || (action !== "APPROVE" && !reason.trim())}
                  className={cn(
                    "text-white border-0",
                    action === "APPROVE" && "bg-emerald-600 hover:bg-emerald-500",
                    action === "REJECT" && "bg-red-600 hover:bg-red-500",
                    action === "SUSPEND" && "bg-orange-600 hover:bg-orange-500"
                  )}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {t("moderation.confirm")}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
