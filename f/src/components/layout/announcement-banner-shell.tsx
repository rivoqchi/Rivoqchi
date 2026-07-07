"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE_PREMIUM } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AnnouncementBannerShellProps {
  visible: boolean;
  hidden?: boolean;
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
  onDismiss: () => void;
  dismissLabel: string;
}

export function AnnouncementBannerShell({
  visible,
  hidden = false,
  message,
  ctaLabel,
  onCta,
  onDismiss,
  dismissLabel,
}: AnnouncementBannerShellProps) {
  const prefersReducedMotion = useReducedMotion();

  if (hidden || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={
            prefersReducedMotion ? { opacity: 1 } : { y: -24, opacity: 0 }
          }
          animate={{ y: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: -16, opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_PREMIUM }}
          className="pointer-events-none fixed inset-x-0 top-16 z-[49] px-3 pt-3.5 sm:px-4 sm:pt-4"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl">
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl border border-emerald-300/30",
                "bg-gradient-to-r from-emerald-700 via-emerald-500 to-green-500",
                "pl-5 pr-4 py-3.5 shadow-[0_12px_40px_-14px_rgba(16,185,129,0.55)]",
                "sm:flex sm:items-center sm:gap-4 sm:pl-6 sm:pr-5 sm:py-4",
              )}
            >
              {/* Chap accent chiziq — icon o'rniga */}
              <div
                aria-hidden
                className="absolute bottom-3.5 left-3 top-3.5 w-1 rounded-full bg-white/45 sm:left-3.5"
              />

              {!prefersReducedMotion && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(255,255,255,0.18)_50%,transparent_65%)]"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: "easeInOut",
                  }}
                />
              )}

              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-white/10 blur-2xl"
              />

              <p className="relative flex-1 text-sm font-medium leading-snug text-white sm:text-[15px]">
                {message}
              </p>

              <div className="relative mt-3 flex shrink-0 items-center gap-2 sm:mt-0">
                {ctaLabel && onCta ? (
                  <Button
                    size="sm"
                    className="h-8 bg-white font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50"
                    onClick={onCta}
                  >
                    {ctaLabel}
                  </Button>
                ) : null}
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-white/85 hover:bg-white/15 hover:text-white"
                  onClick={onDismiss}
                  aria-label={dismissLabel}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
