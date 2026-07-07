"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/theme-store";
import { useTranslation } from "@/hooks/use-translation";

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { t } = useTranslation();

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={t?.theme.toggleTheme ?? "Toggle theme"}
      title={isDark ? (t?.theme.light ?? "Light mode") : (t?.theme.dark ?? "Dark mode")}
      className="size-8 shrink-0"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
