"use client";

import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/utils";

/** Keyframes ship with the component; React 19 hoists this <style> once. */
const SPOTLIGHT_CSS = `
@keyframes ds-spotlight {
  0%, 100% { transform: translate(-8%, -4%) scale(1); }
  50% { transform: translate(10%, 6%) scale(1.12); }
}
@keyframes ds-drift-x {
  from { background-position: 0 0; }
  to { background-position: 240px 0; }
}
.ds-spotlight-beam { animation: ds-spotlight 14s ease-in-out infinite; }
.ds-spotlight-grain { animation: ds-drift-x 22s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .ds-spotlight-beam, .ds-spotlight-grain { animation: none; }
}
`;

export interface SpotlightVeilProps extends ComponentProps<"div"> {
  /** Spotlight tint. */
  color?: string;
  /** Secondary wash behind the beam. */
  wash?: string;
  /** How wide the cone feels (0.35 to 0.85). */
  focus?: number;
  /** Seconds for one drift cycle. */
  speed?: number;
  /** Soft film grain stripes. */
  grain?: boolean;
}

/** A drifting spotlight cone over a dark stage: cinematic, not orb blobs. */
export function SpotlightVeil({
  className,
  children,
  color = "var(--ds-accent, oklch(0.66 0.13 205))",
  wash = "var(--ds-primary, oklch(0.57 0.22 285))",
  focus = 0.55,
  speed = 14,
  grain = true,
  ...props
}: SpotlightVeilProps) {
  const cone = Math.min(85, Math.max(35, Math.round(focus * 100)));

  const beam: CSSProperties = {
    background: `radial-gradient(ellipse ${cone}% 55% at 50% 0%, ${color} 0%, transparent 72%)`,
    animationDuration: `${speed}s`,
  };

  const backwash: CSSProperties = {
    background: `radial-gradient(ellipse 90% 70% at 70% 110%, color-mix(in oklab, ${wash} 45%, transparent), transparent 70%)`,
  };

  return (
    <div className={cn("relative isolate overflow-hidden bg-background", className)} {...props}>
      <style href="ds-spotlight-veil" precedence="default">
        {SPOTLIGHT_CSS}
      </style>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-70" style={backwash} />
        <div
          className="ds-spotlight-beam absolute -top-[20%] left-1/2 h-[120%] w-[140%] -translate-x-1/2 opacity-80"
          style={beam}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-foreground)_35%,transparent),transparent)]" />
        {grain && (
          <div
            className="ds-spotlight-grain absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0 2px, color-mix(in oklab, var(--color-foreground) 40%, transparent) 2px 3px)",
              backgroundSize: "240px 100%",
            }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-background)_90%)]" />
      </div>
      {children}
    </div>
  );
}
