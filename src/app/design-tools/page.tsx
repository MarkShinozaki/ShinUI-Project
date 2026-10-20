import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { FolioBrackets, FolioLabel, FolioSectionHead } from "@/components/folio/kit";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { ShinToolCard } from "@/components/shin-tool-card";
import { designToolResources } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Design Tools",
  description:
    "Spline, Three.js, Rive, Remotion, shader playgrounds and the other tools used to design motion and 3D on the web.",
};

export default function DesignToolsPage() {
  const items = designToolResources();

  return (
    <FolioSection className="min-h-[50vh]">
      <FolioContainer>
        <PageHeader
          eyebrow="Design tools"
          title="Design Tools"
          description="Spline, Three.js, Rive, Remotion, shader playgrounds and the other tools for designing motion and 3D on the web."
        />

        <section className="pt-12">
          <FolioSectionHead
            className="border-t-0 pt-0"
            eyebrow="Tools on Shin UI"
            title="Utilities that run entirely in your browser."
          />
          <div className="mt-8 grid gap-3 md:grid-cols-[1.6fr_1fr]">
            <ShinToolCard
              href="/design-tools/favicon-studio"
              title="Favicon Studio"
              description="Generate favicon.ico, PNG sizes, SVG, web manifest, and HTML from an image, text, or emoji."
              icon={<Sparkles />}
            />
            <div className="relative flex flex-col justify-between border border-dashed border-(--fo-line-strong) p-5">
              <FolioBrackets />
              <FolioLabel>002 · Coming soon</FolioLabel>
              <p className="mt-6 text-[14.5px] leading-relaxed text-(--fo-soft)">
                More built-in utilities will land here, on the same grid with the same export quality.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <FolioSectionHead
            eyebrow={`Curated · ${items.length}`}
            title="External tools indexed on Shin UI."
            lede="Open any card for credits and links."
          />
          <ol className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((resource, i) => (
              <li key={resource.slug} className="flex">
                <ResourceCard resource={resource} index={i} className="w-full" />
              </li>
            ))}
          </ol>
        </section>
      </FolioContainer>
    </FolioSection>
  );
}
