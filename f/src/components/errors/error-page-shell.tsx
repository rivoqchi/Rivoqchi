"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Home, RefreshCw, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { ErrorPageConfig } from "@/lib/error-pages";
import { EASE_PREMIUM } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ErrorPageShellProps {
  config: ErrorPageConfig;
  onRetry?: () => void;
}

const RING_POSITIONS = [
  { x: -180, y: -110 },
  { x: 180, y: -100 },
  { x: -200, y: 90 },
  { x: 200, y: 100 },
  { x: -120, y: -170 },
  { x: 130, y: -165 },
  { x: -130, y: 165 },
  { x: 125, y: 170 },
  { x: 0, y: -195 },
  { x: 0, y: 195 },
];

export function ErrorPageShell({ config, onRetry }: ErrorPageShellProps) {
  const prefersReducedMotion = useReducedMotion();
  const isServerError = config.variant === "500";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-60",
          isServerError
            ? "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.62_0.18_25_/_0.12),transparent_70%)]"
            : "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.55_0.08_250_/_0.1),transparent_70%)]",
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0_0_/_0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0_0_/_0.04)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <header className="relative z-20 flex items-center justify-between px-4 py-5 sm:px-8">
        <a
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Portfolio
        </a>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-4">
        <div className="relative flex min-h-[420px] w-full max-w-3xl items-center justify-center">
          {!prefersReducedMotion &&
            config.fragments.map((fragment, index) => {
              const ring = RING_POSITIONS[index % RING_POSITIONS.length];

              return (
                <motion.span
                  key={fragment.text}
                  initial={{
                    opacity: 0,
                    x: fragment.from.x,
                    y: fragment.from.y,
                    rotate: fragment.from.rotate,
                    scale: 0.7,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    opacity: [0, 0.85, 0.55],
                    x: ring.x,
                    y: [ring.y, ring.y - 6, ring.y],
                    rotate: [fragment.from.rotate, 0, index % 2 === 0 ? 2 : -2],
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 1.4,
                    delay: 0.08 * index,
                    ease: EASE_PREMIUM,
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.4 + index * 0.1,
                    },
                  }}
                  className={cn(
                    "pointer-events-none absolute hidden rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm sm:inline-flex",
                    isServerError
                      ? "border-destructive/20 bg-destructive/5 text-destructive/80"
                      : "border-border/80 bg-background/70 text-muted-foreground",
                  )}
                >
                  {fragment.text}
                </motion.span>
              );
            })}

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: EASE_PREMIUM }}
              className="relative"
            >
              <motion.span
                aria-hidden
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        opacity: [0.35, 0.7, 0.35],
                        scale: [1, 1.04, 1],
                      }
                }
                transition={{
                  duration: isServerError ? 2.2 : 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={cn(
                  "absolute inset-0 -z-10 rounded-[2rem] blur-3xl",
                  isServerError ? "bg-destructive/20" : "bg-primary/10",
                )}
              />

              <motion.p
                animate={
                  prefersReducedMotion || !isServerError
                    ? undefined
                    : { x: [0, -2, 2, -1, 0] }
                }
                transition={{
                  duration: 0.45,
                  repeat: Infinity,
                  repeatDelay: 2.8,
                }}
                className={cn(
                  "font-heading text-[7rem] font-semibold leading-none tracking-tighter sm:text-[9rem]",
                  isServerError && "text-destructive/90",
                )}
              >
                {config.code}
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.45 },
                },
              }}
              className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
            >
              {config.title.split(" ").map((word) => (
                <motion.span
                  key={word}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 28,
                      rotateX: -40,
                      filter: "blur(6px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      filter: "blur(0px)",
                    },
                  }}
                  transition={{ duration: 0.65, ease: EASE_PREMIUM }}
                  className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={{ transformPerspective: 600 }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95, ease: EASE_PREMIUM }}
              className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {config.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.15, ease: EASE_PREMIUM }}
              className="mt-4 flex flex-wrap justify-center gap-2 sm:hidden"
            >
              {config.fragments.slice(0, 4).map((fragment) => (
                <span
                  key={fragment.text}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                    isServerError
                      ? "border-destructive/20 bg-destructive/5 text-destructive/80"
                      : "border-border bg-muted/50 text-muted-foreground",
                  )}
                >
                  {fragment.text}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.25, ease: EASE_PREMIUM }}
              className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              {isServerError && onRetry ? (
                <Button size="lg" onClick={onRetry} className="gap-2">
                  <RefreshCw className="size-4" />
                  {config.primaryLabel}
                </Button>
              ) : (
                <a
                  href="/"
                  className={cn(buttonVariants({ size: "lg" }), "gap-2")}
                >
                  <Home className="size-4" />
                  {config.primaryLabel}
                </a>
              )}

              <a
                href={config.secondaryHref}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2")}
              >
                <Sparkles className="size-4" />
                {config.secondaryLabel}
              </a>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-4 pb-6 text-center text-xs text-muted-foreground">
        HTTP {config.code} · Portfolio
      </footer>
    </div>
  );
}
