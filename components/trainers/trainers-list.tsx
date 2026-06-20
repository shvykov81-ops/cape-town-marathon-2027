"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrainerCardStandard } from "./trainer-card/trainer-card-standard";

interface Trainer {
  id: string;
  slug: string;
  displayName: string | null;
  firstName: string;
  lastName: string;
  headline: string | null;
  photoUrl: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  languages: string[];
  experienceYears: number | null;
  profileViews: number;
  _count?: {
    reviews: number;
    bookings: number;
  };
}

interface TrainersListProps {
  trainers: Trainer[];
  totalCount: number;
}

export function TrainersList({ trainers, totalCount }: TrainersListProps) {
  if (trainers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏃‍♂️</div>
        <h3 className="text-2xl font-bold text-white mb-4">
          No coaches published yet
        </h3>
        <p className="text-[#8b8b9a] mb-8 max-w-md mx-auto">
          We&apos;re currently onboarding elite coaches. Be the first to join our platform or check back soon!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account">
            <Button className="bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
              Apply as Coach
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-[#1e1e2e] text-white hover:bg-[#1a1a25]">
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="mt-12 p-6 bg-[#111118] rounded-lg border border-[#1e1e2e] max-w-lg mx-auto">
          <h4 className="text-lg font-semibold text-white mb-2">Why coach with us?</h4>
          <ul className="text-[#8b8b9a] text-left space-y-2">
            <li>✅ Free registration — no fees</li>
            <li>✅ Access to international athletes</li>
            <li>✅ Professional profile & booking system</li>
            <li>✅ Part of Africa&apos;s first WMM event</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-[#8b8b9a]">
          Showing <span className="text-white font-semibold">{trainers.length}</span> of{" "}
          <span className="text-white font-semibold">{totalCount}</span> coaches
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer, index) => (
          <TrainerCardStandard key={trainer.id} trainer={trainer} index={index} />
        ))}
      </div>
    </div>
  );
}
