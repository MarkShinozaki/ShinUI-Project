"use client";

import { PNG_OUTPUTS } from "@/lib/favicon-studio/types";
import { cn } from "@/lib/utils";

interface Props {
  urls: Record<number, string>;
  title: string;
}

function TabMockup({
  dark,
  icon,
  title,
}: {
  dark: boolean;
  icon?: string;
  title: string;
}) {
  const frame = dark
    ? "bg-[#202124] border-[#3c4043]"
    : "bg-[#dee1e6] border-slate-300";
  const tab = dark ? "bg-[#35363a] text-slate-100" : "bg-white text-slate-800";
  const bar = dark ? "bg-[#35363a]" : "bg-white";
  const url = dark
    ? "bg-[#202124] text-slate-400"
    : "bg-[#f1f3f4] text-slate-500";
  return (
    <div className={cn("overflow-hidden rounded-xl border", frame)}>
      <div className="flex items-end gap-1 px-2 pt-2">
        <div className="mr-2 flex gap-1.5 pb-2.5 pl-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div
          className={cn(
            "flex min-w-0 max-w-[220px] flex-1 items-center gap-2 rounded-t-lg px-3 py-2 text-xs",
            tab
          )}
        >
          {icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={icon}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 shrink-0"
            />
          ) : (
            <span className="h-4 w-4" />
          )}
          <span className="truncate">{title || "My Website"}</span>
          <span className="ml-auto opacity-50">×</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-xs opacity-60",
            dark ? "text-slate-300" : "text-slate-600"
          )}
        >
          <span className="h-4 w-4 rounded-full bg-current opacity-30" />
          <span>New Tab</span>
        </div>
      </div>
      <div className={cn("flex items-center gap-2 px-3 py-2", bar)}>
        <div
          className={cn(
            "flex flex-1 items-center gap-2 rounded-full px-3 py-1 text-xs",
            url
          )}
        >
          {icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={icon}
              alt=""
              width={14}
              height={14}
              className="h-3.5 w-3.5"
            />
          )}
          <span>yourwebsite.com</span>
        </div>
      </div>
    </div>
  );
}

export function FaviconPreviews({ urls, title }: Props) {
  const tabIcon = urls[32];
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-[minmax(0,220px)_1fr]">
        <div className="checker-pattern bg-background flex aspect-square items-center justify-center rounded-xl border p-6">
          {urls[512] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={urls[512]}
              alt="Favicon preview"
              className="h-full w-full object-contain drop-shadow-sm"
            />
          )}
        </div>
        <div className="space-y-3">
          <TabMockup dark={false} icon={tabIcon} title={title} />
          <TabMockup dark icon={tabIcon} title={title} />
          <div className="flex items-center gap-4 rounded-xl border bg-gradient-to-br from-sky-100/80 to-violet-100/80 p-3 dark:from-sky-950/40 dark:to-violet-950/40">
            {urls[180] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urls[180]}
                alt=""
                className="h-14 w-14 rounded-[22%] shadow-md"
              />
            )}
            {urls[192] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urls[192]}
                alt=""
                className="h-14 w-14 rounded-full shadow-md"
              />
            )}
            <p className="text-muted-foreground text-xs">
              Home screen previews. iOS rounds corners automatically; Android may
              apply a circular mask.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 flex flex-wrap items-end gap-4 rounded-xl border p-4">
        {PNG_OUTPUTS.map((o) => {
          const display = Math.min(o.size, 72);
          return (
            <div key={o.size} className="flex flex-col items-center gap-1.5">
              <div
                className="checker-pattern bg-background flex items-center justify-center rounded-md border"
                style={{ width: display + 8, height: display + 8 }}
              >
                {urls[o.size] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urls[o.size]}
                    alt={`${o.size}px`}
                    width={display}
                    height={display}
                    className={cn(o.size <= 48 && "favicon-pixelated")}
                  />
                )}
              </div>
              <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
                {o.size}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
