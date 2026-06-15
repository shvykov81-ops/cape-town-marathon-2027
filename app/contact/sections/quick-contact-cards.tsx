"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, MessageCircle } from "lucide-react";
import { TelegramButton } from "@/components/telegram-button";

const contacts = [
  {
    icon: MessageCircle,
    title: "Telegram",
    description: "Our primary channel",
    action: <TelegramButton variant="outline" size="sm" label="Open Telegram" />,
    highlight: true,
  },
  {
    icon: MapPin,
    title: "Location",
    description: "Cape Town, South Africa",
    action: null,
    highlight: false,
  },
  {
    icon: Clock,
    title: "Response Time",
    description: "Usually within 1 hour",
    action: null,
    highlight: false,
  },
];

export function QuickContactCards() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-6">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`
                relative p-6 rounded-xl border backdrop-blur-sm
                ${contact.highlight 
                  ? "bg-[#229ED9]/5 border-[#229ED9]/20" 
                  : "bg-neutral-900/50 border-neutral-800"
                }
              `}
            >
              {contact.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#229ED9] text-white text-xs font-medium">
                  Recommended
                </div>
              )}
              <contact.icon 
                className={`w-8 h-8 mb-4 ${contact.highlight ? "text-[#229ED9]" : "text-teal-500"}`} 
              />
              <h3 className="text-white font-semibold mb-1">{contact.title}</h3>
              <p className="text-neutral-400 text-sm mb-4">{contact.description}</p>
              {contact.action && (
                <div className="mt-2">{contact.action}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
