"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Star, Languages, Instagram, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  credentials: string;
  photoUrl: string | null;
  photos: string[];
  instagramUrl: string | null;
  tripsterUrl: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  isActive: boolean;
}

export function TrainerProfile({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const t = useTranslations("trainersPage.profile");
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    params.then(({ id }) => {
      fetch(`/api/trainers/${id}`)
        .then((r) => r.json())
        .then((data) => {
          setTrainer(data);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-64 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("notFound")}</h1>
        <p className="text-neutral-400 mb-6">{t("notFoundDesc")}</p>
        <Link href="/trainers">
          <Button className="bg-teal-600 hover:bg-teal-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
        </Link>
      </div>
    );
  }

  const allPhotos = [
    trainer.photoUrl,
    ...trainer.photos,
  ].filter(Boolean) as string[];

  const reviewLabel = (count: number) => {
    if (count === 1) return t("review");
    return t("reviews");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/trainers"
        className="inline-flex items-center text-neutral-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("back")}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column — Photo */}
        <div className="md:col-span-1">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 mb-4">
            {allPhotos.length > 0 ? (
              <Image
                src={allPhotos[selectedPhoto]}
                alt={`${trainer.firstName} ${trainer.lastName}`}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                <span className="text-6xl font-bold text-teal-400">
                  {trainer.firstName[0]}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allPhotos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allPhotos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    i === selectedPhoto
                      ? "border-teal-400"
                      : "border-transparent hover:border-white/30"
                  }`}
                >
                  <Image
                    src={photo}
                    alt={`Photo ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column — Info */}
        <div className="md:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {trainer.firstName} {trainer.lastName}
            </h1>
            <p className="text-neutral-400">{trainer.credentials}</p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(trainer.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-neutral-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium">{trainer.rating.toFixed(1)}</span>
            <span className="text-neutral-400">
              ({trainer.reviewCount} {reviewLabel(trainer.reviewCount)})
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {trainer.specialties.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-sm"
              >
                {s}
              </span>
            ))}
          </div>

          <Card className="bg-white/5 border-white/10 mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">{t("about")}</h2>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {trainer.bio}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 text-neutral-400">
              <Languages className="w-4 h-4" />
              <span className="text-sm">{t("languages")}:</span>
              {trainer.languages.join(", ")}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {trainer.instagramUrl && (
              <a
                href={trainer.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                {t("instagram")}
              </a>
            )}
            {trainer.tripsterUrl && (
              <a
                href={trainer.tripsterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {t("tripster")}
              </a>
            )}
          </div>

          <div className="mt-8">
            <Link href={`/booking?trainer=${trainer.id}`}>
              <Button className="bg-teal-600 hover:bg-teal-500 text-lg px-8 py-3">
                {t("bookWith")} {trainer.firstName}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
