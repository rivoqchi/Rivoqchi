"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Particles } from "@/components/ui/particles";
import { useThemeStore } from "@/stores/theme-store";

function getParticleQuantity() {
  if (typeof window === "undefined") return 60;

  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 4;
  const isLowPower = cores <= 4 || width < 768;

  if (width < 640) return isLowPower ? 36 : 48;
  if (width < 1024) return isLowPower ? 52 : 68;
  return isLowPower ? 72 : 96;
}

export function SiteParticlesBackground() {
  const prefersReducedMotion = useReducedMotion();
  const theme = useThemeStore((s) => s.theme);
  const [quantity, setQuantity] = useState(60);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setQuantity(getParticleQuantity());

    let timer: number | undefined;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setQuantity(getParticleQuantity()), 200);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, []);

  const color = useMemo(
    () => (theme === "dark" ? "#ffffff" : "#0a0a0a"),
    [theme],
  );

  if (!mounted || prefersReducedMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <Particles
        active
        quantity={quantity}
        staticity={70}
        ease={70}
        size={0.55}
        color={color}
        className="opacity-100"
      />

      {/* Yengil overlay — matn o'qilishi uchun, particlelarni yashirmaydi */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/12 via-transparent to-background/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,var(--background)_0%,transparent_62%)] opacity-35" />
    </div>
  );
}
