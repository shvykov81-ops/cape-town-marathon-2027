"use client";

import { cn } from "@/lib/utils";
import { TrainerProfileStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: TrainerProfileStatus | string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  PENDING: { label: "Pending Review", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  PUBLISHED: { label: "Published", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Rejected", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  SUSPENDED: { label: "Suspended", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20" };
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border font-medium",
      size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
      config.className
    )}>
      {config.label}
    </span>
  );
}
