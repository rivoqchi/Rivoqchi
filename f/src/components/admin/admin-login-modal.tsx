"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";

export function AdminLoginModal() {
  const router = useRouter();
  const isOpen = useAuthStore((s) => s.isLoginModalOpen);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const closeLoginModal = useAuthStore((s) => s.closeLoginModal);
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLoginModal();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeLoginModal]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const loginName = String(form.get("login") ?? "");
    const password = String(form.get("password") ?? "");

    const isAdmin = await login(loginName, password);
    if (isAdmin) {
      router.push("/admin");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeLoginModal}
        aria-label="Yopish"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Admin kirish</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Login va parolni kiriting
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeLoginModal}
            aria-label="Yopish"
          >
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-login">Login</Label>
            <Input
              id="admin-login"
              name="login"
              type="text"
              placeholder="admin"
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password">Parol</Label>
            <Input
              id="admin-password"
              name="password"
              type="password"
              placeholder="••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Kirish..." : "Kirish"}
            </Button>
            <Button type="button" variant="outline" onClick={closeLoginModal}>
              Bekor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
