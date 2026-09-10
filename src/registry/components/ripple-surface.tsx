"use client";

import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

export function RippleSurface({
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button">) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const seq = useRef(0);

  const spawn = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const reach = Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y)
      );
      const id = (seq.current += 1);

      setRipples((current) => [...current.slice(-3), { id, x, y, size: reach * 2 }]);

      window.setTimeout(() => {
        setRipples((current) => current.filter((ripple) => ripple.id !== id));
      }, 520);
    },
    [disabled]
  );

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={spawn}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-transform active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-foreground/15 motion-safe:animate-[ripple-bloom_520ms_ease-out_forwards] motion-reduce:opacity-0"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              marginLeft: -ripple.size / 2,
              marginTop: -ripple.size / 2,
            }}
          />
        ))}
      </span>
      <span className="relative">{children}</span>
    </button>
  );
}
