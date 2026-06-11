"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mountain, Waves, TreePine, Flag } from "lucide-react";

const routePoints = [
  { km: "0", label: "Start", desc: "Green Point Stadium", icon: Flag },
  { km: "10", label: "Sea Point", desc: "Coastal Promenade", icon: Waves },
  { km: "21", label: "Halfway", desc: "Camps Bay Beach", icon: Waves },
  { km: "32", label: "Chapman's", desc: "Mountain Pass", icon: Mountain },
  { km: "42.2", label: "Finish", desc: "Green Point Stadium", icon: Flag },
];

export function RouteVisualization() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-neutral-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">The Course</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">42.2km of Pure Beauty</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            From the Atlantic coastline to the shadow of Table Mountain, every kilometer tells a story.
          </p>
        </motion.div>

        {/* Route SVG */}
        <div ref={ref} className="relative">
          <svg viewBox="0 0 1000 300" className="w-full h-auto" fill="none">
            {/* Background layers */}
            <motion.path
              d="M0 200 Q200 150 400 180 T800 120 T1000 80"
              stroke="rgba(20,184,166,0.1)"
              strokeWidth="60"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2, delay: 0.5 }}
            />

            {/* Main route line */}
            <motion.path
              d="M0 200 Q200 150 400 180 T800 120 T1000 80"
              stroke="#14b8a6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />

            {/* Glow effect */}
            <motion.path
              d="M0 200 Q200 150 400 180 T800 120 T1000 80"
              stroke="#14b8a6"
              strokeWidth="12"
              strokeLinecap="round"
              filter="blur(8px)"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>

          {/* Route Points */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
            {routePoints.map((point, index) => (
              <motion.div
                key={point.km}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.15 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-teal-500/20 border border-teal-500/30 rounded-full flex items-center justify-center">
                  <point.icon className="w-5 h-5 text-teal-400" />
                </div>
                <div className="text-2xl font-bold text-teal-400">{point.km}km</div>
                <div className="font-semibold mt-1">{point.label}</div>
                <div className="text-sm text-neutral-400">{point.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
