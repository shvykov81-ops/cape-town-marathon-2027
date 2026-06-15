"use client";

import { motion } from "framer-motion";
import { TelegramIcon } from "@/components/icons/telegram-icon";
import { cn } from "@/lib/utils";

interface TelegramButtonProps {
  href?: string;
  label?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TELEGRAM_PUBLIC_LINK = process.env.NEXT_PUBLIC_TELEGRAM_GROUP_URL || "https://t.me/capetownmarathon2027";

export function TelegramButton({
  href = TELEGRAM_PUBLIC_LINK,
  label = "Join Telegram",
  variant = "primary",
  size = "md",
  className,
}: TelegramButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50";

  const variants = {
    primary: "bg-[#229ED9] text-white hover:bg-[#1a8bc2] shadow-lg shadow-[#229ED9]/20",
    outline: "border border-[#229ED9] text-[#229ED9] hover:bg-[#229ED9]/10",
    ghost: "text-[#229ED9] hover:bg-[#229ED9]/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <TelegramIcon size={size === "lg" ? 20 : size === "md" ? 18 : 16} />
      <span>{label}</span>
    </motion.a>
  );
}
