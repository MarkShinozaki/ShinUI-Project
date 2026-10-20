import type { Metadata } from "next";
import Link from "next/link";

import { CategoryIcon } from "@/components/category-icon";
import { ArrowUpRight } from "@/components/folio/kit";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { categories } from "@/data/categories";
import { resources } from "@/data/resources";
import { registry } from "@/registry";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Every category in the ShinUI index, from component libraries and blocks through shaders, themes, mockups and iOS patterns.",
};

export default function CategoriesPage() {
  return (
    <FolioSection className="min-h-[50vh]">
      <FolioContainer>
        <PageHeader
          eyebrow="Resource listings"
          title="Categories"
          description={`${categories.length} buckets covering the whole surface of front-end design work. Pick the shape of the problem you have.`}
        />

        <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => {
            const count = resources.filter((r) => r.category === category.slug).length;
            const liveCount = registry.filter((r) => r.category === category.slug).length;

            return (
              <li key={category.slug} className="flex">
                <Link
                  href={`/categories/${category.slug}`}
                  className="group flex w-full flex-col border border-(--fo-line) bg-(--fo-paper) p-4 transition-colors duration-200 hover:border-(--fo-accent)"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid size-9 place-items-center border border-(--fo-line) bg-(--fo-well) text-(--fo-soft) transition-colors group-hover:text-(--fo-accent)">
                      <CategoryIcon name={category.icon} className="size-4" />
                    </span>
                    <span className="font-mono text-[10px] text-(--fo-faint) group-hover:text-(--fo-accent)">
                      {String(i + 1).padStart(3, "0")}
                    </span>
                  </div>
                  <h2 className="mt-4 text-[15.5px] font-medium tracking-[-0.01em]">{category.name}</h2>
                  <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-(--fo-soft)">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 border-t border-dashed border-(--fo-line-strong) pt-3 font-mono text-[10.5px] tracking-[0.1em] text-(--fo-faint) uppercase">
                    <span className="tabular-nums">{count} resources</span>
                    {liveCount > 0 && <span className="text-(--fo-accent) tabular-nums">{liveCount} live</span>}
                    <ArrowUpRight className="ml-auto transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--fo-accent)" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </FolioContainer>
    </FolioSection>
  );
}
