export const DEFAULT_ABOUT_GALLERY = [
  "https://picsum.photos/seed/cv-about-1/900/1800",
  "https://picsum.photos/seed/cv-about-2/900/1800",
  "https://picsum.photos/seed/cv-about-3/900/1800",
  "https://picsum.photos/seed/cv-about-4/900/1800",
];

export function resolveAboutGallery(gallery?: string[]): string[] {
  const fromGallery = gallery?.filter(Boolean) ?? [];
  if (fromGallery.length > 0) return fromGallery;
  return DEFAULT_ABOUT_GALLERY;
}
