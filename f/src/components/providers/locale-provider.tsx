"use client";

import { useEffect } from "react";
import { HTML_LANG } from "@/types/locale";
import { useCVStore } from "@/stores/cv-store";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = HTML_LANG;
  }, []);

  useEffect(() => {
    const state = useCVStore.getState();
    if (state.loadingState === "success" && state.data) return;
    void state.fetchCVData();
  }, []);

  return <>{children}</>;
}
