"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CoachRecruitment() {
  const t = useTranslations("trainersPage.cta");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error" | "redirect";
    message: string;
  } | null>(null);

  const handleApply = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/trainers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          type: "success",
          message: t("successMessage") || "Application submitted! Check your dashboard.",
        });
        // Redirect to trainer dashboard after 2 seconds
        setTimeout(() => {
          router.push("/trainer-dashboard");
        }, 2000);
      } else if (res.status === 401) {
        setResult({
          type: "redirect",
          message: t("loginRequired") || "Please sign in first to apply.",
        });
        setTimeout(() => {
          router.push("/account");
        }, 2000);
      } else {
        setResult({
          type: "error",
          message: data.error || t("errorMessage") || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setResult({
        type: "error",
        message: t("errorMessage") || "Network error. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff6b35]/10 via-[#111118] to-[#0a0a0f] border border-[#ff6b35]/20"
    >
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-30 mix-blend-overlay" />

      <div className="relative px-6 py-16 md:px-12 md:py-20 text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/20 text-[#ff6b35] text-sm font-medium mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b35] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b35]" />
          </span>
          {t("badge") || "We're hiring coaches"}
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t("title") || "Are you a coach?"}
        </h2>
        <p className="text-[#8b8b9a] text-lg max-w-2xl mx-auto mb-8">
          {t("subtitle") || "Join our team of elite running coaches and help athletes achieve their goals at Africa's first Abbott World Marathon Major."}
        </p>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-6 p-4 rounded-xl max-w-md mx-auto",
              result.type === "success" && "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
              result.type === "error" && "bg-red-500/10 border border-red-500/20 text-red-400",
              result.type === "redirect" && "bg-blue-500/10 border border-blue-500/20 text-blue-400"
            )}
          >
            <div className="flex items-center gap-2 justify-center">
              {result.type === "success" && <CheckCircle className="w-5 h-5" />}
              {result.type === "error" && <AlertCircle className="w-5 h-5" />}
              {result.type === "redirect" && <ArrowRight className="w-5 h-5" />}
              <span className="text-sm font-medium">{result.message}</span>
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleApply}
          disabled={loading || result?.type === "success"}
          className={cn(
            "bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white text-lg px-8 py-6 rounded-xl transition-all",
            loading && "opacity-70"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t("loading") || "Submitting..."}
            </>
          ) : (
            <>
              {t("button") || "Apply as Coach"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        <p className="mt-4 text-sm text-[#5a5a6a]">
          {t("note") || "Free registration. No fees."}
        </p>
      </div>
    </motion.section>
  );
}
