"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useTranslation } from "@/hooks/use-translation";
import { EASE_PREMIUM } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function NetworkOfflineBanner() {
  const { isOnline, isChecking } = useNetworkStatus();
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  if (typeof document === "undefined" || !t) return null;

  return createPortal(
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={
            prefersReducedMotion ? { opacity: 1 } : { y: -20, opacity: 0 }
          }
          animate={{ y: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: -12, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-4 sm:pt-3.5"
        >
          <div
            className={cn(
              "mx-auto flex max-w-3xl items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
              "border-destructive/40 bg-destructive text-destructive-foreground",
            )}
          >
            <WifiOff className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-snug">{t.network.offlineTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-destructive-foreground/90">
                {isChecking ? t.network.reconnecting : t.network.offlineMessage}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
