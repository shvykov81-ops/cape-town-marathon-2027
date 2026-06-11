"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WebGLGrain } from "./webgl-grain";
import { KineticHeadline } from "./kinetic-typography";
import { MagneticButton } from "./interactive-elements";
import { AnimatedCounter } from "./animated-counter";
import { ChevronDown, Play, MapPin, Calendar, Users } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [0.3, 0.7]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleScroll = () => {
      if (!containerRef.current || !video.duration) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(
        0,
        Math.min(1, -rect.top / (rect.height - window.innerHeight))
      );
      video.currentTime = scrollProgress * video.duration * 0.5;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [videoLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh]"
      style={{ marginTop: "-4rem" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video background */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: videoScale, opacity: videoOpacity }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src="/videos/hero.mp4"
            muted
            playsInline
            loop={false}
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            style={{
              opacity: videoLoaded ? 1 : 0,
              transition: "opacity 1s",
            }}
          />
          {!videoLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-teal-950 to-neutral-900" />
          )}
        </motion.div>

        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 bg-[#0a0a0a]"
          style={{ opacity: overlayOpacity }}
        />

        {/* WebGL grain */}
        <WebGLGrain />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.4) 100%)",
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-30 h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
          style={{ y: textY, opacity: textOpacity }}
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm text-teal-300 tracking-wide">
                Africa&apos;s First Abbott WMM Candidate
              </span>
            </motion.div>

            {/* Kinetic headline */}
            <div className="mb-8">
              <KineticHeadline
                line1="CAPE TOWN MARATHON"
                line2="RUN & TRAVEL"
                line3="2027"
                className="items-center"
              />
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Prepare with world-class coaches. Travel with purpose.
              <br className="hidden sm:block" />
              From airport to finish line — we handle everything.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MagneticButton className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold text-lg rounded-full transition-colors shadow-lg shadow-teal-500/25">
                <Link href="/booking" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Book Your Spot
                </Link>
              </MagneticButton>

              <MagneticButton
                className="px-8 py-4 border border-neutral-600 hover:border-teal-400 text-white font-medium text-lg rounded-full backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all"
                strength={0.2}
              >
                <Link href="/prep-camp" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Watch Experience
                </Link>
              </MagneticButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 1 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter target={42} suffix=".2" />
                  km
                </div>
                <div className="text-xs md:text-sm text-neutral-500 mt-1 uppercase tracking-wider">
                  Distance
                </div>
              </div>
              <div className="text-center border-x border-neutral-800">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter target={500} suffix="+" />
                </div>
                <div className="text-xs md:text-sm text-neutral-500 mt-1 uppercase tracking-wider">
                  Runners
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter target={12} />
                </div>
                <div className="text-xs md:text-sm text-neutral-500 mt-1 uppercase tracking-wider">
                  Coaches
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1 }}
        >
          <span className="text-xs text-neutral-500 uppercase tracking-[0.2em]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-teal-400" />
          </motion.div>
        </motion.div>

        {/* Side decorative lines */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-px bg-gradient-to-b from-transparent via-teal-500/50 to-transparent"
              initial={{ height: 0 }}
              animate={{ height: 40 }}
              transition={{ delay: 3 + i * 0.1, duration: 0.6 }}
            />
          ))}
        </div>

        {/* Side info */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-end gap-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="flex items-center gap-2 text-neutral-500"
          >
            <MapPin className="w-4 h-4 text-teal-400" />
            <span className="text-xs tracking-wider uppercase">Cape Town, RSA</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.2, duration: 0.8 }}
            className="flex items-center gap-2 text-neutral-500"
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-xs tracking-wider uppercase">Sept–Oct 2027</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
