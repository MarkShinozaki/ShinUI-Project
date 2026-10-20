import type { Metadata } from "next";
import { PenTool, Sparkles } from "lucide-react";

import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { ShinToolCard } from "@/components/shin-tool-card";
import { BentoCard, BentoGrid } from "@/registry/components/bento-grid";
import { designToolResources } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Design Tools",
  description:
    "Spline, Three.js, Rive, Remotion, shader playgrounds and the other tools used to design motion and 3D on the web.",
};

export default function DesignToolsPage() {
  const items = designToolResources();

  return (
    <FolioSection grid className="min-h-[50vh] pb-12 pt-8 sm:pt-12">
      <FolioContainer>
        <PageHeader
          eyebrow={
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.18em] uppercase">
              Design tools
            </p>
          }
          title="Design Tools"
          description="Spline, Three.js, Rive, Remotion, shader playgrounds and the other tools for designing motion and 3D on the web."
        />

        <div className="folio-block gradient-border mt-10 p-6 sm:p-8">
          <h2 className="text-sm font-semibold tracking-tight">
            Tools on Shin UI
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Interactive utilities that run entirely in your browser.
          </p>

          <BentoGrid className="mt-6 lg:auto-rows-[9rem]">
            <div className="lg:col-span-2">
              <ShinToolCard
                href="/design-tools/favicon-studio"
                title="Favicon Studio"
                description="Generate favicon.ico, PNG sizes, SVG, web manifest, and HTML from an image, text, or emoji."
                icon={<Sparkles className="size-5" />}
                className="folio-block h-full gradient-border"
              />
            </div>
            <BentoCard
              title="More tools soon"
              description="Built-in utilities will land here as folio tiles — same grid, same export quality."
              icon={<PenTool className="size-4" />}
            />
          </BentoGrid>
        </div>

        <h2 className="mt-14 text-sm font-semibold tracking-tight">
          Curated resources
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          External tools indexed on Shin UI — open any card for credits and links.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      </FolioContainer>
    </FolioSection>
  );
}
