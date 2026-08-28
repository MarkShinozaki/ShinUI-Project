import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryIcon } from "@/components/category-icon";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        title="Categories"
        description="Seventeen buckets covering the whole surface of front-end design work — pick the shape of the problem you have."
      />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const count = resources.filter(
            (r) => r.category === category.slug
          ).length;
          const liveCount = registry.filter(
            (r) => r.category === category.slug
          ).length;

          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group bg-card relative flex flex-col overflow-hidden rounded-xl border p-5 transition-all hover:shadow-md"
            >
              <div
                aria-hidden
                className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative flex flex-1 flex-col">
                <span className="bg-background grid size-10 place-items-center rounded-lg border">
                  <CategoryIcon
                    name={category.icon}
                    className="text-muted-foreground group-hover:text-foreground size-4.5 transition-colors"
                  />
                </span>

                <h2 className="mt-4 font-semibold tracking-tight">
                  {category.name}
                </h2>
                <p className="text-muted-foreground mt-1.5 flex-1 text-sm">
                  {category.description}
                </p>

                <div className="text-muted-foreground mt-4 flex items-center gap-3 text-xs">
                  <span className="tabular-nums">{count} resources</span>
                  {liveCount > 0 && (
                    <span className="text-brand tabular-nums">
                      {liveCount} live
                    </span>
                  )}
                  <ArrowRight className="ml-auto size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
