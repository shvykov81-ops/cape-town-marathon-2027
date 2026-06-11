"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { MapPin, Sun, Thermometer, Droplets, Wind, Umbrella, Footprints, Heart, Camera, Coffee, ShoppingBag, Mountain, Waves } from "lucide-react";

const attractions = [
  { name: "Table Mountain", icon: Mountain, desc: "Take the cable car or hike to the top for panoramic views of the city and ocean.", tip: "Book cable car tickets online to skip queues" },
  { name: "V&A Waterfront", icon: ShoppingBag, desc: "World-class shopping, dining, and entertainment at the historic harbor.", tip: "Visit the Two Oceans Aquarium for a unique experience" },
  { name: "Cape Point", icon: MapPin, desc: "Where the Atlantic and Indian Oceans meet. Dramatic cliffs and lighthouse.", tip: "Arrive early to avoid crowds and heat" },
  { name: "Boulders Beach", icon: Waves, desc: "Walk among a colony of African penguins on this sheltered beach.", tip: "Best visited in the morning when penguins are most active" },
  { name: "Kirstenbosch Gardens", icon: Heart, desc: "One of the world's great botanical gardens at the foot of Table Mountain.", tip: "Pack a picnic and enjoy the sunset concerts" },
  { name: "Bo-Kaap", icon: Camera, desc: "Colorful houses and rich Cape Malay culture in this historic neighborhood.", tip: "Respect residents' privacy when taking photos" },
];

const weatherData = [
  { month: "Jan", temp: "22°C", rain: "Low", wind: "Moderate", note: "Peak summer - hot and dry" },
  { month: "Feb", temp: "23°C", rain: "Low", wind: "Moderate", note: "Best beach weather" },
  { month: "Mar", temp: "21°C", rain: "Low", wind: "Light", note: "Ideal running conditions" },
  { month: "Apr", temp: "19°C", rain: "Moderate", wind: "Light", note: "Autumn colors in wine country" },
  { month: "May", temp: "17°C", rain: "Moderate", wind: "Moderate", note: "Start of whale season" },
  { month: "Jun", temp: "15°C", rain: "High", wind: "Strong", note: "Winter storms - pack layers" },
  { month: "Jul", temp: "14°C", rain: "High", wind: "Strong", note: "Peak whale watching" },
  { month: "Aug", temp: "15°C", rain: "High", wind: "Strong", note: "Still winter - best hotel rates" },
  { month: "Sep", temp: "16°C", rain: "Moderate", wind: "Moderate", note: "Spring begins - wildflowers bloom" },
  { month: "Oct", temp: "18°C", rain: "Low", wind: "Light", note: "🎯 RACE MONTH - perfect conditions!" },
  { month: "Nov", temp: "20°C", rain: "Low", wind: "Light", note: "Late spring - warm and pleasant" },
  { month: "Dec", temp: "22°C", rain: "Low", wind: "Moderate", note: "Summer crowds - book early" },
];

const runnerTips = [
  { icon: Sun, title: "Sun Protection", desc: "Cape Town sun is intense. Use SPF 50+ and wear a cap during training runs." },
  { icon: Droplets, title: "Hydration", desc: "The dry climate can be deceptive. Drink 500ml water per hour of running." },
  { icon: Wind, title: "The Cape Doctor", desc: "The southeasterly wind (Cape Doctor) typically picks up after 10am. Run early." },
  { icon: Thermometer, title: "Temperature Swings", desc: "Mornings can be cool (10-12°C) even in October. Layer your race outfit." },
  { icon: Footprints, title: "Trail Running", desc: "Try the Pipe Track or Lion's Head trails for stunning off-road runs." },
  { icon: Coffee, title: "Coffee Culture", desc: "Cape Town has incredible coffee. Try Truth Coffee or Origin for pre-run fuel." },
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CapeTownGuidePage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <div className="pt-20">
      {/* Hero with Image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src="/images/cape-town-table-mountain.jpg"
            alt="Table Mountain with cable car and fynbos vegetation"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase bg-teal-950/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
              Travel Guide
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-6 mb-6 drop-shadow-lg">
              Discover <span className="text-teal-400">Cape Town</span>
            </h1>
            <p className="text-neutral-300 text-lg max-w-2xl mx-auto leading-relaxed">
              The Mother City awaits. Explore the best attractions, weather, and runner-specific tips.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Attractions */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Must-See Attractions</h2>
            <p className="text-neutral-400">Don't miss these iconic Cape Town experiences</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attr, i) => {
              const Icon = attr.icon;
              return (
                <FadeIn key={attr.name} delay={i * 0.1}>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-teal-500/30 transition-all hover:bg-white/[0.07] group h-full">
                    <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{attr.name}</h3>
                    <p className="text-sm text-neutral-400 mb-4">{attr.desc}</p>
                    <div className="flex items-start gap-2 text-xs text-teal-300/70">
                      <span className="text-teal-400 flex-shrink-0 font-semibold">Tip:</span>
                      {attr.tip}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Weather Table */}
      <section className="py-24 bg-neutral-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Weather by Month</h2>
            <p className="text-neutral-400">Plan your visit with our seasonal guide</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">Month</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">Avg Temp</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">Rainfall</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">Wind</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-neutral-400">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {weatherData.map((w, i) => (
                    <motion.tr
                      key={w.month}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        w.month === "Oct" ? "bg-teal-500/10" : ""
                      }`}
                    >
                      <td className="py-4 px-4 font-semibold">{w.month}</td>
                      <td className="py-4 px-4 text-neutral-300">{w.temp}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          w.rain === "Low" ? "bg-green-500/20 text-green-400" :
                          w.rain === "Moderate" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          <Droplets className="w-3 h-3" />
                          {w.rain}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-neutral-300">{w.wind}</td>
                      <td className="py-4 px-4 text-sm text-neutral-400">{w.note}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Runner Tips */}
      <section className="py-24 bg-neutral-900 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">For Runners</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">Runner's Guide to Cape Town</h2>
            <p className="text-neutral-400">Essential tips for training and racing in the Mother City</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {runnerTips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <FadeIn key={tip.title} delay={i * 0.1}>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-teal-500/30 transition-all hover:bg-white/[0.07]">
                    <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="font-bold mb-2">{tip.title}</h3>
                    <p className="text-sm text-neutral-400">{tip.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
