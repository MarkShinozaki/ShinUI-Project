import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { BrowseExplorer } from "@/components/browse-explorer";
import { CategoryIcon } from "@/components/category-icon";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { RegistryDemo } from "@/registry/demo-map";
import { categories, getCategory } from "@/data/categories";
import { resourcesByCategory } from "@/data/resources";
import { registryByCategory } from "@/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = resourcesByCategory(category.slug);
  const live = registryByCategory(category.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        breadcrumbs={[
          { href: "/categories", label: "Categories" },
          { href: `/categories/${category.slug}`, label: category.short },
        ]}
        eyebrow={
          <span className="bg-card mb-3 grid size-11 place-items-center rounded-xl border">
            <CategoryIcon name={category.icon} className="size-5" />
          </span>
        }
        title={category.name}
        description={category.description}
      />

      {live.length > 0 && (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Live in this category
            </h2>
            <Badge variant="brand">{live.length} components</Badge>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {live.map((item) => (
              <Link
                key={item.slug}
                href={`/components/${item.slug}`}
                className="group bg-card overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
              >
                <div className="flex min-h-40 items-center justify-center p-6">
                  <div className="pointer-events-none flex w-full justify-center">
                    <RegistryDemo name={item.demoExport} />
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t px-4 py-3">
                  <p className="text-sm font-medium">{item.name}</p>
                  <ArrowRight className="text-muted-foreground ml-auto size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="mb-5 text-lg font-semibold tracking-tight">
          {items.length} {items.length === 1 ? "resource" : "resources"}
        </h2>
        <BrowseExplorer
          resources={items}
          initialCategory={category.slug}
          lockCategory
        />
      </section>
    </div>
  );
}
