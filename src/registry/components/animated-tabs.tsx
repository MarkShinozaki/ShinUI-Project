"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function AnimatedTabs({
  tabs,
  defaultValue,
  className,
}: {
  tabs: { value: string; label: string }[];
  defaultValue?: string;
  className?: string;
}) {
  const [active, setActive] = React.useState(defaultValue ?? tabs[0]?.value);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });

  React.useLayoutEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-value="${active}"]`);
    if (!list || !el) return;
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [active]);

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn(
        "relative inline-flex items-center rounded-lg bg-muted p-1",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute top-1 bottom-1 rounded-md bg-background shadow-sm transition-all duration-300 ease-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          data-value={tab.value}
          aria-selected={active === tab.value}
          onClick={() => setActive(tab.value)}
          className={cn(
            "relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            active === tab.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
