export interface AboutHighlight {
  label: string;
  value: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  gallery?: string[];
  bio: string;
  aboutDetails?: string[];
  highlights?: AboutHighlight[];
  interests?: string[];
  social: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

export type SkillCategory = "frontend" | "backend" | "tools" | "languages" | "soft";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
}

export interface ProjectLink {
  label: string;
  url: string;
  type: "live" | "repo" | "file" | "demo";
}

export interface ProjectFile {
  name: string;
  url: string;
  size?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  image?: string;
  images?: string[];
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
  links?: ProjectLink[];
  files?: ProjectFile[];
  likes?: number;
  views?: number;
  isPinned?: boolean;
}

export interface CVData {
  personal: PersonalInfo;
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
}

export type LoadingState = "idle" | "loading" | "success" | "error";
