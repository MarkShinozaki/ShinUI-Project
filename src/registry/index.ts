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
  /**
   * Other files (relative to src/) the component imports, such as a shared
   * kit. They are shown on the detail page so they can be copied too.
   */
  files?: string[];
  /** Surface the preview against a dark checkerboard instead of the page bg. */
  previewClassName?: string;
  authorId?: string;
  inspiredBy?: { name: string; url: string };
  /**
   * Section heading on /components. Items without a group are listed under
   * DEFAULT_REGISTRY_GROUP.
   */
  group?: string;
};

export const DEFAULT_REGISTRY_GROUP = "Components";

/** Order of the sections on /components. Unknown groups follow, A to Z. */
export const REGISTRY_GROUP_ORDER = [DEFAULT_REGISTRY_GROUP, "Backgrounds", "Footers"];

export type RegistryGroup = { name: string; items: RegistryItem[] };

/** Registry items bucketed by `group`, keeping registry order inside each. */
export function groupRegistry(items: RegistryItem[]): RegistryGroup[] {
  const buckets = new Map<string, RegistryItem[]>();
  for (const item of items) {
    const name = item.group ?? DEFAULT_REGISTRY_GROUP;
    const bucket = buckets.get(name);
    if (bucket) bucket.push(item);
    else buckets.set(name, [item]);
  }
  const rank = (name: string) => {
    const i = REGISTRY_GROUP_ORDER.indexOf(name);
    return i === -1 ? REGISTRY_GROUP_ORDER.length : i;
  };
  return [...buckets.entries()]
    .map(([name, groupItems]) => ({ name, items: groupItems }))
    .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
}

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
    group: "Backgrounds",
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
  {
    slug: "thinking-orbs",
    name: "Thinking Orbs",
    description:
      "Three staggered dots for agent and AI chat loading states. Lightweight CSS keyframes with a reduced-motion opt-out.",
    category: "ai-chat-ui",
    tags: ["loading", "ai", "agent", "chat"],
    file: "registry/components/thinking-orbs.tsx",
    demoExport: "ThinkingOrbsDemo",
    dependencies: [],
    authorId: "shinozaki",
    inspiredBy: {
      name: "Thinking orbs",
      url: "https://thinkingorbs.com/",
    },
  },
  {
    slug: "typing-dots",
    name: "Typing Dots",
    description:
      "A compact typing indicator pill — the pattern every chat UI needs, without pulling in a full messaging library.",
    category: "ai-chat-ui",
    tags: ["chat", "typing", "loading", "messaging"],
    file: "registry/components/typing-dots.tsx",
    demoExport: "TypingDotsDemo",
    dependencies: [],
    authorId: "shinozaki",
  },
  {
    slug: "copy-button",
    name: "Copy Button",
    description:
      "One-click clipboard copy with a checkmark confirmation. Uses the Clipboard API and resets after 1.6 seconds.",
    category: "component-libraries",
    tags: ["clipboard", "button", "feedback"],
    file: "registry/components/copy-button.tsx",
    demoExport: "CopyButtonDemo",
    dependencies: ["react", "lucide-react"],
    authorId: "shinozaki",
  },
  {
    slug: "kbd",
    name: "Kbd",
    description:
      "Keyboard shortcut chips with a raised border treatment. Includes a KbdGroup helper for multi-key combos like ⌘K.",
    category: "component-libraries",
    tags: ["keyboard", "shortcut", "accessibility"],
    file: "registry/components/kbd.tsx",
    demoExport: "KbdDemo",
    dependencies: [],
    authorId: "shinozaki",
  },
  {
    slug: "gradient-border",
    name: "Gradient Border",
    description:
      "A card wrapped in a 1px brand gradient ring using a padding-box trick — no extra DOM layers or mask hacks.",
    category: "backgrounds",
    tags: ["border", "gradient", "card", "highlight"],
    file: "registry/components/gradient-border.tsx",
    demoExport: "GradientBorderDemo",
    dependencies: [],
    authorId: "shinozaki",
    inspiredBy: {
      name: "Gradient Border Plugin",
      url: "https://gradient-border.vercel.app/",
    },
  },
  {
    slug: "dot-pattern",
    name: "Dot Pattern",
    description:
      "A subtle radial-dot background for empty states, hero sections and preview frames. Pure CSS, no image asset.",
    category: "backgrounds",
    tags: ["pattern", "background", "dots", "css-only"],
    file: "registry/components/dot-pattern.tsx",
    demoExport: "DotPatternDemo",
    dependencies: [],
    previewClassName: "p-0",
    authorId: "shinozaki",
    group: "Backgrounds",
  },
  {
    slug: "progress-ring",
    name: "Progress Ring",
    description:
      "An SVG circular progress indicator with animated stroke offset and an accessible progressbar role.",
    category: "data-viz",
    tags: ["progress", "ring", "svg", "stats"],
    file: "registry/components/progress-ring.tsx",
    demoExport: "ProgressRingDemo",
    dependencies: [],
    authorId: "shinozaki",
  },
  {
    slug: "status-badge",
    name: "Status Badge",
    description:
      "Presence pill with a ping animation for online, away, busy and offline states. Hides the ping under reduced motion.",
    category: "component-libraries",
    tags: ["status", "presence", "badge", "live"],
    file: "registry/components/status-badge.tsx",
    demoExport: "StatusBadgeDemo",
    dependencies: [],
    authorId: "shinozaki",
  },
  {
    slug: "flip-card",
    name: "Flip Card",
    description:
      "A 3D card flip on hover using preserve-3d and backface-visibility. Disabled entirely when prefers-reduced-motion is on.",
    category: "animation-motion",
    tags: ["card", "3d", "hover", "flip"],
    file: "registry/components/flip-card.tsx",
    demoExport: "FlipCardDemo",
    dependencies: ["react"],
    authorId: "shinozaki",
  },
  {
    slug: "ldrs-ring",
    name: "LDRS Ring",
    description:
      "A minimal SVG ring loader with a dashed arc sweep — the kind of spinner LDRS popularised, without pulling in the full library.",
    category: "component-libraries",
    tags: ["loader", "spinner", "svg", "css"],
    file: "registry/components/ldrs-ring.tsx",
    demoExport: "LdrsRingDemo",
    dependencies: [],
    authorId: "shinozaki",
    inspiredBy: { name: "LDRS", url: "https://uiball.com/ldrs/" },
  },
  {
    slug: "glass-card",
    name: "Glass Card",
    description:
      "Frosted glass surface with backdrop blur, a subtle highlight gradient and a hairline border — the glasscn look in one div.",
    category: "component-libraries",
    tags: ["glassmorphism", "card", "blur"],
    file: "registry/components/glass-card.tsx",
    demoExport: "GlassCardDemo",
    dependencies: [],
    authorId: "shinozaki",
    inspiredBy: { name: "GlassCN", url: "https://www.glasscn.dev/docs/components/card" },
  },
  {
    slug: "cookie-consent",
    name: "Cookie Consent",
    description:
      "A compact consent banner with accept and decline actions. Dismisses inline — wire it to your analytics gate when you ship it.",
    category: "product-infra",
    tags: ["consent", "legal", "banner", "gdpr"],
    file: "registry/components/cookie-consent.tsx",
    demoExport: "CookieConsentDemo",
    dependencies: ["react"],
    authorId: "shinozaki",
    inspiredBy: {
      name: "Shadcn Cookie Consent",
      url: "https://shadcn-cookie-consent.vercel.app/",
    },
  },
  {
    slug: "timeline",
    name: "Timeline",
    description:
      "A vertical timeline with a brand dot per milestone and a left rule — enough structure for changelogs, roadmaps and onboarding steps.",
    category: "blocks-templates",
    tags: ["timeline", "roadmap", "changelog", "layout"],
    file: "registry/components/timeline.tsx",
    demoExport: "TimelineDemo",
    dependencies: [],
    authorId: "shinozaki",
    inspiredBy: {
      name: "Aceternity Timeline",
      url: "https://ui.aceternity.com/components/timeline",
    },
  },
  {
    slug: "aurora",
    name: "Aurora",
    description:
      "Drifting soft color orbs with an optional fading grid. The haze comes from gradient falloff inside circles rather than filter: blur(), so it stays soft in every browser, Edge included.",
    category: "backgrounds",
    tags: ["background", "aurora", "gradient", "glow", "hero"],
    file: "registry/backgrounds/aurora.tsx",
    demoExport: "AuroraDemo",
    dependencies: ["react"],
    previewClassName: "p-0",
    authorId: "shinozaki",
    group: "Backgrounds",
  },
  {
    slug: "ascii-field",
    name: "ASCII Field",
    description:
      "A canvas of ASCII characters rippling in waves, ripples or plasma. Pauses off-screen, caps its column count on wide displays and freezes for reduced-motion users.",
    category: "backgrounds",
    tags: ["background", "ascii", "canvas", "generative", "animated"],
    file: "registry/backgrounds/ascii-field.tsx",
    demoExport: "AsciiFieldDemo",
    dependencies: ["react"],
    previewClassName: "p-0",
    authorId: "shinozaki",
    group: "Backgrounds",
  },
  {
    slug: "spotlight-veil",
    name: "Spotlight Veil",
    description:
      "A drifting stage spotlight with a film-grain veil. A cinematic cone of light with a soft backwash, not orbs.",
    category: "backgrounds",
    tags: ["background", "spotlight", "light", "grain", "hero"],
    file: "registry/backgrounds/spotlight-veil.tsx",
    demoExport: "SpotlightVeilDemo",
    dependencies: ["react"],
    previewClassName: "p-0",
    authorId: "shinozaki",
    group: "Backgrounds",
  },
  {
    slug: "horizon-beam",
    name: "Horizon Beam",
    description:
      "A breathing light beam on a horizon line. Spare and graphic, with an adjustable altitude and thickness.",
    category: "backgrounds",
    tags: ["background", "beam", "horizon", "light", "minimal"],
    file: "registry/backgrounds/horizon-beam.tsx",
    demoExport: "HorizonBeamDemo",
    dependencies: ["react"],
    previewClassName: "p-0",
    authorId: "shinozaki",
    group: "Backgrounds",
  },
  {
    slug: "grid-lines",
    name: "Grid Lines",
    description:
      "Hairline blueprint grid with crosshair marks and cells that softly light up. Lines are an SVG pattern, so any cell size stays crisp.",
    category: "backgrounds",
    tags: ["background", "grid", "blueprint", "svg", "pattern"],
    file: "registry/backgrounds/grid-lines.tsx",
    demoExport: "GridLinesDemo",
    dependencies: ["react"],
    previewClassName: "p-0",
    authorId: "shinozaki",
    group: "Backgrounds",
  },
  {
    slug: "footer-ascii",
    name: "ASCII Footer",
    description:
      "The brand set in monospace characters that shimmer in a slow wave and scramble under the cursor, or an ASCII sunset sea.",
    category: "blocks-templates",
    tags: ["footer", "ascii", "canvas", "animated", "interactive"],
    file: "registry/footers/footer-ascii.tsx",
    files: ["registry/footers/footer-kit.tsx"],
    demoExport: "FooterAsciiDemo",
    dependencies: ["react"],
    previewClassName: "p-0 overflow-hidden",
    authorId: "shinozaki",
    group: "Footers",
  },
  {
    slug: "footer-dots",
    name: "Dot Field Footer",
    description:
      "A dot grid behind the whole footer spells the brand; dots repel, gather or light up around the cursor, and clicks send a ripple.",
    category: "blocks-templates",
    tags: ["footer", "interactive", "cursor", "canvas"],
    file: "registry/footers/footer-dots.tsx",
    files: ["registry/footers/footer-kit.tsx"],
    demoExport: "FooterDotsDemo",
    dependencies: ["react"],
    previewClassName: "p-0 overflow-hidden",
    authorId: "shinozaki",
    group: "Footers",
  },
  {
    slug: "footer-motion",
    name: "Motion Footer",
    description:
      "Always gently moving: layered waves rolling along the bottom, a drifting particle constellation, or a big marquee band.",
    category: "blocks-templates",
    tags: ["footer", "animated", "waves", "particles", "marquee"],
    file: "registry/footers/footer-motion.tsx",
    files: ["registry/footers/footer-kit.tsx"],
    demoExport: "FooterMotionDemo",
    dependencies: ["react"],
    previewClassName: "p-0 overflow-hidden",
    authorId: "shinozaki",
    group: "Footers",
  },
  {
    slug: "footer-scenery",
    name: "Scenery Footer",
    description:
      "Ends on a drawn SVG scene: rolling hills with drifting clouds, a skyline with twinkling windows, or a pixel-art meadow with a tiny walker. Day or night.",
    category: "blocks-templates",
    tags: ["footer", "illustration", "svg", "pixel-art"],
    file: "registry/footers/footer-scenery.tsx",
    files: ["registry/footers/footer-kit.tsx"],
    demoExport: "FooterSceneryDemo",
    dependencies: ["react"],
    previewClassName: "p-0 overflow-hidden",
    authorId: "shinozaki",
    group: "Footers",
  },
  {
    slug: "footer-gradient",
    name: "Gradient Footer",
    description:
      "An aurora of blurred color rising from the bottom, film grain, and a giant wordmark clipped to the same moving gradient.",
    category: "blocks-templates",
    tags: ["footer", "gradient", "aurora", "wordmark"],
    file: "registry/footers/footer-gradient.tsx",
    files: ["registry/footers/footer-kit.tsx"],
    demoExport: "FooterGradientDemo",
    dependencies: ["react"],
    previewClassName: "p-0 overflow-hidden",
    authorId: "shinozaki",
    group: "Footers",
  },
  {
    slug: "footer-outline",
    name: "Outline Footer",
    description:
      "A giant outlined wordmark that fills letter by letter on hover (or follows the cursor), over hairline columns and a live status pill.",
    category: "blocks-templates",
    tags: ["footer", "wordmark", "outline", "hover"],
    file: "registry/footers/footer-outline.tsx",
    files: ["registry/footers/footer-kit.tsx"],
    demoExport: "FooterOutlineDemo",
    dependencies: ["react"],
    previewClassName: "p-0 overflow-hidden",
    authorId: "shinozaki",
    group: "Footers",
  },
  {
    slug: "footer-terminal",
    name: "Terminal Footer",
    description:
      "Links listed like folders in a terminal, a typed boot line, a status and compliance readout, and a prompt that answers help, ls, open and more.",
    category: "blocks-templates",
    tags: ["footer", "terminal", "mono", "interactive"],
    file: "registry/footers/footer-terminal.tsx",
    files: ["registry/footers/footer-kit.tsx"],
    demoExport: "FooterTerminalDemo",
    dependencies: ["react"],
    previewClassName: "p-0 overflow-hidden",
    authorId: "shinozaki",
    group: "Footers",
  },
  {
    slug: "footer-newsletter",
    name: "Newsletter Footer",
    description:
      "Warm paper with adjustable grain, a newsletter signup with a success state, a what’s-new card, trust badges and link columns.",
    category: "blocks-templates",
    tags: ["footer", "newsletter", "form", "texture"],
    file: "registry/footers/footer-newsletter.tsx",
    files: ["registry/footers/footer-kit.tsx"],
    demoExport: "FooterNewsletterDemo",
    dependencies: ["react"],
    previewClassName: "p-0 overflow-hidden",
    authorId: "shinozaki",
    group: "Footers",
  },
  {
    slug: "footer-kit",
    name: "Footer Kit",
    description:
      "Shared pieces: palette root, link columns with New badges and hover arrows, socials, copyright, plus canvas-loop, pointer, dark-mode and text-raster hooks.",
    category: "blocks-templates",
    tags: ["footer", "kit"],
    file: "registry/footers/footer-kit.tsx",
    demoExport: "FooterKitDemo",
    dependencies: ["react"],
    previewClassName: "p-0 overflow-hidden",
    authorId: "shinozaki",
    group: "Footers",
  },
];

export const registryBySlug = new Map(registry.map((item) => [item.slug, item]));

export function getRegistryItem(slug: string) {
  return registryBySlug.get(slug);
}

export function registryByCategory(category: string) {
  return registry.filter((item) => item.category === category);
}
