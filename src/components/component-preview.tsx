"use client";

import * as React from "react";
import { Code2, Eye, Monitor, RotateCw, Smartphone, Tablet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { RegistryDemo } from "@/registry/demo-map";
import { cn } from "@/lib/utils";

const viewports = [
  { id: "phone", label: "Phone", width: 390, Icon: Smartphone },
  { id: "tablet", label: "Tablet", width: 768, Icon: Tablet },
  { id: "full", label: "Full width", width: null, Icon: Monitor },
] as const;

type ViewportId = (typeof viewports)[number]["id"];

export function ComponentPreview({
  demoName,
  code,
  filename,
  previewClassName,
  align = "center",
}: {
  demoName: string;
  code: string | null;
  filename: string;
  previewClassName?: string;
  align?: "center" | "start";
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [viewport, setViewport] = React.useState<ViewportId>("full");
  const [replayKey, setReplayKey] = React.useState(0);

  const width = viewports.find((v) => v.id === viewport)?.width ?? null;

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="bg-muted/40 flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <div className="bg-background inline-flex rounded-lg border p-0.5">
          {(
            [
              { id: "preview", label: "Preview", Icon: Eye },
              { id: "code", label: "Code", Icon: Code2 },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                tab === item.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.Icon className="size-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          {tab === "preview" && (
            <>
              <div className="bg-background hidden rounded-lg border p-0.5 sm:inline-flex">
                {viewports.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setViewport(item.id)}
                    title={item.label}
                    aria-label={item.label}
                    aria-pressed={viewport === item.id}
                    className={cn(
                      "rounded-md p-1.5 transition-colors",
                      viewport === item.id
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.Icon className="size-3.5" />
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setReplayKey((k) => k + 1)}
                aria-label="Replay animation"
              >
                <RotateCw className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {tab === "preview" ? (
        <div className="checker-pattern flex justify-center overflow-auto p-4 sm:p-8">
          <div
            className={cn(
              "bg-background flex min-h-56 w-full items-center rounded-lg border p-6 transition-[max-width] duration-300",
              align === "center" ? "justify-center" : "justify-start",
              previewClassName
            )}
            style={{ maxWidth: width ?? undefined }}
          >
            <div key={replayKey} className="w-full">
              <div
                className={cn(
                  "flex w-full",
                  align === "center" ? "justify-center" : "justify-start"
                )}
              >
                <RegistryDemo name={demoName} />
              </div>
            </div>
          </div>
        </div>
      ) : code ? (
        <CodeBlock
          code={code}
          filename={filename}
          className="rounded-none border-0"
        />
      ) : (
        <p className="text-muted-foreground p-6 text-sm">
          Source unavailable for this component.
        </p>
      )}
    </div>
  );
}
