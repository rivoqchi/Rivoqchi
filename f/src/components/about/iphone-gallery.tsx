"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { isLocalUpload, resolveMediaUrl } from "@/lib/media";

const ROTATE_MS = 4000;

const SIZE_CLASS = {
  md: "w-[min(100%,290px)]",
  lg: "w-[min(100%,340px)] sm:w-[min(100%,360px)]",
} as const;

interface IPhoneGalleryProps {
  images: string[];
  className?: string;
  size?: keyof typeof SIZE_CLASS;
}

export function IPhoneGallery({
  images,
  className,
  size = "lg",
}: IPhoneGalleryProps) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, ROTATE_MS);

    return () => window.clearInterval(id);
  }, [slides.length, paused]);

  if (slides.length === 0) return null;

  const imageSizes =
    size === "lg" ? "(max-width: 640px) 340px, 360px" : "290px";

  return (
    <div
      className={cn("relative mx-auto shrink-0", SIZE_CLASS[size], className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Side buttons */}
      <div
        aria-hidden
        className="absolute -left-[4px] top-[19%] h-9 w-[4px] rounded-l-md bg-zinc-400 shadow-sm dark:bg-zinc-500"
      />
      <div
        aria-hidden
        className="absolute -left-[4px] top-[28%] h-14 w-[4px] rounded-l-md bg-zinc-400 shadow-sm dark:bg-zinc-500"
      />
      <div
        aria-hidden
        className="absolute -left-[4px] top-[40%] h-14 w-[4px] rounded-l-md bg-zinc-400 shadow-sm dark:bg-zinc-500"
      />
      <div
        aria-hidden
        className="absolute -right-[4px] top-[32%] h-[4.5rem] w-[4px] rounded-r-md bg-zinc-400 shadow-sm dark:bg-zinc-500"
      />

      {/* Device frame — iPhone 17 style */}
      <div
        className={cn(
          "relative rounded-[3.25rem] p-[11px]",
          "border border-zinc-300/90 bg-gradient-to-b from-zinc-100 via-zinc-200 to-zinc-300",
          "shadow-[0_40px_80px_-24px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.65)_inset]",
          "dark:border-zinc-500/70 dark:from-zinc-500 dark:via-zinc-600 dark:to-zinc-700",
          "dark:shadow-[0_40px_80px_-24px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.12)_inset]",
        )}
      >
        {/* Dynamic Island */}
        <div className="pointer-events-none absolute inset-x-0 top-[22px] z-20 flex justify-center">
          <div className="h-[30px] w-[118px] rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
        </div>

        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.6rem] bg-black ring-1 ring-black/80">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${slides[index]}-${index}`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={resolveMediaUrl(slides[index]) ?? slides[index]}
                alt=""
                fill
                sizes={imageSizes}
                className="object-cover"
                priority={index === 0}
                unoptimized={isLocalUpload(slides[index])}
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

          {slides.length > 1 && (
            <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center gap-1.5">
              {slides.map((_, slideIndex) => (
                <button
                  key={slideIndex}
                  type="button"
                  aria-label={`Rasm ${slideIndex + 1}`}
                  onClick={() => setIndex(slideIndex)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    slideIndex === index
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/75",
                  )}
                />
              ))}
            </div>
          )}

          {/* Home indicator */}
          <div className="pointer-events-none absolute bottom-[6px] left-1/2 z-10 h-[5px] w-[128px] -translate-x-1/2 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
