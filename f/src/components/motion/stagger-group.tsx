"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  DIRECTION_OFFSET,
  EASE_PREMIUM,
  MOTION_DURATION,
  MOTION_VIEWPORT,
  STAGGER_DELAY,
  type RevealDirection,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  trigger?: "scroll" | "mount";
}

export function StaggerGroup({
  children,
  className,
  staggerDelay = STAGGER_DELAY,
  delay = 0.05,
  trigger = "scroll",
}: StaggerGroupProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const motionProps =
    trigger === "mount"
      ? { initial: "hidden" as const, animate: "visible" as const }
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: MOTION_VIEWPORT,
        };

  return (
    <motion.div
      {...motionProps}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  className?: string;
}

export function StaggerItem({
  children,
  direction = "up",
  className,
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const offset = DIRECTION_OFFSET[direction];

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          x: offset.x,
          y: offset.y,
          scale: 0.94,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { duration: MOTION_DURATION, ease: EASE_PREMIUM },
        },
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
