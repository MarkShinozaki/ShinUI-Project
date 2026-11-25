import type { Metadata } from "next";

import { BrowseExplorer } from "@/components/browse-explorer";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { categories } from "@/data/categories";
import { resources } from "@/data/resources";

export const metadata: Metadata = {
  title: "Browse",
  description:
    "Search and jump through every UI library, motion tool, icon pack, sound kit and design resource in the index, organized by category.",
};

export default function BrowsePage() {
  return (
    <FolioSection className="min-h-[50vh]">
      <FolioContainer>
        <PageHeader
          eyebrow="Full index"
          title="Browse resources"
          description={`${resources.length} curated resources across ${categories.length} categories. Jump a section, search by name or tag, and save the ones you keep coming back to.`}
        />
        <div className="pt-10">
          <BrowseExplorer resources={resources} />
        </div>
      </FolioContainer>
    </FolioSection>
  );
}
