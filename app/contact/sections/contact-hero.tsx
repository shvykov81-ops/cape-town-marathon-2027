"use client";

import { motion } from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { KineticSectionTitle } from "@/components/effects/kinetic-section-title";
import { AmbientGlow } from "@/components/effects/ambient-background";
import { TelegramButton } from "@/components/telegram-button";

export function ContactHero() {
  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <AmbientGlow className="opacity-40" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] text-sm font-medium mb-6">
            <MessageCircle size={16} />
            All Communication via Telegram
          </div>

          <KineticSectionTitle
            title="Get in Touch"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
          />

          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
            Questions about prep camps, trainers, or the marathon? 
            Join our Telegram for instant replies or fill out the form below.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <TelegramButton variant="primary" size="lg" label="Join Telegram" />
            <motion.button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send a Message
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-neutral-500" />
      </motion.div>
    </section>
  );
}
