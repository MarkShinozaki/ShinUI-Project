import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        title="Design Tools"
        description="Spline, Three.js, Rive, Remotion, shader playgrounds and the other tools for designing motion and 3D on the web."
      />

      <section className="mt-8">
        <h2 className="text-sm font-semibold tracking-tight">Tools on Shin UI</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Interactive utilities that run entirely in your browser.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ShinToolCard
            href="/design-tools/favicon-studio"
            title="Favicon Studio"
            description="Generate favicon.ico, PNG sizes, SVG, web manifest, and HTML from an image, text, or emoji."
            icon={<Sparkles className="size-5" />}
          />
        </div>
      </section>

      <h2 className="mt-12 text-sm font-semibold tracking-tight">Curated resources</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((resource) => (
          <ResourceCard key={resource.slug} resource={resource} />
        ))}
      </div>
    </div>
  );
}
