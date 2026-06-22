"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { RoleSelector } from "@/components/auth/role-selector";

interface UserRoleInfo {
  role: "user" | "admin" | "trainer";
  hasTrainerProfile: boolean;
}

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"login" | "role-select">("login");
    const [userRoles, setUserRoles] = useState<UserRoleInfo[]>([]);

    // Redirect if already logged in
    useEffect(() => {
        if (status === "authenticated" && session?.user?.role) {
            const role = session.user.role;
            if (role === "admin") router.push("/admin");
            else if (role === "trainer") router.push("/trainer-dashboard");
            else router.push("/dashboard");
        }
    }, [session, status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                // Step 1: Check available roles
                const checkRes = await fetch("/api/auth/check-roles", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
                });

                if (!checkRes.ok) {
                    const data = await checkRes.json();
                    setError(data.error || "Invalid email or password");
                    setLoading(false);
                    return;
                }

                const { roles } = await checkRes.json();

                if (roles.length === 1) {
                    // Single role — login directly
                    await performSignIn(roles[0].role);
                } else {
                    // Multiple roles — show selector
                    setUserRoles(roles);
                    setStep("role-select");
                    setLoading(false);
                }
            } else {
                // Registration
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, name, phone }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setError(data.error || "Something went wrong");
                    setLoading(false);
                    return;
                }

                // After registration — always user role
                await signIn("credentials", {
                    email,
                    password,
                    activeRole: "user",
                    redirect: false,
                });
                router.push("/dashboard");
                router.refresh();
            }
        } catch {
            setError("An unexpected error occurred");
            setLoading(false);
        }
    };

    async function performSignIn(role: string) {
        setLoading(true);
        const result = await signIn("credentials", {
            email: email.toLowerCase().trim(),
            password,
            activeRole: role,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        // Redirect based on selected role
        if (role === "admin") router.push("/admin");
        else if (role === "trainer") router.push("/trainer-dashboard");
        else router.push("/dashboard");

        router.refresh();
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {step === "login" 
                            ? (isLogin ? "Welcome Back" : "Create Account")
                            : "Select Your Role"
                        }
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        {step === "login"
                            ? (isLogin 
                                ? "Sign in to manage your marathon journey" 
                                : "Join us for Cape Town Marathon 2027")
                            : "Your account has multiple roles. Choose how to continue:"
                        }
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}

                {step === "login" ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                                            required={!isLogin}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                        Phone (optional)
                                    </label>
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                                            placeholder="+7 999 123-45-67"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                                    required
                                    minLength={6}
                                    placeholder="••••••"
                                />
                            </div>
                            {!isLogin && (
                                <p className="text-xs text-neutral-500 mt-1.5">
                                    Minimum 6 characters
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                "Please wait..."
                            ) : (
                                <>
                                    {isLogin ? "Sign In" : "Create Account"}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <RoleSelector
                        availableRoles={userRoles.map((r) => ({
                            role: r.role,
                            label: r.role === "admin" ? "Administrator" : r.role === "trainer" ? "Coach / Trainer" : "Runner / Traveler",
                            description: r.role === "admin"
                                ? "Manage applications, trainers, and platform settings"
                                : r.role === "trainer"
                                    ? "Manage your profile, calendar, and athlete bookings"
                                    : "Book camps, view trainers, and plan your trip",
                        }))}
                        onSelectRole={(role) => performSignIn(role)}
                        isLoading={loading}
                    />
                )}

                {step === "login" && (
                    <div className="mt-6 text-center text-sm text-neutral-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError("");
                                setName("");
                                setPhone("");
                            }}
                            className="text-teal-400 hover:text-teal-300 font-semibold transition-colors"
                        >
                            {isLogin ? "Sign Up" : "Sign In"}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
