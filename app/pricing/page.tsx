"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Users, Minus, Plus } from "lucide-react";

const tiers = [
  {
    name: "Standard Entry",
    price: 120,
    description: "Race entry only",
    features: [
      "Race bib & timing chip",
      "Finisher medal",
      "Race t-shirt",
      "Access to Expo",
      "Post-race refreshment",
      "Digital certificate",
    ],
  },
  {
    name: "Premium Entry",
    price: 220,
    description: "Enhanced race experience",
    features: [
      "Everything in Standard",
      "Premium race vest",
      "Priority start corral",
      "Personalized bib",
      "Post-race massage (15 min)",
      "Finisher photo package",
      "VIP recovery area access",
    ],
    popular: true,
  },
  {
    name: "Elite Entry",
    price: 450,
    description: "The ultimate marathon experience",
    features: [
      "Everything in Premium",
      "Elite start corral",
      "Pre-race warm-up area",
      "Private bag storage",
      "Post-race brunch",
      "Pace team access",
      "Training plan included",
      "Lifetime alumni status",
    ],
  },
];

export default function PricingPage() {
  const [groupSize, setGroupSize] = useState(1);
  const discount = groupSize >= 5 ? 0.15 : groupSize >= 3 ? 0.1 : 0;

  return (
    <div className="pt-20">
      <section className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-teal-400 text-sm font-semibold tracking-wider uppercase">Pricing</span>
            <h1 className="text-5xl font-bold mt-4 mb-6">Choose Your Entry</h1>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              All entries include race timing, medical support, and finisher recognition.
            </p>
          </motion.div>

          {/* Group Discount Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto mb-16 p-6 bg-white/5 border border-white/10 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-teal-400" />
              <h3 className="font-semibold">Group Discount Calculator</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-neutral-400">Group size</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold">{groupSize}</span>
                <button
                  onClick={() => setGroupSize(Math.min(20, groupSize + 1))}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            {discount > 0 && (
              <div className="text-center p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                <span className="text-teal-400 font-semibold">
                  {discount * 100}% group discount applied!
                </span>
                <span className="text-sm text-neutral-400 block mt-1">
                  Save ${Math.round(tiers[1].price * groupSize * discount)} on Premium entries
                </span>
              </div>
            )}
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, i) => {
              const finalPrice = Math.round(tier.price * (1 - discount));
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-8 rounded-2xl border ${
                    tier.popular
                      ? "bg-teal-950/30 border-teal-500/50"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-teal-500 text-white text-xs font-bold rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-neutral-400 mb-4">{tier.description}</p>
                  <div className="mb-6">
                    {discount > 0 && (
                      <span className="text-lg text-neutral-500 line-through mr-2">
                        ${tier.price}
                      </span>
                    )}
                    <span className="text-5xl font-bold text-teal-400">${finalPrice}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/booking"
                    className={`block text-center py-3 rounded-full font-semibold transition-all ${
                      tier.popular
                        ? "bg-teal-600 hover:bg-teal-500 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    Select {tier.name}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
