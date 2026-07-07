import { create } from "zustand";
import type { CVData, LoadingState } from "@/types/cv";
import { api, ApiError, type ContentResponse } from "@/lib/api";
import { mapContentToCV } from "@/lib/content-mapper";
import { useTranslationStore } from "@/stores/translation-store";

interface CVStore {
  data: CVData | null;
  loadingState: LoadingState;
  error: string | null;
  activeSection: string;
  isMobileMenuOpen: boolean;

  setData: (data: CVData) => void;
  setLoadingState: (state: LoadingState) => void;
  setError: (error: string | null) => void;
  setActiveSection: (section: string) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  hydrateFromServer: (content: ContentResponse) => void;
  fetchCVData: () => Promise<void>;
  refreshCVData: () => Promise<void>;
}

let fetchPromise: Promise<void> | null = null;

export const useCVStore = create<CVStore>((set, get) => ({
  data: null,
  loadingState: "loading",
  error: null,
  activeSection: "hero",
  isMobileMenuOpen: false,

  setData: (data) => set({ data, loadingState: "success", error: null }),

  hydrateFromServer: (content) => {
    useTranslationStore
      .getState()
      .setFromApi(content.translations, content.siteSettings);

    set({
      data: mapContentToCV(content),
      loadingState: "success",
      error: null,
    });
  },

  setLoadingState: (loadingState) => set({ loadingState }),
  setError: (error) => set({ error, loadingState: "error" }),
  setActiveSection: (activeSection) => set({ activeSection }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  fetchCVData: async () => {
    const { loadingState, data } = get();
    if (loadingState === "success" && data) return;
    if (fetchPromise) return fetchPromise;

    fetchPromise = (async () => {
      set({ loadingState: "loading", error: null, data: null });

      try {
        const content = await api.getContent();
        get().hydrateFromServer(content);
      } catch (err) {
        set({
          data: null,
          loadingState: "error",
          error:
            err instanceof ApiError
              ? err.message
              : "Ma'lumotlarni yuklab bo'lmadi. Iltimos, qayta urinib ko'ring.",
        });
      }
    })();

    try {
      await fetchPromise;
    } finally {
      fetchPromise = null;
    }
  },

  refreshCVData: async () => {
    try {
      const content = await api.getContent();
      get().hydrateFromServer(content);
    } catch {
      // keep current data on refresh failure
    }
  },
}));
