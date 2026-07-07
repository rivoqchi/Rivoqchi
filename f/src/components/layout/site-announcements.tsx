"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnnouncementBannerShell } from "@/components/layout/announcement-banner-shell";
import { useBannerVisibility } from "@/hooks/use-banner-visibility";
import { useDomElement } from "@/hooks/use-dom-element";
import { useContentData } from "@/hooks/use-content-data";
import { useTranslation } from "@/hooks/use-translation";
import { useCVStore } from "@/stores/cv-store";
import { useProjectStore } from "@/stores/project-store";
import { openProjectById } from "@/lib/project-view-session";

const KEYS = {
  welcome: "cv-welcome-dismissed-v3",
  about: "cv-about-interest-dismissed-v3",
  footer: "cv-footer-interest-dismissed-v3",
  idle: "cv-idle-help-dismissed-v3",
  projects: "cv-projects-suggest-dismissed-v3",
} as const;

const PROJECTS_VIEW_THRESHOLD = 2;

const WELCOME_DELAY_MS = 900;
const WELCOME_AUTO_DISMISS_MS = 12000;
const ABOUT_DWELL_MS = 10_000;
const FOOTER_DWELL_MS = 2000;
const IDLE_MS = 60_000;

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "wheel",
  "click",
] as const;

function isDismissed(key: string) {
  return sessionStorage.getItem(key) === "1";
}

function dismissKey(key: string) {
  sessionStorage.setItem(key, "1");
}

function useSessionDismissed(key: string) {
  const [dismissed, setDismissed] = useState(() =>
    typeof window !== "undefined" ? isDismissed(key) : false,
  );

  const dismiss = useCallback(() => {
    dismissKey(key);
    setDismissed(true);
  }, [key]);

  return [dismissed, dismiss] as const;
}

function useSectionDwell(
  element: HTMLElement | null,
  dwellMs: number,
  visibleRatio: number,
  onDwell: () => void,
  enabled: boolean,
) {
  const dwellTimerRef = useRef<number | null>(null);
  const insideRef = useRef(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (!element || !enabled || triggeredRef.current) return;

    const clearTimer = () => {
      if (dwellTimerRef.current !== null) {
        window.clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inside =
          entry.isIntersecting && entry.intersectionRatio >= visibleRatio;

        if (inside && !insideRef.current) {
          insideRef.current = true;
          clearTimer();
          dwellTimerRef.current = window.setTimeout(() => {
            if (triggeredRef.current) return;
            triggeredRef.current = true;
            onDwell();
          }, dwellMs);
          return;
        }

        if (!inside && insideRef.current) {
          insideRef.current = false;
          clearTimer();
        }
      },
      { threshold: [0, 0.1, 0.15, 0.25, 0.35, 0.5, 0.75, 1] },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimer();
    };
  }, [element, dwellMs, visibleRatio, onDwell, enabled]);
}

export function SiteAnnouncements() {
  const { t, isLoading } = useTranslation();
  const { data, isLoading: isContentLoading } = useContentData();
  const isMobileMenuOpen = useCVStore((s) => s.isMobileMenuOpen);

  const aboutEl = useDomElement("about");
  const footerEl = useDomElement("site-footer");
  const activeSection = useCVStore((s) => s.activeSection);

  const {
    visible: welcomeVisible,
    show: showWelcome,
    hide: hideWelcome,
  } = useBannerVisibility("welcome");
  const {
    visible: aboutVisible,
    show: showAboutBanner,
    hide: hideAbout,
  } = useBannerVisibility("about");
  const {
    visible: footerVisible,
    show: showFooterBanner,
    hide: hideFooter,
  } = useBannerVisibility("footer");
  const {
    visible: idleVisible,
    show: showIdle,
    hide: hideIdle,
  } = useBannerVisibility("idle");
  const {
    visible: projectsVisible,
    show: showProjectsBanner,
    hide: hideProjects,
  } = useBannerVisibility("projects");

  const viewedProjectIds = useProjectStore((s) => s.viewedProjectIds);

  const [welcomeDismissed, dismissWelcome] = useSessionDismissed(KEYS.welcome);
  const [aboutDismissed, dismissAbout] = useSessionDismissed(KEYS.about);
  const [footerDismissed, dismissFooter] = useSessionDismissed(KEYS.footer);
  const [idleDismissed, dismissIdle] = useSessionDismissed(KEYS.idle);
  const [projectsDismissed, dismissProjects] = useSessionDismissed(
    KEYS.projects,
  );
  const projectsTriggeredRef = useRef(false);

  // Xush kelibsiz — saytga kirganda
  useEffect(() => {
    if (
      welcomeDismissed ||
      isLoading ||
      isContentLoading ||
      !t ||
      !data
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      showWelcome();
    }, WELCOME_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [
    welcomeDismissed,
    isLoading,
    isContentLoading,
    t,
    data,
    showWelcome,
  ]);

  useEffect(() => {
    if (!welcomeVisible || welcomeDismissed) return;

    const timer = window.setTimeout(() => {
      hideWelcome();
      dismissWelcome();
    }, WELCOME_AUTO_DISMISS_MS);

    return () => window.clearTimeout(timer);
  }, [welcomeVisible, welcomeDismissed, hideWelcome, dismissWelcome]);

  // Boshqa bo'limga o'tsa xush kelibsiz banner slotini bo'shatadi
  useEffect(() => {
    if (!welcomeVisible || welcomeDismissed || activeSection === "hero") return;
    hideWelcome();
  }, [activeSection, welcomeVisible, welcomeDismissed, hideWelcome]);

  const handleWelcomeDismiss = useCallback(() => {
    hideWelcome();
    dismissWelcome();
  }, [hideWelcome, dismissWelcome]);

  const handleWelcomeExplore = useCallback(() => {
    handleWelcomeDismiss();
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }, [handleWelcomeDismiss]);

  // Men haqimda — bo'limda 10 soniya o'qisa
  const showAbout = useCallback(() => {
    if (aboutDismissed) return;
    showAboutBanner();
  }, [aboutDismissed, showAboutBanner]);

  useSectionDwell(aboutEl, ABOUT_DWELL_MS, 0.1, showAbout, !aboutDismissed);

  const handleAboutDismiss = useCallback(() => {
    hideAbout();
    dismissAbout();
  }, [hideAbout, dismissAbout]);

  const handleAboutContact = useCallback(() => {
    handleAboutDismiss();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }, [handleAboutDismiss]);

  // Footer — 2 soniya
  const showFooter = useCallback(() => {
    if (footerDismissed) return;
    showFooterBanner();
  }, [footerDismissed, showFooterBanner]);

  useSectionDwell(footerEl, FOOTER_DWELL_MS, 0.2, showFooter, !footerDismissed);

  const handleFooterDismiss = useCallback(() => {
    hideFooter();
    dismissFooter();
  }, [hideFooter, dismissFooter]);

  const handleFooterContact = useCallback(() => {
    handleFooterDismiss();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }, [handleFooterDismiss]);

  // Harakatsizlik — 1 daqiqa
  const idleTriggeredRef = useRef(false);

  useEffect(() => {
    if (idleDismissed || idleTriggeredRef.current || isLoading || !t) return;

    let idleTimer: number | null = null;

    const clearIdle = () => {
      if (idleTimer !== null) {
        window.clearTimeout(idleTimer);
        idleTimer = null;
      }
    };

    const scheduleIdle = () => {
      clearIdle();
      idleTimer = window.setTimeout(() => {
        if (idleTriggeredRef.current || idleDismissed) return;
        idleTriggeredRef.current = true;
        showIdle();
      }, IDLE_MS);
    };

    const onActivity = () => {
      if (idleTriggeredRef.current) return;
      scheduleIdle();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { passive: true });
    }

    scheduleIdle();

    return () => {
      clearIdle();
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity);
      }
    };
  }, [idleDismissed, isLoading, t, showIdle]);

  const handleIdleDismiss = useCallback(() => {
    hideIdle();
    dismissIdle();
  }, [hideIdle, dismissIdle]);

  const handleIdleHelp = useCallback(() => {
    handleIdleDismiss();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }, [handleIdleDismiss]);

  const pinnedProject =
    data?.projects.find((project) => project.isPinned) ?? null;

  // Loyihalar — 2 ta ko'rilgandan keyin pin qilingan loyihani taklif qilish
  useEffect(() => {
    if (
      projectsDismissed ||
      projectsTriggeredRef.current ||
      !pinnedProject ||
      viewedProjectIds.length < PROJECTS_VIEW_THRESHOLD ||
      isLoading ||
      !t
    ) {
      return;
    }

    projectsTriggeredRef.current = true;
    showProjectsBanner();
  }, [
    projectsDismissed,
    pinnedProject,
    viewedProjectIds.length,
    isLoading,
    t,
    showProjectsBanner,
  ]);

  const handleProjectsDismiss = useCallback(() => {
    hideProjects();
    dismissProjects();
  }, [hideProjects, dismissProjects]);

  const handleProjectsOpen = useCallback(() => {
    if (!pinnedProject) return;
    handleProjectsDismiss();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => openProjectById(pinnedProject.id), 450);
  }, [handleProjectsDismiss, pinnedProject]);

  if (isLoading || !t) return null;

  const projectsMessage =
    pinnedProject && t.projects?.suggestBanner
      ? t.projects.suggestBanner.replace("{project}", pinnedProject.title)
      : null;

  const welcomeMessage =
    data && t.welcome?.banner
      ? t.welcome.banner.replace("{name}", data.personal.name.split(" ")[0])
      : null;

  const shellVisible = !isMobileMenuOpen;

  return (
    <>
      {welcomeMessage && !welcomeDismissed && (
        <AnnouncementBannerShell
          visible={welcomeVisible && shellVisible}
          message={welcomeMessage}
          ctaLabel={t.welcome.cta}
          onCta={handleWelcomeExplore}
          onDismiss={handleWelcomeDismiss}
          dismissLabel={t.welcome.dismiss}
        />
      )}

      {!aboutDismissed && t.about?.interestBanner && (
        <AnnouncementBannerShell
          visible={aboutVisible && shellVisible}
          message={t.about.interestBanner}
          ctaLabel={t.about.interestCta}
          onCta={handleAboutContact}
          onDismiss={handleAboutDismiss}
          dismissLabel={t.about.interestDismiss}
        />
      )}

      {!footerDismissed && t.footer?.interestBanner && (
        <AnnouncementBannerShell
          visible={footerVisible && shellVisible}
          message={t.footer.interestBanner}
          ctaLabel={t.footer.interestCta}
          onCta={handleFooterContact}
          onDismiss={handleFooterDismiss}
          dismissLabel={t.footer.interestDismiss}
        />
      )}

      {!idleDismissed && t.idle?.banner && (
        <AnnouncementBannerShell
          visible={idleVisible && shellVisible}
          message={t.idle.banner}
          ctaLabel={t.idle.cta}
          onCta={handleIdleHelp}
          onDismiss={handleIdleDismiss}
          dismissLabel={t.idle.dismiss}
        />
      )}

      {projectsMessage && !projectsDismissed && (
        <AnnouncementBannerShell
          visible={projectsVisible && shellVisible}
          message={projectsMessage}
          ctaLabel={t.projects.suggestCta}
          onCta={handleProjectsOpen}
          onDismiss={handleProjectsDismiss}
          dismissLabel={t.projects.suggestDismiss}
        />
      )}
    </>
  );
}
