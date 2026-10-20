import type { Metadata } from "next";

import { BrowseExplorer } from "@/components/browse-explorer";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { resources } from "@/data/resources";

export const metadata: Metadata = {
  title: "Browse",
  description:
    "Search and filter every UI library, block set, motion system, shader tool, icon pack and design utility in the index.",
};

export default function BrowsePage() {
  return (
    <FolioSection grid className="min-h-[50vh] pb-12 pt-8 sm:pt-12">
      <FolioContainer>
        <PageHeader
          eyebrow={
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.18em] uppercase">
              Full index
            </p>
          }
          title="Browse everything"
          description={`${resources.length} curated resources across ${new Set(resources.map((r) => r.category)).size} categories. Save sites you use often, add your own URLs, and filter by stack or pricing.`}
        />
        <div className="folio-block mt-8 p-4 sm:p-6">
          <BrowseExplorer resources={resources} />
        </div>
      </FolioContainer>
    </FolioSection>
  );
}
