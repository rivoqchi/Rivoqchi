import type { Translation } from "@/lib/i18n/types";
import { getTranslation } from "@/lib/i18n";

export function flattenTranslation(
  obj: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(
        result,
        flattenTranslation(value as Record<string, unknown>, newKey),
      );
    } else if (typeof value === "string") {
      result[newKey] = value;
    }
  }

  return result;
}

export function unflattenTranslation(flat: Record<string, string>): Translation {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = value;
  }

  return result as unknown as Translation;
}

export function getDefaultFlatTranslations(): Record<string, string> {
  return flattenTranslation(getTranslation() as unknown as Record<string, unknown>);
}

export const TRANSLATION_LABELS: Record<string, string> = {
  "nav.home": "Nav: Bosh sahifa",
  "nav.about": "Nav: Men haqimda",
  "nav.experience": "Nav: Tajriba",
  "nav.skills": "Nav: Ko'nikmalar",
  "nav.projects": "Nav: Loyihalar",
  "nav.contact": "Nav: Aloqa",
  "hero.contactMe": "Hero: Bog'lanish",
  "hero.viewProjects": "Hero: Loyihalarim",
  "about.title": "About: Sarlavha",
  "about.email": "About: Email",
  "about.phone": "About: Telefon",
  "about.location": "About: Manzil",
  "about.interests": "About: Qiziqishlar",
  "about.interestBanner": "About: Loyiq nomzod banner matni",
  "about.interestCta": "About: Bog'lanish tugmasi",
  "about.interestDismiss": "About: Banner yopish",
  "experience.title": "Experience: Sarlavha",
  "skills.title": "Skills: Sarlavha",
  "skills.categories.frontend": "Skills: Frontend",
  "skills.categories.backend": "Skills: Backend",
  "skills.categories.tools": "Skills: Asboblar",
  "skills.categories.languages": "Skills: Tillar",
  "skills.categories.soft": "Skills: Soft skills",
  "projects.title": "Projects: Sarlavha",
  "projects.live": "Projects: Jonli",
  "projects.code": "Projects: Kod",
  "projects.readMore": "Projects: Batafsil",
  "projects.like": "Projects: Yoqtirish",
  "projects.save": "Projects: Saqlash",
  "projects.saved": "Projects: Saqlangan",
  "projects.views": "Projects: Ko'rishlar",
  "projects.links": "Projects: Havolalar",
  "projects.files": "Projects: Fayllar",
  "projects.close": "Projects: Yopish",
  "projects.dragHint": "Projects: Scroll hint",
  "projects.suggestBanner": "Projects: Taklif banner matni",
  "projects.suggestCta": "Projects: Ko'rish tugmasi",
  "projects.suggestDismiss": "Projects: Banner yopish",
  "projects.pinned": "Projects: Pin yorlig'i",
  "contact.title": "Contact: Sarlavha",
  "contact.email": "Contact: Email",
  "contact.phone": "Contact: Telefon",
  "contact.formTitle": "Contact: Form sarlavhasi",
  "contact.googleAccount": "Contact: Google akkaunt",
  "contact.googleAccountPlaceholder": "Contact: Google placeholder",
  "contact.googleAccountAutoHint": "Contact: Google avtomatik hint",
  "contact.googleAccountClear": "Contact: Google maydon tozalash",
  "contact.purpose": "Contact: Maqsad",
  "contact.purposePlaceholder": "Contact: Maqsad placeholder",
  "contact.submit": "Contact: Yuborish tugmasi",
  "contact.success": "Contact: Muvaffaqiyat xabari",
  "contact.error": "Contact: Xato xabari",
  "footer.rights": "Footer: Huquqlar",
  "footer.interestBanner": "Footer: Qiziqish banner matni",
  "footer.interestCta": "Footer: Xabar qoldirish tugmasi",
  "footer.interestDismiss": "Footer: Banner yopish",
  "welcome.banner": "Welcome: Xush kelibsiz matni",
  "welcome.cta": "Welcome: Tanishib olaylik tugmasi",
  "welcome.dismiss": "Welcome: Yopish",
  "idle.banner": "Idle: Yordam banner matni",
  "idle.cta": "Idle: Yordam olish tugmasi",
  "idle.dismiss": "Idle: Banner yopish",
  "common.portfolio": "Common: Portfolio",
  "common.openMenu": "Common: Menyu ochish",
  "common.closeMenu": "Common: Menyu yopish",
  "common.scrollToTop": "Common: Tepaga qaytish",
  "common.badgeLabel": "Common: Shaxsiy badjik",
  "common.badgeHint": "Common: Yopish uchun o'ngga suring",
  "network.offlineTitle": "Network: Offline sarlavha",
  "network.offlineMessage": "Network: Offline xabar",
  "network.reconnecting": "Network: Qayta ulanmoqda",
  "theme.light": "Theme: Yorug'",
  "theme.dark": "Theme: Qorong'u",
  "theme.system": "Theme: Tizim",
  "theme.toggleTheme": "Theme: O'zgartirish",
};
