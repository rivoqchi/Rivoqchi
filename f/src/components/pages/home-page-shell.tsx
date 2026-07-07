import type { ContentResponse } from "@/lib/api";
import { JsonLd } from "@/components/seo/json-ld";
import { SeoDocument } from "@/components/seo/seo-document";
import { ContentProvider } from "@/components/providers/content-provider";
import { HomeSections } from "@/components/pages/home-sections";

export function HomePageShell({
  content,
}: {
  content: ContentResponse | null;
}) {
  return (
    <>
      {content && (
        <>
          <JsonLd content={content} />
          <SeoDocument content={content} />
          <ContentProvider content={content}>
            <HomeSections />
          </ContentProvider>
        </>
      )}

      {!content && <HomeSections />}
    </>
  );
}
