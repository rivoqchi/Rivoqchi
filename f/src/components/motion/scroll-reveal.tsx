"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  DIRECTION_OFFSET,
  EASE_PREMIUM,
  MOTION_DURATION,
  MOTION_VIEWPORT,
  type RevealDirection,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = MOTION_DURATION,
  className,
  as = "div",
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as];
  const offset = DIRECTION_OFFSET[direction];

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: 0.94,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={MOTION_VIEWPORT}
      transition={{
        duration,
        delay,
        ease: EASE_PREMIUM,
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </Component>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: MOTION_DURATION, delay, ease: EASE_PREMIUM }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
