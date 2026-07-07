"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Skill, SkillCategory } from "@/types/cv";
import { cn } from "@/lib/utils";

const RING_RADIUS = 38;
const SPOKES = 12;
const FLY_DIRECTIONS = 20;
const FLY_DISTANCE = 130;

const CATEGORY_RING: Partial<Record<SkillCategory, number>> = {
  frontend: 36,
  backend: 40,
  tools: 44,
  languages: 48,
  soft: 0,
};

const CATEGORY_ARC: Partial<
  Record<SkillCategory, { start: number; end: number }>
> = {
  frontend: { start: -2.4, end: -0.5 },
  backend: { start: 0.2, end: 1.6 },
  tools: { start: 1.8, end: 3.3 },
  languages: { start: 3.5, end: 5.0 },
};

const CATEGORY_STYLE: Record<
  SkillCategory,
  { chip: string; dot: string }
> = {
  frontend: {
    chip: "bg-sky-500/10 text-sky-950 dark:bg-sky-400/10 dark:text-sky-100",
    dot: "bg-sky-500 dark:bg-sky-400",
  },
  backend: {
    chip: "bg-violet-500/10 text-violet-950 dark:bg-violet-400/10 dark:text-violet-100",
    dot: "bg-violet-500 dark:bg-violet-400",
  },
  tools: {
    chip: "bg-amber-500/10 text-amber-950 dark:bg-amber-400/10 dark:text-amber-100",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  languages: {
    chip: "bg-emerald-500/10 text-emerald-950 dark:bg-emerald-400/10 dark:text-emerald-100",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  soft: {
    chip: "text-foreground",
    dot: "bg-rose-500 dark:bg-rose-400",
  },
};

type PositionedSkill = Skill & { x: number; y: number };

function polarToPercent(angle: number, radius: number) {
  return {
    x: 50 + radius * Math.cos(angle - Math.PI / 2),
    y: 50 + radius * Math.sin(angle - Math.PI / 2),
  };
}

function getFlyInOffset(index: number) {
  const angle = ((index % FLY_DIRECTIONS) / FLY_DIRECTIONS) * Math.PI * 2;
  return {
    x: Math.cos(angle - Math.PI / 2) * FLY_DISTANCE,
    y: Math.sin(angle - Math.PI / 2) * FLY_DISTANCE,
  };
}

function layoutWebSkills(skills: Skill[]): PositionedSkill[] {
  const grouped = skills.reduce<Partial<Record<SkillCategory, Skill[]>>>(
    (acc, skill) => {
      const list = acc[skill.category] ?? [];
      list.push(skill);
      acc[skill.category] = list;
      return acc;
    },
    {},
  );

  const positioned: PositionedSkill[] = [];

  for (const category of Object.keys(grouped) as SkillCategory[]) {
    const items = grouped[category];
    if (category === "soft" || !items?.length) continue;

    const arc = CATEGORY_ARC[category] ?? { start: 0, end: Math.PI * 2 };
    const radius = CATEGORY_RING[category] ?? RING_RADIUS;

    items.forEach((skill, index) => {
      const t = items.length === 1 ? 0.5 : index / (items.length - 1);
      const angle = arc.start + (arc.end - arc.start) * t;
      const { x, y } = polarToPercent(angle, radius);
      positioned.push({ ...skill, x, y });
    });
  }

  return positioned;
}

interface SkillSpiderWebProps {
  skills: Skill[];
}

export function SkillSpiderWeb({ skills }: SkillSpiderWebProps) {
  const prefersReducedMotion = useReducedMotion();
  const nodes = useMemo(() => layoutWebSkills(skills), [skills]);
  const rings = [14, 24, 34, 44];

  const flyTransition = {
    type: "spring" as const,
    stiffness: 120,
    damping: 16,
    mass: 0.85,
  };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(100%,640px)]">
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full overflow-visible"
        aria-hidden
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {rings.map((radius) => (
          <circle
            key={radius}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            className="stroke-foreground/10"
            strokeWidth="0.35"
          />
        ))}

        {Array.from({ length: SPOKES }).map((_, index) => {
          const angle = (index / SPOKES) * Math.PI * 2;
          const outer = polarToPercent(angle, 48);
          return (
            <line
              key={index}
              x1="50"
              y1="50"
              x2={outer.x}
              y2={outer.y}
              className="stroke-foreground/12"
              strokeWidth="0.35"
            />
          );
        })}
      </motion.svg>

      {nodes.map((skill, index) => {
        const style = CATEGORY_STYLE[skill.category];
        const offset = getFlyInOffset(index);

        return (
          <motion.div
            key={skill.id}
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    x: offset.x,
                    y: offset.y,
                    scale: 0.55,
                  }
            }
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ ...flyTransition, delay: 0.1 + index * 0.05 }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${skill.x}%`, top: `${skill.y}%` }}
          >
            <div
              className={cn(
                "group relative flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-sm",
                "transition-transform duration-300 hover:scale-[1.04]",
                style.chip,
              )}
            >
              <span
                aria-hidden
                className={cn("size-1.5 shrink-0 rounded-full", style.dot)}
              />
              <span className="whitespace-nowrap text-xs font-semibold tracking-tight">
                {skill.name}
              </span>
              <span className="font-mono text-[10px] font-medium tabular-nums opacity-70">
                {skill.level}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
