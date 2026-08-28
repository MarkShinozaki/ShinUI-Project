"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Package, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { CatalogItem } from "@/lib/registry-catalog";
import { cn } from "@/lib/utils";

type SourceMeta = {
  id: string;
  name: string;
  count: number;
  ok: boolean;
};

export function ComponentsCatalog({
  items,
  sources,
}: {
  items: CatalogItem[];
  sources: SourceMeta[];
}) {
  const [query, setQuery] = React.useState("");
  const [sourceId, setSourceId] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (sourceId !== "all" && item.sourceId !== sourceId) return false;
      if (!q) return true;
      return (
        item.name.includes(q) ||
        item.displayName.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );
    });
  }, [items, query, sourceId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search installable components…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={sourceId === "all"}
            onClick={() => setSourceId("all")}
            label={`All (${items.length})`}
          />
          {sources
            .filter((source) => source.ok)
            .map((source) => (
              <FilterChip
                key={source.id}
                active={sourceId === source.id}
                onClick={() => setSourceId(source.id)}
                label={`${source.name} (${source.count})`}
              />
            ))}
        </div>
      </div>

      <p className="text-muted-foreground text-sm">
        {filtered.length} installable {filtered.length === 1 ? "item" : "items"}
        {query ? ` matching “${query.trim()}”` : ""}. These are fetched from
        public registries — copy the install command; they do not run live on
        ShinUI.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <CatalogCard key={`${item.sourceId}:${item.name}`} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
          No catalog items match. Try another search or source filter.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function CatalogCard({ item }: { item: CatalogItem }) {
  return (
    <div className="bg-card flex flex-col rounded-xl border p-4">
      <div className="flex items-start gap-2">
        <Package className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-medium tracking-tight">{item.displayName}</h3>
            <Badge variant="muted" className="text-[10px]">
              {item.sourceName}
            </Badge>
            {item.kind === "block" && (
              <Badge variant="outline" className="text-[10px]">
                block
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {item.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/components/catalog/${item.sourceId}/${item.name}`}
          className="bg-primary text-primary-foreground inline-flex h-8 items-center rounded-lg px-3 text-xs font-medium"
        >
          Install snippet
        </Link>
        <Link
          href={`/resource/${item.resourceSlug}`}
          className="hover:bg-muted inline-flex h-8 items-center rounded-lg border px-3 text-xs font-medium"
        >
          Registry
        </Link>
        {item.docUrl && (
          <a
            href={item.docUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground inline-flex h-8 items-center gap-1 px-1 text-xs"
          >
            Docs
            <ExternalLink className="size-3" />
          </a>
        )}
      </div>
    </div>
  );
}
