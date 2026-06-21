"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown, Play } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { WebGLGrain } from "./webgl-grain";
import { KineticHeadline } from "./kinetic-typography";
import { AnimatedCounter } from "./animated-counter";

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });
    const locale = useLocale();
    const t = useTranslations("hero");

    const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
    const contentScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);
    const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);

    const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
    const videoY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    const vignetteOpacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 0.8]);

    const parallaxX = useTransform(() => (mousePosition.x - 0.5) * 30);
    const parallaxY = useTransform(() => (mousePosition.y - 0.5) * 20);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMousePosition({
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        });
    };

    // Загружаем видео через fetch — обходим <base> тег
    useEffect(() => {
        const loadVideo = async () => {
            try {
                const origin = window.location.origin;
                const url = `${origin}/videos/hero.mp4`;
                console.log("[Hero] Fetching video from:", url);

                const response = await fetch(url, { cache: "no-store" });
                if (!response.ok) {
                    console.error("[Hero] Video fetch failed:", response.status);
                    return;
                }

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                console.log("[Hero] Video loaded, blob size:", blob.size);
                setVideoSrc(objectUrl);
            } catch (err) {
                console.error("[Hero] Failed to load video:", err);
            }
        };

        loadVideo();

        return () => {
            if (videoSrc) URL.revokeObjectURL(videoSrc);
        };
    }, []);

    // Воспроизведение видео
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoSrc) return;

        const handleCanPlay = () => {
            console.log("[Hero] Video can play");
            setVideoLoaded(true);
        };

        video.addEventListener("canplay", handleCanPlay);
        video.load();

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.warn("[Hero] Autoplay blocked:", err.message);
            });
        }

        return () => {
            video.removeEventListener("canplay", handleCanPlay);
        };
    }, [videoSrc]);

    const posterUrl = typeof window !== "undefined" 
        ? `${window.location.origin}/images/hero-runners.jpg` 
        : "/images/hero-runners.jpg";

    return (
        <section 
            ref={containerRef} 
            className="relative h-[250vh]"
            onMouseMove={handleMouseMove}
        >
            <div className="sticky top-0 h-screen overflow-hidden">
                <motion.div
                    style={{ scale: videoScale, y: videoY }}
                    className="absolute inset-0"
                >
                    {/* Poster fallback — ВСЕГДА видим, пока видео не загрузилось */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                        style={{
                            backgroundImage: `url('${posterUrl}')`,
                            opacity: videoLoaded ? 0 : 1,
                        }}
                    />

                    {/* Video — рендерим ТОЛЬКО когда videoSrc загружен */}
                    {videoSrc && (
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            poster={posterUrl}
                            src={videoSrc}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                            style={{ opacity: videoLoaded ? 1 : 0 }}
                        />
                    )}

                    {/* Cinematic overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-transparent to-orange-900/20 mix-blend-overlay" />

                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    <motion.div 
                        style={{ opacity: vignetteOpacity }}
                        className="absolute inset-0 bg-black/40 pointer-events-none"
                    />
                </motion.div>

                <motion.div 
                    style={{ opacity: vignetteOpacity }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
                </motion.div>

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ opacity: [0.1, 0.3, 0.1], x: ["-10%", "10%", "-10%"] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-orange-500/10 via-transparent to-transparent blur-3xl"
                    />
                    <motion.div
                        animate={{ opacity: [0.05, 0.15, 0.05], x: ["10%", "-10%", "10%"] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-teal-500/10 via-transparent to-transparent blur-3xl"
                    />
                </div>

                <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                    style={{
                        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                    }}
                />

                <WebGLGrain />

                <motion.div
                    style={{ opacity: contentOpacity, scale: contentScale, y: contentY }}
                    className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center"
                >
                    <motion.div style={{ x: parallaxX, y: parallaxY }} className="flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="mb-8"
                        >
                            <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-teal-300 text-xs font-medium tracking-[0.2em] uppercase backdrop-blur-md">
                                <motion.span 
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                                />
                                {t("badge")}
                            </span>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
                            <KineticHeadline line1={t("line1")} line2={t("line2")} line3={t("line3")} />
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ delay: 1.0, duration: 0.8 }}
                            className="text-lg sm:text-xl text-neutral-300/90 max-w-2xl mb-4 mt-6"
                        >
                            {t("subtitle1")}
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="text-base text-neutral-400/80 max-w-xl mb-12"
                        >
                            {t("subtitle2")}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4, duration: 0.6 }}
                            className="flex flex-wrap gap-4 justify-center"
                        >
                            <Link
                                href="/booking"
                                className="group relative px-8 py-4 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-lg rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)] inline-flex items-center gap-2 overflow-hidden"
                            >
                                <span className="relative z-10">{t("cta1")}</span>
                                <motion.span
                                    className="absolute inset-0 bg-white/20"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.5 }}
                                />
                            </Link>

                            <Link
                                href="/about-race"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-lg rounded-full transition-all duration-300 border border-white/10 hover:border-white/30 inline-flex items-center gap-2 backdrop-blur-sm"
                            >
                                <Play className="w-5 h-5" />
                                {t("cta2")}
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8, duration: 0.6 }}
                            className="flex gap-8 sm:gap-12 mt-16"
                        >
                            {[
                                { target: 42, suffix: ".2km", label: t("statDistance") },
                                { target: 500, suffix: "+", label: t("statRunners") },
                                { target: 12, suffix: "", label: t("statCoaches") },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.0 + i * 0.1, duration: 0.5 }}
                                    className="text-center group"
                                >
                                    <div className="relative">
                                        <AnimatedCounter target={stat.target} suffix={stat.suffix} className="text-2xl sm:text-3xl font-bold text-teal-400 group-hover:text-teal-300 transition-colors" />
                                        <motion.div
                                            className="absolute -bottom-1 left-0 h-0.5 bg-teal-400/50"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ delay: 2.5 + i * 0.1, duration: 0.8 }}
                                        />
                                    </div>
                                    <div className="text-sm text-neutral-500 mt-2">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5, duration: 0.6 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-xs text-neutral-500 tracking-[0.2em] uppercase">{t("scroll")}</span>
                        <motion.div
                            animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            <ChevronDown className="w-5 h-5 text-neutral-500" />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.2, duration: 0.6 }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block"
                    >
                        <div className="text-xs text-neutral-600 tracking-[0.3em] uppercase" style={{ writingMode: "vertical-rl" }}>
                            {t("sideInfo")}
                        </div>
                    </motion.div>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
            </div>
        </section>
    );
}
