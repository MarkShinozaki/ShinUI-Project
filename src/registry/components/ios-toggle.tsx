"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function IosToggle({
  defaultChecked = false,
  label,
  onCheckedChange,
}: {
  defaultChecked?: boolean;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
}) {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => {
          setChecked((v) => {
            onCheckedChange?.(!v);
            return !v;
          });
        }}
        className={cn(
          "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-300 ease-out",
          "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
          checked ? "bg-[#34C759]" : "bg-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] left-[2px] size-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)]",
            "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            checked ? "translate-x-[20px]" : "translate-x-0"
          )}
        />
      </button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
