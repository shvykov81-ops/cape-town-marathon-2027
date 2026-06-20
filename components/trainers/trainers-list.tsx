"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Star, Languages } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Trainer {
  id: string;
  slug: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  headline: string | null;
  bio: string;
  credentials: string;
  photoUrl: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
}

export function TrainersList() {
  const t = useTranslations("trainersPage.list");
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trainers")
      .then((r) => r.json())
      .then((data) => {
        // Phase 2 API returns { trainers, filters, stats, pagination }
        setTrainers(data.trainers || []);
        setLoading(false);
      })
      .catch(() => {
        setTrainers([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-96" />
        ))}
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-400 text-lg">{t("noTrainers")}</p>
      </div>
    );
  }

  const reviewLabel = (count: number) => {
    if (count === 1) return t("review");
    return t("reviews");
  };

  const getDisplayName = (trainer: Trainer) => {
    return trainer.displayName || `${trainer.firstName} ${trainer.lastName}`;
  };

  const getInitial = (trainer: Trainer) => {
    return (trainer.displayName?.[0] || trainer.firstName[0] || "?").toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainers.map((trainer) => (
        <Link key={trainer.id} href={`/trainers/${trainer.slug}`}>
          <Card className="bg-white/5 border-white/10 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-teal-500/30">
                  {trainer.photoUrl ? (
                    <Image
                      src={trainer.photoUrl}
                      alt={getDisplayName(trainer)}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                      <span className="text-3xl font-bold text-teal-400">
                        {getInitial(trainer)}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-1">
                  {getDisplayName(trainer)}
                </h3>
                {trainer.headline && (
                  <p className="text-sm text-teal-400 mb-2">{trainer.headline}</p>
                )}
                <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
                  {trainer.credentials || trainer.bio}
                </p>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(trainer.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-neutral-600"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-neutral-400 ml-1">
                    {trainer.rating.toFixed(1)} ({trainer.reviewCount} {reviewLabel(trainer.reviewCount)})
                  </span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {trainer.specialties.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-1 rounded-full bg-teal-500/10 text-teal-400"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {trainer.languages && trainer.languages.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <Languages className="w-3 h-3" />
                    {trainer.languages.join(", ")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
