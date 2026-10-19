import type { Metadata } from "next";

import { FaviconStudioLoader } from "@/components/favicon-studio/favicon-studio-loader";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        breadcrumbs={[
          { href: "/design-tools", label: "Design Tools" },
          { href: "/design-tools/favicon-studio", label: "Favicon Studio" },
        ]}
        title="Favicon Studio"
        description="Every favicon your site needs, from one image, text, or emoji. Export ICO, PNG sizes, SVG, web manifest, and a ready-to-paste HTML snippet."
      />
      <div className="mt-8">
        <FaviconStudioLoader />
      </div>
    </div>
  );
}
