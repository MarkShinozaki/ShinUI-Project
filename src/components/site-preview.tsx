"use client";

import * as React from "react";
import { ExternalLink, Monitor, Play, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, hostnameOf } from "@/lib/utils";

/**
 * Embeds the resource's own site in an iframe. Many sites send
 * X-Frame-Options or a frame-ancestors CSP, and the browser gives us no
 * reliable event when that happens — so the frame is opt-in and always sits
 * next to an "open in a new tab" escape hatch.
 */
export function SitePreview({ url, name }: { url: string; name: string }) {
  const [loaded, setLoaded] = React.useState(false);
  const [device, setDevice] = React.useState<"desktop" | "mobile">("desktop");

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Live site</h2>
        <div className="ml-auto flex items-center gap-1">
          <div className="bg-card inline-flex rounded-lg border p-0.5">
            {(
              [
                { id: "desktop", label: "Desktop", Icon: Monitor },
                { id: "mobile", label: "Mobile", Icon: Smartphone },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDevice(option.id)}
                aria-pressed={device === option.id}
                aria-label={option.label}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  device === option.id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <option.Icon className="size-3.5" />
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              Open
              <ExternalLink className="size-3" />
            </a>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="bg-muted/50 flex h-9 items-center gap-2 border-b px-3">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="bg-background text-muted-foreground mx-auto max-w-[60%] truncate rounded px-2.5 py-0.5 font-mono text-[11px]">
            {hostnameOf(url)}
          </span>
        </div>

        <div className="checker-pattern flex justify-center p-3 sm:p-5">
          <div
            className="w-full transition-[max-width] duration-300"
            style={{ maxWidth: device === "mobile" ? 390 : undefined }}
          >
            {loaded ? (
              <iframe
                src={url}
                title={`${name} preview`}
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                className="bg-background h-[420px] w-full rounded-lg border sm:h-[560px]"
              />
            ) : (
              <div className="bg-background grid h-[280px] w-full place-items-center rounded-lg border px-6 text-center sm:h-[360px]">
                <div>
                  <p className="font-medium">Preview {name} inline</p>
                  <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
                    Loads the real site in a frame. Some sites block embedding —
                    if it comes up blank, use Open instead.
                  </p>
                  <Button onClick={() => setLoaded(true)} className="mt-4">
                    <Play className="size-4" />
                    Load preview
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
