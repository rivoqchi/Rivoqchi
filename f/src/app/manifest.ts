import type { MetadataRoute } from "next";
import { getServerContent } from "@/lib/server-api";
import { getSiteUrl } from "@/lib/seo";
import { resolveAvatarAbsoluteUrl, resolveAvatarMediaPath } from "@/lib/site-branding";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const content = await getServerContent();
  const siteUrl = getSiteUrl(content.siteSettings.url);
  const { personal } = content.cv;
  const siteName = content.siteSettings.name;

  const avatarPath = resolveAvatarMediaPath(personal.avatar);
  const avatarUrl = avatarPath
    ? resolveAvatarAbsoluteUrl(avatarPath, siteUrl)
    : undefined;

  return {
    name: `${personal.name} — ${personal.title}`,
    short_name: siteName,
    description: personal.bio,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    lang: "uz",
    orientation: "portrait-primary",
    categories: ["portfolio", "business", "productivity"],
    icons: avatarUrl
      ? [
          {
            src: avatarUrl,
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: avatarUrl,
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
        ]
      : [],
  };
}
