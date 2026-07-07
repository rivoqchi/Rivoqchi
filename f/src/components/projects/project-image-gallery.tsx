"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isLocalUpload } from "@/lib/media";
import { cn } from "@/lib/utils";

interface ProjectImageGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function ProjectImageGallery({
  images,
  title,
  className,
}: ProjectImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const total = images.length;
  const hasMany = total > 1;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const closeFullscreen = useCallback(() => setFullscreen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const thumb = thumbRefs.current[activeIndex];
    thumb?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!fullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeFullscreen();
      }
      if (hasMany && event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (hasMany && event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeFullscreen, fullscreen, goNext, goPrev, hasMany]);

  useEffect(() => {
    if (!hasMany || fullscreen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreen, goNext, goPrev, hasMany]);

  useEffect(() => {
    if (!hasMany) return;

    const preload = (index: number) => {
      const src = images[index];
      if (!src) return;
      const img = new window.Image();
      img.src = src;
    };

    preload((activeIndex + 1) % total);
    preload((activeIndex - 1 + total) % total);
  }, [activeIndex, hasMany, images, total]);

  if (total === 0) return null;

  const currentSrc = images[activeIndex];

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current || !hasMany) return;

    const deltaX = event.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) goNext();
    else goPrev();
  };

  const imageSlide = (variant: "inline" | "fullscreen") => (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={currentSrc}
        initial={{ opacity: 0, scale: variant === "inline" ? 1.02 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src={currentSrc}
          alt={`${title} — ${activeIndex + 1}/${total}`}
          fill
          className="object-contain object-center"
          sizes={
            variant === "fullscreen"
              ? "100vw"
              : "(max-width: 768px) 100vw, 672px"
          }
          priority={activeIndex === 0}
          unoptimized={isLocalUpload(currentSrc)}
        />
      </motion.div>
    </AnimatePresence>
  );

  const navButtons = (className?: string) =>
    hasMany ? (
      <>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className={cn(
            "absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-black/50 text-white shadow-sm backdrop-blur-sm hover:bg-black/65",
            className,
          )}
          onClick={goPrev}
          aria-label="Oldingi rasm"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className={cn(
            "absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-black/50 text-white shadow-sm backdrop-blur-sm hover:bg-black/65",
            className,
          )}
          onClick={goNext}
          aria-label="Keyingi rasm"
        >
          <ChevronRight className="size-4" />
        </Button>
      </>
    ) : null;

  const fullscreenLightbox =
    mounted && fullscreen
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex flex-col bg-black"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — kattalashtirilgan rasm`}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
              <p className="min-w-0 truncate text-sm font-medium text-white/90">
                {title}
                {hasMany && (
                  <span className="text-white/60">
                    {" "}
                    · {activeIndex + 1}/{total}
                  </span>
                )}
              </p>
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                className="shrink-0 bg-white/10 text-white hover:bg-white/20"
                onClick={closeFullscreen}
                aria-label="Yopish"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div
              className="relative min-h-0 flex-1"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {imageSlide("fullscreen")}
              {navButtons("sm:left-3 sm:right-3")}
            </div>

            {hasMany && (
              <div className="flex shrink-0 justify-center gap-2 px-4 py-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      index === activeIndex
                        ? "w-5 bg-white"
                        : "w-1.5 bg-white/45 hover:bg-white/70",
                    )}
                    onClick={() => goTo(index)}
                    aria-label={`Rasm ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <div
          className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {imageSlide("inline")}
          {navButtons(
            "bg-background/80 text-foreground hover:bg-background/90",
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-3">
            <div className="flex items-end justify-between gap-3">
              {hasMany ? (
                <div className="flex gap-1.5">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={cn(
                        "pointer-events-auto size-1.5 rounded-full transition-all",
                        index === activeIndex
                          ? "w-4 bg-white"
                          : "bg-white/50 hover:bg-white/80",
                      )}
                      onClick={() => goTo(index)}
                      aria-label={`Rasm ${index + 1}`}
                    />
                  ))}
                </div>
              ) : (
                <span />
              )}

              <div className="pointer-events-auto flex items-center gap-2">
                {hasMany && (
                  <span className="rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
                    {activeIndex + 1} / {total}
                  </span>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={() => setFullscreen(true)}
                  aria-label="Kattalashtirish"
                >
                  <Maximize2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {hasMany && (
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                ref={(node) => {
                  thumbRefs.current[index] = node;
                }}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-md border-2 transition-all sm:size-[4.5rem]",
                  index === activeIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
                aria-label={`${title} — rasm ${index + 1}`}
                aria-current={index === activeIndex}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="72px"
                  loading="lazy"
                  unoptimized={isLocalUpload(src)}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {fullscreenLightbox}
    </>
  );
}
