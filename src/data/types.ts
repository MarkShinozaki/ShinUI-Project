export type Pricing = "free" | "open-source" | "freemium" | "paid";

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
  slug: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  stack: string[];
  pricing: Pricing;
  authorId?: string;
  featured?: boolean;
  /** Shown in the "Install" tab when the resource ships a CLI. */
  install?: string;
  /** When ShinUI ships a live reimplementation, link to /components/[slug]. */
  componentSlug?: string;
  addedAt: string;
};
