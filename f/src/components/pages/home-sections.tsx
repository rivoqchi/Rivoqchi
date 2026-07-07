"use client";

import { PageSkeleton } from "@/components/skeletons";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useContentData } from "@/hooks/use-content-data";
import { useCVStore } from "@/stores/cv-store";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ExperienceSection } from "@/components/sections/experience";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { ContactSection } from "@/components/sections/contact";

export function HomeSections() {
  const { isLoading, error } = useContentData();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="max-w-md text-muted-foreground">{error}</p>
        <Button
          type="button"
          onClick={() => void useCVStore.getState().fetchCVData()}
        >
          Qayta urinish
        </Button>
      </Container>
    );
  }

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
