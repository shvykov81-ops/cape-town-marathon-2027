"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Dumbbell, Hotel, Utensils, Heart } from "lucide-react";

const features = [
  { icon: Dumbbell, title: "Elite Coaching", desc: "World-class coaches from Kenya & Ethiopia" },
  { icon: Hotel, title: "Luxury Stay", desc: "5-star accommodation near the start line" },
  { icon: Utensils, title: "Nutrition Plans", desc: "Personalized meal prep for peak performance" },
  { icon: Heart, title: "Recovery Spa", desc: "Daily physio & ice bath sessions" },
];

export function PrepCampTeaser() {
  return (
    <section className="py-24 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800 relative">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/prep-camp.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="px-3 py-1 bg-teal-600 text-white text-xs font-semibold rounded-full">
                  Limited Spots
                </span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">Prep Camp</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6">
              Train Like a Pro in
              <span className="text-teal-400"> Cape Town</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
              Arrive early and join our exclusive 7-day preparation camp. Train on the actual course, 
              acclimatize to the altitude, and fine-tune your race strategy with elite coaches.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{feature.title}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/prep-camp"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full transition-all hover:scale-105"
            >
              Explore Prep Camp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
