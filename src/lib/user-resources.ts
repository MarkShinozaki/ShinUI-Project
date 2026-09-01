import type { Pricing, Resource } from "@/data/types";
import { resources } from "@/data/resources";
import { assertUrlAllowed } from "@/lib/url-policy";
import { slugify } from "@/lib/utils";

const STORAGE_KEY = "shinui-user-resources";

export type SiteInspectResult = {
  url: string;
  name: string;
  tagline: string;
  description: string;
  existingSlug?: string;
  registry?: {
    indexUrl: string;
    itemCount: number;
    format: "shadcn-index" | "unknown";
  };
};

export function normalizeResourceUrl(url: string) {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = parsed.pathname.replace(/\/$/, "").toLowerCase();
    return `${host}${path}`;
  } catch {
    return url.trim().toLowerCase();
  }
}

const EMPTY_USER_RESOURCES = [] as Resource[];

let cachedUserRaw: string | null | undefined;
let cachedUserSnapshot: Resource[] = EMPTY_USER_RESOURCES;

function readUserResources(): Resource[] {
  if (typeof window === "undefined") return EMPTY_USER_RESOURCES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedUserRaw) return cachedUserSnapshot;
    cachedUserRaw = raw;
    if (!raw) {
      cachedUserSnapshot = EMPTY_USER_RESOURCES;
      return cachedUserSnapshot;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      cachedUserSnapshot = EMPTY_USER_RESOURCES;
      return cachedUserSnapshot;
    }
    cachedUserSnapshot = parsed as Resource[];
    return cachedUserSnapshot;
  } catch {
    cachedUserSnapshot = EMPTY_USER_RESOURCES;
    cachedUserRaw = null;
    return cachedUserSnapshot;
  }
}

function writeUserResources(items: Resource[]) {
  const raw = JSON.stringify(items);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedUserRaw = raw;
  cachedUserSnapshot = items;
  window.dispatchEvent(new Event("shinui-user-resources"));
}

export function getUserResources(): Resource[] {
  return readUserResources();
}

export function subscribeUserResources(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("shinui-user-resources", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("shinui-user-resources", handler);
    window.removeEventListener("storage", handler);
  };
}

export function getUserResourcesSnapshot(): Resource[] {
  return readUserResources();
}

export function getServerUserResourcesSnapshot(): Resource[] {
  return EMPTY_USER_RESOURCES;
}

export function findCuratedByUrl(url: string) {
  const key = normalizeResourceUrl(url);
  return resources.find((r) => normalizeResourceUrl(r.url) === key);
}

export function findUserResourceBySlug(slug: string) {
  return readUserResources().find((r) => r.slug === slug);
}

function uniqueSlug(base: string, taken: Set<string>) {
  let slug = base;
  let i = 2;
  while (taken.has(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

export function buildUserResource(input: {
  url: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  pricing: Pricing;
  tags?: string[];
  stack?: string[];
}): Resource {
  const taken = new Set([
    ...resources.map((r) => r.slug),
    ...readUserResources().map((r) => r.slug),
  ]);
  const hostSlug = slugify(new URL(input.url).hostname.replace(/^www\./, ""));
  const slug = uniqueSlug(`user-${hostSlug || "site"}`, taken);

  return {
    slug,
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    url: input.url,
    category: input.category,
    tags: input.tags ?? ["user-added"],
    stack: input.stack ?? ["Web"],
    pricing: input.pricing,
    addedAt: new Date().toISOString().slice(0, 10),
    userSubmitted: true,
  };
}

export function addUserResource(resource: Resource) {
  assertUrlAllowed(resource.url);

  const existing = findCuratedByUrl(resource.url);
  if (existing) {
    throw new Error(`Already in the index as ${existing.name}`);
  }

  const key = normalizeResourceUrl(resource.url);
  const items = readUserResources().filter(
    (r) => normalizeResourceUrl(r.url) !== key
  );
  items.unshift(resource);
  writeUserResources(items);
  return resource;
}

export function removeUserResource(slug: string) {
  writeUserResources(readUserResources().filter((r) => r.slug !== slug));
}

export function mergeBrowsableResources(curated: Resource[]): Resource[] {
  const userItems = readUserResources();
  const curatedKeys = new Set(curated.map((r) => normalizeResourceUrl(r.url)));
  const uniqueUser = userItems.filter(
    (r) => !curatedKeys.has(normalizeResourceUrl(r.url))
  );
  return [...uniqueUser, ...curated];
}
