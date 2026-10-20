import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Grid Frame (ported from Design Studio `src/blocks/grid-frame.tsx`), recoloured with the
 * folio sakura tokens. A centred container framed by two vertical rails, with hairline
 * rules that run edge to edge and plus markers wherever lines meet. Lines are opaque mixes
 * of ink and paper so overlapping borders never double up.
 */

export type GridMarkerKind = "plus" | "square" | "none";

const GridContext = React.createContext<{ marker: GridMarkerKind }>({ marker: "plus" });

const VARS = {
  "--gf-accent": "var(--fo-accent)",
  "--gf-line": "color-mix(in oklab, var(--fo-ink) 11%, var(--fo-paper))",
  "--gf-cross": "color-mix(in oklab, var(--fo-ink) 38%, var(--fo-paper))",
  "--gf-tint": "color-mix(in oklab, var(--fo-accent) 7%, var(--fo-paper))",
} as React.CSSProperties;

export interface GridSectionProps extends Omit<React.ComponentProps<"section">, "children"> {
  children?: React.ReactNode;
  /** Which full-bleed rules to draw. */
  edges?: "both" | "top" | "bottom" | "none";
  marker?: GridMarkerKind;
  innerClassName?: string;
}

/** A centred container with vertical rails and full-bleed hairline rules. */
export function GridSection({
  children,
  edges = "both",
  marker = "plus",
  className,
  innerClassName,
  style,
  ...props
}: GridSectionProps) {
  return (
    <GridContext.Provider value={{ marker }}>
      <section
        className={cn("relative overflow-x-clip text-(--fo-ink)", className)}
        style={{ ...VARS, ...style }}
        {...props}
      >
        <div
          className={cn(
            "relative mx-auto flex w-full max-w-6xl flex-col border-x border-(--gf-line) bg-(--fo-paper)",
            innerClassName
          )}
        >
          {(edges === "both" || edges === "top") && <GridRule />}
          {children}
          {(edges === "both" || edges === "bottom") && <GridRule />}
        </div>
      </section>
    </GridContext.Provider>
  );
}

/** A marker centred on a point; x and y are CSS lengths inside the parent. */
export function GridMarker({ x, y, kind }: { x: string; y: string; kind?: GridMarkerKind }) {
  const settings = React.useContext(GridContext);
  const shape = kind ?? settings.marker;
  if (shape === "none") return null;
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-20 size-[11px]"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      {shape === "plus" ? (
        <>
          <span className="absolute top-0 left-[5px] h-full w-px bg-(--gf-cross)" />
          <span className="absolute top-[5px] left-0 h-px w-full bg-(--gf-cross)" />
        </>
      ) : (
        <span className="absolute inset-[2px] border border-(--gf-cross) bg-(--fo-paper)" />
      )}
    </span>
  );
}

/** A full-bleed horizontal hairline with markers where it crosses the rails. */
export function GridRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative h-px shrink-0 bg-(--gf-line)", className)}>
      <span className="absolute top-0 right-full h-px w-screen bg-(--gf-line)" />
      <span className="absolute top-0 left-full h-px w-screen bg-(--gf-line)" />
      <GridMarker x="-0.5px" y="0.5px" />
      <GridMarker x="calc(100% + 0.5px)" y="0.5px" />
    </div>
  );
}

/** Divider cell edge with markers where it meets the rules above and below. */
export function GridEdge({ side = "right" }: { side?: "left" | "right" }) {
  const x = side === "right" ? "calc(100% - 0.5px)" : "-0.5px";
  return (
    <>
      <GridMarker x={x} y="-0.5px" />
      <GridMarker x={x} y="calc(100% + 0.5px)" />
    </>
  );
}
