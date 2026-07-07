import type { Metadata, Viewport } from "next";
import { ThemeScript } from "@/components/layout/theme-script";
import { AppProvider } from "@/components/providers/app-provider";
import { SITE_CONFIG } from "@/lib/constants";
import { fontVariables } from "@/lib/fonts";
import { getServerContent } from "@/lib/server-api";
import { getSiteUrl } from "@/lib/seo";
import { buildMetadataIcons } from "@/lib/site-branding";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const content = await getServerContent();
  const siteUrl = getSiteUrl(content.siteSettings.url);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: SITE_CONFIG.name,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    applicationName: SITE_CONFIG.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: buildMetadataIcons(),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fontVariables} scroll-smooth`}
    >
      <body className="min-h-screen antialiased">
        <ThemeScript />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
