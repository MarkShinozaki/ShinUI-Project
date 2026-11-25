import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "design-manifestos",
    name: "Design Manifestos",
    short: "Manifestos",
    description:
      "Archives of design principles, declarations and writing that still shape how interfaces get made.",
    icon: "ScrollText",
    accent: "from-stone-500/20 to-neutral-500/5",
  },
  {
    slug: "sound-services",
    name: "Sound Services",
    short: "Sound",
    description:
      "UI chimes, ambient players and sound packs for interfaces that need a click, a ding or a room tone.",
    icon: "Volume2",
    accent: "from-amber-500/20 to-yellow-500/5",
  },
  {
    slug: "motion-video",
    name: "Motion & Video",
    short: "Motion / Video",
    description:
      "Interactive motion runtimes, programmatic video and frame tools for clusters, product shots and HMI-style motion.",
    icon: "Clapperboard",
    accent: "from-fuchsia-500/20 to-violet-500/5",
  },
  {
    slug: "inspiration",
    name: "Design Inspo",
    short: "Inspo",
    description:
      "Galleries, pattern archives and single-interaction demos worth stealing from.",
    icon: "Eye",
    accent: "from-pink-500/20 to-rose-500/5",
  },
  {
    slug: "data-viz",
    name: "Charts",
    short: "Charts",
    description:
      "Chart libraries, dashboard primitives and animated numeric feedback.",
    icon: "ChartSpline",
    accent: "from-teal-500/20 to-sky-500/5",
  },
  {
    slug: "icons-assets",
    name: "Icons",
    short: "Icons",
    description:
      "Icon sets, SVG collections, 3D marks and loaders — from minimal strokes to full brand packs.",
    icon: "Shapes",
    accent: "from-lime-500/20 to-emerald-500/5",
  },
  {
    slug: "agent",
    name: "Agent",
    short: "Agent",
    description:
      "Mascots, character kits and other agent presence you can drop onto a page.",
    icon: "Bot",
    accent: "from-indigo-500/20 to-violet-500/5",
  },
  {
    slug: "buttons",
    name: "Buttons",
    short: "Buttons",
    description:
      "Dedicated button kits — loading states, unusual hover treatments and animated press feedback.",
    icon: "RectangleHorizontal",
    accent: "from-rose-500/20 to-red-500/5",
  },
  {
    slug: "design-tools",
    name: "Tools",
    short: "Tools",
    description:
      "Where the design actually happens — canvases, extractors, PDF viewers and design-to-dev handoff.",
    icon: "PenTool",
    accent: "from-purple-500/20 to-fuchsia-500/5",
  },
  {
    slug: "component-libraries",
    name: "Component Libraries",
    short: "Libraries",
    description:
      "Full component systems you can install and compose — headless primitives, styled kits and shadcn-flavoured registries.",
    icon: "Boxes",
    accent: "from-violet-500/20 to-indigo-500/5",
  },
  {
    slug: "blocks-templates",
    name: "Blocks & Templates",
    short: "Blocks",
    description:
      "Copy-paste page sections, marketing layouts and full dashboards that skip the blank canvas.",
    icon: "LayoutTemplate",
    accent: "from-sky-500/20 to-cyan-500/5",
  },
  {
    slug: "animation-motion",
    name: "Animation & Motion",
    short: "Animation",
    description:
      "Animation engines, spring physics and motion component kits for interfaces that feel alive.",
    icon: "Sparkles",
    accent: "from-fuchsia-500/20 to-pink-500/5",
  },
  {
    slug: "transitions",
    name: "Transitions & Scroll",
    short: "Transitions",
    description:
      "Page transitions, view transitions, smooth scroll and scroll-driven choreography.",
    icon: "ArrowLeftRight",
    accent: "from-emerald-500/20 to-teal-500/5",
  },
  {
    slug: "shaders-webgl",
    name: "Shaders & WebGL",
    short: "Shaders",
    description:
      "GLSL playgrounds, 3D renderers and shader-driven surfaces for depth and atmosphere on the web.",
    icon: "Aperture",
    accent: "from-orange-500/20 to-amber-500/5",
  },
  {
    slug: "backgrounds",
    name: "Backgrounds & Atmosphere",
    short: "Backgrounds",
    description:
      "Gradients, grids, noise, patterns and animated backdrops that set the mood behind your UI.",
    icon: "Waves",
    accent: "from-blue-500/20 to-violet-500/5",
  },
  {
    slug: "themes-color",
    name: "Colors & Themes",
    short: "Colors",
    description:
      "Theme editors, palette generators and color systems — including drop-in shadcn theme tooling.",
    icon: "Palette",
    accent: "from-rose-500/20 to-orange-500/5",
  },
  {
    slug: "ios-mobile",
    name: "iOS & Mobile UI",
    short: "Mobile",
    description:
      "Native-feeling patterns: sheets, drawers, haptic-style toggles, HIG references and React Native kits.",
    icon: "Smartphone",
    accent: "from-slate-500/20 to-zinc-500/5",
  },
  {
    slug: "mockups",
    name: "Mockups & Presentation",
    short: "Mockups",
    description:
      "Device frames, screenshot beautifiers and screen recording tools for shipping the launch post.",
    icon: "Frame",
    accent: "from-amber-500/20 to-yellow-500/5",
  },
  {
    slug: "ai-chat-ui",
    name: "AI & Chat UI",
    short: "AI UI",
    description:
      "Message threads, streaming states, prompt inputs and agent surfaces.",
    icon: "MessagesSquare",
    accent: "from-indigo-500/20 to-blue-500/5",
  },
  {
    slug: "product-infra",
    name: "Product Infra UI",
    short: "Infra",
    description:
      "The unglamorous but load-bearing pieces: billing, tables, calendars, drag & drop, uploads.",
    icon: "Boxes",
    accent: "from-stone-500/20 to-neutral-500/5",
  },
  {
    slug: "no-code-webflow",
    name: "No-code & Webflow",
    short: "No-code",
    description:
      "Visual builders and the component libraries, cloneables and attribute systems around them.",
    icon: "MousePointerClick",
    accent: "from-cyan-500/20 to-blue-500/5",
  },
  {
    slug: "experimental-retro",
    name: "Experimental & Retro",
    short: "Retro",
    description:
      "8-bit, brutalist, terminal and other deliberately non-neutral aesthetics.",
    icon: "Gamepad2",
    accent: "from-green-500/20 to-lime-500/5",
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string) {
  return categoryBySlug.get(slug);
}
