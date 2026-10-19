"use client";

import { useRef, useState, type DragEvent } from "react";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ACCEPT_ATTR } from "@/lib/favicon-studio/load";
import type { SourceImage } from "@/lib/favicon-studio/types";
import { cn } from "@/lib/utils";

interface Props {
  image: SourceImage | null;
  onFile: (file: File) => void;
  onClear: () => void;
  title: string;
  hint: string;
  compact?: boolean;
}

export function FaviconDropzone({
  image,
  onFile,
  onClear,
  title,
  hint,
  compact,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
      onClick={() => input.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && input.current?.click()
      }
      className={cn(
        "group relative flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed transition",
        compact ? "p-3" : "p-5",
        over
          ? "border-brand bg-brand/5"
          : "border-border bg-muted/40 hover:border-brand/40 hover:bg-muted/60"
      )}
    >
      <input
        ref={input}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      {image ? (
        <>
          <div
            className={cn(
              "checker-pattern bg-background shrink-0 overflow-hidden rounded-lg border",
              compact ? "h-12 w-12" : "h-16 w-16"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{image.name}</p>
            <p className="text-muted-foreground text-xs">
              {image.width}×{image.height} ·{" "}
              {image.type.replace("image/", "").replace("+xml", "").toUpperCase()}{" "}
              · click or drop to replace
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-muted-foreground hover:text-destructive shrink-0"
          >
            <X className="size-4" />
            Remove
          </Button>
        </>
      ) : (
        <>
          <div
            className={cn(
              "text-brand bg-background flex shrink-0 items-center justify-center rounded-lg shadow-sm ring-1 ring-border",
              compact ? "h-10 w-10" : "h-14 w-14"
            )}
          >
            <Upload className={compact ? "size-5" : "size-6"} />
          </div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-muted-foreground text-xs">{hint}</p>
          </div>
        </>
      )}
    </div>
  );
}
