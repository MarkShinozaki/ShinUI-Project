import { cache } from "react";

import {
  registrySourceById,
  registrySources,
  type RegistrySource,
} from "@/data/registry-sources";

export type CatalogItem = {
  sourceId: string;
  sourceName: string;
  resourceSlug: string;
  name: string;
  displayName: string;
  description?: string;
  category?: string;
  installCommand: string;
  docUrl?: string;
  kind: "component" | "block";
};

type ShadcnIndexEntry = {
  name: string;
  type?: string;
  description?: string;
};

type SmoothUiLlms = {
  components?: Array<{
    name: string;
    displayName?: string;
    description?: string;
    category?: string;
    installCommand?: string;
    docUrl?: string;
  }>;
  blocks?: Array<{
    name: string;
    displayName?: string;
    description?: string;
    category?: string;
    installCommand?: string;
    docUrl?: string;
  }>;
};

const REVALIDATE_SECONDS = 60 * 60 * 24;

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function titleCase(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseShadcnIndex(source: RegistrySource, data: ShadcnIndexEntry[]) {
  return data
    .filter((entry) => {
      const type = entry.type ?? "";
      return (
        type === "registry:ui" ||
        type === "registry:block" ||
        type === "registry:component"
      );
    })
    .map((entry) => ({
      sourceId: source.id,
      sourceName: source.name,
      resourceSlug: source.resourceSlug,
      name: entry.name,
      displayName: titleCase(entry.name),
      description: entry.description,
      installCommand: `npx shadcn@latest add ${entry.name}`,
      docUrl: `${source.siteUrl}/${entry.name}`,
      kind:
        entry.type === "registry:block"
          ? ("block" as const)
          : ("component" as const),
    }));
}

function parseSmoothUiLlms(source: RegistrySource, data: SmoothUiLlms) {
  const mapEntry = (
    entry: NonNullable<SmoothUiLlms["components"]>[number],
    kind: CatalogItem["kind"]
  ): CatalogItem => ({
    sourceId: source.id,
    sourceName: source.name,
    resourceSlug: source.resourceSlug,
    name: entry.name,
    displayName: entry.displayName ?? titleCase(entry.name),
    description: entry.description,
    category: entry.category,
    installCommand:
      entry.installCommand ??
      `npx shadcn@latest add https://smoothui.dev/r/${entry.name}.json`,
    docUrl: entry.docUrl,
    kind,
  });

  return [
    ...(data.components ?? []).map((entry) => mapEntry(entry, "component")),
    ...(data.blocks ?? []).map((entry) => mapEntry(entry, "block")),
  ];
}

async function fetchSourceCatalog(source: RegistrySource): Promise<CatalogItem[]> {
  if (source.format === "shadcn-index") {
    const data = await fetchJson<ShadcnIndexEntry[]>(source.indexUrl);
    if (!data) return [];
    return parseShadcnIndex(source, data);
  }

  const data = await fetchJson<SmoothUiLlms>(source.indexUrl);
  if (!data) return [];
  return parseSmoothUiLlms(source, data);
}

export const getRegistryCatalog = cache(async () => {
  const results = await Promise.all(
    registrySources.map(async (source) => {
      const items = await fetchSourceCatalog(source);
      return { source, items, ok: items.length > 0 };
    })
  );

  const items = results.flatMap((result) => result.items);
  const bySource = new Map(
    results.map((result) => [result.source.id, result.items])
  );

  return {
    items,
    bySource,
    sources: results.map((result) => ({
      ...result.source,
      count: result.items.length,
      ok: result.ok,
    })),
    total: items.length,
  };
});

export async function getCatalogItem(sourceId: string, name: string) {
  const catalog = await getRegistryCatalog();
  return catalog.items.find(
    (item) => item.sourceId === sourceId && item.name === name
  );
}

export function getRegistrySource(sourceId: string) {
  return registrySourceById.get(sourceId);
}
