export type RegistryItem = {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  /** Path relative to src/, used to read the source at build time. */
  file: string;
  demoExport: string;
  dependencies: string[];
  /** Surface the preview against a dark checkerboard instead of the page bg. */
  previewClassName?: string;
  authorId?: string;
  inspiredBy?: { name: string; url: string };
};

export const registry: RegistryItem[] = [
  {
    slug: "spotlight-card",
    name: "Spotlight Card",
    description:
      "A card that lights up under the cursor. The gradient is positioned from pointer coordinates rather than a CSS hover state, so the highlight follows the exact path of the mouse.",
    category: "animation-motion",
    tags: ["card", "hover", "gradient", "pointer"],
    file: "registry/components/spotlight-card.tsx",
    demoExport: "SpotlightCardDemo",
    dependencies: ["react"],
    authorId: "shinozaki",
    inspiredBy: { name: "Aceternity UI", url: "https://ui.aceternity.com/" },
  },
  {
    slug: "dock",
    name: "Dock",
    description:
      "macOS dock magnification. The scale falloff uses a cosine curve rather than a linear ramp, which is what makes neighbouring icons swell smoothly instead of stepping.",
    category: "ios-mobile",
    tags: ["dock", "macos", "magnification", "navigation"],
    file: "registry/components/dock.tsx",
    demoExport: "DockDemo",
    dependencies: ["react", "lucide-react"],
    authorId: "shinozaki",
    inspiredBy: {
      name: "Apple Dock (CodePen)",
      url: "https://codepen.io/osmosupply/pen/BaXPYNQ",
    },
  },
  {
    slug: "animated-tabs",
    name: "Animated Tabs",
    description:
      "A tab list with a sliding indicator measured from the active trigger's own layout box, so it stays correct when labels change length or the container resizes.",
    category: "transitions",
    tags: ["tabs", "indicator", "navigation"],
    file: "registry/components/animated-tabs.tsx",
    demoExport: "AnimatedTabsDemo",
    dependencies: ["react"],
    authorId: "shinozaki",
  },
  {
    slug: "ios-toggle",
    name: "iOS Toggle",
    description:
      "The iOS switch at its real dimensions — 51×31 with a 27px thumb — using Apple's system green and the spring-like easing curve from the platform.",
    category: "ios-mobile",
    tags: ["switch", "toggle", "ios", "form"],
    file: "registry/components/ios-toggle.tsx",
    demoExport: "IosToggleDemo",
    dependencies: ["react"],
    authorId: "shinozaki",
    inspiredBy: {
      name: "Apple HIG",
      url: "https://developer.apple.com/design/human-interface-guidelines/toggles",
    },
  },
  {
    slug: "marquee",
    name: "Marquee",
    description:
      "An infinite scrolling row built from two duplicated tracks, with an edge mask, hover pause and a reduced-motion opt-out. No dependency and no JavaScript loop.",
    category: "animation-motion",
    tags: ["marquee", "logos", "infinite-scroll", "css"],
    file: "registry/components/marquee.tsx",
    demoExport: "MarqueeDemo",
    dependencies: ["react"],
    authorId: "shinozaki",
    inspiredBy: { name: "Magic UI", url: "https://magicui.design/" },
  },
  {
    slug: "gradient-mesh",
    name: "Gradient Mesh",
    description:
      "Four drifting blurred blobs plus an SVG grain overlay. Renders on the server, costs nothing at runtime, and gets most of the way to a WebGL mesh gradient.",
    category: "backgrounds",
    tags: ["background", "gradient", "mesh", "css-only"],
    file: "registry/components/gradient-mesh.tsx",
    demoExport: "GradientMeshDemo",
    dependencies: [],
    previewClassName: "p-0",
    authorId: "shinozaki",
  },
  {
    slug: "bento-grid",
    name: "Bento Grid",
    description:
      "A responsive bento layout that collapses to a single column on mobile, with per-card column and row spans and a hover glow that scales from the corner.",
    category: "blocks-templates",
    tags: ["layout", "grid", "bento", "responsive"],
    file: "registry/components/bento-grid.tsx",
    demoExport: "BentoGridDemo",
    dependencies: [],
    authorId: "shinozaki",
  },
  {
    slug: "avatar-stack",
    name: "Avatar Stack",
    description:
      "Overlapping avatars with an overflow counter and a lift on hover. Falls back to initials when no image is supplied.",
    category: "component-libraries",
    tags: ["avatar", "presence", "collaboration"],
    file: "registry/components/avatar-stack.tsx",
    demoExport: "AvatarStackDemo",
    dependencies: [],
    authorId: "shinozaki",
  },
  {
    slug: "counter-stat",
    name: "Counter Stat",
    description:
      "A stat card whose number counts up the first time it scrolls into view, using easeOutExpo so the final digits do not crawl. Respects prefers-reduced-motion.",
    category: "data-viz",
    tags: ["counter", "stats", "intersection-observer"],
    file: "registry/components/counter-stat.tsx",
    demoExport: "CounterStatDemo",
    dependencies: ["react"],
    authorId: "shinozaki",
    inspiredBy: {
      name: "NumberFlow",
      url: "https://number-flow.barvian.me/",
    },
  },
  {
    slug: "glow-button",
    name: "Glow Button",
    description:
      "A pill button with a sweeping specular highlight and a soft brand-coloured bloom behind it. Both effects are hidden under reduced motion.",
    category: "component-libraries",
    tags: ["button", "glow", "shine", "cta"],
    file: "registry/components/glow-button.tsx",
    demoExport: "GlowButtonDemo",
    dependencies: [],
    authorId: "shinozaki",
  },
  {
    slug: "segmented-control",
    name: "Segmented Control",
    description:
      "The iOS segmented control as a CSS grid, so the thumb width is derived from the number of options and the translate is a whole multiple of it.",
    category: "ios-mobile",
    tags: ["segmented", "ios", "toggle-group", "view-switcher"],
    file: "registry/components/segmented-control.tsx",
    demoExport: "SegmentedControlDemo",
    dependencies: ["react"],
    authorId: "shinozaki",
  },
  {
    slug: "shimmer-text",
    name: "Shimmer Text",
    description:
      "A loading-state text treatment that animates a light sweep through a background-clipped gradient. Useful for streaming AI responses.",
    category: "ai-chat-ui",
    tags: ["text", "shimmer", "loading", "streaming"],
    file: "registry/components/shimmer-text.tsx",
    demoExport: "ShimmerTextDemo",
    dependencies: [],
    authorId: "shinozaki",
  },
];

export const registryBySlug = new Map(registry.map((item) => [item.slug, item]));

export function getRegistryItem(slug: string) {
  return registryBySlug.get(slug);
}

export function registryByCategory(category: string) {
  return registry.filter((item) => item.category === category);
}
