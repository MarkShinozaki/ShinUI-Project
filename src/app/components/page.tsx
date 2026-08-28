import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { RegistryDemo } from "@/registry/demo-map";
import { getCategory } from "@/data/categories";
import { registry } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Live, interactive components with their real source code — docks, spotlight cards, iOS toggles, mesh gradients and more.",
};

export default function ComponentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        title="Components"
        description="Everything below renders live on this page. Open one to resize the viewport, replay the animation and read the exact file that produced it."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                  <h2 className="font-semibold tracking-tight">{item.name}</h2>
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
    </div>
  );
}
