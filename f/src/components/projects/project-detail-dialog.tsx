"use client";

import { useEffect } from "react";
import {
  Bookmark,
  Code,
  Download,
  ExternalLink,
  Eye,
  Heart,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectImageGallery } from "@/components/projects/project-image-gallery";
import { RichText } from "@/components/projects/rich-text";
import { useProjectStats } from "@/hooks/use-project-stats";
import { resolveProjectImageUrls } from "@/lib/project-images";
import { useProjectStore } from "@/stores/project-store";
import { useTranslation } from "@/hooks/use-translation";
import type { Project } from "@/types/cv";
import { cn } from "@/lib/utils";

interface ProjectDetailDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDetailDialog({
  project,
  open,
  onOpenChange,
}: ProjectDetailDialogProps) {
  const { t } = useTranslation();

  const toggleLike = useProjectStore((s) => s.toggleLike);
  const toggleSave = useProjectStore((s) => s.toggleSave);
  const recordView = useProjectStore((s) => s.recordView);
  const isSaved = useProjectStore((s) => s.isSaved);
  const { likes, views, liked } = useProjectStats(project);

  const images = project ? resolveProjectImageUrls(project) : [];

  useEffect(() => {
    if (open && project) {
      void recordView(project.id);
    }
  }, [open, project, recordView]);

  if (!project || !t) return null;

  const saved = isSaved(project.id);

  const links = project.links ?? [
    ...(project.liveUrl
      ? [{ label: t.projects.live, url: project.liveUrl, type: "live" as const }]
      : []),
    ...(project.repoUrl
      ? [{ label: t.projects.code, url: project.repoUrl, type: "repo" as const }]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(90vh,900px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <DialogHeader className="shrink-0 border-b px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="font-heading text-xl font-semibold">
              {project.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              aria-label={t.projects.close}
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="space-y-5 p-5 pb-6">
            {images.length > 0 && (
              <ProjectImageGallery images={images} title={project.title} />
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                onClick={() => void toggleLike(project.id)}
              >
                <Heart
                  className={cn("size-4", liked && "fill-current")}
                />
                {likes}
                <span className="sr-only">{t.projects.like}</span>
              </Button>
              <Button
                variant={saved ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSave(project.id)}
              >
                <Bookmark
                  className={cn("size-4", saved && "fill-current")}
                />
                {t.projects.save}
              </Button>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Eye className="size-4" />
                {views} {t.projects.views}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>

            {project.content ? (
              <RichText html={project.content} />
            ) : (
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            )}

            {links.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{t.projects.links}</h4>
                <div className="flex flex-wrap gap-2">
                  {links.map((link) => (
                    <Button
                      key={link.url}
                      variant="outline"
                      size="sm"
                      nativeButton={false}
                      render={
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      {link.type === "repo" ? (
                        <Code className="size-4" />
                      ) : (
                        <ExternalLink className="size-4" />
                      )}
                      {link.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {project.files && project.files.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{t.projects.files}</h4>
                <div className="space-y-2">
                  {project.files.map((file) => (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="size-4 text-muted-foreground" />
                        {file.name}
                      </span>
                      {file.size && (
                        <span className="text-xs text-muted-foreground">
                          {file.size}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
