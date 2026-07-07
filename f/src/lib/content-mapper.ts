import type { ContentResponse } from "@/lib/api";
import type { CVData } from "@/types/cv";

export function mapContentToCV(content: ContentResponse): CVData {
  return {
    personal: {
      ...content.cv.personal,
      social: content.cv.personal.social.map((s) => ({
        platform: s.platform,
        url: s.url,
        icon: s.icon,
      })),
    },
    experiences: content.cv.experiences,
    skills: content.cv.skills.map((s) => ({
      ...s,
      category: s.category as CVData["skills"][0]["category"],
    })),
    projects: content.cv.projects,
  };
}
