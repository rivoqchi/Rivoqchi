import type { MetadataRoute } from "next";
import { getServerContent } from "@/lib/server-api";
import { getCanonicalUrl, getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getServerContent();
  const siteUrl = getSiteUrl(content.siteSettings.url);

  return [
    {
      url: getCanonicalUrl(siteUrl),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
