"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, MapPin, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  photoUrl: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  location?: string;
}

function TrainerCard({ trainer, index }: { trainer: Trainer; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const locale = useLocale();
  const t = useTranslations("trainers");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      className="group relative"
    >
      <Link href={`/${locale}/trainers/${trainer.id}`} className="block">
        <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/30">
          {/* Photo */}
          <div className="relative h-64 overflow-hidden">
            {trainer.photoUrl ? (
              <Image
                src={trainer.photoUrl}
                alt={`${trainer.firstName} ${trainer.lastName}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                <User className="w-16 h-16 text-neutral-600" />
              </div>
            )}

            {/* Rating badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm font-medium">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {trainer.rating.toFixed(1)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-1">
              {trainer.firstName} {trainer.lastName}
            </h3>
            {trainer.location && (
              <div className="flex items-center gap-1 text-neutral-400 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                {trainer.location}
              </div>
            )}

            <p className="text-neutral-400 text-sm line-clamp-2 mb-4">
              {trainer.bio}
            </p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-4">
              {trainer.specialties.slice(0, 3).map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-1 rounded-md bg-teal-500/10 text-teal-400 text-xs font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Languages */}
            <div className="text-xs text-neutral-500">
              {trainer.languages.join(" · ")}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function TrainersTeaser() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const locale = useLocale();
  const t = useTranslations("trainers");

  useEffect(() => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data) => {
        const top = (data.trainers || [])
          .sort((a: Trainer, b: Trainer) => b.rating - a.rating)
          .slice(0, 4);
        setTrainers(top);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-neutral-950" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            {t("badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainers.map((trainer, i) => (
              <TrainerCard key={trainer.id} trainer={trainer} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href={`/${locale}/trainers`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold rounded-full transition-colors shadow-lg shadow-teal-500/25"
          >
            {t("cta")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
