import { toSameOriginMediaPath } from "@/lib/site-url";

export function isLocalUpload(url?: string): boolean {
  if (!url) return false;
  if (url.startsWith("/uploads/")) return true;

  try {
    const parsed = new URL(url);
    return parsed.pathname.startsWith("/uploads/");
  } catch {
    return false;
  }
}

export function resolveMediaUrl(url?: string): string | undefined {
  return toSameOriginMediaPath(url);
}
