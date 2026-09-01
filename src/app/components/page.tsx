import type { Metadata } from "next";

import { ComponentCard } from "@/components/component-card";
import { ComponentsCatalog } from "@/components/components-catalog";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        title="Components"
        description={`${registry.length} run live on this site with copyable source. ${catalog.total > 0 ? `${catalog.total} more install via CLI` : ""} from registries we can fetch automatically.`}
      />

      <section>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Live on ShinUI
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Interactive previews with the exact source file that renders them.
              Save components you reuse often — stored in your browser.
            </p>
          </div>
          <Badge variant="brand">{registry.length}</Badge>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {registry.map((item) => (
            <ComponentCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {catalog.total > 0 && (
        <section id="catalog" className="mt-16 border-t pt-14">
          <div className="mb-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Installable from registries
            </h2>
            <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
              Fetched from public indexes where available ({catalog.sources
                .filter((s) => s.ok)
                .map((s) => s.name)
                .join(", ")}
              ). Most indexed sites are browse-only links — only registries with
              open catalogs appear here.
            </p>
          </div>
          <ComponentsCatalog items={catalog.items} sources={catalog.sources} />
        </section>
      )}
    </div>
  );
}
