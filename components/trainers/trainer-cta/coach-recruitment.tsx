"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SPECIALTIES = [
  "Marathon Training",
  "Speed Work",
  "Beginner Programs",
  "Injury Prevention",
  "Nutrition",
  "Mental Coaching",
  "Trail Running",
  "Cross Training",
];

const LANGUAGES = ["English", "Русский", "Afrikaans", "Deutsch", "Français", "Español"];

export function CoachRecruitment() {
  const t = useTranslations("trainers");
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    experience: "",
    specialties: [] as string[],
    languages: [] as string[],
  });

  const toggleSpecialty = (s: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter((x) => x !== s)
        : [...prev.specialties, s],
    }));
  };

  const toggleLanguage = (l: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(l)
        ? prev.languages.filter((x) => x !== l)
        : [...prev.languages, l],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/trainers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // ─── INSTANT ACCESS: Set role cookie client-side ───
      document.cookie = `x-active-role=trainer; path=/; max-age=${60 * 60 * 24 * 30}`;
      document.cookie = `x-original-role=trainer; path=/; max-age=${60 * 60 * 24 * 30}`;

      // Small delay to show success message, then redirect
      setTimeout(() => {
        setOpen(false);
        // Force full reload so middleware sees new role cookie
        window.location.href = `/${locale}/trainer-dashboard`;
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/trainers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          experience: formData.experience,
          specialties: formData.specialties,
          languages: formData.languages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("apply.error"));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Set role cookies for instant middleware access
      document.cookie = `x-active-role=trainer; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      document.cookie = `x-original-role=trainer; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;

      // Force reload to /trainer-dashboard with new role
      setTimeout(() => {
        window.location.href = `/${locale}/trainer-dashboard`;
      }, 1200);
    } catch {
      setError(t("apply.networkError"));
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all"
        >
          {t("cta.applyButton")}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg bg-neutral-900 border border-white/[0.08] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {success ? t("apply.successTitle") : t("apply.title")}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {success ? t("apply.successDesc") : t("apply.description")}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 mx-auto bg-teal-500/10 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-teal-400" />
            </motion.div>
            <p className="text-neutral-300">{t("apply.redirecting")}</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-300">{t("apply.experience")}</Label>
                  <Textarea
                    value={formData.experience}
                    onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
                    placeholder={t("apply.experiencePlaceholder")}
                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-neutral-600 mt-2"
                    rows={4}
                  />
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full bg-teal-500 hover:bg-teal-600"
                >
                  {t("apply.next")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-300">{t("apply.specialties")}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SPECIALTIES.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSpecialty(s)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm transition-all",
                          formData.specialties.includes(s)
                            ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                            : "bg-white/[0.03] text-neutral-400 border border-white/[0.06] hover:border-white/[0.12]"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-white/[0.08] text-neutral-300"
                  >
                    {t("apply.back")}
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-teal-500 hover:bg-teal-600"
                  >
                    {t("apply.next")}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-300">{t("apply.languages")}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l}
                        onClick={() => toggleLanguage(l)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm transition-all",
                          formData.languages.includes(l)
                            ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                            : "bg-white/[0.03] text-neutral-400 border border-white/[0.06] hover:border-white/[0.12]"
                        )}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1 border-white/[0.08] text-neutral-300"
                  >
                    {t("apply.back")}
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={loading}
                    className="flex-1 bg-teal-500 hover:bg-teal-600"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {t("apply.submit")}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
