"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { StoreHydration } from "@/components/providers/store-hydration";
import { AdminShortcutListener } from "@/components/admin/admin-shortcut-listener";
import { AdminLoginModal } from "@/components/admin/admin-login-modal";
import { NetworkOfflineBanner } from "@/components/layout/network-offline-banner";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <StoreHydration />
      <LocaleProvider>
        <NetworkOfflineBanner />
        <AdminShortcutListener />
        <AdminLoginModal />
        {children}
      </LocaleProvider>
    </ThemeProvider>
  );
}
