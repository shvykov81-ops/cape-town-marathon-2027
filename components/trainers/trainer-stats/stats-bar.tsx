"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Target, Globe, Star } from "lucide-react";
import { useTranslations } from "next-intl";

interface StatsBarProps {
  totalCoaches: number;
  totalSpecialties: number;
  totalLanguages: number;
  avgRating: number;
}

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function StatsBar({ totalCoaches, totalSpecialties, totalLanguages, avgRating }: StatsBarProps) {
  const t = useTranslations("trainersPage.stats");

  const stats = [
    { icon: Users, value: totalCoaches, label: t("coaches"), color: "#ff6b35" },
    { icon: Target, value: totalSpecialties, label: t("specialties"), color: "#4a9eff" },
    { icon: Globe, value: totalLanguages, label: t("languages"), color: "#00d4aa" },
    { icon: Star, value: avgRating, label: t("avg_rating"), color: "#f59e0b", isDecimal: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-4 flex items-center gap-3"
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${stat.color}15` }}
          >
            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
          </div>
          <div>
            <p className="text-xl font-bold text-white">
              {stat.isDecimal ? avgRating.toFixed(1) : <AnimatedCounter value={stat.value} />}
            </p>
            <p className="text-xs text-[#5a5a6a]">{stat.label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
