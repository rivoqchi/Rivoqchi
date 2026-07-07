"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetailDialog } from "@/components/projects/project-detail-dialog";
import { useDragScroll } from "@/hooks/use-drag-scroll";
import type { Project } from "@/types/cv";
import { cn } from "@/lib/utils";

interface ProjectCarouselProps {
  projects: Project[];
  className?: string;
}

export function ProjectCarousel({ projects, className }: ProjectCarouselProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { ref, handlers } = useDragScroll<HTMLDivElement>();

  const scrollBy = (direction: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amount = direction === "left" ? -360 : 360;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const openProject = (project: Project) => {
    setSelected(project);
    setDialogOpen(true);
  };

  useEffect(() => {
    const onOpenProject = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId: string }>).detail;
      const project = projects.find((item) => item.id === detail.projectId);
      if (project) openProject(project);
    };

    window.addEventListener("cv-open-project", onOpenProject);
    return () => window.removeEventListener("cv-open-project", onOpenProject);
  }, [projects]);

  return (
    <>
      <div className={cn("relative w-full min-w-0 overflow-x-clip", className)}>
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />

        <Button
          variant="secondary"
          size="icon-sm"
          className="absolute top-1/2 left-0 z-20 -translate-y-1/2 shadow-md"
          onClick={() => scrollBy("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon-sm"
          className="absolute top-1/2 right-0 z-20 -translate-y-1/2 shadow-md"
          onClick={() => scrollBy("right")}
          aria-label="Scroll right"
        >
          <ChevronRight className="size-4" />
        </Button>

        <div
          ref={ref}
          {...handlers}
          className="-my-3 flex w-full min-w-0 cursor-grab items-stretch gap-4 overflow-x-auto overflow-y-visible scroll-smooth px-1 py-3 [-ms-overflow-style:none] [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={openProject}
            />
          ))}
        </div>
      </div>

      <ProjectDetailDialog
        project={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
