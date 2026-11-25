"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { ComponentCard } from "@/components/component-card";
import { FolioSectionHead } from "@/components/folio/kit";
import {
  ALL_SECTIONS,
  DEFAULT_SECTION,
  SECTIONS,
  groupChipLabel,
  isSectionId,
  sectionForGroup,
  type SectionDef,
  type SectionId,
} from "@/lib/component-sections";
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

type View = { section: SectionId | typeof ALL_SECTIONS; group: string };
type Bucket = { section: SectionDef; groups: BrowserGroup[] };

const DEFAULT_VIEW: View = { section: DEFAULT_SECTION, group: ALL };

/**
 * Reads ?section= and ?group= from the URL. A known ?group= always wins and
 * selects its umbrella, so older ?group= links keep working. Wrap in
 * <Suspense> (see ComponentsBrowserFallback).
 */
export function ComponentsBrowser({ groups }: { groups: BrowserGroup[] }) {
  const params = useSearchParams();
  const view = resolveView(groups, params.get("section"), params.get("group"));
  return <ComponentsBrowserView groups={groups} view={view} />;
}

/** Server-rendered default view, shown until the URL has been read. */
export function ComponentsBrowserFallback({ groups }: { groups: BrowserGroup[] }) {
  return <ComponentsBrowserView groups={groups} view={resolveView(groups, null, null)} />;
}

function bucketsFor(groups: BrowserGroup[]): Bucket[] {
  return SECTIONS.map((section) => ({
    section,
    groups: groups.filter((g) => sectionForGroup(g.name).id === section.id),
  })).filter((b) => b.groups.length > 0);
}

function resolveView(groups: BrowserGroup[], section: string | null, group: string | null): View {
  const match = groups.find((g) => g.slug === group);
  if (match) return { section: sectionForGroup(match.name).id, group: match.slug };
  if (section === ALL_SECTIONS) return { section: ALL_SECTIONS, group: ALL };
  const buckets = bucketsFor(groups);
  if (isSectionId(section) && buckets.some((b) => b.section.id === section)) return { section, group: ALL };
  if (buckets.some((b) => b.section.id === DEFAULT_SECTION)) return DEFAULT_VIEW;
  return { section: buckets[0]?.section.id ?? DEFAULT_SECTION, group: ALL };
}

function sectionHref(id: SectionId | typeof ALL_SECTIONS) {
  return id === DEFAULT_SECTION ? "/components" : `/components?section=${id}`;
}

function groupHref(section: SectionId, slug: string) {
  return `/components?section=${section}&group=${slug}`;
}

const countItems = (groups: BrowserGroup[]) => groups.reduce((n, g) => n + g.items.length, 0);

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-(--fo-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--fo-paper)";

const scrollRow = "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function ComponentsBrowserView({ groups, view }: { groups: BrowserGroup[]; view: View }) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const navRef = React.useRef<HTMLDivElement>(null);
  const firstRender = React.useRef(true);

  const buckets = bucketsFor(groups);
  const total = countItems(groups);
  const current = view.section === ALL_SECTIONS ? undefined : buckets.find((b) => b.section.id === view.section);

  const primaryTabs = [
    ...buckets.map((b) => ({
      id: b.section.id as View["section"],
      label: b.section.label,
      count: countItems(b.groups),
      href: sectionHref(b.section.id),
    })),
    { id: ALL_SECTIONS as View["section"], label: "All", count: total, href: sectionHref(ALL_SECTIONS) },
  ];

  const subTabs = current
    ? [
        {
          slug: ALL,
          label: `All ${current.section.label}`,
          count: countItems(current.groups),
          href: sectionHref(current.section.id),
        },
        ...current.groups.map((g) => ({
          slug: g.slug,
          label: groupChipLabel(g.name, current.section),
          count: g.items.length,
          href: groupHref(current.section.id, g.slug),
        })),
      ]
    : [];

  const shown: Bucket[] = current
    ? view.group === ALL
      ? [current]
      : [{ section: current.section, groups: current.groups.filter((g) => g.slug === view.group) }]
    : buckets;
  // Big umbrella headings fence sections off in every "all" view.
  const showHeadings = view.group === ALL;
  const viewKey = `${view.section}:${view.group}`;

  React.useEffect(() => {
    // Keep the active tabs visible in the horizontally scrolling rows.
    navRef.current?.querySelectorAll<HTMLUListElement>("ul[data-scroll-row]").forEach((list) => {
      const tab = list.querySelector<HTMLElement>('[aria-current="page"]');
      if (!tab || list.scrollWidth <= list.clientWidth) return;
      const left = tab.offsetLeft - list.clientWidth / 2 + tab.clientWidth / 2;
      list.scrollTo({ left, behavior: firstRender.current ? "auto" : "smooth" });
    });
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // After switching from a stuck bar, bring the new view's top up under
    // the bar instead of leaving the reader mid-page.
    const anchor = anchorRef.current;
    const nav = navRef.current;
    if (!anchor || !nav) return;
    const stickyTop = parseFloat(getComputedStyle(nav).top) || 0;
    const target = anchor.getBoundingClientRect().top + window.scrollY - stickyTop;
    if (window.scrollY > target) window.scrollTo({ top: target });
  }, [viewKey]);

  return (
    <>
      <div ref={anchorRef} aria-hidden />
      <div
        ref={navRef}
        className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-30 -mx-6 border-b border-(--fo-line) bg-(--fo-paper)/95 backdrop-blur md:-mx-10 lg:top-[calc(57px+env(safe-area-inset-top))]"
      >
        <nav aria-label="Library sections">
          <ul data-scroll-row className={cn("flex px-3 md:px-7", scrollRow)}>
            {primaryTabs.map((tab) => {
              const isActive = tab.id === view.section;
              return (
                <li key={tab.id} className="shrink-0">
                  <Link
                    href={tab.href}
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex h-12 items-center gap-2.5 border-b-2 px-3 font-mono text-[12.5px] font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-colors",
                      focusRing,
                      isActive
                        ? "border-b-(--fo-accent) text-(--fo-ink)"
                        : "border-b-transparent text-(--fo-soft) hover:text-(--fo-ink)"
                    )}
                  >
                    {isActive && <span aria-hidden className="size-1.5 bg-(--fo-accent)" />}
                    {tab.label}
                    <span className={cn("text-[11px] tabular-nums", isActive ? "text-(--fo-accent)" : "text-(--fo-faint)")}>
                      {tab.count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {current && (
          <nav aria-label={`${current.section.label} groups`} className="border-t border-(--fo-line)">
            <ul
              data-scroll-row
              className={cn("flex gap-1.5 px-6 py-2.5 md:px-10 lg:flex-wrap lg:overflow-visible", scrollRow)}
            >
              {subTabs.map((tab) => {
                const isActive = tab.slug === view.group;
                return (
                  <li key={tab.slug} className="shrink-0">
                    <Link
                      href={tab.href}
                      scroll={false}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "inline-flex h-8 items-center gap-2 border px-3 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors",
                        focusRing,
                        isActive
                          ? "border-(--fo-accent) bg-(--fo-accent) text-(--fo-on-accent)"
                          : "border-(--fo-line) text-(--fo-soft) hover:bg-(--fo-tint) hover:text-(--fo-ink)"
                      )}
                    >
                      {tab.label}
                      <span className={cn("tabular-nums", isActive ? "opacity-80" : "text-(--fo-faint)")}>{tab.count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      {shown.map((bucket, b) => (
        <section
          key={bucket.section.id}
          id={`section-${bucket.section.id}`}
          aria-labelledby={showHeadings ? `section-${bucket.section.id}-title` : undefined}
          aria-label={showHeadings ? undefined : bucket.section.label}
          className="scroll-mt-40"
        >
          {showHeadings && (
            <UmbrellaHead
              section={bucket.section}
              index={buckets.findIndex((x) => x.section.id === bucket.section.id) + 1}
              groupCount={bucket.groups.length}
              itemCount={countItems(bucket.groups)}
              first={b === 0}
            />
          )}
          {bucket.groups.map((group, g) => (
            <section key={group.slug} id={group.slug} className="scroll-mt-40 pt-12" aria-label={group.name}>
              <FolioSectionHead
                className={g === 0 ? "border-t-0 pt-0" : undefined}
                eyebrow={`${group.name} \u00b7 ${group.items.length}`}
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
        </section>
      ))}
    </>
  );
}

/** Big umbrella opener that fences one umbrella (e.g. all Blocks) off from the next. */
function UmbrellaHead({
  section,
  index,
  groupCount,
  itemCount,
  first,
}: {
  section: SectionDef;
  index: number;
  groupCount: number;
  itemCount: number;
  first: boolean;
}) {
  return (
    <header className={first ? "pt-12" : "pt-28"}>
      <div className="border-t-2 border-(--fo-ink) pt-6">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-(--fo-faint) uppercase">
          <span aria-hidden className="size-2 bg-(--fo-accent)" />
          {`${String(index).padStart(2, "0")} \u00b7 ${groupCount} ${groupCount === 1 ? "group" : "groups"} \u00b7 ${itemCount} items`}
        </p>
        <h2
          id={`section-${section.id}-title`}
          className="mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-none font-normal tracking-[-0.035em]"
        >
          {section.label}
        </h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-(--fo-soft)">
          <span className="text-(--fo-ink)">{section.title}</span> {section.lede}
        </p>
      </div>
    </header>
  );
}
