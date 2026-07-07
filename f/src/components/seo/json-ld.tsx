import type { ContentResponse } from "@/lib/api";
import { buildJsonLd } from "@/lib/seo";

export function JsonLd({ content }: { content: ContentResponse }) {
  const jsonLd = buildJsonLd(content);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
