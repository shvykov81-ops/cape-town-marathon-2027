"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BadgeCheck, Mountain, Users, Calendar, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Mountain,
    title: "Elite Training",
    description: "Train with certified marathon coaches on Table Mountain routes",
  },
  {
    icon: Users,
    title: "Community",
    description: "Join 500+ runners from 40+ countries in 2027",
  },
  {
    icon: Calendar,
    title: "Full Package",
    description: "From airport pickup to finish line celebration",
  },
];

export function GlassmorphismFeatureCard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-card rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden"
        >
          {/* Inner glow border */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
          <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-8"
            >
              <BadgeCheck className="w-4 h-4" />
              Abbott WMM Candidate
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Experience Cape Town 2027
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-neutral-400 max-w-2xl mb-12"
            >
              Join Africa&apos;s first Abbott World Marathon Majors candidate.
              Train with elite coaches, explore Cape Town, and be part of history.
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 mb-12"
            >
              {[
                { value: "42.2", label: "km Distance" },
                { value: "500+", label: "Runners" },
                { value: "12", label: "Coaches" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-teal-400">{stat.value}</div>
                  <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid sm:grid-cols-3 gap-4 mb-12"
            >
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="glass-card-hover p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <feature.icon className="w-6 h-6 text-teal-400 mb-3" />
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-neutral-400">{feature.description}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons - Standard buttons instead of MagneticButton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/booking"
                className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-400 text-black font-semibold px-8 py-4 rounded-2xl group inline-flex items-center gap-2 hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-300"
              >
                <span className="relative z-10">Book Your Spot</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <Link
                href="/about-race"
                className="relative overflow-hidden bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl group inline-flex items-center gap-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <span className="relative z-10">Explore Route</span>
                <Play className="w-5 h-5 relative z-10" />
              </Link>
            </motion.div>
          </div>

          {/* Floating orbs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-500/20 rounded-full blur-[60px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-[60px]" />
        </motion.div>
      </div>
    </section>
  );
}
