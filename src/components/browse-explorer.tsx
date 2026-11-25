"use client";

import * as React from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";

import { AddResourceDialog } from "@/components/add-resource-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ResourceCard } from "@/components/resource-card";
import { CategoryIcon } from "@/components/category-icon";
import { useSavedItems } from "@/components/save-button";
import { categories } from "@/data/categories";
import type { Pricing, Resource } from "@/data/types";
import { isSaved } from "@/lib/saved-items";
import {
  getServerUserResourcesSnapshot,
  getUserResourcesSnapshot,
  mergeBrowsableResources,
  subscribeUserResources,
} from "@/lib/user-resources";
import { cn } from "@/lib/utils";

const pricingOptions: { value: Pricing; label: string }[] = [
  { value: "open-source", label: "Open source" },
  { value: "free", label: "Free" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
  { value: "unknown", label: "Unknown" },
];

type Sort = "featured" | "saved" | "name" | "newest";

const MAX_TAG_CHIPS = 22;

export function BrowseExplorer({
  resources,
  initialCategory,
  lockCategory = false,
}: {
  resources: Resource[];
  initialCategory?: string;
  lockCategory?: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [activeCategories, setActiveCategories] = React.useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [activePricing, setActivePricing] = React.useState<Pricing[]>([]);
  const [activeTags, setActiveTags] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<Sort>("newest");
  const [savedOnly, setSavedOnly] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [activeSection, setActiveSection] = React.useState<string | null>(
    initialCategory ?? null
  );

  const userResources = React.useSyncExternalStore(
    subscribeUserResources,
    getUserResourcesSnapshot,
    getServerUserResourcesSnapshot
  );
  const saved = useSavedItems();

  const allResources = React.useMemo(() => {
    void refreshKey;
    return mergeBrowsableResources(resources);
  }, [resources, userResources, refreshKey]);

  const availableCategories = React.useMemo(
    () =>
      categories.filter((c) => allResources.some((r) => r.category === c.slug)),
    [allResources]
  );

  function toggle<T>(list: T[], value: T, set: (next: T[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = allResources.filter((resource) => {
      if (savedOnly && !isSaved("resource", resource.slug)) {
        return false;
      }
      if (
        activeCategories.length > 0 &&
        !activeCategories.includes(resource.category)
      ) {
        return false;
      }
      if (
        activePricing.length > 0 &&
        !activePricing.includes(resource.pricing)
      ) {
        return false;
      }
      if (
        activeTags.length > 0 &&
        !activeTags.every((tag) => resource.tags.includes(tag))
      ) {
        return false;
      }
      if (!q) return true;

      const haystack = [
        resource.name,
        resource.tagline,
        resource.description,
        resource.notes ?? "",
        ...resource.tags,
        ...resource.stack,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });

    return result.sort((a, b) => {
      if (sort === "saved") {
        const aSaved = isSaved("resource", a.slug);
        const bSaved = isSaved("resource", b.slug);
        if (aSaved !== bSaved) return aSaved ? -1 : 1;
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.name.localeCompare(b.name);
      }
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "newest") return b.addedAt.localeCompare(a.addedAt);
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [
    allResources,
    query,
    activeCategories,
    activePricing,
    activeTags,
    sort,
    savedOnly,
    saved,
  ]);

  const sections = React.useMemo(() => {
    return availableCategories
      .map((category) => ({
        category,
        items: filtered.filter((r) => r.category === category.slug),
      }))
      .filter((section) => section.items.length > 0);
  }, [availableCategories, filtered]);

  const tagCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const resource of filtered) {
      for (const tag of resource.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [filtered]);

  const visibleTags = React.useMemo(() => {
    const top = tagCounts.slice(0, MAX_TAG_CHIPS).map(([tag]) => tag);
    const extra = activeTags.filter((tag) => !top.includes(tag));
    return [...extra, ...top];
  }, [tagCounts, activeTags]);

  const categoryTotals = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const resource of allResources) {
      counts.set(resource.category, (counts.get(resource.category) ?? 0) + 1);
    }
    return counts;
  }, [allResources]);

  const filterCount =
    (lockCategory ? 0 : activeCategories.length) +
    activePricing.length +
    activeTags.length +
    (savedOnly ? 1 : 0);

  const userCount = allResources.filter((r) => r.userSubmitted).length;

  function clearAll() {
    setActiveCategories(lockCategory && initialCategory ? [initialCategory] : []);
    setActivePricing([]);
    setActiveTags([]);
    setQuery("");
    setSavedOnly(false);
  }

  function scrollToCategory(slug: string) {
    const node = document.getElementById(`category-${slug}`);
    if (!node) return;
    setActiveSection(slug);
    node.scrollIntoView({ behavior: "smooth", block: "start" });
    const url = new URL(window.location.href);
    url.hash = slug;
    window.history.replaceState(null, "", url);
  }

  React.useEffect(() => {
    if (lockCategory) return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const frame = window.requestAnimationFrame(() => {
      const node = document.getElementById(`category-${hash}`);
      if (node) {
        setActiveSection(hash);
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [lockCategory, sections.length]);

  React.useEffect(() => {
    if (lockCategory || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target instanceof HTMLElement) {
          const slug = visible[0].target.dataset.slug;
          if (slug) setActiveSection(slug);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5] }
    );

    for (const { category } of sections) {
      const node = document.getElementById(`category-${category.slug}`);
      if (node) observer.observe(node);
    }

    return () => observer.disconnect();
  }, [lockCategory, sections]);

  const filterPanel = (
    <div className="space-y-6">
      {!lockCategory && (
        <FilterGroup title="Category">
          <div className="flex flex-col gap-0.5">
            {availableCategories.map((category) => {
              const active = activeCategories.includes(category.slug);
              const count = categoryTotals.get(category.slug) ?? 0;
              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() =>
                    toggle(activeCategories, category.slug, setActiveCategories)
                  }
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-colors",
                    active
                      ? "bg-(--fo-tint) font-medium text-(--fo-ink)"
                      : "text-(--fo-soft) hover:bg-(--fo-tint) hover:text-(--fo-ink)"
                  )}
                >
                  <CategoryIcon name={category.icon} className="size-4 shrink-0" />
                  <span className="truncate">{category.short}</span>
                  <span className="ml-auto font-mono text-[10.5px] text-(--fo-faint) tabular-nums">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Pricing">
        <div className="flex flex-wrap gap-1.5">
          {pricingOptions.map((option) => (
            <FilterChip
              key={option.value}
              active={activePricing.includes(option.value)}
              onClick={() =>
                toggle(activePricing, option.value, setActivePricing)
              }
            >
              {option.label}
            </FilterChip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Saved">
        <FilterChip active={savedOnly} onClick={() => setSavedOnly((v) => !v)}>
          Saved only
        </FilterChip>
      </FilterGroup>

      {filterCount > 0 && (
        <Button variant="outline" size="sm" onClick={clearAll} className="w-full">
          <X className="size-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  );

  const jumpNav = !lockCategory && (
    <nav aria-label="Resource categories" className="space-y-0.5">
      <p className="mb-3 font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase">
        Jump to
      </p>
      {sections.length === 0 ? (
        <p className="text-[12.5px] text-(--fo-faint)">No categories match.</p>
      ) : (
        sections.map(({ category, items }) => {
          const active = activeSection === category.slug;
          return (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToCategory(category.slug);
              }}
              className={cn(
                "flex items-center gap-2 border-l px-2 py-1.5 text-left text-[13px] transition-colors",
                active
                  ? "border-(--fo-accent) bg-(--fo-tint) font-medium text-(--fo-ink)"
                  : "border-transparent text-(--fo-soft) hover:border-(--fo-line-strong) hover:text-(--fo-ink)"
              )}
            >
              <CategoryIcon name={category.icon} className="size-3.5 shrink-0" />
              <span className="min-w-0 truncate">{category.short}</span>
              <span className="ml-auto font-mono text-[10.5px] text-(--fo-faint) tabular-nums">
                {items.length}
              </span>
            </a>
          );
        })
      )}
    </nav>
  );

  return (
    <div
      className={cn(
        !lockCategory && "lg:grid lg:grid-cols-[220px_1fr] lg:gap-10"
      )}
    >
      {!lockCategory && (
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
            {jumpNav}
            <div className="mt-8 border-t border-dashed border-(--fo-line-strong) pt-6">
              {filterPanel}
            </div>
          </div>
        </aside>
      )}

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-(--fo-faint)" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, description or tag…"
              className="h-10 pl-9"
              type="search"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AddResourceDialog onAdded={() => setRefreshKey((k) => k + 1)} />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10 lg:hidden">
                  <SlidersHorizontal className="size-4" />
                  Filters
                  {filterCount > 0 && (
                    <Badge variant="brand" className="ml-1">
                      {filterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto px-4 pb-8">
                  {!lockCategory && <div className="mb-6">{jumpNav}</div>}
                  {filterPanel}
                </div>
              </SheetContent>
            </Sheet>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort results"
              className="h-10 min-w-0 max-w-full border border-(--fo-line) bg-(--fo-paper) px-3 text-sm text-(--fo-ink) outline-none"
            >
              <option value="newest">Newest</option>
              <option value="featured">Featured first</option>
              <option value="saved">Saved first</option>
              <option value="name">A–Z</option>
            </select>
          </div>
        </div>

        {visibleTags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase">
              Tags
            </span>
            {visibleTags.map((tag) => (
              <FilterChip
                key={tag}
                active={activeTags.includes(tag)}
                onClick={() => toggle(activeTags, tag, setActiveTags)}
              >
                {tag}
              </FilterChip>
            ))}
          </div>
        )}

        {!lockCategory && sections.length > 0 && (
          <div className="sticky top-16 z-10 -mx-6 mt-4 border-y border-(--fo-line) bg-(--fo-paper)/90 px-6 py-2 backdrop-blur-md lg:hidden">
            <div className="-mx-1 flex gap-1 overflow-x-auto">
              {sections.map(({ category, items }) => {
                const active = activeSection === category.slug;
                return (
                  <a
                    key={category.slug}
                    href={`#${category.slug}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToCategory(category.slug);
                    }}
                    className={cn(
                      "shrink-0 border px-2 py-1 font-mono text-[10.5px] tracking-[0.08em] uppercase transition-colors",
                      active
                        ? "border-(--fo-accent) bg-(--fo-accent) text-(--fo-on-accent)"
                        : "border-(--fo-line) text-(--fo-soft) hover:border-(--fo-accent) hover:text-(--fo-ink)"
                    )}
                  >
                    {category.short}
                    <span className="ml-1 tabular-nums opacity-70">{items.length}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-(--fo-soft)">
          <p>
            <span className="font-medium text-(--fo-ink) tabular-nums">
              {filtered.length}
            </span>{" "}
            {filtered.length === 1 ? "resource" : "resources"}
            {!lockCategory && (
              <>
                {" "}
                across{" "}
                <span className="font-medium text-(--fo-ink) tabular-nums">
                  {sections.length}
                </span>{" "}
                {sections.length === 1 ? "category" : "categories"}
              </>
            )}
            {userCount > 0 && (
              <span className="ml-2">
                · <span className="font-medium text-(--fo-ink)">{userCount}</span>{" "}
                added by you
              </span>
            )}
          </p>
          <p className="text-xs text-(--fo-faint)">
            Bookmark sites — saved only in your browser on this device
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-5 border border-dashed border-(--fo-line) py-16 text-center">
            <p className="font-medium">No matches</p>
            <p className="mt-1 text-sm text-(--fo-soft)">
              Try a broader search or clear a filter.
            </p>
            <Button variant="outline" size="sm" onClick={clearAll} className="mt-4">
              Reset
            </Button>
          </div>
        ) : lockCategory ? (
          <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((resource) => (
              <li key={resource.slug} className="flex min-w-0">
                <ResourceCard resource={resource} className="w-full" />
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-8 space-y-12">
            {sections.map(({ category, items }) => (
              <section
                key={category.slug}
                id={`category-${category.slug}`}
                data-slug={category.slug}
                className="scroll-mt-32"
              >
                <div className="mb-4 flex items-end justify-between gap-3 border-b border-(--fo-line) pb-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center border border-(--fo-line) bg-(--fo-well) text-(--fo-accent)">
                      <CategoryIcon name={category.icon} className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-[17px] leading-tight font-medium tracking-[-0.01em]">
                        {category.name}
                      </h2>
                      <p className="mt-0.5 hidden truncate text-[12.5px] text-(--fo-faint) sm:block">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase tabular-nums">
                    {items.length} {items.length === 1 ? "resource" : "resources"}
                  </p>
                </div>
                <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((resource) => (
                    <li key={resource.slug} className="flex min-w-0">
                      <ResourceCard resource={resource} className="w-full" />
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border border-(--fo-line) px-2 py-0.5 font-mono text-[11px] transition-colors",
        active
          ? "border-(--fo-accent) bg-(--fo-accent) text-(--fo-on-accent)"
          : "text-(--fo-soft) hover:bg-(--fo-tint) hover:text-(--fo-ink)"
      )}
    >
      {children}
    </button>
  );
}
