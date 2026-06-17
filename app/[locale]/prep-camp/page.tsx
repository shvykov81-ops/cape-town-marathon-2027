"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronDown, Dumbbell, Hotel, Utensils, Heart, Star, Clock, Users } from "lucide-react";

const packages = [
  {
    name: "Essential",
    price: "$1,299",
    description: "Perfect for first-timers and budget-conscious runners",
    features: [
      "5-day accommodation (shared room)",
      "Daily group training runs",
      "Course reconnaissance run",
      "Pre-race pasta dinner",
      "Race day transport",
      "Basic welcome pack",
    ],
    notIncluded: ["1-on-1 coaching", "Spa treatments", "Safari excursion"],
    popular: false,
  },
  {
    name: "Performance",
    price: "$2,499",
    description: "The sweet spot for serious runners seeking an edge",
    features: [
      "7-day accommodation (private room)",
      "Personalized training plan",
      "2x 1-on-1 coaching sessions",
      "Daily physio & stretching",
      "Nutrition consultation",
      "Ice bath recovery sessions",
      "Course reconnaissance (2 runs)",
      "Pre-race gala dinner",
      "Race day concierge",
      "Premium welcome pack",
    ],
    notIncluded: ["Safari excursion"],
    popular: true,
  },
  {
    name: "Elite",
    price: "$4,999",
    description: "The ultimate marathon preparation experience",
    features: [
      "10-day accommodation (suite)",
      "Fully personalized coaching",
      "Daily 1-on-1 sessions",
      "Full spa & recovery package",
      "Personal nutritionist",
      "Blood lactate testing",
      "Video gait analysis",
      "Unlimited physio",
      "Private course tours",
      "VIP race day experience",
      "Post-race safari (2 days)",
      "Lifetime alumni benefits",
    ],
    notIncluded: [],
    popular: false,
  },
];

const schedule = [
  { day: "Day 1", title: "Arrival & Welcome", desc: "Airport pickup, hotel check-in, welcome dinner & briefing" },
  { day: "Day 2", title: "Easy Run & Orientation", desc: "Light 5km jog along Sea Point promenade + course briefing" },
  { day: "Day 3", title: "Track Session", desc: "Speed work at Green Point Stadium track with coach" },
  { day: "Day 4", title: "Long Run", desc: "18-22km on the actual marathon course (first half)" },
  { day: "Day 5", title: "Recovery & Yoga", desc: "Morning yoga, afternoon spa, evening strategy session" },
  { day: "Day 6", title: "Course Recon", desc: "Drive the full course with coach commentary" },
  { day: "Day 7", title: "Race Prep", desc: "Final easy run, gear check, pasta dinner, early sleep" },
];

const faqs = [
  { q: "When should I arrive for the prep camp?", a: "We recommend arriving 5-7 days before race day. The Essential package starts 5 days prior, Performance 7 days, and Elite 10 days." },
  { q: "Do I need a visa for South Africa?", a: "Most visitors receive a 90-day visa on arrival. Check with your local South African embassy for specific requirements." },
  { q: "Is the prep camp suitable for beginners?", a: "Absolutely! Our coaches adapt sessions to all levels. The Essential package is specifically designed for first-time marathoners." },
  { q: "What if I get injured during the camp?", a: "Our on-site medical team and physios are available 24/7. We also have partnerships with Cape Town's top sports medicine clinics." },
  { q: "Can I bring a non-running partner?", a: "Yes! Partners can join for accommodation and meals at a reduced rate. We also offer partner activities during training hours." },
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

export default function PrepCampPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  return (
    <div className="pt-20">
      {/* Hero with Image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <Image
            src="/images/prep-camp.jpg"
            alt="Runners training with Table Mountain in background"
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
              Prep Camp
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-6 mb-6 drop-shadow-lg">
              Train Like a <span className="text-teal-400">Champion</span>
            </h1>
            <p className="text-neutral-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Arrive early, acclimatize to the altitude, and fine-tune your race strategy 
              with world-class coaches in the shadow of Table Mountain.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-full transition-all hover:scale-105 shadow-lg shadow-teal-900/30"
            >
              Book Your Spot
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">Packages</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">Choose Your Experience</h2>
            <p className="text-neutral-400">All packages include race entry and accommodation</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <FadeIn key={pkg.name} delay={i * 0.15}>
                <div
                  className={`relative p-8 rounded-2xl border h-full flex flex-col ${
                    pkg.popular
                      ? "bg-teal-950/30 border-teal-500/50 md:scale-105"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-teal-400 mb-2">{pkg.price}</div>
                  <p className="text-sm text-neutral-400 mb-6">{pkg.description}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {pkg.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-neutral-500">
                        <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-center">—</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/booking"
                    className={`block text-center py-3 rounded-full font-semibold transition-all hover:scale-[1.02] ${
                      pkg.popular
                        ? "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/30"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    Select {pkg.name}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-24 bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">Schedule</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">A Week of Preparation</h2>
            <p className="text-neutral-400">Performance package schedule (7 days)</p>
          </FadeIn>

          <div className="space-y-4">
            {schedule.map((item, i) => (
              <FadeIn key={item.day} delay={i * 0.08}>
                <div className="flex gap-6 p-6 bg-white/5 border border-white/10 rounded-xl hover:border-teal-500/30 transition-all hover:bg-white/[0.07] group">
                  <div className="w-20 flex-shrink-0">
                    <div className="text-teal-400 font-bold text-lg">{item.day}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-teal-300 transition-colors">{item.title}</h3>
                    <p className="text-sm text-neutral-400">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">FAQ</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">Common Questions</h2>
          </FadeIn>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-teal-400 flex-shrink-0 transition-transform duration-300 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 text-neutral-400 text-sm leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
