"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_PREMIUM, MOTION_VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  delay?: number;
}

export function AnimatedProgress({
  value,
  className,
  barClassName,
  delay = 0.2,
}: AnimatedProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, value));

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        <div
          className={cn("h-full bg-primary", barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.div
        className={cn("h-full bg-primary", barClassName)}
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={MOTION_VIEWPORT}
        transition={{ duration: 1.1, ease: EASE_PREMIUM, delay }}
      />
    </div>
  );
}
