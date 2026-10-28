"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Where a demo is being rendered: a small gallery card or the full detail
 * page preview. Page-sized blocks use it to pick how they lay themselves out.
 */
export type PreviewSurface = "card" | "page";

export const PreviewSurfaceContext = React.createContext<PreviewSurface>("page");

/** Width blocks are laid out at before being scaled down into a card. */
const CARD_DESIGN_WIDTH = 1280;
/** Tallest slice of a block shown in a card, in design pixels. */
const CARD_MAX_DESIGN_HEIGHT = 900;
/** Height of fill-mode previews (canvas / WebGL scenes) in a card. */
const CARD_FILL_HEIGHT = 220;

/**
 * Frame for page-sized blocks and scenes.
 *
 * - On the detail page it is a flex column at least `height` tall, so blocks
 *   that stretch with `flex-1` get the room they were designed for.
 * - In a card, `fit="scale"` lays the block out at desktop width and scales
 *   it down to the card; `fit="fill"` gives it a short, full-width frame.
 */
export function BlockPreview({
  height,
  fit = "scale",
  className,
  children,
}: {
  height: number;
  fit?: "scale" | "fill";
  className?: string;
  children: React.ReactNode;
}) {
  const surface = React.useContext(PreviewSurfaceContext);

  if (surface === "page") {
    return (
      <div className={cn("flex w-full flex-col", className)} style={{ minHeight: height }}>
        {children}
      </div>
    );
  }

  if (fit === "fill") {
    return (
      <div
        className={cn("flex w-full flex-col overflow-hidden", className)}
        style={{ height: CARD_FILL_HEIGHT }}
      >
        {children}
      </div>
    );
  }

  return (
    <ScaledFrame height={Math.min(height, CARD_MAX_DESIGN_HEIGHT)} className={className}>
      {children}
    </ScaledFrame>
  );
}

function ScaledFrame({
  height,
  className,
  children,
}: {
  height: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / CARD_DESIGN_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: height * scale }}
    >
      {scale > 0 && (
        <div
          className="absolute top-0 left-0 flex flex-col"
          style={{
            width: CARD_DESIGN_WIDTH,
            height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Mounts its children only while they are on (or near) the screen, so a grid
 * of animated or WebGL previews doesn't run them all at once.
 */
export function LazyMount({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible ? children : null}
    </div>
  );
}
