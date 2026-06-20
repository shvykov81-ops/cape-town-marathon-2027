"use client";

import { Card } from "@/components/ui/card";

export function TrainerCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Card
          key={i}
          className="bg-[#111118] border-[#1e1e2e] overflow-hidden"
        >
          <div className="relative w-full h-48 bg-[#1a1a25] animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-[#1a1a25] rounded animate-pulse w-3/4" />
            <div className="h-3 bg-[#1a1a25] rounded animate-pulse w-1/2" />
            <div className="flex gap-2">
              <div className="h-5 bg-[#1a1a25] rounded-full animate-pulse w-16" />
              <div className="h-5 bg-[#1a1a25] rounded-full animate-pulse w-20" />
            </div>
            <div className="h-3 bg-[#1a1a25] rounded animate-pulse w-2/3" />
          </div>
        </Card>
      ))}
    </>
  );
}
