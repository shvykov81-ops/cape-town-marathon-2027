"use client";

import { motion } from "framer-motion";
import { MessageCircle, Users, Zap } from "lucide-react";
import { TelegramButton } from "@/components/telegram-button";
import { AmbientGlow } from "@/components/effects/ambient-background";

const benefits = [
  {
    icon: MessageCircle,
    title: "Instant Replies",
    description: "Get answers within minutes, not hours",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with fellow runners & travelers",
  },
  {
    icon: Zap,
    title: "Live Updates",
    description: "Race news, prep tips & exclusive offers",
  },
];

export function TelegramCtaSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <AmbientGlow className="opacity-30" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] text-sm font-medium mb-6">
            <MessageCircle size={16} />
            Preferred Channel
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Join Our Telegram Community
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-10">
            All communication goes through Telegram — fastest way to reach us, 
            get updates, and connect with the running community.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm"
              >
                <benefit.icon className="w-8 h-8 text-[#229ED9] mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                <p className="text-neutral-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <TelegramButton variant="primary" size="lg" label="Join Telegram Group" />

          <p className="mt-4 text-neutral-500 text-sm">
            Or fill out the form below — we will reply via Telegram
          </p>
        </motion.div>
      </div>
    </section>
  );
}
