"use client";

// Generated from Design Studio's gallery previews (default props).
import { Badge } from "@/registry/components/badge";
import { Button } from "@/registry/components/button";
import { MarqueeChip } from "@/registry/components/marquee-chip";

export function ButtonDemo() {
  const props = { children: "Get started", variant: "primary", size: "md", disabled: false } as const
  return (
    <Button {...props} />
  )
}

export function BadgeDemo() {
  const props = { children: "Live", variant: "success", size: "md", dot: true, pulse: true } as const
  return (
    <Badge {...props} />
  )
}

export function MarqueeChipDemo() {
  const props = { label: "Original", mark: "01", tone: "signal" } as const
  return (
    <MarqueeChip {...props} />
  )
}
