"use client";

import { useEffect, useRef, type ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type AsciiPattern = "waves" | "ripple" | "plasma";

export interface AsciiFieldProps extends ComponentProps<"div"> {
  /** Characters from darkest to brightest. */
  characters?: string;
  /** Any CSS color, including var(--*). */
  color?: string;
  /** Font size of one character cell in px. */
  cellSize?: number;
  /** Animation speed multiplier (0 freezes it). */
  speed?: number;
  pattern?: AsciiPattern;
  /** Fade the edges with a radial mask. */
  fade?: boolean;
}

type PatternFn = (x: number, y: number, t: number, aspect: number) => number;

const patterns: Record<AsciiPattern, PatternFn> = {
  waves: (x, y, t) =>
    0.5 +
    0.25 * Math.sin(x * 9 + t) * Math.cos(y * 7 - t * 0.6) +
    0.25 * Math.sin((x + y) * 5 + t * 1.4),
  ripple: (x, y, t, aspect) => {
    const d = Math.hypot(x - 0.5, (y - 0.5) * aspect);
    return 0.5 + 0.5 * Math.sin(d * 42 - t * 3) * Math.max(0, 1 - d * 1.3);
  },
  plasma: (x, y, t, aspect) =>
    (Math.sin(x * 10 + t) +
      Math.sin(y * 8 * aspect - t * 1.2) +
      Math.sin((x + y) * 6 + t * 0.8) +
      Math.sin(Math.hypot(x - 0.5, (y - 0.5) * aspect) * 18 - t * 2) +
      4) /
    8,
};

/** Cap columns so large / hi-dpi screens don't freeze the main thread. */
const MAX_COLUMNS = 96;

/** Animated field of ASCII characters drawn on a canvas. */
export function AsciiField({
  className,
  children,
  characters = " .:-=+*#%@",
  color = "var(--ds-accent, oklch(0.66 0.13 205))",
  cellSize = 12,
  speed = 1,
  pattern = "waves",
  fade = true,
  ...props
}: AsciiFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settings = useRef({ characters, cellSize, speed, pattern });

  useEffect(() => {
    settings.current = { characters, cellSize, speed, pattern };
  }, [characters, cellSize, speed, pattern]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let time = 0;
    let last = performance.now();
    let visible = false;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const s = settings.current;
      time += ((now - last) / 1000) * (reduceMotion ? 0 : s.speed);
      last = now;
      if (width === 0 || height === 0) return;

      // Grow cells on wide canvases so we never exceed MAX_COLUMNS.
      const cell = Math.max(6, s.cellSize, Math.ceil(width / MAX_COLUMNS));
      const cellWidth = cell * 0.62;
      const chars = s.characters.length > 0 ? s.characters : " .";
      const fn = patterns[s.pattern] ?? patterns.waves;
      const aspect = height / width;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(canvas).color;
      ctx.font = `${cell}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textBaseline = "top";

      for (let py = 0; py < height; py += cell) {
        for (let px = 0; px < width; px += cellWidth) {
          const v = Math.min(1, Math.max(0, fn(px / width, py / height, time, aspect)));
          const char = chars[Math.round(v * (chars.length - 1))];
          if (char === " ") continue;
          ctx.globalAlpha = 0.12 + v * 0.88;
          ctx.fillText(char, px, py);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (!visible) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
      draw(now);
    };

    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    intersectionObserver.observe(canvas);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div className={cn("relative isolate overflow-hidden bg-background", className)} {...props}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 size-full",
          fade && "mask-[radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
        )}
        style={{ color }}
      />
      {children}
    </div>
  );
}
