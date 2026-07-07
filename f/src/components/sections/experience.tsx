"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { Container } from "@/components/layout/container";
import { useContentData } from "@/hooks/use-content-data";
import { useTranslation } from "@/hooks/use-translation";
import type { Experience } from "@/types/cv";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  const { data } = useContentData();
  const { t } = useTranslation();

  if (!data || !t) return null;

  return (
    <section id="experience" className="py-20">
      <Container>
        <ScrollReveal direction="down">
          <h2 className="mb-10 sm:mb-12">{t.experience.title}</h2>
        </ScrollReveal>

        <div className="relative">
          <div
            aria-hidden
            className="absolute top-3 bottom-3 left-[11px] w-px bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent"
          />

          <StaggerGroup className="relative space-y-0">
            {data.experiences.map((exp, index) => (
              <ExperienceTimelineItem
                key={exp.id}
                exp={exp}
                index={index}
                isLast={index === data.experiences.length - 1}
              />
            ))}
          </StaggerGroup>
        </div>
      </Container>
    </section>
  );
}

function ExperienceTimelineItem({
  exp,
  index,
  isLast,
}: {
  exp: Experience;
  index: number;
  isLast: boolean;
}) {
  const isCurrent = index === 0;

  return (
    <StaggerItem direction={index % 2 === 0 ? "left" : "right"}>
      <div
        className={cn(
          "relative grid grid-cols-[24px_minmax(0,1fr)] gap-5 sm:gap-8",
          !isLast && "pb-10 sm:pb-12",
        )}
      >
        <div className="relative flex justify-center pt-2">
          <div
            className={cn(
              "relative z-10 rounded-full ring-4 ring-background transition-transform duration-300",
              isCurrent
                ? "size-3 bg-foreground"
                : "size-2.5 bg-background ring-foreground/15 ring-[3px]",
            )}
          >
            {isCurrent && (
              <span className="absolute inset-0 animate-ping rounded-full bg-foreground/30" />
            )}
          </div>
        </div>

        <article className="group min-w-0 rounded-2xl p-4 transition-colors duration-300 hover:bg-foreground/[0.03] sm:p-5 sm:pl-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0 space-y-1">
              <h3 className="font-heading text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                {exp.role}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">
                {exp.company}
              </p>
            </div>
            <time className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground sm:text-right">
              {exp.period}
            </time>
          </div>

          <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {exp.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {exp.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="rounded-full border-foreground/10 bg-transparent px-2.5 py-0.5 text-[11px] font-normal"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </article>
      </div>
    </StaggerItem>
  );
}
