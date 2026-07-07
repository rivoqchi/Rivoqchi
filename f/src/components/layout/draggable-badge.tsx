"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import { useContentData } from "@/hooks/use-content-data";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { isLocalUpload, resolveMediaUrl } from "@/lib/media";

const BADGE_WIDTH = 136;
const PIN_Y = 10;
const REST_LENGTH = 188;
const ATTACH_Y = PIN_Y + REST_LENGTH;
const BADGE_CENTER = BADGE_WIDTH / 2;
const DISMISS_X = 120;
const DISMISS_VELOCITY = 360;
const DROP_Y = -540;
const DROP_X = -28;
const SPRING_BACK = {
  type: "spring" as const,
  stiffness: 220,
  damping: 18,
  mass: 0.95,
};

const SETTLE_SWINGS = [
  { x: 38, y: 16, duration: 0.7 },
  { x: -30, y: 20, duration: 0.92 },
  { x: 22, y: -10, duration: 1.05 },
  { x: -16, y: 12, duration: 1.2 },
  { x: 10, y: -6, duration: 1.35 },
  { x: -6, y: 4, duration: 1.5 },
  { x: 3, y: -2, duration: 1.65 },
  { x: 0, y: 0, duration: 1.85 },
] as const;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const DESKTOP_MQ = "(min-width: 768px)";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export function DraggableBadge() {
  const isDesktop = useIsDesktop();
  const [portalReady, setPortalReady] = useState(false);
  const { data, isLoading } = useContentData();
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const wobble = useMotionValue(0);

  const activeControlsRef = useRef<AnimationPlaybackControls[]>([]);
  const userInteractedRef = useRef(false);

  const stopActiveAnimations = useCallback(() => {
    activeControlsRef.current.forEach((control) => control.stop());
    activeControlsRef.current = [];
  }, []);

  const trackAnimation = useCallback((control: AnimationPlaybackControls) => {
    activeControlsRef.current.push(control);
    return control;
  }, []);

  const lineX2 = useTransform(x, (v) => BADGE_CENTER + v);
  const lineY2 = useTransform(y, (v) => ATTACH_Y + v);

  const ropePath = useTransform([x, y, lineX2, lineY2], ([ox, oy, bx, by]) => {
    const dx = Number(ox) || 0;
    const dy = Number(oy) || 0;
    const endX = Number(bx) || BADGE_CENTER;
    const endY = Number(by) || ATTACH_Y;
    const sag = 18 + Math.abs(dx) * 0.42 + Math.max(0, dy) * 0.08;
    const midX = BADGE_CENTER + dx * 0.48;
    const midY = (PIN_Y + endY) / 2 + sag;
    return `M ${BADGE_CENTER} ${PIN_Y} Q ${midX} ${midY} ${endX} ${endY}`;
  });

  const rotate = useTransform([x, y, wobble], ([latestX, latestY, w]) => {
    const dx = Number(latestX) || 0;
    const dy = REST_LENGTH + (Number(latestY) || 0);
    const base = (Math.atan2(dx, dy) * 180) / Math.PI;
    return Math.max(-48, Math.min(48, base + (Number(w) || 0)));
  });

  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const entranceRef = useRef(false);

  const canDrag = ready && !prefersReducedMotion;

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      setDismissed(true);
      setReady(false);
      return;
    }
    setDismissed(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop || isLoading || !data || dismissed) return;
    const timer = window.setTimeout(() => setReady(true), 350);
    return () => window.clearTimeout(timer);
  }, [isDesktop, isLoading, data, dismissed]);

  useLayoutEffect(() => {
    if (!ready || prefersReducedMotion) return;
    x.set(DROP_X);
    y.set(DROP_Y);
    wobble.set(0);
  }, [ready, prefersReducedMotion, x, y, wobble]);

  useEffect(() => {
    if (!ready) return;

    if (prefersReducedMotion) {
      x.set(0);
      y.set(0);
      wobble.set(0);
      setHasEntered(true);
      return;
    }

    if (entranceRef.current) return;
    entranceRef.current = true;
    userInteractedRef.current = false;

    let cancelled = false;

    const runEntrance = async () => {
      x.set(DROP_X);
      y.set(DROP_Y);
      wobble.set(-6);

      await Promise.all([
        trackAnimation(
          animate(y, [DROP_Y, 52, -28, 16, -9, 4, 0], {
            duration: 1.75,
            times: [0, 0.46, 0.6, 0.74, 0.86, 0.94, 1],
            ease: [0.22, 0.05, 0.25, 1],
          }),
        ),
        trackAnimation(
          animate(x, [DROP_X, 32, -26, 18, -11, 5, 0], {
            duration: 1.75,
            times: [0, 0.44, 0.58, 0.72, 0.86, 0.94, 1],
            ease: [0.22, 0.05, 0.25, 1],
          }),
        ),
        trackAnimation(
          animate(wobble, [-6, 8, -10, 6, -3, 1, 0], {
            duration: 1.75,
            times: [0, 0.4, 0.55, 0.7, 0.85, 0.94, 1],
          }),
        ),
      ]);
      if (cancelled || userInteractedRef.current) return;

      await wait(80);
      if (cancelled || userInteractedRef.current) return;

      for (const swing of SETTLE_SWINGS) {
        if (cancelled || userInteractedRef.current) return;

        await Promise.all([
          trackAnimation(
            animate(x, swing.x, {
              duration: swing.duration,
              ease: [0.36, 0, 0.2, 1],
            }),
          ),
          trackAnimation(
            animate(y, swing.y, {
              duration: swing.duration * 1.05,
              ease: [0.36, 0, 0.2, 1],
            }),
          ),
          trackAnimation(
            animate(wobble, swing.x * 0.18, {
              duration: swing.duration,
              ease: [0.36, 0, 0.2, 1],
            }),
          ),
        ]);
      }

      if (!cancelled && !userInteractedRef.current) {
        setHasEntered(true);
      }
    };

    void runEntrance();

    return () => {
      cancelled = true;
      stopActiveAnimations();
      entranceRef.current = false;
    };
  }, [ready, prefersReducedMotion, stopActiveAnimations, trackAnimation, wobble, x, y]);

  useEffect(() => {
    if (!hasEntered || isDragging || prefersReducedMotion || !ready) return;

    let cancelled = false;

    const runIdle = async () => {
      await wait(600);
      if (cancelled || userInteractedRef.current) return;

      while (!cancelled && !userInteractedRef.current) {
        await Promise.all([
          trackAnimation(animate(x, 4.2, { duration: 2.6, ease: "easeInOut" })),
          trackAnimation(animate(y, 3.2, { duration: 2.1, ease: "easeInOut" })),
          trackAnimation(animate(wobble, 2.8, { duration: 2.4, ease: "easeInOut" })),
        ]);
        if (cancelled || userInteractedRef.current) break;

        await Promise.all([
          trackAnimation(animate(x, -3.8, { duration: 3.1, ease: "easeInOut" })),
          trackAnimation(animate(y, 4.5, { duration: 2.8, ease: "easeInOut" })),
          trackAnimation(animate(wobble, -2.4, { duration: 2.9, ease: "easeInOut" })),
        ]);
        if (cancelled || userInteractedRef.current) break;

        await Promise.all([
          trackAnimation(animate(x, 2.2, { duration: 3.4, ease: "easeInOut" })),
          trackAnimation(animate(y, -2.8, { duration: 3.0, ease: "easeInOut" })),
          trackAnimation(animate(wobble, 1.6, { duration: 3.2, ease: "easeInOut" })),
        ]);
        if (cancelled || userInteractedRef.current) break;

        await Promise.all([
          trackAnimation(animate(x, -1.2, { duration: 3.8, ease: "easeInOut" })),
          trackAnimation(animate(y, 1.5, { duration: 3.5, ease: "easeInOut" })),
          trackAnimation(animate(wobble, -0.8, { duration: 3.6, ease: "easeInOut" })),
        ]);
        if (cancelled || userInteractedRef.current) break;

        await Promise.all([
          trackAnimation(animate(x, 0, { duration: 4.2, ease: "easeInOut" })),
          trackAnimation(animate(y, 0, { duration: 4.0, ease: "easeInOut" })),
          trackAnimation(animate(wobble, 0, { duration: 4.5, ease: "easeInOut" })),
        ]);
        if (cancelled || userInteractedRef.current) break;

        await wait(1800);
      }
    };

    void runIdle();

    return () => {
      cancelled = true;
      stopActiveAnimations();
    };
  }, [
    hasEntered,
    isDragging,
    prefersReducedMotion,
    ready,
    stopActiveAnimations,
    trackAnimation,
    wobble,
    x,
    y,
  ]);

  const dismiss = useCallback(async () => {
    stopActiveAnimations();
    await Promise.all([
      animate(x, 180, { duration: 0.5, ease: [0.32, 0, 0.67, 0] }),
      animate(y, 80, { duration: 0.5, ease: [0.32, 0, 0.67, 0] }),
      animate(wobble, 0, { duration: 0.3 }),
    ]);
    setDismissed(true);
    setReady(false);
    setHasEntered(false);
    userInteractedRef.current = false;
    entranceRef.current = false;
  }, [stopActiveAnimations, wobble, x, y]);

  const snapBack = useCallback(() => {
    stopActiveAnimations();
    trackAnimation(animate(x, 0, SPRING_BACK));
    trackAnimation(animate(y, 0, SPRING_BACK));
    trackAnimation(
      animate(wobble, 0, { type: "spring", stiffness: 180, damping: 14 }),
    );
  }, [stopActiveAnimations, trackAnimation, wobble, x, y]);

  const handlePointerDown = useCallback(() => {
    userInteractedRef.current = true;
    stopActiveAnimations();
    setHasEntered(true);
  }, [stopActiveAnimations]);

  const handleDragStart = useCallback(() => {
    userInteractedRef.current = true;
    stopActiveAnimations();
    setIsDragging(true);
    setHasEntered(true);
  }, [stopActiveAnimations]);

  const handleDragEnd = useCallback(
    (
      _: unknown,
      info: {
        offset: { x: number; y: number };
        velocity: { x: number; y: number };
      },
    ) => {
      setIsDragging(false);

      const farRight = info.offset.x > DISMISS_X;
      const fastRight = info.velocity.x > DISMISS_VELOCITY;
      const offScreen =
        info.offset.x > 90 &&
        info.offset.x > Math.abs(info.offset.y) * 1.1;

      if (farRight || fastRight || offScreen) {
        void dismiss();
        return;
      }

      snapBack();
    },
    [dismiss, snapBack],
  );

  if (
    !isDesktop ||
    !portalReady ||
    dismissed ||
    isLoading ||
    !data ||
    !ready ||
    !t
  ) {
    return null;
  }

  const { personal } = data;
  const avatarUrl = resolveMediaUrl(personal.avatar);
  const initials = personal.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return createPortal(
    <div
      className="fixed right-4 top-[4.5rem] z-[60] md:right-6 lg:right-8"
      aria-hidden={false}
    >
      <div
        className="relative w-[136px]"
        style={{ height: ATTACH_Y + 320 }}
      >
        <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <div className="size-2.5 rounded-full bg-gradient-to-b from-zinc-300 to-zinc-500 shadow-sm ring-2 ring-background dark:from-zinc-500 dark:to-zinc-700" />
        </div>

        <svg
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 overflow-visible"
          width={BADGE_WIDTH}
          height={ATTACH_Y + 320}
        >
          <defs>
            <linearGradient id="cv-lanyard-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(161 161 170 / 0.95)" />
              <stop offset="55%" stopColor="rgb(113 113 122 / 0.9)" />
              <stop offset="100%" stopColor="rgb(82 82 91 / 0.95)" />
            </linearGradient>
          </defs>
          <motion.path
            d={ropePath}
            fill="none"
            stroke="url(#cv-lanyard-gradient)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <motion.path
            d={ropePath}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1}
            strokeLinecap="round"
            transform="translate(0.5, 0)"
          />
        </svg>

        <motion.div
          drag={canDrag}
          dragConstraints={{
            top: -100,
            bottom: 220,
            left: -150,
            right: 110,
          }}
          dragElastic={0.22}
          dragMomentum
          dragPropagation={false}
          dragTransition={{
            bounceStiffness: 180,
            bounceDamping: 14,
            power: 0.32,
            timeConstant: 280,
          }}
          onPointerDown={handlePointerDown}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          whileDrag={{
            scale: 1.04,
            cursor: "grabbing",
            transition: { duration: 0.08 },
          }}
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ x, y, rotate, top: ATTACH_Y, left: 0, touchAction: "none" }}
          className={cn(
            "absolute z-30 origin-top select-none will-change-transform",
            canDrag && !isDragging && "cursor-grab",
            isDragging && "cursor-grabbing",
          )}
          aria-label={t.common.badgeLabel}
        >
          <div className="flex flex-col items-center">
            <div className="pointer-events-none -mt-0.5 mb-0.5 flex h-6 w-11 items-end justify-center">
              <div className="relative h-5 w-9 rounded-t-md bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500 shadow-md ring-1 ring-black/15 dark:from-zinc-500 dark:to-zinc-700">
                <div className="absolute inset-x-2 top-1 h-0.5 rounded-full bg-zinc-600/30" />
              </div>
            </div>

            <article
              className={cn(
                "relative w-[128px] overflow-hidden rounded-xl sm:w-[136px]",
                "bg-gradient-to-b from-white to-zinc-50",
                "shadow-[0_22px_48px_-16px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,0,0,0.07)]",
                "ring-1 ring-black/5",
              )}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.6)_0%,transparent_48%)]"
              />

              <div className="relative flex justify-center pt-3">
                <div className="size-3.5 rounded-full bg-zinc-200 ring-2 ring-zinc-400/90" />
              </div>

              <div className="relative px-3.5 pb-4 pt-2.5 text-center text-zinc-900">
                <div className="mx-auto mb-3 size-[4.5rem] overflow-hidden rounded-lg bg-zinc-100 ring-2 ring-white shadow-inner sm:size-20">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt=""
                      width={80}
                      height={80}
                      draggable={false}
                      className="pointer-events-none size-full object-cover"
                      unoptimized={isLocalUpload(avatarUrl)}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-zinc-800 text-base font-semibold text-white">
                      {initials}
                    </div>
                  )}
                </div>

                <p className="line-clamp-2 font-heading text-[13px] font-semibold leading-snug tracking-tight">
                  {personal.name}
                </p>
                <p className="mt-1 line-clamp-2 text-[9px] font-medium uppercase leading-relaxed tracking-[0.1em] text-zinc-500">
                  {personal.title}
                </p>

                <div className="mt-3 flex items-center justify-center">
                  <span className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white">
                    CV
                  </span>
                </div>
              </div>
            </article>

            <p
              className={cn(
                "pointer-events-none mt-2 max-w-[136px] text-center text-[9px] leading-relaxed text-muted-foreground/75 transition-opacity duration-700",
                ready ? "opacity-100" : "opacity-0",
              )}
            >
              {t.common.badgeHint}
            </p>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}
