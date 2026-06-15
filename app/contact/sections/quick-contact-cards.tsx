"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { TiltCard } from "@/components/effects/interactive-elements";

const CONTACT_METHODS = [
  {
    icon: Mail,
    label: "Email",
    value: "info@cape-town-marathon.com",
    href: "mailto:info@cape-town-marathon.com",
    color: "teal",
    description: "Response within 24 hours"
  },
  {
    icon: MessageCircle,
    label: "Telegram",
    value: "@CTM2027SupportBot",
    href: "https://t.me/CTM2027SupportBot",
    color: "gold",
    description: "Instant auto-replies + live support"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Green Point Stadium, Cape Town",
    href: "https://maps.google.com/?q=Green+Point+Stadium+Cape+Town",
    color: "green",
    description: "Race start & finish line"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
  }
};

export function QuickContactCards() {
  return (
    <section className="py-24 px-4 bg-neutral-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Other Ways to Connect
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Choose the channel that works best for you
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {CONTACT_METHODS.map((method) => (
            <motion.div key={method.label} variants={itemVariants}>
              <TiltCard className="h-full">
                <a 
                  href={method.href} 
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block p-8 text-center h-full group"
                >
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6
                    transition-transform duration-300 group-hover:scale-110
                    ${method.color === "teal" ? "bg-teal-500/10" : ""}
                    ${method.color === "gold" ? "bg-amber-500/10" : ""}
                    ${method.color === "green" ? "bg-emerald-500/10" : ""}
                  `}>
                    <method.icon className={`
                      w-8 h-8
                      ${method.color === "teal" ? "text-teal-400" : ""}
                      ${method.color === "gold" ? "text-amber-400" : ""}
                      ${method.color === "green" ? "text-emerald-400" : ""}
                    `} />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
                    {method.label}
                  </h3>
                  <p className="text-white font-medium mb-2">{method.value}</p>
                  <p className="text-neutral-500 text-sm">{method.description}</p>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
