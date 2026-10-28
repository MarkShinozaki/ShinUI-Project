import type { Metadata } from "next";

import { ComponentCard } from "@/components/component-card";
import { FolioSectionHead } from "@/components/folio/kit";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { registry } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description: "Live ShinUI components with source code you can preview and copy.",
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
      </FolioContainer>
    </FolioSection>
  );
}
