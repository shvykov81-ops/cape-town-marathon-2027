"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Users, Trophy, Route, Zap } from "lucide-react";
import { MagneticButton } from "./interactive-elements";
import { AmbientGlow, FloatingOrb } from "./ambient-background";
import { KineticSectionTitle } from "./kinetic-section-title";

// ─── Stat Badge ────────────────────────────────────────
function StatBadge({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20">
        <Icon className="w-5 h-5 text-teal-400" />
      </div>
      <div>
        <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-semibold text-white">{value}</div>
      </div>
    </motion.div>
  );
}

// ─── Feature Item ──────────────────────────────────────
function FeatureItem({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
      className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 shrink-0">
        <Icon className="w-5 h-5 text-teal-400" />
      </div>
      <div>
        <div className="text-sm font-semibold text-white mb-1">{title}</div>
        <div className="text-xs text-white/50 leading-relaxed">{description}</div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────
export function GlassmorphismFeatureCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  const features = [
    {
      icon: Zap,
      title: "Elite Coaching",
      description: "12 certified trainers from around the world",
    },
    {
      icon: Route,
      title: "Scenic Route",
      description: "42.2km through Cape Town's iconic landmarks",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a] py-20"
    >
      {/* Ambient background */}
      <AmbientGlow />

      {/* Main glass card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl mx-4"
      >
        <div
          className="relative rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden transition-transform duration-100 ease-out"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(20,184,166,0.05) 100%)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 80px rgba(20,184,166,0.1)",
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Inner glow border */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.1) 0%, transparent 50%, rgba(245,158,11,0.08) 100%)",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMaskComposite: "xor",
              padding: "1px",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-300 uppercase tracking-widest">
                Abbott WMM Candidate
              </span>
            </motion.div>

            {/* Title */}
            <KineticSectionTitle
              eyebrow=""
              title="RUN & TRAVEL"
              highlight=""
              align="left"
              className="mb-4"
              delay={0.4}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light text-teal-400 tracking-tight mb-6">
                Experience Cape Town 2027
              </h3>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed"
            >
              Join Africa&apos;s first Abbott World Marathon Majors candidate.
              Train with elite coaches, explore Cape Town, and be part of history.
            </motion.p>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
              <StatBadge icon={Calendar} label="Race Date" value="September 2027" delay={0.7} />
              <StatBadge icon={MapPin} label="Location" value="Cape Town, RSA" delay={0.8} />
              <StatBadge icon={Users} label="Community" value="500+ Runners" delay={0.9} />
            </div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
            >
              {features.map((feature, i) => (
                <FeatureItem key={feature.title} {...feature} index={i} />
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <MagneticButton className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-400 text-black font-semibold px-8 py-4 rounded-2xl group">
                <span className="relative z-10 flex items-center gap-2">
                  Book Your Spot
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </MagneticButton>

              <MagneticButton
                className="relative overflow-hidden border border-white/20 bg-white/5 text-white font-medium px-8 py-4 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors"
                strength={0.2}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Route
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Floating orbs */}
          <FloatingOrb
            className="top-8 right-8"
            color="rgba(20, 184, 166, 0.5)"
            size={128}
            duration={6}
          />
          <FloatingOrb
            className="bottom-12 left-8"
            color="rgba(245, 158, 11, 0.5)"
            size={96}
            duration={8}
            delay={2}
          />
        </div>
      </motion.div>
    </section>
  );
}
