"use client";

import { ProjectCarousel } from "@/components/projects/project-carousel";
import { ScrollReveal } from "@/components/motion";
import { Container } from "@/components/layout/container";
import { useContentData } from "@/hooks/use-content-data";
import { useProjectSync } from "@/hooks/use-project-sync";
import { useTranslation } from "@/hooks/use-translation";

export function ProjectsSection() {
  const { data } = useContentData();
  const { t } = useTranslation();

  useProjectSync(data?.projects ?? []);

  if (!data || !t) return null;

  return (
    <section id="projects" className="overflow-x-clip py-20">
      <Container>
        <ScrollReveal direction="left">
          <h2 className="mb-6 text-3xl font-bold tracking-tight">
            {t.projects.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={0.1}>
          <ProjectCarousel projects={data.projects} />
        </ScrollReveal>
      </Container>
    </section>
  );
}
