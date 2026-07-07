import type { ResolvedTheme, Theme } from "@/types/theme";

export function resolveTheme(theme: string | undefined): ResolvedTheme {
  if (theme === "dark") return "dark";
  return "light";
}

export function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export const THEME_STORAGE_KEY = "cv-theme";
