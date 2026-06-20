"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { WebGLGrain } from "@/components/effects/webgl-grain";
import { KineticHeadline } from "@/components/effects/kinetic-typography";
import { AnimatedCounter } from "@/components/effects/animated-counter";

export function HeroSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });
    const locale = useLocale();
    const t = useTranslations("hero");

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const videoProgress = useTransform(smoothProgress, [0, 1], [0, 1]);

    return (
        <section ref={containerRef} className="relative h-[200vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Video background */}
                <motion.div style={{ opacity: videoProgress }} className="absolute inset-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        poster="/images/hero-fallback.jpg"
                    >
                        <source src="/videos/hero.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/50" />
                </motion.div>

                {/* WebGL grain */}
                <WebGLGrain />

                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

                {/* Content */}
                <motion.div
                    style={{ opacity, scale, y }}
                    className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6"
                    >
                        {t("badge")}
                    </motion.div>

                    {/* Kinetic headline */}
                    <KineticHeadline
                        line1={t("line1")}
                        line2={t("line2")}
                        line3={t("line3")}
                    />

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="text-lg sm:text-xl text-neutral-300 max-w-2xl mb-4"
                    >
                        {t("subtitle1")}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.6 }}
                        className="text-base text-neutral-400 max-w-xl mb-10"
                    >
                        {t("subtitle2")}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.6 }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        <Link
                            href={`/${locale}/booking`}
                            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-lg rounded-full transition-colors shadow-lg shadow-teal-500/25 inline-flex items-center gap-2"
                        >
                            {t("cta1")}
                        </Link>

                        <Link
                            href={`/${locale}/about-race`}
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-full transition-colors border border-white/20 inline-flex items-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            {t("cta2")}
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                        className="flex gap-8 sm:gap-12 mt-16"
                    >
                        <div className="text-center">
                            <AnimatedCounter target={42} suffix=".2km" className="text-2xl sm:text-3xl font-bold text-teal-400" />
                            <div className="text-sm text-neutral-500 mt-1">{t("statDistance")}</div>
                        </div>
                        <div className="text-center">
                            <AnimatedCounter target={500} suffix="+" className="text-2xl sm:text-3xl font-bold text-teal-400" />
                            <div className="text-sm text-neutral-500 mt-1">{t("statRunners")}</div>
                        </div>
                        <div className="text-center">
                            <AnimatedCounter target={12} className="text-2xl sm:text-3xl font-bold text-teal-400" />
                            <div className="text-sm text-neutral-500 mt-1">{t("statCoaches")}</div>
                        </div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2, duration: 0.6 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-sm text-neutral-500">{t("scroll")}</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <ChevronDown className="w-5 h-5 text-neutral-500" />
                        </motion.div>
                    </motion.div>

                    {/* Side info */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block">
                        <div className="text-xs text-neutral-500" style={{ writingMode: "vertical-rl" }}>
                            {t("sideInfo")}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
