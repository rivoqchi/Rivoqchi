"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, Heart, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProjectStats } from "@/hooks/use-project-stats";
import type { Project } from "@/types/cv";
import { cn } from "@/lib/utils";
import { isLocalUpload } from "@/lib/media";
import { resolveProjectCover } from "@/lib/project-images";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  className?: string;
}

export function ProjectCard({ project, onOpen, className }: ProjectCardProps) {
  const { likes, views } = useProjectStats(project);

  const cover = resolveProjectCover(project);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
      className={cn(
        "group flex w-[300px] shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:w-[340px]",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted">
        {cover ? (
          <Image
            src={cover}
            alt={project.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="340px"
            draggable={false}
            unoptimized={isLocalUpload(cover)}
          />
        ) : (
          <div className="flex size-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
            {project.title}
          </div>
        )}
        {project.isPinned ? (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            <Pin className="size-3" />
            Pin
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-heading text-lg font-semibold leading-tight">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="size-3.5" />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {views}
          </span>
        </div>
      </div>
    </article>
  );
}
