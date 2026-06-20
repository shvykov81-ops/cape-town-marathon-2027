"use client";

import { motion } from "framer-motion";

export function LoadingFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <motion.div
        className="w-8 h-8 border-2 border-[#ff6b35] border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
