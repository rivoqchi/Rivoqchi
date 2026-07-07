"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/stores/project-store";
import type { Project } from "@/types/cv";

export function useProjectSync(projects: Project[]) {
  const initFromProjects = useProjectStore((s) => s.initFromProjects);
  const initViewedProjects = useProjectStore((s) => s.initViewedProjects);
  const syncInteractions = useProjectStore((s) => s.syncInteractions);

  useEffect(() => {
    initViewedProjects();
  }, [initViewedProjects]);

  useEffect(() => {
    initFromProjects(projects);
  }, [projects, initFromProjects]);

  useEffect(() => {
    if (projects.length === 0) return;
    void syncInteractions();
  }, [projects, syncInteractions]);
}
