"use client";

import { useRef, useState, useCallback } from "react";

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    setIsDragging(true);
    el.dataset.scrollStart = String(e.pageX);
    el.dataset.scrollLeft = String(el.scrollLeft);
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el || !isDragging) return;

      e.preventDefault();
      const start = Number(el.dataset.scrollStart ?? 0);
      const left = Number(el.dataset.scrollLeft ?? 0);
      el.scrollLeft = left - (e.pageX - start) * 1.2;
    },
    [isDragging]
  );

  const stopDrag = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setIsDragging(false);
    el.style.cursor = "grab";
  }, []);

  return {
    ref,
    isDragging,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp: stopDrag,
      onMouseLeave: stopDrag,
    },
  };
}
