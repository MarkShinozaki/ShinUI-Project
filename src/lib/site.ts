export const SITE = {
  name: "ShinUI",
  title: "ShinUI — UI components & design resources for modern web dev",
  description:
    "A curated, searchable index of UI component libraries, blocks, animation systems, shaders, icons and design tools — with live previews, source code and credit to the people who made them.",
  url: "https://shinui.dev",
  repo: "https://github.com/MarkShinozaki/ShinUI-Project",
  author: {
    name: "Mark Shinozaki",
    github: "https://github.com/MarkShinozaki",
  },
} as const;

/** Static assets in /public — referenced from metadata and UI. */
export const SITE_ASSETS = {
  favicon: "/favicon.ico",
  favicon16: "/favicon-16x16.png",
  favicon32: "/favicon-32x32.png",
  appleTouchIcon: "/apple-touch-icon.png",
  icon192: "/android-chrome-192x192.png",
  icon512: "/android-chrome-512x512.png",
  manifest: "/site.webmanifest",
} as const;
