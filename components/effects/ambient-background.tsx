"use client";

import { motion } from "framer-motion";

interface AmbientGlowProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showNoise?: boolean;
}

export function AmbientGlow({
  className = "",
  primaryColor = "rgba(20, 184, 166, 0.4)",
  secondaryColor = "rgba(245, 158, 11, 0.3)",
  showNoise = true,
}: AmbientGlowProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Primary orb */}
      <div
        className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full animate-pulse-slow"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
        }}
      />
      {/* Secondary orb */}
      <div
        className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full animate-pulse-slow-delayed"
        style={{
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
        }}
      />
      {/* Noise texture */}
      {showNoise && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      )}
    </div>
  );
}

interface FloatingOrbProps {
  className?: string;
  color?: string;
  size?: number;
  duration?: number;
  delay?: number;
}

export function FloatingOrb({
  className = "",
  color = "rgba(20, 184, 166, 0.5)",
  size = 128,
  duration = 6,
  delay = 0,
}: FloatingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
