import type { Metadata } from "next";

import { BrowseExplorer } from "@/components/browse-explorer";
import { PageHeader } from "@/components/page-header";
import { resources } from "@/data/resources";

export const metadata: Metadata = {
  title: "Browse",
  description:
    "Search and filter every UI library, block set, motion system, shader tool, icon pack and design utility in the index.",
};

export default function BrowsePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        title="Browse everything"
        description={`${resources.length} curated resources across ${new Set(resources.map((r) => r.category)).size} categories. Filter by stack, pricing or category — or just start typing.`}
      />
      <div className="mt-8">
        <BrowseExplorer resources={resources} />
      </div>
    </div>
  );
}
