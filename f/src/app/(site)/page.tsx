import type { Metadata } from "next";
import { getServerContent } from "@/lib/server-api";
import { buildPageMetadata } from "@/lib/seo";
import { HomePageShell } from "@/components/pages/home-page-shell";
import { SITE_CONFIG } from "@/lib/constants";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getServerContent();
    return buildPageMetadata(content);
  } catch {
    return {
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
    };
  }
}

export default async function HomePage() {
  let content = null;

  try {
    content = await getServerContent();
  } catch {
    content = null;
  }

  return <HomePageShell content={content} />;
}
