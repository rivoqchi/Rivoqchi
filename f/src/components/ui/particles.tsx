"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

export interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
  active?: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  let normalized = hex.replace("#", "");

  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = Number.parseInt(normalized, 16);
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

function remapValue(
  value: number,
  start1: number,
  end1: number,
  start2: number,
  end2: number,
): number {
  const remapped =
    ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
  return remapped > 0 ? remapped : 0;
}

export function Particles({
  className,
  quantity = 80,
  staticity = 60,
  ease = 60,
  size = 0.35,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  active = true,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const circlesRef = useRef<Circle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const canvasSizeRef = useRef({ w: 0, h: 0 });
  const animationRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const dprRef = useRef(1);
  const rgbRef = useRef<[number, number, number]>([255, 255, 255]);

  useEffect(() => {
    rgbRef.current = hexToRgb(color);
  }, [color]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
    contextRef.current = canvas.getContext("2d", { alpha: true });

    const circleParams = (): Circle => {
      const w = canvasSizeRef.current.w;
      const h = canvasSizeRef.current.h;
      return {
        x: Math.floor(Math.random() * w),
        y: Math.floor(Math.random() * h),
        translateX: 0,
        translateY: 0,
        size: Math.floor(Math.random() * 2.5) + size,
        alpha: 0,
        targetAlpha: Number.parseFloat(
          (Math.random() * 0.42 + 0.28).toFixed(2),
        ),
        dx: (Math.random() - 0.5) * 0.08,
        dy: (Math.random() - 0.5) * 0.08,
        magnetism: 0.1 + Math.random() * 3,
      };
    };

    const resizeCanvas = () => {
      const ctx = contextRef.current;
      if (!container || !canvas || !ctx) return;

      circlesRef.current.length = 0;
      canvasSizeRef.current.w = container.offsetWidth;
      canvasSizeRef.current.h = container.offsetHeight;

      const dpr = dprRef.current;
      canvas.width = Math.floor(canvasSizeRef.current.w * dpr);
      canvas.height = Math.floor(canvasSizeRef.current.h * dpr);
      canvas.style.width = `${canvasSizeRef.current.w}px`;
      canvas.style.height = `${canvasSizeRef.current.h}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (let i = 0; i < quantity; i++) {
        circlesRef.current.push(circleParams());
      }
    };

    const drawCircle = (circle: Circle) => {
      const ctx = contextRef.current;
      if (!ctx) return;

      const { x, y, translateX, translateY, size: radius, alpha } = circle;
      ctx.beginPath();
      ctx.arc(x + translateX, y + translateY, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgbRef.current.join(", ")}, ${alpha})`;
      ctx.fill();
    };

    const clearContext = () => {
      const ctx = contextRef.current;
      if (!ctx) return;
      ctx.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h);
    };

    const animate = () => {
      if (!visibleRef.current) {
        animationRef.current = window.requestAnimationFrame(animate);
        return;
      }

      clearContext();

      const { w, h } = canvasSizeRef.current;
      const circles = circlesRef.current;

      for (let i = circles.length - 1; i >= 0; i--) {
        const circle = circles[i];
        const edge = [
          circle.x + circle.translateX - circle.size,
          w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          h - circle.y - circle.translateY - circle.size,
        ];
        const closestEdge = Math.min(...edge);
        const edgeAlpha = remapValue(closestEdge, 0, 20, 0, 1);

        if (edgeAlpha > 1) {
          circle.alpha = Math.min(circle.alpha + 0.02, circle.targetAlpha);
        } else {
          circle.alpha = circle.targetAlpha * edgeAlpha;
        }

        circle.x += circle.dx + vx;
        circle.y += circle.dy + vy;
        circle.translateX +=
          (mouseRef.current.x / (staticity / circle.magnetism) -
            circle.translateX) /
          ease;
        circle.translateY +=
          (mouseRef.current.y / (staticity / circle.magnetism) -
            circle.translateY) /
          ease;

        drawCircle(circle);

        if (
          circle.x < -circle.size ||
          circle.x > w + circle.size ||
          circle.y < -circle.size ||
          circle.y > h + circle.size
        ) {
          circles[i] = circleParams();
        }
      }

      animationRef.current = window.requestAnimationFrame(animate);
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const { w, h } = canvasSizeRef.current;
      mouseRef.current.x = event.clientX - rect.left - w / 2;
      mouseRef.current.y = event.clientY - rect.top - h / 2;
    };

    const onVisibilityChange = () => {
      visibleRef.current = !document.hidden;
    };

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resizeCanvas, 150);
    };

    resizeCanvas();
    animate();

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(animationRef.current);
    };
  }, [active, color, ease, quantity, refresh, size, staticity, vx, vy]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}

Particles.displayName = "Particles";

export default Particles;
