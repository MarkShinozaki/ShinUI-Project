import type { Metadata } from "next";

import { ComponentCard } from "@/components/component-card";
import { ComponentsCatalog } from "@/components/components-catalog";
import { FolioSectionHead } from "@/components/folio/kit";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { registry } from "@/registry";
import { getRegistryCatalog } from "@/lib/registry-catalog";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Live ShinUI components with source code, plus installable items fetched from public shadcn-compatible registries.",
};

export default async function ComponentsPage() {
  const catalog = await getRegistryCatalog();

  return (
    <FolioSection>
      <FolioContainer>
        <PageHeader
          eyebrow="Component library"
          title="Components"
          description={`${registry.length} run live on this site with copyable source.${catalog.total > 0 ? ` ${catalog.total} more install via CLI from registries we can fetch automatically.` : ""}`}
        />

        <section className="pt-12">
          <FolioSectionHead
            className="border-t-0 pt-0"
            eyebrow={`Live on ShinUI · ${registry.length}`}
            title="Interactive previews with the exact source that renders them."
            lede="Save components you reuse often. They're stored in your browser."
          />
          <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {registry.map((item, i) => (
              <li key={item.slug} className="flex min-w-0">
                <ComponentCard item={item} index={i} />
              </li>
            ))}
          </ol>
        </section>

        {catalog.total > 0 && (
          <section id="catalog" className="mt-16">
            <FolioSectionHead
              eyebrow={`Installable · ${catalog.total}`}
              title="Installable from registries."
              lede={`Fetched from public indexes where available (${catalog.sources
                .filter((s) => s.ok)
                .map((s) => s.name)
                .join(", ")}). Most indexed sites are browse-only links; only registries with open catalogs appear here.`}
            />
            <div className="mt-8">
              <ComponentsCatalog items={catalog.items} sources={catalog.sources} />
            </div>
          </section>
        )}
      </FolioContainer>
    </FolioSection>
  );
}
