"use client";

import * as React from "react";
import { Check, Copy, WrapText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { tokenClass, tokenize } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  maxHeight = 520,
  className,
}: {
  code: string;
  language?: string;
  filename?: string;
  maxHeight?: number | null;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [wrap, setWrap] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const tokens = React.useMemo(() => tokenize(code), [code]);
  const lineCount = React.useMemo(() => code.split("\n").length, [code]);
  const collapsible = maxHeight !== null && lineCount > 24;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={cn(
        "bg-muted/40 relative overflow-hidden rounded-xl border",
        className
      )}
    >
      <div className="flex h-10 items-center gap-2 border-b px-3">
        <span className="text-muted-foreground font-mono text-xs">
          {filename ?? language}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setWrap((v) => !v)}
            aria-pressed={wrap}
            aria-label="Toggle line wrapping"
            className={cn(wrap && "bg-accent")}
          >
            <WrapText className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={copy}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>
      </div>

      <div
        className="no-scrollbar overflow-auto"
        style={{
          maxHeight:
            collapsible && !expanded ? maxHeight : (maxHeight ?? undefined),
        }}
      >
        <pre
          className={cn(
            "p-4 font-mono text-[13px] leading-[1.65]",
            wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
          )}
        >
          <code>
            {tokens.map((token, i) => (
              <span key={i} className={tokenClass[token.type]}>
                {token.text}
              </span>
            ))}
          </code>
        </pre>
      </div>

      {collapsible && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex justify-center pt-10 pb-3",
            !expanded &&
              "from-background bg-gradient-to-t via-background/85 to-transparent"
          )}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Collapse" : `Expand ${lineCount} lines`}
          </Button>
        </div>
      )}
    </div>
  );
}
