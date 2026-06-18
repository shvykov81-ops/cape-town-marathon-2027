"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";

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
}

export function CoachesSection() {
  const t = useTranslations("prepCampPage.coaches");
  const locale = useLocale();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((data: Trainer[]) => {
        // Sort by rating, take top 5
        const sorted = data
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);
        setTrainers(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">
            {t("badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            {t("title")}{" "}
            <span className="text-teal-400">{t("titleHighlight")}</span>
          </h2>
          <p className="text-neutral-400 max-w-3xl mx-auto text-lg leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center text-neutral-500 py-12">
            {t("noTrainers") || "No trainers available at the moment."}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainers.map((trainer, index) => (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-teal-500/30 transition-colors group"
              >
                <div className="relative h-56 bg-neutral-800">
                  {trainer.photoUrl ? (
                    <Image
                      src={trainer.photoUrl}
                      alt={`${trainer.firstName} ${trainer.lastName}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-neutral-700">
                        {trainer.firstName[0]}{trainer.lastName[0]}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold text-sm">
                        {trainer.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-neutral-500 text-sm">
                      ({trainer.reviewCount} reviews)
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {trainer.firstName} {trainer.lastName}
                  </h3>

                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                    {trainer.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {trainer.specialties.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-xs rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-neutral-500 text-xs">
                      {trainer.languages.slice(0, 2).join(", ")}
                    </div>
                    <Link
                      href={`/${locale}/trainers/${trainer.id}`}
                      className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 text-sm font-semibold transition-colors"
                    >
                      Profile
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href={`/${locale}/trainers`}
            className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold transition-colors"
          >
            {t("allTrainers") || "View All Trainers"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
