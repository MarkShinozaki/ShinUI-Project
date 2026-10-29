"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ComponentCard } from "@/components/component-card";
import { FolioSectionHead } from "@/components/folio/kit";
import type { RegistryItem } from "@/registry";
import { cn } from "@/lib/utils";

export type BrowserGroup = {
  name: string;
  slug: string;
  title: string;
  lede?: string;
  items: RegistryItem[];
};

const ALL = "all";

/** Reads ?group= from the URL. Wrap in <Suspense> (see ComponentsBrowserFallback). */
export function ComponentsBrowser({ groups }: { groups: BrowserGroup[] }) {
  const params = useSearchParams();
  const requested = params.get("group");
  const active = groups.some((g) => g.slug === requested) ? requested! : ALL;
  return <ComponentsBrowserView groups={groups} active={active} />;
}

/** Server-rendered "All" view, shown until the URL has been read. */
export function ComponentsBrowserFallback({ groups }: { groups: BrowserGroup[] }) {
  return <ComponentsBrowserView groups={groups} active={ALL} />;
}

function ComponentsBrowserView({ groups, active }: { groups: BrowserGroup[]; active: string }) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const navRef = React.useRef<HTMLDivElement>(null);
  const tabsRef = React.useRef<HTMLUListElement>(null);
  const firstRender = React.useRef(true);

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const tabs = [{ slug: ALL, name: "All", count: total }, ...groups.map((g) => ({ slug: g.slug, name: g.name, count: g.items.length }))];
  const shown = active === ALL ? groups : groups.filter((g) => g.slug === active);

  React.useEffect(() => {
    // Keep the active tab visible in the horizontally scrolling bar.
    const list = tabsRef.current;
    const tab = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (list && tab) {
      const left = tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2;
      list.scrollTo({ left, behavior: firstRender.current ? "auto" : "smooth" });
    }
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // After switching sections from a stuck bar, bring the new section's top
    // up under the bar instead of leaving the reader mid-page.
    const anchor = anchorRef.current;
    const nav = navRef.current;
    if (!anchor || !nav) return;
    const stickyTop = parseFloat(getComputedStyle(nav).top) || 0;
    const target = anchor.getBoundingClientRect().top + window.scrollY - stickyTop;
    if (window.scrollY > target) window.scrollTo({ top: target });
  }, [active]);

  return (
    <>
      <div ref={anchorRef} aria-hidden />
      <div
        ref={navRef}
        className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-6 mt-8 border-y border-(--fo-line) bg-(--fo-paper)/95 backdrop-blur md:-mx-10 lg:top-[calc(57px+env(safe-area-inset-top))]"
      >
        <nav aria-label="Component sections">
          <ul
            ref={tabsRef}
            className="flex gap-1.5 overflow-x-auto px-6 py-2.5 lg:flex-wrap lg:overflow-visible [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const isActive = tab.slug === active;
              return (
                <li key={tab.slug} className="shrink-0">
                  <Link
                    href={tab.slug === ALL ? "/components" : `/components?group=${tab.slug}`}
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex h-8 items-center gap-2 border px-3 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-(--fo-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--fo-paper)",
                      isActive
                        ? "border-(--fo-accent) bg-(--fo-accent) text-(--fo-on-accent)"
                        : "border-(--fo-line) text-(--fo-soft) hover:bg-(--fo-tint) hover:text-(--fo-ink)"
                    )}
                  >
                    {tab.name}
                    <span className={cn("tabular-nums", isActive ? "opacity-80" : "text-(--fo-faint)")}>{tab.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {shown.map((group, g) => (
        <section key={group.slug} id={group.slug} className="scroll-mt-32 pt-12" aria-label={group.name}>
          <FolioSectionHead
            className={g === 0 ? "border-t-0 pt-0" : undefined}
            eyebrow={`${group.name} · ${group.items.length}`}
            title={group.title}
            lede={group.lede}
          />
          <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item, i) => (
              <li key={item.slug} className="flex min-w-0">
                <ComponentCard item={item} index={i} />
              </li>
            ))}
          </ol>
        </section>
      ))}
    </>
  );
}
