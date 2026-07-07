import type { Metadata } from "next";
import type { ContentResponse } from "@/lib/api";
import { HTML_LANG } from "@/types/locale";
import { SITE_CONFIG } from "@/lib/constants";
import { getTranslation } from "@/lib/i18n";
import {
  buildLogoImageObject,
  buildMetadataIcons,
} from "@/lib/site-branding";
import { normalizeSiteUrl } from "@/lib/site-url";

export function getSiteUrl(settingsUrl?: string): string {
  const url =
    settingsUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    SITE_CONFIG.url ||
    "http://127.0.0.1:3001";
  return normalizeSiteUrl(url);
}

export function resolveAbsoluteUrl(
  siteUrl: string,
  path?: string,
): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

function formatTwitterHandle(handle: string, fallbackName: string): string {
  const trimmed = handle.trim();
  if (trimmed) {
    return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
  }
  return `@${fallbackName.replace(/\s+/g, "")}`;
}

function parseHiddenParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}|\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function getSeoLabel(
  content: ContentResponse,
  key: string,
): string {
  if (content.translations[key]) return content.translations[key];
  const parts = key.split(".");
  let current: unknown = getTranslation() as unknown;
  for (const part of parts) {
    if (!current || typeof current !== "object") return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : key;
}

export function buildRichDescription(content: ContentResponse): string {
  const { personal } = content.cv;
  const parts = [
    personal.bio,
    ...(personal.aboutDetails ?? []).slice(0, 2),
    personal.highlights
      ?.map((item) => `${item.label}: ${item.value}`)
      .join(". "),
    personal.interests?.length
      ? `${getSeoLabel(content, "about.title")}: ${personal.interests.join(", ")}`
      : "",
  ].filter(Boolean);

  return truncate(parts.join(" "), 165);
}

export function buildKeywords(content: ContentResponse): string[] {
  const { cv } = content;
  const techSet = new Set<string>();

  for (const skill of cv.skills) techSet.add(skill.name);
  for (const exp of cv.experiences) {
    techSet.add(exp.company);
    techSet.add(exp.role);
    for (const tech of exp.technologies) techSet.add(tech);
  }
  for (const project of cv.projects) {
    techSet.add(project.title);
    for (const tech of project.technologies) techSet.add(tech);
  }
  for (const interest of cv.personal.interests ?? []) techSet.add(interest);
  for (const highlight of cv.personal.highlights ?? []) {
    techSet.add(highlight.label);
    techSet.add(highlight.value);
  }

  return [
    cv.personal.name,
    cv.personal.title,
    cv.personal.location,
    ...Array.from(techSet),
    "portfolio",
    "CV",
    "resume",
    "developer",
    "software engineer",
  ].filter(Boolean);
}

export function getCanonicalUrl(siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, "")}/`;
}

const EMPTY_SEO_SETTINGS: ContentResponse["seoSettings"] = {
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  hiddenContent: "",
  twitterHandle: "",
};

export function getSeoSettings(content: ContentResponse) {
  return content.seoSettings ?? EMPTY_SEO_SETTINGS;
}

export function buildPageMetadata(content: ContentResponse): Metadata {
  const { personal } = content.cv;
  const seoSettings = getSeoSettings(content);
  const siteName = content.siteSettings.name || SITE_CONFIG.name;
  const siteUrl = getSiteUrl(content.siteSettings.url);
  const canonical = getCanonicalUrl(siteUrl);
  const autoDescription = buildRichDescription(content);
  const autoTitle = `${personal.name} — ${personal.title}`;
  const title = seoSettings.metaTitle.trim() || autoTitle;
  const description = truncate(
    seoSettings.metaDescription.trim() || autoDescription,
    165,
  );
  const customKeywords = seoSettings.keywords
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const keywords = [...new Set([...customKeywords, ...buildKeywords(content)])];
  const ogTitle = seoSettings.ogTitle.trim() || title;
  const ogDescription = seoSettings.ogDescription.trim() || description;
  const avatarUrl = resolveAbsoluteUrl(siteUrl, personal.avatar);
  const galleryImages = (personal.gallery ?? [])
    .map((img) => resolveAbsoluteUrl(siteUrl, img))
    .filter(Boolean) as string[];

  const ogImages = avatarUrl
    ? [
        {
          url: avatarUrl,
          width: 1200,
          height: 630,
          alt: `${personal.name} — ${personal.title}`,
          type: "image/jpeg",
        },
        ...galleryImages.slice(0, 3).map((url) => ({
          url,
          alt: personal.name,
        })),
      ]
    : galleryImages.length > 0
      ? galleryImages.slice(0, 4).map((url) => ({
          url,
          alt: personal.name,
        }))
      : undefined;

  const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

  return {
    title,
    description,
    keywords,
    authors: [{ name: personal.name, url: canonical }],
    creator: personal.name,
    publisher: siteName,
    category: "technology",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    openGraph: {
      type: "profile",
      locale: HTML_LANG,
      url: canonical,
      siteName,
      title: ogTitle,
      description: ogDescription,
      images: ogImages,
    },
    twitter: {
      card: ogImages?.length ? "summary_large_image" : "summary",
      title: ogTitle,
      description: ogDescription,
      images: ogImages?.map((img) => img.url),
      creator: formatTwitterHandle(seoSettings.twitterHandle, siteName),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: buildMetadataIcons(),
    other: {
      "profile:first_name": personal.name.split(" ")[0] ?? personal.name,
      "profile:last_name":
        personal.name.split(" ").slice(1).join(" ") || personal.name,
      "profile:username": personal.name.replace(/\s+/g, "").toLowerCase(),
      ...(googleVerification
        ? { "google-site-verification": googleVerification }
        : {}),
    },
  };
}

export function buildJsonLd(content: ContentResponse) {
  const { cv } = content;
  const { personal } = cv;
  const seoSettings = getSeoSettings(content);
  const siteUrl = getSiteUrl(content.siteSettings.url);
  const pageUrl = getCanonicalUrl(siteUrl);
  const siteName = content.siteSettings.name || SITE_CONFIG.name;
  const htmlLang = HTML_LANG;
  const avatarUrl = resolveAbsoluteUrl(siteUrl, personal.avatar);
  const siteLogo = buildLogoImageObject(siteUrl, personal.avatar, `${personal.name} logo`);
  const galleryUrls = (personal.gallery ?? [])
    .map((img) => resolveAbsoluteUrl(siteUrl, img))
    .filter(Boolean);

  const knowsAbout = [
    ...cv.skills.map((s) => s.name),
    ...(personal.interests ?? []),
  ];
  const sameAs = personal.social.map((s) => s.url).filter(Boolean);

  const fullDescription = [
    personal.bio,
    ...(personal.aboutDetails ?? []),
    ...(seoSettings.hiddenContent.trim()
      ? parseHiddenParagraphs(seoSettings.hiddenContent)
      : []),
  ].join(" ");

  const person = {
    "@type": "Person",
    "@id": `${pageUrl}#person`,
    name: personal.name,
    jobTitle: personal.title,
    description: fullDescription,
    email: personal.email,
    telephone: personal.phone,
    url: pageUrl,
    image: avatarUrl ? [avatarUrl, ...galleryUrls] : galleryUrls,
    address: {
      "@type": "PostalAddress",
      addressLocality: personal.location,
    },
    knowsAbout,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "professional",
        email: personal.email,
        telephone: personal.phone,
        areaServed: personal.location,
        availableLanguage: [HTML_LANG],
      },
    ],
  };

  const workExperiences = cv.experiences.map((exp) => ({
    "@type": "OrganizationRole",
    "@id": `${pageUrl}#experience-${exp.id}`,
    roleName: exp.role,
    description: exp.description,
    startDate: exp.period.split("—")[0]?.trim(),
    endDate:
      exp.period.includes("Hozir") ||
      exp.period.includes("Present") ||
      exp.period.includes("настоящ")
        ? undefined
        : exp.period.split("—")[1]?.trim(),
    worksFor: {
      "@type": "Organization",
      name: exp.company,
    },
    skills: exp.technologies.join(", "),
  }));

  const projectEntities = cv.projects.map((project) => ({
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#project-${project.id}`,
    name: project.title,
    description: project.content
      ? stripHtml(project.content)
      : project.description,
    image: resolveAbsoluteUrl(siteUrl, project.image),
    url: project.liveUrl ?? project.repoUrl ?? pageUrl,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    keywords: project.technologies.join(", "),
    author: { "@id": `${pageUrl}#person` },
    ...(project.likes != null || project.views != null
      ? {
          interactionStatistic: [
            ...(project.likes != null
              ? [
                  {
                    "@type": "InteractionCounter",
                    interactionType: "https://schema.org/LikeAction",
                    userInteractionCount: project.likes,
                  },
                ]
              : []),
            ...(project.views != null
              ? [
                  {
                    "@type": "InteractionCounter",
                    interactionType: "https://schema.org/ViewAction",
                    userInteractionCount: project.views,
                  },
                ]
              : []),
          ],
        }
      : {}),
  }));

  const skillsList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#skills`,
    name: getSeoLabel(content, "skills.title"),
    itemListElement: cv.skills.map((skill, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "DefinedTerm",
        name: skill.name,
        termCode: skill.category,
        description: `${skill.level}%`,
      },
    })),
  };

  const experienceList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#experience-list`,
    name: getSeoLabel(content, "experience.title"),
    itemListElement: cv.experiences.map((exp, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@id": `${pageUrl}#experience-${exp.id}` },
    })),
  };

  const projectsList = {
    "@type": "ItemList",
    "@id": `${pageUrl}#projects-list`,
    name: getSeoLabel(content, "projects.title"),
    itemListElement: cv.projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: { "@id": `${pageUrl}#project-${project.id}` },
    })),
  };

  const breadcrumbs = {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumbs`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteName,
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: personal.name,
        item: pageUrl,
      },
    ],
  };

  const highlights =
    personal.highlights && personal.highlights.length > 0
      ? {
          "@type": "ItemList",
          "@id": `${pageUrl}#highlights`,
          name: "Highlights",
          itemListElement: personal.highlights.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.label,
            description: item.value,
          })),
        }
      : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name: siteName,
        description: content.siteSettings.description,
        publisher: { "@id": `${pageUrl}#person` },
        logo: siteLogo,
        inLanguage: HTML_LANG,
        potentialAction: {
          "@type": "SearchAction",
          target: `${pageUrl}#projects`,
          "query-input": "required name=search_term_string",
        },
      },
      ...(siteLogo
        ? [
            {
              "@type": "Organization",
              "@id": `${siteUrl}#organization`,
              name: siteName,
              url: siteUrl,
              logo: siteLogo,
              image: siteLogo,
            },
          ]
        : []),
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${personal.name} — ${personal.title}`,
        description: truncate(fullDescription, 300),
        isPartOf: { "@id": `${siteUrl}#website` },
        about: { "@id": `${pageUrl}#person` },
        inLanguage: htmlLang,
        mainEntity: { "@id": `${pageUrl}#person` },
        primaryImageOfPage: avatarUrl
          ? { "@type": "ImageObject", url: avatarUrl }
          : undefined,
        breadcrumb: { "@id": `${pageUrl}#breadcrumbs` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#hero", "#about", "#experience", "#skills", "#projects"],
        },
      },
      breadcrumbs,
      {
        ...person,
        hasOccupation: workExperiences.length > 0 ? workExperiences : undefined,
        subjectOf: projectEntities.length > 0 ? projectEntities : undefined,
      },
      ...workExperiences,
      ...projectEntities,
      skillsList,
      experienceList,
      projectsList,
      ...(highlights ? [highlights] : []),
    ],
  };
}
