"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

export function MapSection() {
  return (
    <section className="py-24 px-4 bg-neutral-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Us in Cape Town
          </h2>
          <p className="text-neutral-400">
            Green Point Stadium — the heart of the marathon
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden border border-neutral-800 aspect-[21/9] md:aspect-[21/7]"
        >
          {/* Static map image placeholder — replace with actual map image */}
          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-teal-400 mx-auto mb-4" />
              <p className="text-white font-medium text-lg">Green Point Stadium</p>
              <p className="text-neutral-400">Cape Town, South Africa</p>
            </div>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent" />

          {/* Location badge */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-neutral-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-neutral-700">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Race Start & Finish</p>
              <p className="text-neutral-400 text-xs">Green Point Stadium</p>
            </div>
          </div>

          {/* CTA */}
          <a 
            href="https://maps.google.com/?q=Green+Point+Stadium+Cape+Town"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 right-6 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-neutral-900 font-medium rounded-lg transition-colors text-sm"
          >
            Open in Maps
          </a>
        </motion.div>
      </div>
    </section>
  );
}
