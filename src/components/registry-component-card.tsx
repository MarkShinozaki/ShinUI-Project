"use client";

import Link from "next/link";

import { SaveButton } from "@/components/save-button";
import { ArrowUpRight, FolioBrackets } from "@/components/folio/kit";
import { RegistryDemo } from "@/registry/demo-map";
import type { RegistryItem } from "@/registry";
import { getCategory } from "@/data/categories";

export function RegistryComponentCard({
  item,
  index,
}: {
  item: RegistryItem;
  /** Optional position; renders a folio-style 001 index. */
  index?: number;
}) {
  const category = getCategory(item.category);

  return (
    <div className="group relative flex h-full w-full flex-col border border-(--fo-line) bg-(--fo-paper) p-3 transition-colors duration-200 hover:border-(--fo-accent)">
      <Link href={`/components/${item.slug}`} className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2 px-1 pt-1 pr-9">
          <div className="min-w-0">
            <h3 className="text-[14.5px] leading-snug font-medium">{item.name}</h3>
            {category && (
              <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-(--fo-faint) uppercase">
                {category.short}
              </p>
            )}
          </div>
          {index !== undefined && (
            <span className="font-mono text-[10px] text-(--fo-faint) group-hover:text-(--fo-accent)">
              {String(index + 1).padStart(3, "0")}
            </span>
          )}
        </div>
        <div className="relative mt-4 p-2.5">
          <FolioBrackets />
          <div className="fo-dots pointer-events-none flex min-h-48 items-center justify-center overflow-hidden bg-(--fo-well)/60 p-6">
            <div className="flex w-full justify-center">
              <RegistryDemo name={item.demoExport} />
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 px-1 pt-3 pb-1">
          <p className="line-clamp-2 flex-1 text-[13.5px] leading-relaxed text-(--fo-soft)">
            {item.description}
          </p>
          <ArrowUpRight className="mt-1 text-(--fo-faint) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--fo-accent)" />
        </div>
      </Link>
      <div className="absolute top-3 right-3 z-10">
        <SaveButton kind="component" id={item.slug} />
      </div>
    </div>
  );
}
