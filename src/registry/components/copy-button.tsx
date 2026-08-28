"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium transition-colors",
        "hover:bg-muted focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="size-4 text-emerald-500" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-4" />
          {label}
        </>
      )}
    </button>
  );
}
