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
    <FolioSection className="min-h-[50vh]">
      <FolioContainer>
        <PageHeader
          eyebrow="Full index"
          title="Browse everything"
          description={`${resources.length} curated resources across ${new Set(resources.map((r) => r.category)).size} categories. Save sites you use often, add your own URLs, and filter by stack or pricing.`}
        />
        <div className="pt-10">
          <BrowseExplorer resources={resources} />
        </div>
      </FolioContainer>
    </FolioSection>
  );
}
