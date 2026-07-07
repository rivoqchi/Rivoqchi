"use client";

import { useCVStore } from "@/stores/cv-store";
import type { CVData } from "@/types/cv";

export function useContentData(): {
  data: CVData | null;
  isLoading: boolean;
  error: string | null;
} {
  const storeData = useCVStore((s) => s.data);
  const loadingState = useCVStore((s) => s.loadingState);
  const error = useCVStore((s) => s.error);

  const isLoading = loadingState !== "success" || !storeData;
  const data = isLoading ? null : storeData;

  return {
    data,
    isLoading,
    error: loadingState === "error" ? error : null,
  };
}
