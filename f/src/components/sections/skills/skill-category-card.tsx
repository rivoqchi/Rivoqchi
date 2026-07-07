"use client";

import { StaggerItem } from "@/components/motion";
import { SkillPulseWave } from "@/components/sections/skills/skill-pulse-wave";
import type { Skill } from "@/types/cv";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SkillCategoryCardProps {
  label: string;
  skills: Skill[];
  icon: LucideIcon;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
}

function skillTier(level: number) {
  if (level >= 85) return { label: "Expert", tone: "text-emerald-600 dark:text-emerald-400" };
  if (level >= 70) return { label: "Advanced", tone: "text-foreground/80" };
  if (level >= 50) return { label: "Proficient", tone: "text-muted-foreground" };
  return { label: "Growing", tone: "text-muted-foreground/70" };
}

export function SkillCategoryCard({
  label,
  skills,
  icon: Icon,
  direction = "up",
  className,
}: SkillCategoryCardProps) {
  const average = Math.round(
    skills.reduce((sum, s) => sum + s.level, 0) / skills.length,
  );

  return (
    <StaggerItem direction={direction} className={cn("h-full", className)}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 transition-[box-shadow,ring-color] duration-500 hover:ring-foreground/20 hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)] dark:hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
        />

        <header className="border-b border-foreground/[0.06] px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.04] ring-1 ring-foreground/10 transition-colors group-hover:bg-foreground/[0.06]">
                <Icon className="size-[19px] text-foreground/75" strokeWidth={1.65} />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-lg font-semibold leading-tight tracking-tight">
                  {label}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {skills.length} signal · EKG monitor
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-heading text-2xl font-semibold tabular-nums leading-none">
                {average}
                <span className="text-sm font-normal text-muted-foreground">%</span>
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                o&apos;rtacha impuls
              </p>
            </div>
          </div>
        </header>

        <ul className="flex flex-1 flex-col gap-4 p-5 sm:gap-5 sm:p-6">
          {skills.map((skill, index) => {
            const tier = skillTier(skill.level);

            return (
              <li
                key={skill.id}
                className="rounded-xl p-3 ring-1 ring-transparent transition-colors hover:bg-foreground/[0.02] hover:ring-foreground/[0.06]"
              >
                <div className="mb-2.5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold tracking-tight">
                      {skill.name}
                    </p>
                    <p className={cn("mt-0.5 text-[11px] font-medium", tier.tone)}>
                      {tier.label}
                    </p>
                  </div>
                  <div className="shrink-0 rounded-md bg-foreground/[0.04] px-2 py-1 ring-1 ring-foreground/10">
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      {skill.level}
                    </span>
                  </div>
                </div>

                <SkillPulseWave level={skill.level} delay={index * 0.18} />
              </li>
            );
          })}
        </ul>
      </article>
    </StaggerItem>
  );
}
