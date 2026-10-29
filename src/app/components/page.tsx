import type { Metadata } from "next";
import { Suspense } from "react";

import {
  ComponentsBrowser,
  ComponentsBrowserFallback,
  type BrowserGroup,
} from "@/components/components-browser";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { groupRegistry, registry, registryGroupSlug } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description: "Live ShinUI components with source code you can preview and copy.",
};

const GROUP_TITLES: Record<string, string> = {
  Components: "Interactive previews with the exact source that renders them.",
  Backgrounds: "Animated surfaces to put behind a hero, a section or a card.",
  Footers: "Standalone site footers, one idea each.",
  "Blocks · General": "A navbar, a hero and a split hero, plus the page they make together.",
  "Blocks · Grid": "Hairline frames, crosshair joints and mono details.",
  "Blocks · Folio": "Editorial sections on a narrow, square-cornered column.",
  "Blocks · Context": "Blueprint panels, dashed boxes and pixel streams for developer products.",
  "Blocks · ORO": "Warm, data-heavy sections with sun glows and growth charts.",
  "Blocks · Roma": "Consumer-app pages: mosaic hero, loud orange band, pill buttons and phone mockups.",
  "Blocks · Dia": "Calm, sunlit work-tool pages: a drifting gold glow, soft serif headlines and gentle motion.",
  "Pixel Art 3D": "Isometric WebGL dioramas you can zoom and turn.",
  "Pixel Art 2D": "Flat sprite-style scenes on a tiny canvas.",
};

const GROUP_LEDES: Record<string, string> = {
  Components: "Save components you reuse often. They're stored in your browser.",
  Backgrounds: "Each one wraps its children, so drop your content straight inside.",
  Footers:
    "ASCII, cursor-reactive dots, motion, scenery, gradient, outline wordmark, terminal and newsletter. They share the Footer Kit.",
  "Blocks · General": "The full page comes first; open it to scroll the whole thing at desktop width. The parts follow.",
  "Blocks · Grid": "The full page first, then the navbar, hero, features, steps and footer it is built from, on the Grid Frame kit.",
  "Blocks · Folio": "The full page first, then each part from navbar to footer, sharing the Folio Kit.",
  "Blocks · Context": "The full page first, then each part from navbar to footer, sharing the Context Kit.",
  "Blocks · ORO": "The full page first, then each part from navbar to footer, sharing the ORO Kit.",
  "Blocks · Roma": "The full page first, then each part from navbar to footer, sharing the Roma Kit.",
  "Blocks · Dia": "The full page first, then each part from navbar to footer, sharing the Dia Kit.",
  "Pixel Art 3D": "Toon-lit, pixelated three.js scenes built on the Iso Scene kit. Needs three and @react-three/fiber.",
  "Pixel Art 2D": "Frame-by-frame animation, parallax and dithered skies on the Pixel 2D kit. No WebGL.",
};

export default function ComponentsPage() {
  const groups: BrowserGroup[] = groupRegistry(registry).map((group) => ({
    name: group.name,
    slug: registryGroupSlug(group.name),
    title: GROUP_TITLES[group.name] ?? group.name,
    lede: GROUP_LEDES[group.name],
    items: group.items,
  }));

  return (
    <FolioSection>
      <FolioContainer>
        <PageHeader
          eyebrow="Component library"
          title="Components"
          description={`${registry.length} run live on this site with copyable source.`}
        />

        <Suspense fallback={<ComponentsBrowserFallback groups={groups} />}>
          <ComponentsBrowser groups={groups} />
        </Suspense>
      </FolioContainer>
    </FolioSection>
  );
}
