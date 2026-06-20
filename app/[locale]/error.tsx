"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t("title")}</h2>
        <p className="text-[#8b8b9a] mb-2">{t("description")}</p>
        {error.digest && (
          <p className="text-xs text-[#5a5a6a] mb-6 font-mono">{t("errorId")}: {error.digest}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("retry")}
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-white/[0.08] text-[#8b8b9a] hover:text-white hover:bg-white/5">
              <Home className="w-4 h-4 mr-2" />
              {t("home")}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
