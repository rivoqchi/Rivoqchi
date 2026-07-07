import { create } from "zustand";
import { api, type AuthUser, ApiError, getUserRoles } from "@/lib/api";

interface AuthStore {
  user: AuthUser | null;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  error: string | null;

  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isLoginModalOpen: false,
  error: null,

  openLoginModal: () => set({ isLoginModalOpen: true, error: null }),
  closeLoginModal: () => set({ isLoginModalOpen: false, error: null }),
  clearError: () => set({ error: null }),

  login: async (login, password) => {
    set({ isLoading: true, error: null });
    try {
      await api.login(login, password);
      const user = await api.getMe();
      set({ user, isLoading: false, isLoginModalOpen: false });
      return getUserRoles(user).includes("admin");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Login xatosi yuz berdi";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.logout();
    } catch {
      // ignore logout errors
    }
    set({ user: null });
  },

  checkAuth: async () => {
    try {
      const user = await api.getMe();
      set({ user });
    } catch {
      set({ user: null });
    }
  },
}));
