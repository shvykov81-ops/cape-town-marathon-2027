"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface KineticSectionTitleProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
  delay?: number;
}

export function KineticSectionTitle({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className = "",
  delay = 0,
}: KineticSectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div ref={ref} className={`${alignClasses[align]} ${className}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay }}
          className="inline-block text-teal-400 text-sm tracking-[0.3em] uppercase font-medium mb-4"
        >
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
      >
        {title}
        {highlight && (
          <span className="text-amber-400"> {highlight}</span>
        )}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className="text-neutral-400 max-w-2xl mx-auto text-lg mt-6 leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
