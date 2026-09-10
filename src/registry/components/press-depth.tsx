"use client";

import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function PressDepth({
  className,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button">) {
  const [pressed, setPressed] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const pointerId = useRef<number | null>(null);

  const release = useCallback(() => {
    pointerId.current = null;
    setPressed(false);
    setOrigin(null);
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const rect = event.currentTarget.getBoundingClientRect();
      pointerId.current = event.pointerId;
      event.currentTarget.setPointerCapture(event.pointerId);
      setPressed(true);
      setOrigin({
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      });
    },
    [disabled]
  );

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={onPointerDown}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onBlur={release}
      style={
        pressed && origin
          ? ({ transformOrigin: `${origin.x}% ${origin.y}%` } as React.CSSProperties)
          : undefined
      }
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-[transform,box-shadow] duration-150 ease-out",
        "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
        pressed && "scale-[0.96] shadow-inner",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
