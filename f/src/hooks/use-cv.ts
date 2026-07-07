"use client";

import { useCVStore } from "@/stores/cv-store";

export function useCV() {
  const store = useCVStore();

  return {
    data: store.data,
    isLoading: store.loadingState === "loading",
    isError: store.loadingState === "error",
    error: store.error,
    fetchCVData: store.fetchCVData,
  };
}
