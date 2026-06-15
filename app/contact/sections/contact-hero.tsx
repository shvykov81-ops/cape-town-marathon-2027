"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { KineticSectionTitle } from "@/components/effects/kinetic-section-title";
import { AmbientGlow } from "@/components/effects/ambient-background";
import { MagneticButton } from "@/components/effects/interactive-elements";

export function ContactHero() {
  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <AmbientGlow 
        primaryColor="rgba(20, 184, 166, 0.4)" 
        secondaryColor="rgba(245, 158, 11, 0.3)" 
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <KineticSectionTitle 
            title="GET IN TOUCH"
            description="We're here to help you run your best race"
            className="mb-8"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
        >
          Questions about prep camps, trainers, or the marathon? 
          Reach out and our team will respond within 24 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <MagneticButton 
            onClick={scrollToForm}
            className="bg-gradient-to-r from-teal-500 to-teal-400 text-black font-semibold px-8 py-4 rounded-2xl"
          >
            Start Conversation
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-teal-400" />
      </motion.div>
    </section>
  );
}
