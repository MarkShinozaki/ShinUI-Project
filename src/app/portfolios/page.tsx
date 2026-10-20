import type { Metadata } from "next";

import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { BentoCard, BentoGrid } from "@/registry/components/bento-grid";
import { portfolioResources } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Portfolios",
  description:
    "Personal sites and craft pages worth studying — portfolios, component registries and living experiments.",
};

export default function PortfoliosPage() {
  const items = portfolioResources();
  const featured = items.slice(0, 2);
  const rest = items.slice(2);

  return (
    <FolioSection grid className="min-h-[50vh] pb-12 pt-8 sm:pt-12">
      <FolioContainer>
        <PageHeader
          eyebrow={
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.18em] uppercase">
              Folio block
            </p>
          }
          title="Portfolios"
          description="Sites people actually shipped. Component registries, personal labs and interactive pieces — the kind of page you open when you want the work, not the template."
        />

        {featured.length > 0 && (
          <BentoGrid className="mt-10 lg:auto-rows-[minmax(12rem,auto)]">
            {featured.map((resource, i) => (
              <div
                key={resource.slug}
                className={i === 0 ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1"}
              >
                <ResourceCard resource={resource} className="h-full" />
              </div>
            ))}
          </BentoGrid>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>

        <div className="mt-12 hidden lg:block">
          <BentoGrid className="opacity-90">
            <BentoCard
              span={3}
              title="Grid-first layout"
              description="Portfolio listings use modular tiles on a visible folio grid — editorial headings up top, dense cards below."
            />
          </BentoGrid>
        </div>
      </FolioContainer>
    </FolioSection>
  );
}
