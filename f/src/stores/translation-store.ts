import { create } from "zustand";
import type { Translation } from "@/lib/i18n/types";
import {
  getDefaultFlatTranslations,
  unflattenTranslation,
} from "@/lib/translation-utils";

interface TranslationStore {
  translation: Translation | null;
  flatTranslations: Record<string, string> | null;
  siteSettings: { name: string; description: string; url: string } | null;

  setFromApi: (
    flat: Record<string, string>,
    siteSettings?: { name: string; description: string; url: string },
  ) => void;
}

export const useTranslationStore = create<TranslationStore>((set, get) => ({
  translation: null,
  flatTranslations: null,
  siteSettings: null,

  setFromApi: (flat, siteSettings) => {
    const merged = { ...getDefaultFlatTranslations(), ...flat };
    set({
      flatTranslations: merged,
      translation: unflattenTranslation(merged),
      siteSettings: siteSettings ?? get().siteSettings,
    });
  },
}));
