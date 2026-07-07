"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_CONFIG } from "@/lib/constants";
import { Container } from "@/components/layout/container";
import { EASE_PREMIUM } from "@/lib/motion";
import { useTranslation } from "@/hooks/use-translation";
import { useTranslationStore } from "@/stores/translation-store";

export function Footer() {
  const { t, isLoading } = useTranslation();
  const siteSettings = useTranslationStore((s) => s.siteSettings);
  const prefersReducedMotion = useReducedMotion();
  const watermark = SITE_CONFIG.watermark.toUpperCase();
  const siteName = siteSettings?.name ?? SITE_CONFIG.name;

  return (
    <footer id="site-footer" className="overflow-x-clip border-t">
      <div className="relative overflow-hidden border-b border-foreground/[0.06] py-6 sm:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_100%,var(--foreground)_0%,transparent_72%)] opacity-[0.05]"
        />

        <Container className="relative flex justify-center px-3 sm:px-4">
          <motion.p
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 32 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px", amount: 0.5 }}
            transition={{ duration: 0.9, ease: EASE_PREMIUM }}
            aria-hidden
            className="font-heading whitespace-nowrap text-center font-bold uppercase leading-none tracking-[-0.04em] [font-size:clamp(2.5rem,calc((100vw-2.5rem)/6.5),10rem)]"
          >
            {prefersReducedMotion ? (
              <span className="text-foreground/[0.13] dark:text-foreground/[0.17]">
                {watermark}
              </span>
            ) : (
              <motion.span
                className="inline-block bg-gradient-to-r from-foreground/10 via-foreground/22 to-foreground/10 bg-clip-text text-transparent"
                style={{ backgroundSize: "200% 100%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {watermark}
              </motion.span>
            )}
          </motion.p>
        </Container>
      </div>

      <Container className="py-5 text-center text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="mx-auto h-4 w-72 max-w-full" />
        ) : (
          <p>
            &copy; {new Date().getFullYear()} {siteName}. {t!.footer.rights}
          </p>
        )}
      </Container>
    </footer>
  );
}
