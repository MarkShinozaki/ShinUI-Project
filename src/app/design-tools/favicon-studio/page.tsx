import type { Metadata } from "next";

import { FaviconStudioLoader } from "@/components/favicon-studio/favicon-studio-loader";
import { FolioBrackets, FolioLabel } from "@/components/folio/kit";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Favicon Studio",
  description:
    "Generate every favicon your site needs from one image, text, or emoji. ICO, PNG sizes, SVG, web manifest, and HTML snippet — 100% in your browser.",
  keywords: [
    "favicon generator",
    "favicon maker",
    "ico generator",
    "apple touch icon",
    "web manifest",
    "pwa icons",
  ],
  openGraph: {
    title: "Favicon Studio — Shin UI",
    description:
      "Create favicon.ico, PNG sizes, favicon.svg, and site.webmanifest locally in your browser.",
  },
};

export default function FaviconStudioPage() {
  return (
    <FolioSection className="min-h-[50vh]">
      <FolioContainer>
        <PageHeader
          breadcrumbs={[
            { href: "/design-tools", label: "Design Tools" },
            { href: "/design-tools/favicon-studio", label: "Favicon Studio" },
          ]}
          title="Favicon Studio"
          description="Every favicon your site needs, from one image, text, or emoji. Export ICO, PNG sizes, SVG, web manifest, and a ready-to-paste HTML snippet."
        />
        <div className="pt-10">
          <div className="mb-3 flex items-center justify-between">
            <FolioLabel>Tool · runs in your browser</FolioLabel>
            <FolioLabel className="text-(--fo-accent)">001</FolioLabel>
          </div>
          <div className="relative border border-(--fo-line) p-3 sm:p-5">
            <FolioBrackets inset={-1} />
            <FaviconStudioLoader />
          </div>
        </div>
      </FolioContainer>
    </FolioSection>
  );
}
