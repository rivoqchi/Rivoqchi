"use client";

import { ScrollReveal } from "@/components/motion";
import { Container } from "@/components/layout/container";
import { useContentData } from "@/hooks/use-content-data";
import { useTranslation } from "@/hooks/use-translation";
import { SkillSpiderWeb } from "@/components/sections/skills/skill-spider-web";

export function SkillsSection() {
  const { data } = useContentData();
  const { t } = useTranslation();

  if (!data || !t) return null;

  const webSkills = data.skills.filter((skill) => skill.category !== "soft");

  const averageLevel = Math.round(
    webSkills.reduce((sum, skill) => sum + skill.level, 0) /
      Math.max(webSkills.length, 1),
  );

  return (
    <section id="skills" className="py-20">
      <Container>
        <ScrollReveal direction="right">
          <div className="mb-10 flex items-end justify-between gap-4 sm:mb-12">
            <h2>{t.skills.title}</h2>
            <span className="font-heading text-3xl font-semibold tabular-nums leading-none text-muted-foreground">
              {averageLevel}%
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.08}>
          <SkillSpiderWeb skills={webSkills} />
        </ScrollReveal>
      </Container>
    </section>
  );
}
