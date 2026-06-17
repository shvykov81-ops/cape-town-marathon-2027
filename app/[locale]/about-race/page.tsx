"use client";

import { motion } from "framer-motion";
import { Mountain, Waves, Sun, Wind } from "lucide-react";

const highlights = [
  { icon: Mountain, title: "Table Mountain Views", desc: "Run beneath one of the New7Wonders of Nature" },
  { icon: Waves, title: "Atlantic Coastline", desc: "42km of breathtaking ocean scenery" },
  { icon: Sun, title: "Perfect Weather", desc: "Spring conditions averaging 15-22°C" },
  { icon: Wind, title: "Fast Course", desc: "Net downhill with PB potential" },
];

const coursePoints = [
  { km: "0km", title: "Green Point Stadium", desc: "Start in the shadow of Cape Town Stadium. The energy is electric as 15,000 runners gather beneath the mountain." },
  { km: "5km", title: "Sea Point Promenade", desc: "Flat and fast along the Atlantic seaboard. The ocean crashes beside you as the sun rises over the city." },
  { km: "10km", title: "Clifton Beaches", desc: "Pass four of the world's most beautiful beaches. Crystal clear water and white sand accompany your stride." },
  { km: "15km", title: "Camps Bay", desc: "The iconic Twelve Apostles mountain range towers above. A slight uphill tests your pacing strategy." },
  { km: "21.1km", title: "Halfway Mark", desc: "The turning point at Hout Bay. Aid stations every 3km keep you fueled and hydrated." },
  { km: "28km", title: "Chapman's Peak", desc: "The most scenic marathon section in the world. Cliffs, ocean, and endless horizons." },
  { km: "35km", title: "Noordhoek", desc: "Long flat stretches through wetlands. Keep your rhythm as you enter the final phase." },
  { km: "42.2km", title: "Finish Line", desc: "Return to Green Point Stadium. The crowd roars as you complete Africa's Major Marathon." },
];

export default function AboutRacePage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/about-hero.jpg')" }}
        />
        <div className="relative z-20 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-teal-400 text-sm font-semibold tracking-wider uppercase"
          >
            The Race
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-4 mb-6"
          >
            About the <span className="text-teal-400">Marathon</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-300 text-lg max-w-2xl mx-auto"
          >
            A World Athletics Gold Label race through one of the most beautiful cities on Earth.
          </motion.p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-teal-500/30 transition-colors"
              >
                <item.icon className="w-10 h-10 text-teal-400 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Breakdown */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">Course Map</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">Every Kilometer Tells a Story</h2>
            <p className="text-neutral-400">Navigate the 42.2km from start to finish.</p>
          </motion.div>

          <div className="space-y-8">
            {coursePoints.map((point, i) => (
              <motion.div
                key={point.km}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-6 items-start"
              >
                <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-400 font-bold text-sm">{point.km}</span>
                </div>
                <div className="flex-1 pb-8 border-b border-white/5">
                  <h3 className="font-semibold text-xl mb-2">{point.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{point.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
