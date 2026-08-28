"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type DockProps = {
  items: { id: string; label: string; icon: React.ReactNode }[];
  className?: string;
  /** Pixel radius over which neighbouring icons are affected. */
  falloff?: number;
  magnification?: number;
};

export function Dock({
  items,
  className,
  falloff = 110,
  magnification = 26,
}: DockProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = React.useState<number | null>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) setMouseX(e.clientX - rect.left);
      }}
      onMouseLeave={() => setMouseX(null)}
      className={cn(
        "mx-auto flex h-16 items-end gap-2 rounded-2xl border bg-card/70 px-3 pb-2 backdrop-blur-xl",
        className
      )}
    >
      {items.map((item, index) => (
        <DockIcon
          key={item.id}
          item={item}
          index={index}
          mouseX={mouseX}
          falloff={falloff}
          magnification={magnification}
        />
      ))}
    </div>
  );
}

function DockIcon({
  item,
  mouseX,
  falloff,
  magnification,
}: {
  item: DockProps["items"][number];
  index: number;
  mouseX: number | null;
  falloff: number;
  magnification: number;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const base = 40;

  // The resting centre is measured once so the render pass never reads a ref.
  const [center, setCenter] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => setCenter(el.offsetLeft + base / 2);
    measure();

    const observer = new ResizeObserver(measure);
    if (el.parentElement) observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, []);

  let scale = 0;
  if (mouseX !== null && center !== null) {
    const distance = Math.abs(mouseX - center);
    // Cosine falloff reads closer to the macOS dock than a linear ramp.
    scale =
      distance > falloff
        ? 0
        : (Math.cos((distance / falloff) * Math.PI) + 1) / 2;
  }

  const size = base + scale * magnification;

  return (
    <button
      ref={ref}
      type="button"
      title={item.label}
      className="group relative flex shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground transition-colors hover:text-foreground"
      style={{
        width: size,
        height: size,
        transition: mouseX === null ? "width 200ms, height 200ms" : undefined,
      }}
    >
      <span className="[&_svg]:size-1/2 flex size-full items-center justify-center">
        {item.icon}
      </span>
      <span className="pointer-events-none absolute -top-9 rounded-md bg-primary px-2 py-1 text-xs whitespace-nowrap text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
        {item.label}
      </span>
    </button>
  );
}
