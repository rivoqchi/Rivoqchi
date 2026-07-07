"use client";

import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkillPulseWaveProps {
  level: number;
  className?: string;
  delay?: number;
}

const CYCLE_WIDTH = 112;
const VIEW_HEIGHT = 48;
const BASELINE = 28;

function clampLevel(level: number) {
  return Math.max(0, Math.min(100, level));
}

/**
 * Bir yurak urishi tsikli: uzun diastola (tekis) + P → QRS (keskin impuls) → T
 */
function buildHeartbeatCycle(x0: number, baseline: number, amp: number) {
  const b = baseline;
  const a = amp;
  const w = CYCLE_WIDTH;

  return [
    `L ${x0 + w * 0.665} ${b - a * 0.11}`,
    `L ${x0 + w * 0.695} ${b}`,
    `L ${x0 + w * 0.715} ${b + a * 0.09}`,
    `L ${x0 + w * 0.728} ${b - a}`,
    `L ${x0 + w * 0.742} ${b + a * 0.48}`,
    `L ${x0 + w * 0.756} ${b - a * 0.14}`,
    `L ${x0 + w * 0.775} ${b}`,
    `L ${x0 + w * 0.84} ${b - a * 0.28}`,
    `L ${x0 + w * 0.9} ${b}`,
    `L ${x0 + w} ${b}`,
  ].join(" ");
}

function buildHeartbeatPath(amplitude: number, baseline: number, cycles: number) {
  const b = baseline;
  let d = `M 0 ${b}`;

  for (let i = 0; i < cycles; i++) {
    const x0 = i * CYCLE_WIDTH;
    d += ` L ${x0 + CYCLE_WIDTH * 0.62} ${b}`;
    d += buildHeartbeatCycle(x0, b, amplitude);
  }

  return d;
}

export function SkillPulseWave({
  level,
  className,
  delay = 0,
}: SkillPulseWaveProps) {
  const uid = useId().replace(/:/g, "");
  const prefersReducedMotion = useReducedMotion();
  const value = clampLevel(level);

  const amplitude = 5 + (value / 100) * 20;
  const duration = 22 - (value / 100) * 6;
  const beatInterval = duration / 5.5;
  const strokeWidth = 1.35 + (value / 100) * 1.65;
  const opacity = 0.32 + (value / 100) * 0.68;
  const tier =
    value >= 85 ? "expert" : value >= 70 ? "strong" : value >= 50 ? "mid" : "low";

  const viewWidth = CYCLE_WIDTH * 6;
  const path = useMemo(
    () => buildHeartbeatPath(amplitude, BASELINE, 6),
    [amplitude],
  );

  return (
    <div
      className={cn(
        "relative h-12 w-full overflow-hidden rounded-xl",
        "bg-gradient-to-b from-emerald-950/[0.04] to-foreground/[0.02]",
        "ring-1 ring-foreground/10 dark:from-emerald-500/[0.06]",
        className,
      )}
      aria-hidden
    >
      {/* EKG grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: "14px 12px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-emerald-500/15 dark:bg-emerald-400/20" />

      {/* Live beat indicator — har urishda chaqnaydi */}
      <span
        className={cn(
          "absolute left-2 top-2 size-1.5 rounded-full",
          tier === "expert" && "bg-emerald-500",
          tier === "strong" && "bg-emerald-600/80 dark:bg-emerald-400/90",
          tier === "mid" && "bg-foreground/50",
          tier === "low" && "bg-foreground/25",
        )}
        style={
          prefersReducedMotion
            ? undefined
            : {
                animation: `skill-beat-flash ${beatInterval}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }
        }
      />

      <motion.div
        className="absolute inset-y-0 left-0 flex w-[200%]"
        initial={false}
        animate={prefersReducedMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration,
                repeat: Infinity,
                ease: "linear",
                delay,
              }
        }
      >
        {[0, 1].map((copy) => (
          <svg
            key={copy}
            viewBox={`0 0 ${viewWidth} ${VIEW_HEIGHT}`}
            preserveAspectRatio="none"
            className="h-full w-1/2 shrink-0"
          >
            <defs>
              <linearGradient
                id={`ekg-stroke-${uid}-${copy}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.15" />
                <stop offset="45%" stopColor="var(--foreground)" stopOpacity={opacity} />
                <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.15" />
              </linearGradient>
              {tier === "expert" && (
                <filter id={`ekg-glow-${uid}-${copy}`}>
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              )}
            </defs>

            <path
              d={path}
              fill="none"
              stroke={`url(#ekg-stroke-${uid}-${copy})`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              filter={
                tier === "expert" ? `url(#ekg-glow-${uid}-${copy})` : undefined
              }
            />

            {/* R cho'qqisi highlight */}
            <path
              d={path}
              fill="none"
              stroke={
                tier === "expert" || tier === "strong"
                  ? "rgb(16 185 129 / 0.55)"
                  : "transparent"
              }
              strokeWidth={strokeWidth + 0.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{ opacity: tier === "expert" ? 0.85 : 0.45 }}
            />
          </svg>
        ))}
      </motion.div>

      {/* Sweep dot — monitor nuqtasi */}
      {!prefersReducedMotion && (
        <motion.div
          className={cn(
            "pointer-events-none absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full",
            tier === "expert"
              ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
              : "bg-foreground/70 shadow-[0_0_6px_rgba(255,255,255,0.35)]",
          )}
          animate={{ left: ["-2%", "102%"] }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
    </div>
  );
}
