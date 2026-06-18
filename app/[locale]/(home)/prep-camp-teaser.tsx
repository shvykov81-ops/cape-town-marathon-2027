"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Dumbbell, Hotel, Utensils, Heart } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const FEATURES = [
    { icon: Dumbbell, key: "coaching" as const },
    { icon: Hotel, key: "stay" as const },
    { icon: Utensils, key: "nutrition" as const },
    { icon: Heart, key: "recovery" as const },
];

export function PrepCampTeaser() {
    const t = useTranslations("prepCamp");
    const locale = useLocale();

    return (
        <section className="py-24 bg-neutral-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image side */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800 relative">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: "url('/images/prep-camp.jpg')" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent" />
                            <div className="absolute bottom-6 left-6">
                                <span className="px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full">
                                    {t("badge")}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content side */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">
                            {t("badge")}
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
                            {t("title")}{" "}
                            <span className="text-teal-400">{t("titleHighlight")}</span>
                        </h2>
                        <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
                            {t("description")}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {FEATURES.map((feature) => (
                                <div key={feature.key} className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <feature.icon className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">
                                            {t(`features.${feature.key}.title`)}
                                        </div>
                                        <div className="text-xs text-neutral-500 mt-0.5">
                                            {t(`features.${feature.key}.desc`)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href={`/${locale}/prep-camp`}
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full transition-all hover:scale-105"
                        >
                            {t("cta")}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}