"use client";

import { useEffect, useId, useRef, useState, type ComponentProps, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Tone = "border" | "muted" | "primary" | "accent";
type Highlight = "primary" | "accent" | "highlight";
type Fade = "none" | "radial" | "top";

export interface GridLinesProps extends ComponentProps<"div"> {
  /** Size of one grid cell in px. */
  cellSize?: number;
  /** Line color preset, built from the design tokens. */
  tone?: Tone;
  /** Any CSS color. Overrides `tone` when set. */
  lineColor?: string;
  /** Dashed instead of solid hairlines. */
  dashed?: boolean;
  /** Draw small plus marks at grid intersections. */
  showCrosshairs?: boolean;
  /** Put a crosshair on every Nth intersection. */
  crosshairEvery?: number;
  /** Randomly light up cells. Turns itself off for reduced-motion users. */
  animate?: boolean;
  /** Color of the lit cells. */
  highlight?: Highlight;
  /** Milliseconds between newly lit cells. */
  interval?: number;
  /** Fade the grid out towards the edges. */
  fade?: Fade;
}

/** Design Studio palette, with light-theme fallbacks so the file works alone. */
const COLOR: Record<Highlight, string> = {
  primary: "var(--ds-primary, oklch(0.57 0.22 285))",
  accent: "var(--ds-accent, oklch(0.66 0.13 205))",
  highlight: "var(--ds-highlight, oklch(0.63 0.21 350))",
};

const LINE: Record<Tone, string> = {
  border: "color-mix(in oklab, var(--color-foreground) 9%, var(--color-background))",
  muted: "color-mix(in oklab, var(--color-foreground) 18%, var(--color-background))",
  primary: `color-mix(in oklab, ${COLOR.primary} 30%, var(--color-background))`,
  accent: `color-mix(in oklab, ${COLOR.accent} 35%, var(--color-background))`,
};

const MASK: Record<Fade, string | undefined> = {
  none: undefined,
  radial: "radial-gradient(ellipse at center, #000 35%, transparent 80%)",
  top: "linear-gradient(to bottom, #000 30%, transparent 95%)",
};

interface LitCell {
  key: number;
  col: number;
  row: number;
}

/**
 * A hairline grid with crosshair marks and optional cells that softly light
 * up, the "blueprint" look of technical landing pages. Lines are an SVG
 * pattern, so any cell size stays crisp. Put content inside as children.
 */
export function GridLines({
  cellSize = 64,
  tone = "border",
  lineColor,
  dashed = false,
  showCrosshairs = true,
  crosshairEvery = 2,
  animate = true,
  highlight = "primary",
  interval = 700,
  fade = "radial",
  className,
  style,
  children,
  ...props
}: GridLinesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [lit, setLit] = useState<LitCell[]>([]);
  const id = `gl${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const cell = Math.max(8, Math.round(cellSize));
  const every = Math.max(1, Math.round(crosshairEvery));
  const big = cell * every;
  const line = lineColor ?? LINE[tone];
  const cross = `color-mix(in oklab, ${line} 45%, var(--color-foreground))`;
  const glow = COLOR[highlight];
  const arm = Math.min(6, Math.floor(cell / 4));

  // Center the grid so a line always runs through the middle.
  const halfW = Math.floor(size.w / 2);
  const halfH = Math.floor(size.h / 2);
  const ox = halfW % cell;
  const oy = halfH % cell;
  const cx = halfW % big;
  const cy = halfH % big;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!animate || !size.w || !size.h) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cols = Math.ceil(size.w / cell) + 1;
    const rows = Math.ceil(size.h / cell) + 1;
    let key = 0;
    const tick = () => {
      const next = {
        key: key++,
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
      };
      setLit((cells) => [...cells.slice(-11), next]);
    };
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, Math.max(120, interval));
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      setLit([]);
    };
  }, [animate, size.w, size.h, cell, interval]);

  const mask = MASK[fade];
  const layer: CSSProperties = mask ? { maskImage: mask, WebkitMaskImage: mask } : {};

  return (
    <div
      ref={ref}
      className={cn("relative isolate overflow-hidden bg-background", className)}
      style={style}
      {...props}
    >
      <style>{`@keyframes ${id}-pulse{0%{opacity:0}35%{opacity:1}100%{opacity:0}}`}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={layer}>
        {lit.map((c) => (
          <span
            key={c.key}
            className="absolute"
            onAnimationEnd={() => setLit((cells) => cells.filter((x) => x.key !== c.key))}
            style={{
              left: ox - cell + c.col * cell,
              top: oy - cell + c.row * cell,
              width: cell,
              height: cell,
              background: `color-mix(in oklab, ${glow} 18%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${glow} 45%, transparent)`,
              opacity: 0,
              animation: `${id}-pulse 2.8s ease-in-out forwards`,
            }}
          />
        ))}
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <pattern
              id={`${id}-grid`}
              width={cell}
              height={cell}
              x={ox}
              y={oy}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M0.5 0V${cell}M0 0.5H${cell}`}
                fill="none"
                stroke={line}
                strokeWidth={1}
                strokeDasharray={dashed ? "3 3" : undefined}
                shapeRendering="crispEdges"
              />
            </pattern>
            <pattern
              id={`${id}-cross`}
              width={big}
              height={big}
              x={cx - big / 2}
              y={cy - big / 2}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M${big / 2 + 0.5} ${big / 2 - arm + 0.5}V${big / 2 + arm + 0.5}M${big / 2 - arm + 0.5} ${big / 2 + 0.5}H${big / 2 + arm + 0.5}`}
                fill="none"
                stroke={cross}
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id}-grid)`} />
          {showCrosshairs && arm > 1 && (
            <rect width="100%" height="100%" fill={`url(#${id}-cross)`} />
          )}
        </svg>
      </div>
      {children}
    </div>
  );
}
