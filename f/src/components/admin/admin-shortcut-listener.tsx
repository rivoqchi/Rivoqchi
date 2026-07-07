"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function AdminShortcutListener() {
  const openLoginModal = useAuthStore((s) => s.openLoginModal);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isInput) return;

      if (e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        openLoginModal();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openLoginModal]);

  return null;
}
