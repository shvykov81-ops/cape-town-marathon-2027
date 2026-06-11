"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Languages } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  credentials: string;
  photoUrl: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  isActive: boolean;
}

export function TrainersList() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trainers")
      .then((r) => r.json())
      .then((data) => {
        setTrainers(data);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trainers.map((trainer) => (
        <Link key={trainer.id} href={`/trainers/${trainer.id}`}>
          <Card className="bg-white/5 border-white/10 hover:border-teal-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-teal-500/30">
                  {trainer.photoUrl ? (
                    <Image
                      src={trainer.photoUrl}
                      alt={`${trainer.firstName} ${trainer.lastName}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                      <span className="text-3xl font-bold text-teal-400">
                        {trainer.firstName[0]}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-1">
                  {trainer.firstName} {trainer.lastName}
                </h3>
                <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
                  {trainer.credentials}
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
                    {trainer.rating.toFixed(1)} ({trainer.reviewCount})
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

                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Languages className="w-3 h-3" />
                  {trainer.languages.join(", ")}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
