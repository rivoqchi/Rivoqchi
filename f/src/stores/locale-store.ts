import { create } from "zustand";
import type { Locale } from "@/types/locale";
import { DEFAULT_LOCALE } from "@/types/locale";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (locale) => set({ locale }),
}));
