export type RegistrySourceFormat =
  | "shadcn-index"
  | "shadcn-registry"
  | "smoothui-llms";

export type RegistrySource = {
  id: string;
  /** Matches a slug in resources.ts for cross-linking. */
  resourceSlug: string;
  name: string;
  indexUrl: string;
  format: RegistrySourceFormat;
  siteUrl: string;
};

/**
 * Public registries ShinUI can fetch at build time. Only sources with a stable
 * machine-readable index are listed here — most indexed sites are link-only.
 */
export const registrySources: RegistrySource[] = [
  {
    id: "shadcn-ui",
    resourceSlug: "shadcn-ui",
    name: "shadcn/ui",
    indexUrl: "https://ui.shadcn.com/r/index.json",
    format: "shadcn-index",
    siteUrl: "https://ui.shadcn.com/docs/components",
  },
  {
    id: "smoothui",
    resourceSlug: "smoothui",
    name: "SmoothUI",
    indexUrl: "https://smoothui.dev/llms-components.json",
    format: "smoothui-llms",
    siteUrl: "https://smoothui.dev/docs/components",
  },
  {
    id: "interior-dev",
    resourceSlug: "interior-dev",
    name: "interior.dev",
    indexUrl: "https://www.interior.dev/r/registry.json",
    format: "shadcn-registry",
    siteUrl: "https://www.interior.dev/docs",
  },
  {
    id: "sona-ui",
    resourceSlug: "sona-ui",
    name: "Sona UI",
    indexUrl: "https://sonaui.com/r/registry.json",
    format: "shadcn-registry",
    siteUrl: "https://sonaui.com/docs/components",
  },
];

export const registrySourceById = new Map(
  registrySources.map((source) => [source.id, source])
);
