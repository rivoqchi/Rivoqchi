import {
  Code2,
  Database,
  Globe2,
  HeartHandshake,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { SkillCategory } from "@/types/cv";

export const SKILL_CATEGORY_META: Record<
  SkillCategory,
  { icon: LucideIcon; span: string }
> = {
  frontend: { icon: Code2, span: "md:col-span-2 lg:col-span-7" },
  backend: { icon: Database, span: "lg:col-span-5" },
  tools: { icon: Wrench, span: "lg:col-span-5" },
  languages: { icon: Globe2, span: "lg:col-span-7" },
  soft: { icon: HeartHandshake, span: "lg:col-span-12" },
};
