import type { MetadataRoute } from "next";
import { getServerContent } from "@/lib/server-api";
import { getSiteUrl } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const content = await getServerContent();
  const siteUrl = getSiteUrl(content.siteSettings.url);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
