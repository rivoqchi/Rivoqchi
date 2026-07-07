"use client";

import { useProjectStore } from "@/stores/project-store";
import type { Project } from "@/types/cv";

export function useProjectStats(project: Project | null | undefined) {
  const stats = useProjectStore((s) =>
    project ? s.stats[project.id] : undefined,
  );

  if (!project) {
    return { likes: 0, views: 0, liked: false };
  }

  return {
    likes: stats?.likes ?? project.likes ?? 0,
    views: stats?.views ?? project.views ?? 0,
    liked: stats?.liked ?? false,
  };
}
