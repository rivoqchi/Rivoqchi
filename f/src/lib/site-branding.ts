import { getServerContent } from "@/lib/server-api";
import { getSiteUrl, resolveAbsoluteUrl } from "@/lib/seo";

export function resolveAvatarMediaPath(avatar?: string): string | undefined {
  if (!avatar?.trim()) return undefined;

  const trimmed = avatar.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  return `/${trimmed}`;
}

export function resolveAvatarFetchUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized.startsWith("/uploads/")) {
    return `${process.env.BACKEND_URL ?? "http://127.0.0.1:4000"}${normalized}`;
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3001");

  return `${origin.replace(/\/$/, "")}${normalized}`;
}

export function resolveAvatarAbsoluteUrl(path: string, siteUrl: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl.replace(/\/$/, "")}${normalized}`;
}

export function resolveAvatarHref(path: string, siteUrl: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/uploads/")) {
    return path;
  }

  return resolveAbsoluteUrl(siteUrl, path) ?? path;
}

export async function getSiteAvatarPath(): Promise<string | undefined> {
  try {
    const content = await getServerContent();
    return resolveAvatarMediaPath(content.cv.personal.avatar);
  } catch {
    return undefined;
  }
}

export async function getSiteAvatarUrl(): Promise<string | undefined> {
  const path = await getSiteAvatarPath();
  if (!path) return undefined;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  try {
    const content = await getServerContent();
    const siteUrl = getSiteUrl(content.siteSettings.url);
    return resolveAvatarHref(path, siteUrl);
  } catch {
    return path;
  }
}

export function buildLogoImageObject(
  siteUrl: string,
  avatar?: string,
  caption?: string,
) {
  const path = resolveAvatarMediaPath(avatar);
  if (!path) return undefined;

  const url = resolveAvatarHref(path, siteUrl);

  return {
    "@type": "ImageObject" as const,
    url,
    width: 512,
    height: 512,
    caption: caption ?? "Site logo",
  };
}

export function buildMetadataIcons() {
  return {
    icon: [
      { url: "/icon", sizes: "32x32", type: "image/png" },
      { url: "/icon", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: "/icon",
  };
}

export async function fetchAvatarIconResponse(): Promise<Response | undefined> {
  const path = await getSiteAvatarPath();
  if (!path) return undefined;

  const fetchUrl = resolveAvatarFetchUrl(path);
  const response = await fetch(fetchUrl, {
    next: { revalidate: 300 },
    cache: "force-cache",
  });

  if (!response.ok) return undefined;

  return new Response(await response.arrayBuffer(), {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}
