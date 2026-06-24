"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Star,
  Shield,
  Lock,
  User,
  Package,
  Loader2,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────
interface Trainer {
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
}

interface PackageData {
  id: string;
  name: string;
  durationDays: number;
  priceBase: string;
  description: string;
  includes: string[];
}

interface PackageOption {
  id: string;
  name: string;
  priceAdd: string;
  category: string;
}

// ─── Step Indicator ────────────────────────────────────────────
function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
                isDone
                  ? "bg-teal-500 text-black"
                  : isActive
                  ? "bg-teal-500/20 text-teal-400 border border-teal-500/40"
                  : "bg-white/5 text-white/40 border border-white/10"
              }`}
            >
              {isDone ? <Check className="w-4 h-4" /> : stepNum}
            </div>
            <span
              className={`hidden sm:block text-sm ${
                isActive ? "text-teal-400" : isDone ? "text-white/60" : "text-white/30"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`w-8 h-px mx-1 ${
                  isDone ? "bg-teal-500/40" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Trainer Selection Card ─────────────────────────────────────
function TrainerSelectCard({
  trainer,
  selected,
  onSelect,
  t,
  locale,
}: {
  trainer: Trainer;
  selected: boolean;
  onSelect: () => void;
  t: (k: string) => string;
  locale: string;
}) {
  const name = trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  const imageUrl = trainer.photos?.[0] || trainer.photoUrl || null;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300 ${
        selected
          ? "border-teal-400 bg-teal-400/10 shadow-[0_0_30px_rgba(45,212,191,0.15)]"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-teal-400 flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-black" />
        </motion.div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-teal-500/20 to-amber-500/20">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill className="object-cover" sizes="64px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white/60">
              {name[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{name}</h4>
          {trainer.headline && (
            <p className="text-sm text-white/50 truncate">{trainer.headline}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm text-white/70">{trainer.rating.toFixed(1)}</span>
            </div>
            <span className="text-white/30">·</span>
            <span className="text-sm text-white/50">
              {trainer.reviewCount} {t("list.reviews")}
            </span>
            {trainer.experienceYears && (
              <>
                <span className="text-white/30">·</span>
                <span className="text-sm text-white/50">
                  {trainer.experienceYears}+ yrs
                </span>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {trainer.specialties.slice(0, 2).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/50 border border-white/10"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Link
        href={`/${locale}/trainers/${trainer.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 mt-3 text-sm text-teal-400 hover:text-teal-300 transition-colors"
      >
        {t("card.viewProfile")}
        <ChevronRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

// ─── Main Booking Page ─────────────────────────────────────────
export default function BookingPage() {
  const locale = useLocale();
  const t = useTranslations("booking");
  const searchParams = useSearchParams();

  const preselectedTrainerSlug = searchParams.get("trainer");

  // ── State ────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState<PackageData | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const [packages, setPackages] = useState<PackageData[]>([]);
  const [options, setOptions] = useState<PackageOption[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    dob: "",
    checkInDate: "",
    checkOutDate: "",
    raceCategory: "",
  });

  // ── Fetch packages ───────────────────────────────────────────
  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => {
        setPackages(data.packages || []);
        setLoadingPackages(false);
      })
      .catch(() => setLoadingPackages(false));
  }, []);

  // ── Fetch trainers when package selected ─────────────────────
  useEffect(() => {
    if (!selectedPkg) return;
    setLoadingTrainers(true);
    fetch("/api/trainers?limit=50&sortBy=rating")
      .then((r) => r.json())
      .then((data) => {
        setTrainers(data.trainers || []);
        setLoadingTrainers(false);
      })
      .catch(() => setLoadingTrainers(false));
  }, [selectedPkg]);

  // ── Preselect trainer from URL ───────────────────────────────
  useEffect(() => {
    if (preselectedTrainerSlug && trainers.length > 0) {
      const found = trainers.find((t) => t.slug === preselectedTrainerSlug);
      if (found) setSelectedTrainer(found);
    }
  }, [preselectedTrainerSlug, trainers]);

  // ── Fetch options when package selected ──────────────────────
  useEffect(() => {
    if (!selectedPkg) return;
    fetch(`/api/packages/${selectedPkg.id}`)
      .then((r) => r.json())
      .then((data) => setOptions(data.options || []))
      .catch(() => setOptions([]));
  }, [selectedPkg]);

  // ── Computed ─────────────────────────────────────────────────
  const total = useMemo(() => {
    let sum = selectedPkg ? Number(selectedPkg.priceBase) : 0;
    selectedExtras.forEach((id) => {
      const opt = options.find((o) => o.id === id);
      if (opt) sum += Number(opt.priceAdd);
    });
    return sum;
  }, [selectedPkg, selectedExtras, options]);

  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];

  // ── Handlers ─────────────────────────────────────────────────
  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPkg?.id,
          trainerId: selectedTrainer?.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          dateOfBirth: formData.dob,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          raceCategory: formData.raceCategory,
          extras: selectedExtras,
        }),
      });
      if (!res.ok) throw new Error("Booking failed");
      setStatus("success");
      setStep(5);
    } catch (e) {
      setStatus("error");
      setErrorMsg("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!selectedPkg;
    if (step === 2)
      return (
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.checkInDate &&
        formData.checkOutDate
      );
    if (step === 3) return true;
    if (step === 4) return true;
    return false;
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <StepIndicator steps={steps} current={step} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* ═══════════════════════════════════════════════════════
                  STEP 1: Package Selection
              ═══════════════════════════════════════════════════════ */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">{t("selectPackage")}</h2>
                  {loadingPackages ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                    </div>
                  ) : packages.length === 0 ? (
                    <p className="text-white/50 text-center py-12">{t("loading")}</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {packages.map((pkg) => (
                        <motion.div
                          key={pkg.id}
                          whileHover={{ y: -4 }}
                          onClick={() => setSelectedPkg(pkg)}
                          className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                            selectedPkg?.id === pkg.id
                              ? "border-teal-400 bg-teal-400/10 shadow-[0_0_30px_rgba(45,212,191,0.1)]"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold">{pkg.name}</h3>
                            {selectedPkg?.id === pkg.id && (
                              <div className="w-6 h-6 rounded-full bg-teal-400 flex items-center justify-center">
                                <Check className="w-4 h-4 text-black" />
                              </div>
                            )}
                          </div>
                          <p className="text-white/50 text-sm mb-4">{pkg.description}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-teal-400">
                              ${Number(pkg.priceBase).toLocaleString()}
                            </span>
                            <span className="text-white/40">
                              / {pkg.durationDays} {t("days")}
                            </span>
                          </div>
                          <ul className="mt-4 space-y-2">
                            {pkg.includes.slice(0, 4).map((inc) => (
                              <li key={inc} className="flex items-center gap-2 text-sm text-white/60">
                                <Check className="w-4 h-4 text-teal-400" />
                                {inc}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════════════
                  STEP 2: Runner Details + Trainer Selection
              ═══════════════════════════════════════════════════════ */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">{t("runnerDetails")}</h2>

                  {/* Personal info form */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {[
                      { key: "firstName", label: t("firstName"), type: "text", required: true },
                      { key: "lastName", label: t("lastName"), type: "text", required: true },
                      { key: "email", label: t("email"), type: "email", required: true },
                      { key: "phone", label: t("phone"), type: "tel", required: false },
                      { key: "country", label: t("country"), type: "text", required: false },
                      { key: "dob", label: t("dob"), type: "date", required: false },
                      { key: "checkInDate", label: t("checkIn"), type: "date", required: true },
                      { key: "checkOutDate", label: t("checkOut"), type: "date", required: true },
                    ].map((field) => (
                      <div key={field.key} className={field.type === "date" ? "sm:col-span-1" : ""}>
                        <label className="block text-sm text-white/60 mb-1.5">
                          {field.label}
                          {field.required && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        <input
                          type={field.type}
                          value={formData[field.key as keyof typeof formData]}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 transition-colors text-white"
                          required={field.required}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Race category */}
                  <div className="mb-8">
                    <label className="block text-sm text-white/60 mb-2">Race Category</label>
                    <select
                      value={formData.raceCategory}
                      onChange={(e) => setFormData((prev) => ({ ...prev, raceCategory: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 transition-colors text-white"
                    >
                      <option value="" className="bg-[#1a1a1a]">Select category</option>
                      <option value="marathon" className="bg-[#1a1a1a]">Marathon (42.2km)</option>
                      <option value="half" className="bg-[#1a1a1a]">Half Marathon (21.1km)</option>
                      <option value="10k" className="bg-[#1a1a1a]">10K</option>
                      <option value="5k" className="bg-[#1a1a1a]">5K Fun Run</option>
                    </select>
                  </div>

                  {/* ═══════════════════════════════════════════════════
                      TRAINER SELECTION (NEW — B-01)
                  ═══════════════════════════════════════════════════ */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-teal-400" />
                        {t("selectTrainer")}
                      </h3>
                      {selectedTrainer && (
                        <button
                          onClick={() => setSelectedTrainer(null)}
                          className="text-sm text-white/40 hover:text-white/70 transition-colors"
                        >
                          Clear selection
                        </button>
                      )}
                    </div>

                    {loadingTrainers ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
                      </div>
                    ) : trainers.length === 0 ? (
                      <p className="text-white/40 text-center py-8 bg-white/5 rounded-2xl border border-white/10">
                        No trainers available at the moment.
                      </p>
                    ) : (
                      <div className="grid gap-3">
                        {trainers.map((trainer) => (
                          <TrainerSelectCard
                            key={trainer.id}
                            trainer={trainer}
                            selected={selectedTrainer?.id === trainer.id}
                            onSelect={() =>
                              setSelectedTrainer((prev) =>
                                prev?.id === trainer.id ? null : trainer
                              )
                            }
                            t={t}
                            locale={locale}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════════════
                  STEP 3: Extras
              ═══════════════════════════════════════════════════════ */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">{t("addExtras")}</h2>
                  {options.length === 0 ? (
                    <p className="text-white/50 text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                      {t("noExtras")}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {options.map((option) => (
                        <motion.div
                          key={option.id}
                          whileHover={{ x: 4 }}
                          onClick={() => toggleExtra(option.id)}
                          className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedExtras.includes(option.id)
                              ? "border-teal-400 bg-teal-400/10"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selectedExtras.includes(option.id)
                                  ? "border-teal-400 bg-teal-400"
                                  : "border-white/20"
                              }`}
                            >
                              {selectedExtras.includes(option.id) && (
                                <Check className="w-4 h-4 text-black" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{option.name}</h4>
                              <p className="text-sm text-white/50">{option.category}</p>
                            </div>
                          </div>
                          <span className="text-teal-400 font-semibold">
                            +${Number(option.priceAdd).toLocaleString()}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════════════
                  STEP 4: Review & Confirm
              ═══════════════════════════════════════════════════════ */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">{t("review")}</h2>

                  <div className="space-y-4">
                    {/* Package */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-sm text-white/40 mb-1">{t("packageLabel")}</p>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{selectedPkg?.name}</h4>
                        <span className="text-teal-400 font-bold">
                          ${Number(selectedPkg?.priceBase).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mt-1">
                        {selectedPkg?.durationDays} days
                      </p>
                    </div>

                    {/* Trainer */}
                    {selectedTrainer && (
                      <div className="p-5 rounded-2xl bg-teal-400/5 border border-teal-500/20">
                        <p className="text-sm text-teal-400/60 mb-2">{t("yourTrainer")}</p>
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-teal-500/20 to-amber-500/20">
                            {(selectedTrainer.photos?.[0] || selectedTrainer.photoUrl) ? (
                              <Image
                                src={selectedTrainer.photos?.[0] || selectedTrainer.photoUrl!}
                                alt={`${selectedTrainer.firstName} ${selectedTrainer.lastName}`}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center font-bold text-white/60">
                                {selectedTrainer.firstName[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {selectedTrainer.displayName ||
                                `${selectedTrainer.firstName} ${selectedTrainer.lastName}`}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-white/50">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {selectedTrainer.rating.toFixed(1)} ·{" "}
                              {selectedTrainer.reviewCount} {t("list.reviews")}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Extras */}
                    {selectedExtras.length > 0 && (
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-sm text-white/40 mb-2">{t("extrasLabel")}</p>
                        {selectedExtras.map((id) => {
                          const extra = options.find((o) => o.id === id);
                          return (
                            <div key={id} className="flex justify-between py-1">
                              <span className="text-white/70">{extra?.name}</span>
                              <span className="text-teal-400">
                                +${Number(extra?.priceAdd).toLocaleString()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Personal info */}
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-sm text-white/40 mb-2">{t("personalInfo")}</p>
                      <p className="text-white/80">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-white/50 text-sm">{formData.email}</p>
                      <p className="text-white/50 text-sm mt-1">
                        {formData.checkInDate} → {formData.checkOutDate}
                      </p>
                    </div>

                    {/* Error */}
                    {status === "error" && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {errorMsg}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full py-4 rounded-2xl bg-teal-500 text-black font-bold text-lg hover:bg-teal-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t("processing")}
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          {t("confirm")} — ${total.toLocaleString()}
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-4 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" /> {t("ssl")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {t("encrypted")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════════════
                  STEP 5: Success
              ═══════════════════════════════════════════════════════ */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-teal-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-3">{t("successTitle")}</h2>
                  <p className="text-white/50 max-w-md mx-auto mb-8">{t("successMessage")}</p>

                  {selectedTrainer && (
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10 max-w-sm mx-auto mb-8">
                      <p className="text-sm text-white/40 mb-2">{t("yourTrainer")}</p>
                      <p className="font-semibold text-white">
                        {selectedTrainer.displayName ||
                          `${selectedTrainer.firstName} ${selectedTrainer.lastName}`}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href={`/${locale}/dashboard`}
                      className="px-8 py-3 rounded-xl bg-teal-500 text-black font-semibold hover:bg-teal-400 transition-colors"
                    >
                      {t("goDashboard")}
                    </Link>
                    <Link
                      href={`/${locale}`}
                      className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
                    >
                      {t("backHome")}
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            {step < 5 && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                  {t("back")}
                </button>
                <button
                  onClick={() => setStep((s) => Math.min(5, s + 1))}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 text-black font-semibold hover:bg-teal-400 transition-colors disabled:opacity-30"
                >
                  {step === 4 ? t("reviewBtn") : t("continue")}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════
              ORDER SUMMARY (Sidebar)
          ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white/[0.03] border border-white/10 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-teal-400" />
                {t("orderSummary")}
              </h3>

              {/* Trainer info — FIXED: uses photos[0] with photoUrl fallback */}
              {selectedTrainer && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-400/5 border border-teal-500/20 mb-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-teal-500/20 to-amber-500/20">
                    {(selectedTrainer.photos?.[0] || selectedTrainer.photoUrl) ? (
                      <Image
                        src={selectedTrainer.photos?.[0] || selectedTrainer.photoUrl!}
                        alt={`${selectedTrainer.firstName} ${selectedTrainer.lastName}`}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white/60">
                        {selectedTrainer.firstName[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-teal-400/60">{t("yourTrainer")}</p>
                    <p className="font-medium text-sm">
                      {selectedTrainer.displayName ||
                        `${selectedTrainer.firstName} ${selectedTrainer.lastName}`}
                    </p>
                  </div>
                </div>
              )}

              {/* Package */}
              {selectedPkg && (
                <div className="flex justify-between py-3 border-b border-white/10">
                  <div>
                    <p className="font-medium">{selectedPkg.name}</p>
                    <p className="text-sm text-white/50">
                      {selectedPkg.durationDays} {t("days")}
                    </p>
                  </div>
                  <span className="font-semibold text-teal-400">
                    ${Number(selectedPkg.priceBase).toLocaleString()}
                  </span>
                </div>
              )}

              {/* Extras */}
              {selectedExtras.length > 0 && (
                <div className="py-3 border-b border-white/10">
                  {selectedExtras.map((id) => {
                    const extra = options.find((o) => o.id === id);
                    return (
                      <div key={id} className="flex justify-between py-1">
                        <span className="text-sm text-white/60">{extra?.name}</span>
                        <span className="text-sm text-teal-400">
                          +${Number(extra?.priceAdd).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Total */}
              <div className="flex items-center justify-between pt-4 mt-2">
                <span className="text-lg font-bold">{t("total")}</span>
                <span className="text-2xl font-bold text-teal-400">
                  ${total.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10 text-xs text-white/30">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {t("ssl")}
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3" /> {t("encrypted")}
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> {t("verified")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
