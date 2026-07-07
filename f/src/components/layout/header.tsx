"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/layout/container";
import { SiteLogo } from "@/components/layout/site-logo";
import { SECTION_IDS } from "@/lib/constants";
import { useCVStore } from "@/stores/cv-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const NAV_KEYS = [
  { key: "home" as const, href: "#hero", sectionId: "hero" },
  { key: "about" as const, href: "#about", sectionId: "about" },
  { key: "experience" as const, href: "#experience", sectionId: "experience" },
  { key: "skills" as const, href: "#skills", sectionId: "skills" },
  { key: "projects" as const, href: "#projects", sectionId: "projects" },
  { key: "contact" as const, href: "#contact", sectionId: "contact" },
];

function NavSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-[4.5rem] rounded-md" />
      ))}
    </>
  );
}

export function Header() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, activeSection } =
    useCVStore();
  const { t, isLoading } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      for (const section of [...SECTION_IDS].reverse()) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= 100) {
          useCVStore.getState().setActiveSection(section);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="#hero"
          className="shrink-0 rounded-md outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          onClick={closeMobileMenu}
          aria-label={isLoading ? "Home" : t!.nav.home}
        >
          <SiteLogo />
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={isLoading ? "Navigation" : t!.common.portfolio}
        >
          {isLoading ? (
            <NavSkeleton />
          ) : (
            NAV_KEYS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                  activeSection === item.sectionId
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {t!.nav[item.key]}
              </Link>
            ))
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
            aria-label={
              isLoading
                ? isMobileMenuOpen
                  ? "Close menu"
                  : "Open menu"
                : isMobileMenuOpen
                  ? t!.common.closeMenu
                  : t!.common.openMenu
            }
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </Container>

      {isMobileMenuOpen && (
        <nav
          className="border-t lg:hidden"
          aria-label={isLoading ? "Navigation" : t!.common.portfolio}
        >
          <Container className="flex flex-col gap-1 py-4">
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            ) : (
              NAV_KEYS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={closeMobileMenu}
                >
                  {t!.nav[item.key]}
                </Link>
              ))
            )}
          </Container>
        </nav>
      )}
    </header>
  );
}
