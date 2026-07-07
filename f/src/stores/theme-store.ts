import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types/theme";
import { DEFAULT_THEME } from "@/types/theme";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    { name: "cv-theme" }
  )
);
