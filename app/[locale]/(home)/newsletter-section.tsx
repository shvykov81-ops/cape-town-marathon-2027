"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Check, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function NewsletterSection() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const t = useTranslations("newsletter");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(t("successMessage"));
                setEmail("");
            } else {
                throw new Error(data.error || t("errorDefault"));
            }
        } catch (error) {
            setStatus("error");
            setMessage(error instanceof Error ? error.message : t("errorFailed"));
        }
    };

    return (
        <section className="py-24 bg-gradient-to-b from-neutral-950 to-teal-950/20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="w-16 h-16 mx-auto mb-6 bg-teal-500/20 rounded-2xl flex items-center justify-center">
                        <Mail className="w-8 h-8 text-teal-400" />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t("title")}</h2>
                    <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                        {t("subtitle")}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("placeholder")}
                            disabled={status === "loading"}
                            className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-neutral-500 focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 text-white font-semibold rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:hover:scale-100 min-w-[140px]"
                        >
                            {status === "loading" ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : status === "success" ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            {status === "loading" ? t("loading") : status === "success" ? t("subscribed") : t("subscribe")}
                        </button>
                    </form>

                    {status === "success" && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-teal-400 mt-4 flex items-center justify-center gap-1"
                        >
                            <Check className="w-4 h-4" />
                            {message}
                        </motion.p>
                    )}

                    {status === "error" && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-400 mt-4 flex items-center justify-center gap-1"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {message}
                        </motion.p>
                    )}

                    <p className="text-xs text-neutral-600 mt-4">
                        {t("privacy")}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
