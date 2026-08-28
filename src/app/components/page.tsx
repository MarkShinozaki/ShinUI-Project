import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ComponentsCatalog } from "@/components/components-catalog";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { RegistryDemo } from "@/registry/demo-map";
import { getCategory } from "@/data/categories";
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
            </p>
          </div>
          <Badge variant="brand">{registry.length}</Badge>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {registry.map((item) => {
            const category = getCategory(item.category);
            return (
              <Link
                key={item.slug}
                href={`/components/${item.slug}`}
                className="group bg-card flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
              >
                <div className="checker-pattern flex min-h-52 items-center justify-center p-6">
                  <div className="bg-background pointer-events-none flex w-full justify-center rounded-lg border p-6">
                    <RegistryDemo name={item.demoExport} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col border-t p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold tracking-tight">{item.name}</h3>
                    {category && (
                      <Badge variant="muted" className="text-[11px]">
                        {category.short}
                      </Badge>
                    )}
                    <ArrowRight className="text-muted-foreground ml-auto size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
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
