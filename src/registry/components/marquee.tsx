"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
  speed = 28,
  reverse = false,
  pauseOnHover = true,
  fade = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Seconds for one full pass. */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  fade?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className
      )}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            "flex shrink-0 items-center gap-6 pr-6",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            "motion-reduce:animate-none"
          )}
          style={{
            animation: `shinui-marquee ${speed}s linear infinite`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
      <style>{`
        @keyframes shinui-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
