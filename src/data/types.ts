export type Pricing = "free" | "open-source" | "freemium" | "paid" | "unknown";

/** How the resource is primarily used. */
export type ResourceType =
  | "library"
  | "inspiration"
  | "tool"
  | "service"
  | "asset";

/** Result of a lightweight link check. `ok` is the default when omitted. */
export type LinkStatus = "ok" | "dead" | "uncertain";

export type Author = {
  id: string;
  name: string;
  handle?: string;
  x?: string;
  github?: string;
  site?: string;
};

export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  /** Lucide icon name, resolved at render time. */
  icon: string;
  accent: string;
};

export type Resource = {
  /** Stable id used in routes, saved items, and the catalog. */
  slug: string;
  name: string;
  /** One-line description shown on cards and in search. */
  tagline: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  stack: string[];
  pricing: Pricing;
  /** library / inspiration / tool / service / asset */
  type?: ResourceType;
  /** Set when a link check failed or was inconclusive. Omit when healthy. */
  linkStatus?: LinkStatus;
  /** Curator notes, e.g. why a link is flagged. */
  notes?: string;
  authorId?: string;
  featured?: boolean;
  /** Shown in the "Install" tab when the resource ships a CLI. */
  install?: string;
  /** When ShinUI ships a live reimplementation, link to /components/[slug]. */
  componentSlug?: string;
  addedAt: string;
  /** Saved in the browser by the visitor — not in the curated index. */
  userSubmitted?: boolean;
};
