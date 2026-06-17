"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Users, Globe, Timer } from "lucide-react";

const stats = [
  { icon: Trophy, value: "42.2", label: "Kilometers", suffix: "km" },
  { icon: Users, value: "15,000", label: "Runners", suffix: "+" },
  { icon: Globe, value: "80", label: "Countries", suffix: "+" },
  { icon: Timer, value: "2:08", label: "Course Record", suffix: "" },
];

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-neutral-950 relative overflow-hidden">
      {/* Ticker Marquee */}
      <div className="border-y border-white/10 py-4 mb-20 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-12">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-2xl font-bold text-white/10 flex items-center gap-12">
              <span>CAPE TOWN MARATHON 2027</span>
              <span className="text-teal-500/30">•</span>
              <span>AFRICA'S MAJOR MARATHON</span>
              <span className="text-teal-500/30">•</span>
              <span>MAY, 2027</span>
              <span className="text-teal-500/30">•</span>
              <span>42.2KM OF COASTAL BEAUTY</span>
              <span className="text-teal-500/30">•</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-teal-400 mx-auto mb-4" />
              <div className="text-4xl sm:text-5xl font-bold mb-2">
                {stat.value}
                <span className="text-teal-400">{stat.suffix}</span>
              </div>
              <div className="text-neutral-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
