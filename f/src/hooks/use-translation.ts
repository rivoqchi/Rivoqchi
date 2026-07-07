"use client";

import { useTranslationStore } from "@/stores/translation-store";
import type { Translation } from "@/lib/i18n/types";

export function useTranslation(): {
  t: Translation | null;
  isLoading: boolean;
} {
  const translation = useTranslationStore((s) => s.translation);

  return {
    t: translation,
    isLoading: !translation,
  };
}
