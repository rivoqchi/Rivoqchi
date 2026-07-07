import type { Project } from "@/types/cv";
import { resolveMediaUrl } from "@/lib/media";

export function resolveProjectImages(
  project: Pick<Project, "image" | "images">,
): string[] {
  const fromList = project.images?.map((url) => url.trim()).filter(Boolean) ?? [];
  if (fromList.length > 0) return fromList;

  const cover = project.image?.trim();
  return cover ? [cover] : [];
}

export function resolveProjectImageUrls(
  project: Pick<Project, "image" | "images">,
): string[] {
  return resolveProjectImages(project)
    .map((url) => resolveMediaUrl(url))
    .filter((url): url is string => Boolean(url));
}

export function resolveProjectCover(
  project: Pick<Project, "image" | "images">,
): string | undefined {
  return resolveProjectImageUrls(project)[0];
}
