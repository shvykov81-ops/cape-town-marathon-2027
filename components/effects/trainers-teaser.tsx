"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, ArrowRight, MapPin, Award } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/effects/interactive-elements";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  bio: string;
  specialties: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  location: string | null;
}

function TrainerCard({ trainer, index }: { trainer: Trainer; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
    >
      <TiltCard className="h-full" tiltAmount={6}>
        <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-colors duration-300 h-full flex flex-col">
          {/* Photo */}
          <div className="relative h-64 overflow-hidden">
            {trainer.photoUrl ? (
              <img
                src={trainer.photoUrl}
                alt={`${trainer.firstName} ${trainer.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-900/50 to-neutral-800 flex items-center justify-center">
                <Award className="w-16 h-16 text-teal-500/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

            {/* Rating badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-neutral-900/80 backdrop-blur-sm rounded-full border border-amber-500/30">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-amber-400">{trainer.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-1">
              {trainer.firstName} {trainer.lastName}
            </h3>

            {trainer.location && (
              <div className="flex items-center gap-1 text-neutral-500 text-sm mb-3">
                <MapPin className="w-3 h-3" />
                <span>{trainer.location}</span>
              </div>
            )}

            <p className="text-neutral-400 text-sm line-clamp-2 mb-4 flex-1">
              {trainer.bio}
            </p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-4">
              {trainer.specialties.slice(0, 3).map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-1 text-xs bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/20"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Languages */}
            <div className="text-xs text-neutral-600">
              {trainer.languages.join(" · ")}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function TrainersTeaser() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data) => {
        // Take top 4 trainers by rating
        const top = (data.trainers || [])
          .sort((a: Trainer, b: Trainer) => b.rating - a.rating)
          .slice(0, 4);
        setTrainers(top);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-teal-400 text-sm tracking-[0.3em] uppercase font-medium">
            World-Class Coaches
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
            Train with the <span className="text-amber-400">Best</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            Certified marathon coaches who will prepare you for the ultimate
            challenge and guide you through Cape Town.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-neutral-800/50 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer, i) => (
              <TrainerCard key={trainer.id} trainer={trainer} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link
            href="/trainers"
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold rounded-full transition-colors shadow-lg shadow-teal-500/25 group"
          >
            View All Trainers
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
