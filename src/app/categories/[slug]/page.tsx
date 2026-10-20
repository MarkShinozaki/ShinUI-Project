import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrowseExplorer } from "@/components/browse-explorer";
import { CategoryIcon } from "@/components/category-icon";
import { PageHeader } from "@/components/page-header";
import { ComponentCard } from "@/components/component-card";
import { FolioLabel } from "@/components/folio/kit";
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
    <div className="mx-auto max-w-6xl px-6 md:px-10">
      <PageHeader
        breadcrumbs={[
          { href: "/categories", label: "Categories" },
          { href: `/categories/${category.slug}`, label: category.short },
        ]}
        eyebrow={
          <span className="mb-5 grid size-11 place-items-center border border-(--fo-line) bg-(--fo-well) text-(--fo-accent)">
            <CategoryIcon name={category.icon} className="size-5" />
          </span>
        }
        title={category.name}
        description={category.description}
      />

      {live.length > 0 && (
        <section className="mt-10">
          <FolioLabel>Live in this category · {live.length}</FolioLabel>
          <ol className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {live.map((item, i) => (
              <li key={item.slug} className="flex min-w-0">
                <ComponentCard item={item} index={i} />
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="mt-12">
        <FolioLabel className="mb-5">
          {items.length} {items.length === 1 ? "resource" : "resources"}
        </FolioLabel>
        <BrowseExplorer
          resources={items}
          initialCategory={category.slug}
          lockCategory
        />
      </section>
    </div>
  );
}
