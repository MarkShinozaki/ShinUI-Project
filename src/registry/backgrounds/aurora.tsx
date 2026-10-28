"use client";

import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Keyframes ship with the component so the file works on its own. React 19
 * hoists a <style> with `href` + `precedence` into <head> once, however many
 * instances render.
 */
const AURORA_CSS = `
@keyframes ds-aurora {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33% { transform: translate(12%, 8%) scale(1.15) rotate(20deg); }
  66% { transform: translate(-10%, 12%) scale(0.92) rotate(-15deg); }
}
.ds-aurora-orb { animation: ds-aurora 18s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ds-aurora-orb { animation: none; } }
`;

export interface AuroraProps extends ComponentProps<"div"> {
  /** How strong the glow is. */
  intensity?: "subtle" | "vivid";
  /** Show a faint grid on top of the glow. */
  grid?: boolean;
  /** Seconds for one full drift cycle. Lower is faster. */
  speed?: number;
  /**
   * Softness of the glow (how far the haze reaches).
   * Softness comes from gradient falloff + circular masks, not `filter: blur()`,
   * which softens Chrome but turns into hard rotated discs in Edge.
   */
  blur?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
}

/** Soft drifting aurora glow. Put any content inside it as children. */
export function Aurora({
  className,
  children,
  intensity = "vivid",
  grid = true,
  speed = 18,
  blur = 110,
  colorA = "var(--ds-primary, oklch(0.57 0.22 285))",
  colorB = "var(--ds-accent, oklch(0.66 0.13 205))",
  colorC = "var(--ds-highlight, oklch(0.63 0.21 350))",
  ...props
}: AuroraProps) {
  // Fully transparent well before the circle edge so rotation never shows a hard rim.
  const fadeEnd = Math.min(70, Math.max(48, Math.round(42 + blur * 0.2)));

  const orb = (color: string, delay: number): CSSProperties => ({
    background: `radial-gradient(circle at 50% 50%, ${color} 0%, ${color} 8%, transparent ${fadeEnd}%)`,
    animationDuration: `${speed}s`,
    animationDelay: `${-speed * delay}s`,
  });

  return (
    <div className={cn("relative isolate overflow-hidden bg-background", className)} {...props}>
      <style href="ds-aurora" precedence="default">
        {AURORA_CSS}
      </style>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10",
          intensity === "subtle" ? "opacity-45" : "opacity-85"
        )}
      >
        {/*
          Circles (rounded-full), not rectangles. The animation rotates each
          orb; a rotated rect shows hard corners in Edge. A circle stays soft
          under rotation when the gradient fades out early.
        */}
        <div
          className="ds-aurora-orb absolute -top-[35%] -left-[30%] aspect-square w-[110%] rounded-full"
          style={orb(colorA, 0)}
        />
        <div
          className="ds-aurora-orb absolute -top-[25%] -right-[35%] aspect-square w-[100%] rounded-full"
          style={orb(colorB, 1 / 3)}
        />
        <div
          className="ds-aurora-orb absolute -bottom-[45%] left-[0%] aspect-square w-[105%] rounded-full"
          style={orb(colorC, 2 / 3)}
        />
        {grid && (
          <div
            className="absolute inset-0 mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-size-[48px_48px]"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklab, var(--color-foreground) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-foreground) 7%, transparent) 1px, transparent 1px)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--color-background)_82%)]" />
      </div>
      {children}
    </div>
  );
}
