import type { CVData } from "@/types/cv";
import { ABOUT_EXTRAS } from "@/lib/about-extras";
import { DEFAULT_ABOUT_GALLERY } from "@/lib/about-gallery";
import { PROJECTS } from "@/lib/project-seeds";

export const CV_DATA: CVData = {
  personal: {
    name: "Ismingiz",
    title: "Full Stack Dasturchi",
    email: "hello@example.com",
    phone: "+998 90 000 00 00",
    location: "Toshkent, O'zbekiston",
    bio: "Zamonaviy veb ilovalar yaratishga ishtiyoqli dasturchi. Toza kod, tez ishlash va foydalanuvchi uchun qulay interfeys — mening asosiy ustuvor yo'nalishlarim.",
    gallery: DEFAULT_ABOUT_GALLERY,
    ...ABOUT_EXTRAS,
    social: [
      { platform: "GitHub", url: "https://github.com", icon: "github" },
      { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { platform: "Telegram", url: "https://t.me", icon: "send" },
    ],
  },
  experiences: [
    {
      id: "1",
      company: "Tech Company",
      role: "Senior Frontend Dasturchi",
      period: "2023 — Hozirgacha",
      description:
        "React va Next.js yordamida bir nechta mijoz loyihalarida frontend ishlab chiqishni boshqardim.",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      id: "2",
      company: "Startup Inc",
      role: "Full Stack Dasturchi",
      period: "2021 — 2023",
      description:
        "G'oyadan joriy etishgacha veb ilovalarni yaratdim va qo'llab-quvvatladim.",
      technologies: ["Node.js", "PostgreSQL", "React", "Docker"],
    },
  ],
  skills: [
    { id: "1", name: "Next.js", category: "frontend", level: 90 },
    { id: "2", name: "React", category: "frontend", level: 95 },
    { id: "3", name: "TypeScript", category: "frontend", level: 85 },
    { id: "4", name: "Tailwind CSS", category: "frontend", level: 90 },
    { id: "5", name: "Node.js", category: "backend", level: 80 },
    { id: "6", name: "PostgreSQL", category: "backend", level: 75 },
    { id: "7", name: "Git", category: "tools", level: 90 },
    { id: "8", name: "Docker", category: "tools", level: 70 },
  ],
  projects: PROJECTS,
};

export function getCVData(): CVData {
  return CV_DATA;
}
