"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/** Folio command well (ported from Design Studio): hatched, mono, with a copy button. */
export function FolioCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className={cn(
        "fo-hatch flex h-9 min-w-0 items-stretch bg-(--fo-well) font-mono text-[11px] tracking-[0.08em] uppercase",
        className
      )}
    >
      <span className="flex min-w-0 flex-1 items-center truncate px-3">{command}</span>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(command).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="grid w-9 cursor-pointer place-items-center border-l border-(--fo-line) text-(--fo-soft) transition-colors hover:text-(--fo-ink)"
        aria-label={copied ? "Copied" : "Copy command"}
      >
        {copied ? (
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
            <path d="M3 8.5l3 3 7-7" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
            <rect x="5" y="5" width="8.5" height="8.5" />
            <path d="M3 10.5V2.5h8" />
          </svg>
        )}
      </button>
    </div>
  );
}
