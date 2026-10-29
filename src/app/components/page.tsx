import type { Metadata } from "next";

import { ComponentCard } from "@/components/component-card";
import { FolioSectionHead } from "@/components/folio/kit";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { groupRegistry, registry } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description: "Live ShinUI components with source code you can preview and copy.",
};

const GROUP_TITLES: Record<string, string> = {
  Components: "Interactive previews with the exact source that renders them.",
  Backgrounds: "Animated surfaces to put behind a hero, a section or a card.",
  Footers: "Standalone site footers, one idea each.",
  "Blocks · General": "A hero, a split hero and a navbar to start a page with.",
  "Blocks · Grid": "Hairline frames, crosshair joints and mono details.",
  "Blocks · Folio": "Editorial sections on a narrow, square-cornered column.",
  "Blocks · Context": "Blueprint panels, dashed boxes and pixel streams for developer products.",
  "Blocks · ORO": "Warm, data-heavy sections with sun glows and growth charts.",
  "Blocks · Roma": "Consumer-app pages: mosaic hero, loud orange band, pill buttons and phone mockups.",
  "Pixel Art 3D": "Isometric WebGL dioramas you can zoom and turn.",
  "Pixel Art 2D": "Flat sprite-style scenes on a tiny canvas.",
};

const GROUP_LEDES: Record<string, string> = {
  Components: "Save components you reuse often. They're stored in your browser.",
  Backgrounds: "Each one wraps its children, so drop your content straight inside.",
  Footers:
    "ASCII, cursor-reactive dots, motion, scenery, gradient, outline wordmark, terminal and newsletter. They share the Footer Kit.",
  "Blocks · General": "Full-width sections. Previews are scaled down here; open one to see it at size.",
  "Blocks · Grid": "Navbar, hero, features, steps, footer and a full landing page, built on the Grid Frame kit.",
  "Blocks · Folio": "Navbar to footer plus a full landing page, sharing the Folio Kit.",
  "Blocks · Context": "Navbar to footer plus a full landing page, sharing the Context Kit.",
  "Blocks · ORO": "Navbar to footer plus a full landing page, sharing the ORO Kit.",
  "Blocks · Roma": "Navbar to footer plus a full landing page, sharing the Roma Kit.",
  "Pixel Art 3D": "Toon-lit, pixelated three.js scenes built on the Iso Scene kit. Needs three and @react-three/fiber.",
  "Pixel Art 2D": "Frame-by-frame animation, parallax and dithered skies on the Pixel 2D kit. No WebGL.",
};

export default function ComponentsPage() {
  return (
    <FolioSection>
      <FolioContainer>
        <PageHeader
          eyebrow="Component library"
          title="Components"
          description={`${registry.length} run live on this site with copyable source.`}
        />

        {groupRegistry(registry).map((group, g) => (
          <section key={group.name} className="pt-12">
            <FolioSectionHead
              className={g === 0 ? "border-t-0 pt-0" : undefined}
              eyebrow={`${group.name} · ${group.items.length}`}
              title={GROUP_TITLES[group.name] ?? group.name}
              lede={GROUP_LEDES[group.name]}
            />
            <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <li key={item.slug} className="flex min-w-0">
                  <ComponentCard item={item} index={i} />
                </li>
              ))}
            </ol>
          </section>
        ))}
      </FolioContainer>
    </FolioSection>
  );
}
