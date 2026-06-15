"use client";

import { cn } from "@/lib/utils";

interface TelegramIconProps {
  className?: string;
  size?: number;
}

export function TelegramIcon({ className, size = 24 }: TelegramIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <path
        d="M21.5 4.5L2.5 12.5L9.5 14.5L12.5 21.5L21.5 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 14.5L15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
