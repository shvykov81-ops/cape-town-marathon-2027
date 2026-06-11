"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Check, Package, User, Plus, CreditCard, CheckCircle, AlertCircle, Loader2, Award } from "lucide-react";

interface PackageFromDB {
    id: string;
    name: string;
    type: string;
    durationDays: number;
    priceBase: number;
    maxParticipants: number;
    description: string | null;
    includes: string[];
}

interface PackageOptionFromDB {
    id: string;
    name: string;
    priceAdd: number;
    category: string;
}

interface TrainerFromDB {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
    rating: number;
}

const steps = [
    { id: 1, label: "Package", icon: Package },
    { id: 2, label: "Details", icon: User },
    { id: 3, label: "Extras", icon: Plus },
    { id: 4, label: "Payment", icon: CreditCard },
    { id: 5, label: "Confirm", icon: CheckCircle },
];

function BookingForm() {
    const searchParams = useSearchParams();
    const trainerIdFromUrl = searchParams.get("trainer");

    const [step, setStep] = useState(1);
    const [packages, setPackages] = useState<PackageFromDB[]>([]);
    const [options, setOptions] = useState<PackageOptionFromDB[]>([]);
    const [selectedTrainer, setSelectedTrainer] = useState<TrainerFromDB | null>(null);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        dob: "",
        category: "42.2km",
        checkInDate: "",
        checkOutDate: "",
    });

    // Load trainer if trainerId in URL
    useEffect(() => {
        if (trainerIdFromUrl) {
            fetch(`/api/trainers/${trainerIdFromUrl}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.trainer) {
                        setSelectedTrainer(data.trainer);
                    }
                })
                .catch(console.error);
        }
    }, [trainerIdFromUrl]);

    // Load packages
    useEffect(() => {
        fetch("/api/packages")
            .then((res) => res.json())
            .then((data) => {
                setPackages(data);
                setLoadingPackages(false);
            })
            .catch((err) => {
                console.error("Failed to load packages:", err);
                setLoadingPackages(false);
            });
    }, []);

    // Load options for selected package
    useEffect(() => {
        if (!selectedPackageId) {
            setOptions([]);
            return;
        }
        fetch(`/api/packages/${selectedPackageId}/options`)
            .then((res) => res.json())
            .then((data) => setOptions(data))
            .catch(console.error);
    }, [selectedPackageId]);

    const toggleExtra = (id: string) => {
        setSelectedExtras((prev) =>
            prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
        );
    };

    const selectedPkg = packages.find((p) => p.id === selectedPackageId);
    const basePrice = selectedPkg ? parseFloat(String(selectedPkg.priceBase)) || 0 : 0;
    const extrasTotal = selectedExtras.reduce((sum, id) => {
        const extra = options.find((o) => o.id === id);
        return sum + (extra ? parseFloat(String(extra.priceAdd)) || 0 : 0);
    }, 0);
    const total = basePrice + extrasTotal;

    const canProceed = () => {
        if (step === 1) return !!selectedPackageId;
        if (step === 2) return formData.firstName && formData.lastName && formData.email;
        return true;
    };

    async function handleComplete() {
        setStatus("loading");

        try {
            const response = await fetch("/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    packageId: selectedPackageId,
                    trainerId: selectedTrainer?.id || trainerIdFromUrl || null,
                    raceCategory: formData.category,
                    participants: 1,
                    extras: selectedExtras,
                    totalAmount: total,
                    checkInDate: formData.checkInDate,
                    checkOutDate: formData.checkOutDate,
                    phone: formData.phone,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setStep(5);
            } else {
                throw new Error(data.error || "Booking failed");
            }
        } catch (error) {
            setStatus("error");
            setErrorMsg(error instanceof Error ? error.message : "Failed to submit booking");
        }
    }

    function handleNext() {
        if (step === 4) {
            handleComplete();
        } else {
            setStep(Math.min(5, step + 1));
        }
    }

    return (
        <div className="pt-20 min-h-screen bg-neutral-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Book Your Entry</h1>
                    <p className="text-neutral-400">Complete your registration in 5 simple steps</p>
                    {selectedTrainer && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full"
                        >
                            <Award className="w-4 h-4 text-teal-400" />
                            <span className="text-sm text-teal-300">
                                Training with: <strong>{selectedTrainer.firstName} {selectedTrainer.lastName}</strong>
                            </span>
                            {selectedTrainer.rating > 0 && (
                                <span className="text-xs text-amber-400">★ {selectedTrainer.rating.toFixed(1)}</span>
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* Progress */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s.id
                                        ? "bg-teal-600 text-white"
                                        : "bg-white/10 text-neutral-500"
                                    }`}
                            >
                                {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                            </div>
                            <span
                                className={`hidden sm:block ml-2 text-sm ${step >= s.id ? "text-white" : "text-neutral-500"
                                    }`}
                            >
                                {s.label}
                            </span>
                            {i < steps.length - 1 && (
                                <div
                                    className={`w-8 sm:w-12 h-0.5 mx-2 sm:mx-3 ${step > s.id ? "bg-teal-600" : "bg-white/10"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Package */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <h2 className="text-2xl font-bold mb-6">Select Your Package</h2>

                                    {loadingPackages ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                                        </div>
                                    ) : packages.length === 0 ? (
                                        <div className="text-center py-12 text-neutral-400">
                                            No packages available at the moment.
                                        </div>
                                    ) : (
                                        packages.map((pkg) => (
                                            <button
                                                key={pkg.id}
                                                onClick={() => setSelectedPackageId(pkg.id)}
                                                className={`w-full p-6 rounded-2xl border text-left transition-all ${selectedPackageId === pkg.id
                                                        ? "bg-teal-950/30 border-teal-500/50"
                                                        : "bg-white/5 border-white/10 hover:border-white/20"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{pkg.name}</h3>
                                                        <span className="text-xs text-teal-400 uppercase tracking-wider">
                                                            {pkg.durationDays} days
                                                        </span>
                                                    </div>
                                                    <span className="text-2xl font-bold text-teal-400">
                                                        ${Number(pkg.priceBase).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-neutral-400 mb-3">{pkg.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {pkg.includes.map((inc) => (
                                                        <span
                                                            key={inc}
                                                            className="text-xs px-2 py-1 bg-white/5 rounded-full text-neutral-300"
                                                        >
                                                            {inc}
                                                        </span>
                                                    ))}
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </motion.div>
                            )}

                            {/* Step 2: Details */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-2xl font-bold mb-6">Runner Details</h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {[
                                            { key: "firstName", label: "First Name", type: "text" },
                                            { key: "lastName", label: "Last Name", type: "text" },
                                            { key: "email", label: "Email", type: "email" },
                                            { key: "phone", label: "Phone", type: "tel" },
                                            { key: "country", label: "Country", type: "text" },
                                            { key: "dob", label: "Date of Birth", type: "date" },
                                            { key: "checkInDate", label: "Check-in Date", type: "date" },
                                            { key: "checkOutDate", label: "Check-out Date", type: "date" },
                                        ].map((field) => (
                                            <div key={field.key}>
                                                <label className="block text-sm font-medium mb-2">{field.label}</label>
                                                <input
                                                    type={field.type}
                                                    value={formData[field.key as keyof typeof formData]}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                                                    }
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
                                                />
                                            </div>
                                        ))}
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Race Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                                                }
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-teal-500 transition-colors"
                                            >
                                                <option value="42.2km">Full Marathon (42.2km)</option>
                                                <option value="21.1km">Half Marathon (21.1km)</option>
                                                <option value="10km">10K Race</option>
                                                <option value="5km">5K Fun Run</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Extras */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-2xl font-bold mb-6">Add Extras</h2>
                                    {options.length === 0 ? (
                                        <div className="text-neutral-400 py-8">
                                            No additional options for this package.
                                        </div>
                                    ) : (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {options.map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => toggleExtra(option.id)}
                                                    className={`p-4 rounded-xl border text-left transition-all ${selectedExtras.includes(option.id)
                                                            ? "bg-teal-950/30 border-teal-500/50"
                                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-semibold text-sm">{option.name}</span>
                                                        <span className="text-teal-400 font-bold">+${Number(option.priceAdd).toLocaleString()}</span>
                                                    </div>
                                                    <span className="text-xs text-neutral-500 uppercase">{option.category}</span>
                                                    {selectedExtras.includes(option.id) && (
                                                        <Check className="w-4 h-4 text-teal-400 mt-2" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 4: Payment */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h2 className="text-2xl font-bold mb-6">Payment</h2>
                                    <div className="p-6 bg-teal-500/10 border border-teal-500/20 rounded-xl mb-6">
                                        <p className="text-teal-300 text-sm">
                                            Payment processing will be available soon.
                                            Your booking is saved as pending — our team will contact you for payment confirmation.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Card Number</label>
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                disabled
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl opacity-50"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Expiry</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    disabled
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl opacity-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">CVC</label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    disabled
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl opacity-50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {status === "error" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400"
                                        >
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">{errorMsg}</span>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* Step 5: Confirm */}
                            {step === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 mx-auto mb-6 bg-teal-500/20 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-10 h-10 text-teal-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
                                    <p className="text-neutral-400 mb-8 max-w-md mx-auto">
                                        Thank you for registering for the Cape Town Marathon 2027 Prep Camp.
                                        A confirmation has been sent to your dashboard.
                                    </p>
                                    {selectedTrainer && (
                                        <div className="mb-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl inline-block">
                                            <p className="text-sm text-teal-300">
                                                Your trainer: <strong>{selectedTrainer.firstName} {selectedTrainer.lastName}</strong>
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link
                                            href="/dashboard"
                                            className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full transition-all"
                                        >
                                            Go to Dashboard
                                        </Link>
                                        <Link
                                            href="/"
                                            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all"
                                        >
                                            Back to Home
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        {step < 5 && (
                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setStep(Math.max(1, step - 1))}
                                    disabled={step === 1 || status === "loading"}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={!canProceed() || status === "loading"}
                                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-30 disabled:hover:bg-teal-600 text-white font-semibold rounded-full transition-all"
                                >
                                    {status === "loading" ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : step === 4 ? (
                                        <>
                                            Complete Booking
                                            <Check className="w-4 h-4" />
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <h3 className="font-bold text-lg mb-4">Order Summary</h3>

                            {/* Trainer info */}
                            {selectedTrainer && (
                                <div className="flex items-center gap-3 p-3 mb-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                                    {selectedTrainer.photoUrl ? (
                                        <img
                                            src={selectedTrainer.photoUrl}
                                            alt={selectedTrainer.firstName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                                            <Award className="w-5 h-5 text-teal-400" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-sm font-semibold text-white">
                                            {selectedTrainer.firstName} {selectedTrainer.lastName}
                                        </div>
                                        <div className="text-xs text-teal-400">Your Trainer</div>
                                    </div>
                                </div>
                            )}

                            {selectedPkg && (
                                <div className="flex justify-between py-3 border-b border-white/10">
                                    <div>
                                        <span className="text-sm block">{selectedPkg.name}</span>
                                        <span className="text-xs text-neutral-500">{selectedPkg.durationDays} days</span>
                                    </div>
                                    <span className="font-semibold">${Number(selectedPkg.priceBase).toLocaleString()}</span>
                                </div>
                            )}

                            {selectedExtras.length > 0 && (
                                <div className="py-3 border-b border-white/10 space-y-2">
                                    {selectedExtras.map((id) => {
                                        const extra = options.find((o) => o.id === id);
                                        return (
                                            <div key={id} className="flex justify-between text-sm">
                                                <span className="text-neutral-400">{extra?.name}</span>
                                                <span>+${Number(extra?.priceAdd).toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="flex justify-between py-4 mt-2">
                                <span className="font-bold">Total</span>
                                <span className="text-2xl font-bold text-teal-400">${total.toLocaleString()}</span>
                            </div>

                            <div className="mt-4 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                                <p className="text-xs text-teal-300">
                                    Secure booking. Your data is encrypted and protected.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Wrap with Suspense for useSearchParams
export default function BookingPage() {
    return (
        <Suspense fallback={
            <div className="pt-20 min-h-screen bg-neutral-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            </div>
        }>
            <BookingForm />
        </Suspense>
    );
}
