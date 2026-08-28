"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * iOS-style segmented control. Unlike a tab list the thumb is dragged by the
 * layout itself, so the selection reads as one physical object moving.
 */
export function SegmentedControl({
  options,
  defaultValue,
  onValueChange,
  className,
}: {
  options: { value: string; label: string; icon?: React.ReactNode }[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}) {
  const [value, setValue] = React.useState(defaultValue ?? options[0]?.value);
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  return (
    <div
      role="radiogroup"
      className={cn(
        "relative inline-grid rounded-[10px] bg-muted p-[3px]",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}
    >
      <span
        aria-hidden
        className="absolute inset-y-[3px] rounded-[7px] bg-background shadow-sm transition-transform duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          width: `calc((100% - 6px) / ${options.length})`,
          transform: `translateX(calc(${index} * 100%))`,
          left: 3,
        }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => {
            setValue(option.value);
            onValueChange?.(option.value);
          }}
          className={cn(
            "relative z-10 flex items-center justify-center gap-1.5 rounded-[7px] px-3 py-1.5 text-sm font-medium transition-colors [&_svg]:size-4",
            value === option.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
