"use client";

import type { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/utils";

/** Keyframes ship with the component; React 19 hoists this <style> once. */
const HORIZON_CSS = `
@keyframes ds-horizon {
  0%, 100% { transform: translateX(-6%) scaleX(1); opacity: 0.55; }
  50% { transform: translateX(6%) scaleX(1.08); opacity: 1; }
}
.ds-horizon-beam { animation: ds-horizon 9s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .ds-horizon-beam { animation: none; } }
`;

export interface HorizonBeamProps extends ComponentProps<"div"> {
  /** Beam color. */
  color?: string;
  /** Vertical position of the horizon line (0 to 100). */
  altitude?: number;
  /** Beam thickness feel. */
  thickness?: "thin" | "medium" | "wide";
  /** Seconds for one breath cycle. */
  speed?: number;
}

const thicknessMap = {
  thin: "h-px",
  medium: "h-0.5",
  wide: "h-1",
} as const;

/** A breathing light beam on a horizon: spare, graphic, Edge-safe. */
export function HorizonBeam({
  className,
  children,
  color = "var(--ds-accent, oklch(0.66 0.13 205))",
  altitude = 58,
  thickness = "medium",
  speed = 9,
  ...props
}: HorizonBeamProps) {
  const y = Math.min(90, Math.max(10, altitude));

  const glow: CSSProperties = {
    background: `linear-gradient(90deg, transparent 0%, ${color} 35%, ${color} 65%, transparent 100%)`,
    boxShadow: `0 0 48px 4px color-mix(in oklab, ${color} 55%, transparent), 0 0 120px 20px color-mix(in oklab, ${color} 22%, transparent)`,
    animationDuration: `${speed}s`,
  };

  const sky: CSSProperties = {
    background: `linear-gradient(180deg, var(--color-background) 0%, color-mix(in oklab, ${color} 12%, var(--color-background)) ${y}%, var(--color-background) 100%)`,
  };

  return (
    <div className={cn("relative isolate overflow-hidden bg-background", className)} {...props}>
      <style href="ds-horizon-beam" precedence="default">
        {HORIZON_CSS}
      </style>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0" style={sky} />
        <div
          className={cn("ds-horizon-beam absolute left-[-10%] w-[120%]", thicknessMap[thickness])}
          style={{ top: `${y}%`, ...glow }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 opacity-40"
          style={{
            background: `linear-gradient(180deg, transparent, color-mix(in oklab, ${color} 8%, transparent))`,
            maskImage: "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
          }}
        />
      </div>
      {children}
    </div>
  );
}
