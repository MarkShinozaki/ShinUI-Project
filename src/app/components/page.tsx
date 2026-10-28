import type { Metadata } from "next";

import { ComponentCard } from "@/components/component-card";
import { FolioSectionHead } from "@/components/folio/kit";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { groupRegistry, registry } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description: "Live ShinUI components with source code you can preview and copy.",
};

const GROUP_TITLES: Record<string, string> = {
  Components: "Interactive previews with the exact source that renders them.",
  Backgrounds: "Animated surfaces to put behind a hero, a section or a card.",
};

const GROUP_LEDES: Record<string, string> = {
  Components: "Save components you reuse often. They're stored in your browser.",
  Backgrounds: "Each one wraps its children, so drop your content straight inside.",
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

        {groupRegistry(registry).map((group, g) => (
          <section key={group.name} className="pt-12">
            <FolioSectionHead
              className={g === 0 ? "border-t-0 pt-0" : undefined}
              eyebrow={`${group.name} · ${group.items.length}`}
              title={GROUP_TITLES[group.name] ?? group.name}
              lede={GROUP_LEDES[group.name]}
            />
            <ol className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item, i) => (
                <li key={item.slug} className="flex min-w-0">
                  <ComponentCard item={item} index={i} />
                </li>
              ))}
            </ol>
          </section>
        ))}
      </FolioContainer>
    </FolioSection>
  );
}
