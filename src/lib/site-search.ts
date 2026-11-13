import { resources } from "@/data/resources";
import { primaryNav } from "@/lib/nav";
import {
  DEFAULT_SECTION,
  sectionForGroup,
  type SectionId,
} from "@/lib/component-sections";
import { DEFAULT_REGISTRY_GROUP, registry, type RegistryItem } from "@/registry";
import type { Resource } from "@/data/types";

export type SearchScope =
  | "all"
  | "components"
  | "blocks"
  | "pixel-art"
  | "other"
  | "resources"
  | "pages";

export type PageRoute = {
  href: string;
  label: string;
  keywords: string;
};

export const PAGE_ROUTES: PageRoute[] = [
  ...primaryNav.map((page) => ({
    href: page.href,
    label: page.label,
    keywords: page.label,
  })),
  {
    href: "/categories",
    label: "Categories",
    keywords: "categories buckets tags",
  },
  {
    href: "/portfolios",
    label: "Portfolios",
    keywords: "portfolios showcase sites inspiration",
  },
  {
    href: "/components/catalog",
    label: "Component catalog",
    keywords: "catalog installable registry shadcn",
  },
  {
    href: "/design-tools/favicon-studio",
    label: "Favicon Studio",
    keywords: "favicon studio ico png svg design tools",
  },
];

export function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function termsFromQuery(query: string) {
  return normalize(query).split(/\s+/).filter(Boolean);
}

export function sectionIdOf(item: RegistryItem): SectionId {
  return sectionForGroup(item.group ?? DEFAULT_REGISTRY_GROUP).id;
}

export function groupLabelOf(item: RegistryItem) {
  return item.group ?? DEFAULT_REGISTRY_GROUP;
}

function scoreHaystack(haystack: string, name: string, tags: string[], terms: string[]) {
  const nameLower = name.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (!term) continue;
    if (haystack === term) score += 100;
    else if (nameLower === term) score += 80;
    else if (nameLower.startsWith(term)) score += 50;
    else if (haystack.includes(term)) score += 20;
    else if (tags.some((tag) => tag.toLowerCase().includes(term))) score += 12;
  }
  return score;
}

export function scoreComponent(item: RegistryItem, terms: string[]) {
  const haystack = normalize(
    [item.name, item.slug, item.description, groupLabelOf(item), ...item.tags].join(" ")
  );
  return scoreHaystack(haystack, item.name, item.tags, terms);
}

export function scoreResource(resource: Resource, terms: string[]) {
  const haystack = normalize(
    [
      resource.name,
      resource.slug,
      resource.tagline,
      resource.description,
      resource.category,
      resource.type ?? "",
      ...resource.tags,
      ...resource.stack,
    ].join(" ")
  );
  return scoreHaystack(haystack, resource.name, resource.tags, terms);
}

export function scorePage(page: PageRoute, terms: string[]) {
  const haystack = normalize([page.label, page.href, page.keywords].join(" "));
  return scoreHaystack(haystack, page.label, [], terms);
}

const bySection = (id: SectionId) => registry.filter((item) => sectionIdOf(item) === id);

const sectionCounts = {
  components: bySection("components").length,
  blocks: bySection("blocks").length,
  "pixel-art": bySection("pixel-art").length,
  other: bySection("other").length,
  resources: resources.length,
  pages: PAGE_ROUTES.length,
};

export const SEARCH_COUNTS: Record<SearchScope, number> = {
  ...sectionCounts,
  all:
    sectionCounts.components +
    sectionCounts.blocks +
    sectionCounts["pixel-art"] +
    sectionCounts.other +
    sectionCounts.resources +
    sectionCounts.pages,
};

export const SEARCH_SECTIONS: {
  id: SearchScope;
  label: string;
  hint: string;
}[] = [
  { id: "all", label: "All", hint: "The whole index" },
  { id: "components", label: "Components", hint: `${SEARCH_COUNTS.components} UI pieces` },
  { id: "blocks", label: "Blocks", hint: `${SEARCH_COUNTS.blocks} page sections` },
  { id: "pixel-art", label: "Pixel Art", hint: `${SEARCH_COUNTS["pixel-art"]} scenes` },
  ...(SEARCH_COUNTS.other > 0
    ? [{ id: "other" as const, label: "Other", hint: `${SEARCH_COUNTS.other} ungrouped` }]
    : []),
  { id: "resources", label: "Resources", hint: `${SEARCH_COUNTS.resources} curated links` },
  { id: "pages", label: "Pages", hint: `${SEARCH_COUNTS.pages} site pages` },
];

export function matchComponents(terms: string[], section: SectionId | "all" = "all") {
  const pool =
    section === "all" ? registry : registry.filter((item) => sectionIdOf(item) === section);
  const searching = terms.length > 0;
  return pool
    .map((item) => ({ item, score: searching ? scoreComponent(item, terms) : 1 }))
    .filter((row) => (searching ? row.score > 0 : true))
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
}

export function matchResources(terms: string[]) {
  const searching = terms.length > 0;
  return resources
    .map((resource) => ({
      resource,
      score:
        searching
          ? scoreResource(resource, terms) + (resource.featured ? 4 : 0)
          : resource.featured
            ? 2
            : 1,
    }))
    .filter((row) => (searching ? row.score > 0 : true))
    .sort((a, b) => b.score - a.score || a.resource.name.localeCompare(b.resource.name));
}

export function matchPages(terms: string[]) {
  const searching = terms.length > 0;
  if (!searching) return PAGE_ROUTES.map((page) => ({ page, score: 1 }));
  return PAGE_ROUTES.map((page) => ({ page, score: scorePage(page, terms) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.page.label.localeCompare(b.page.label));
}

export function isComponentScope(
  scope: SearchScope
): scope is "components" | "blocks" | "pixel-art" | "other" {
  return (
    scope === "components" ||
    scope === "blocks" ||
    scope === "pixel-art" ||
    scope === "other"
  );
}

/** Map a search scope to the registry umbrella, if it has one. */
export function scopeToSection(scope: SearchScope): SectionId | "all" {
  if (scope === "all") return "all";
  if (isComponentScope(scope)) return scope;
  return DEFAULT_SECTION;
}
