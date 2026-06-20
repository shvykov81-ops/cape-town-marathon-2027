"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

function AnimatedCounter({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function Hero() {
  const t = useTranslations("hero");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-8 h-8 border-2 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl sm:text-2xl text-[#8b8b9a] mb-4"
        >
          {t("subtitle")}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-[#5a5a6a] mb-12"
        >
          Cape Town, RSA · Sep–Oct 2027
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#ff6b35]">
              <AnimatedCounter target={27000} suffix="+" />
            </div>
            <div className="text-sm text-[#8b8b9a] mt-2">Runners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#4a9eff]">
              <AnimatedCounter target={50} suffix="+" />
            </div>
            <div className="text-sm text-[#8b8b9a] mt-2">Coaches</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-[#00d4aa]">
              <AnimatedCounter target={42} suffix="km" />
            </div>
            <div className="text-sm text-[#8b8b9a] mt-2">Distance</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/booking">
            <Button size="lg" className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white px-8 py-6 text-lg">
              {t("cta_primary") || "Book Your Journey"}
            </Button>
          </Link>
          <Link href="/trainers">
            <Button size="lg" variant="outline" className="border-[#1e1e2e] text-white hover:bg-[#1a1a25] px-8 py-6 text-lg">
              {t("cta_secondary") || "Meet Our Coaches"}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
