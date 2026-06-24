"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Shield,
  Lock,
  User,
  Calendar,
  Package,
  Sparkles,
  CreditCard,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Package {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  priceBase: number;
  type: string;
}

interface PackageOption {
  id: string;
  name: string;
  priceAdd: number;
  category: string;
}

// ─── FIX B-01: Added slug field ──────────────────────────────────────────
interface Trainer {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  photos: string[];
  specialties: string[];
}

const steps = [
  { id: 1, label: "Package", icon: Package },
  { id: 2, label: "Details", icon: User },
  { id: 3, label: "Extras", icon: Sparkles },
  { id: 4, label: "Review", icon: BadgeCheck },
];

const trustIndicators = [
  { icon: Shield, label: "SSL Secured" },
  { icon: Lock, label: "Encrypted" },
  { icon: BadgeCheck, label: "Verified" },
];

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || 0;
  if (value && typeof value === "object" && "toNumber" in value && typeof (value as Record<string, unknown>).toNumber === "function") {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const preselectedPackage = searchParams.get("package");
  const preselectedTrainer = searchParams.get("trainer");

  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState<Package[]>([]);
  const [options, setOptions] = useState<PackageOption[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/packages").then((r) => r.json()),
      fetch("/api/trainers").then((r) => r.json()),
    ])
      .then(([pkgs, trs]) => {
        setPackages(pkgs);
        setTrainers(trs);
        if (preselectedPackage) {
          const pkg = pkgs.find((p: Package) => p.name.toLowerCase() === preselectedPackage);
          if (pkg) setSelectedPkg(pkg);
        }
        // ─── FIX B-01: Match by slug instead of id ─────────────────────
        if (preselectedTrainer) {
          const trainer = trs.find((t: Trainer) => t.slug === preselectedTrainer);
          if (trainer) setSelectedTrainer(trainer);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [preselectedPackage, preselectedTrainer]);

  useEffect(() => {
    if (selectedPkg) {
      fetch(`/api/packages/${selectedPkg.id}/options`)
        .then((r) => r.json())
        .then(setOptions);
    }
  }, [selectedPkg]);

  const total =
    toNumber(selectedPkg?.priceBase) +
    selectedExtras.reduce((sum, id) => {
      const extra = options.find((o) => o.id === id);
      return sum + toNumber(extra?.priceAdd);
    }, 0);

  const handleSubmit = async () => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPkg?.id,
          trainerId: selectedTrainer?.id,
          ...formData,
          extras: selectedExtras,
        }),
      });
      if (res.ok) {
        setStatus("success");
        setStep(5);
      } else {
        const data = await res.json();
        setStatus("error");
        setErrorMsg(data.error || "Booking failed");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error");
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedPkg !== null;
    if (step === 2) return formData.firstName && formData.lastName && formData.email;
    if (step === 3) return true;
    if (step === 4) return true;
    return false;
  };

  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-20">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Book Your{" "}
            <span className="gradient-text">Experience</span>
          </h1>
          <p className="text-neutral-400 max-w-xl mx-auto">
            Secure your spot at Africa&apos;s first Abbott World Marathon Majors candidate event.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCurrent = step === s.id;

              return (
                <div key={s.id} className="flex items-center gap-2 md:gap-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                      isCurrent
                        ? "bg-teal-500/20 border border-teal-500/30"
                        : isActive
                        ? "bg-white/5 border border-white/10"
                        : "bg-white/5 border border-white/5 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive ? "bg-teal-500/20 text-teal-400" : "bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {isActive && step > s.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`hidden md:block text-sm font-medium ${
                        isActive ? "text-white" : "text-neutral-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Select Your Package</h2>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPkg(pkg)}
                          className={`w-full text-left p-6 rounded-2xl glass-card transition-all duration-300 ${
                            selectedPkg?.id === pkg.id
                              ? "border-teal-500/50 bg-teal-500/10"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-white mb-1">
                                {pkg.name}
                              </h3>
                              <p className="text-sm text-neutral-400 mb-3">
                                {pkg.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-neutral-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {pkg.durationDays} days
                                </span>
                                <span className="flex items-center gap-1">
                                  <Package className="w-4 h-4" />
                                  {pkg.type}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">
                                ${toNumber(pkg.priceBase).toLocaleString()}
                              </p>
                              {selectedPkg?.id === pkg.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="mt-2 inline-flex items-center gap-1 text-xs text-teal-400"
                                >
                                  <Check className="w-3 h-3" />
                                  Selected
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Runner Details</h2>
                  <div className="space-y-4">
                    {[
                      { key: "firstName", label: "First Name", type: "text", required: true },
                      { key: "lastName", label: "Last Name", type: "text", required: true },
                      { key: "email", label: "Email", type: "email", required: true },
                      { key: "phone", label: "Phone", type: "tel", required: false },
                      { key: "country", label: "Country", type: "text", required: false },
                      { key: "dob", label: "Date of Birth", type: "date", required: false },
                      { key: "checkInDate", label: "Check-in Date", type: "date", required: false },
                      { key: "checkOutDate", label: "Check-out Date", type: "date", required: false },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-400 ml-1">*</span>}
                        </label>
                        <input
                          type={field.type}
                          required={field.required}
                          value={formData[field.key] || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all duration-200 text-white placeholder-neutral-600"
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>

                  {trainers.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold mb-4">Select Trainer (Optional)</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {trainers.map((trainer) => (
                          <button
                            key={trainer.id}
                            onClick={() =>
                              setSelectedTrainer(
                                selectedTrainer?.id === trainer.id ? null : trainer
                              )
                            }
                            className={`p-4 rounded-xl glass-card transition-all duration-300 text-left ${
                              selectedTrainer?.id === trainer.id
                                ? "border-teal-500/50 bg-teal-500/10"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {(trainer.photos?.[0] || trainer.photoUrl) ? (
                                <img
                                  src={trainer.photos?.[0] || trainer.photoUrl || ""}
                                  alt={trainer.firstName}
                                  className="w-12 h-12 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = "none";
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = "flex";
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                                  <User className="w-6 h-6 text-teal-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-white">
                                  {trainer.firstName} {trainer.lastName}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {trainer.specialties.slice(0, 2).join(", ")}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Add Extras</h2>
                  {options.length === 0 ? (
                    <div className="p-8 text-center glass-card rounded-2xl">
                      <Sparkles className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                      <p className="text-neutral-400">No additional options for this package.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() =>
                            setSelectedExtras((prev) =>
                              prev.includes(option.id)
                                ? prev.filter((id) => id !== option.id)
                                : [...prev, option.id]
                            )
                          }
                          className={`w-full text-left p-5 rounded-2xl glass-card transition-all duration-300 ${
                            selectedExtras.includes(option.id)
                              ? "border-teal-500/50 bg-teal-500/10"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                                  selectedExtras.includes(option.id)
                                    ? "bg-teal-500 border-teal-500"
                                    : "border-neutral-600"
                                }`}
                              >
                                {selectedExtras.includes(option.id) && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-white">{option.name}</p>
                                <p className="text-xs text-neutral-500">{option.category}</p>
                              </div>
                            </div>
                            <p className="text-lg font-bold text-teal-400">
                              +${toNumber(option.priceAdd).toLocaleString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Review Your Booking</h2>

                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl glass-card">
                      <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">
                        Package
                      </h3>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg font-bold text-white">{selectedPkg?.name}</p>
                          <p className="text-sm text-neutral-400">{selectedPkg?.description}</p>
                        </div>
                        <p className="text-xl font-bold text-white">
                          ${toNumber(selectedPkg?.priceBase).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {selectedExtras.length > 0 && (
                      <div className="p-6 rounded-2xl glass-card">
                        <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">
                          Extras
                        </h3>
                        <div className="space-y-3">
                          {selectedExtras.map((id) => {
                            const extra = options.find((o) => o.id === id);
                            return (
                              <div key={id} className="flex justify-between">
                                <span className="text-neutral-300">{extra?.name}</span>
                                <span className="text-teal-400">
                                  +${toNumber(extra?.priceAdd).toLocaleString()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="p-6 rounded-2xl glass-card">
                      <h3 className="text-sm font-medium text-neutral-400 mb-4 uppercase tracking-wider">
                        Personal Information
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-500">Name</p>
                          <p className="text-white">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500">Email</p>
                          <p className="text-white">{formData.email}</p>
                        </div>
                        {formData.phone && (
                          <div>
                            <p className="text-neutral-500">Phone</p>
                            <p className="text-white">{formData.phone}</p>
                          </div>
                        )}
                        {selectedTrainer && (
                          <div>
                            <p className="text-neutral-500">Trainer</p>
                            <p className="text-white">
                              {selectedTrainer.firstName} {selectedTrainer.lastName}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                        <p className="text-red-400 text-sm">{errorMsg}</p>
                      </motion.div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={status === "submitting"}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg hover:from-teal-400 hover:to-emerald-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === "submitting" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Confirm Booking — ${total.toLocaleString()}
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-neutral-500 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      Your data is encrypted and protected
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-teal-400" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
                  <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                    Thank you for registering for the Cape Town Marathon 2027 Prep Camp.
                    A confirmation has been sent to your dashboard.
                  </p>
                  {selectedTrainer && (
                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl glass-card mb-8">
                      {(selectedTrainer.photos?.[0] || selectedTrainer.photoUrl) ? (
                        <img
                          src={selectedTrainer.photos?.[0] || selectedTrainer.photoUrl || ""}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-teal-400" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-sm text-neutral-500">Your trainer</p>
                        <p className="font-bold text-white">
                          {selectedTrainer.firstName} {selectedTrainer.lastName}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-400 transition-colors"
                    >
                      Go to Dashboard
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-card text-white font-semibold hover:bg-white/10 transition-colors"
                    >
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 5 && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl glass-card text-neutral-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep((s) => Math.min(4, s + 1))}
                  disabled={!canProceed() || step === 4}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {step === 3 ? "Review" : "Continue"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl glass-card"
              >
                <h3 className="text-lg font-bold mb-6">Order Summary</h3>

                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                  {trustIndicators.map((t) => (
                    <div key={t.label} className="flex flex-col items-center gap-1">
                      <t.icon className="w-5 h-5 text-teal-400" />
                      <span className="text-[10px] text-neutral-500">{t.label}</span>
                    </div>
                  ))}
                </div>

                {selectedPkg && (
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm text-neutral-400">{selectedPkg.name}</span>
                      <span className="text-sm font-medium text-white">
                        ${toNumber(selectedPkg.priceBase).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-600">{selectedPkg.durationDays} days</span>
                  </div>
                )}

                {selectedExtras.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-white/10 space-y-2">
                    {selectedExtras.map((id) => {
                      const extra = options.find((o) => o.id === id);
                      return (
                        <div key={id} className="flex justify-between text-sm">
                          <span className="text-neutral-400">{extra?.name}</span>
                          <span className="text-teal-400">+${toNumber(extra?.priceAdd).toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedTrainer && (
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      {(selectedTrainer.photos?.[0] || selectedTrainer.photoUrl) ? (
                        <img
                          src={selectedTrainer.photos?.[0] || selectedTrainer.photoUrl || ""}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-teal-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">
                          {selectedTrainer.firstName} {selectedTrainer.lastName}
                        </p>
                        <p className="text-xs text-teal-400">Your Trainer</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold gradient-text">${total.toLocaleString()}</span>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-neutral-500">
                  <Lock className="w-3 h-3" />
                  Secure booking. Your data is encrypted.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
