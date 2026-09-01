"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SaveButton } from "@/components/save-button";
import { Badge } from "@/components/ui/badge";
import { RegistryDemo } from "@/registry/demo-map";
import type { RegistryItem } from "@/registry";
import { getCategory } from "@/data/categories";

export function RegistryComponentCard({ item }: { item: RegistryItem }) {
  const category = getCategory(item.category);

  return (
    <div className="group bg-card relative flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md">
      <div className="absolute top-3 right-3 z-10">
        <SaveButton kind="component" id={item.slug} />
      </div>

      <Link
        href={`/components/${item.slug}`}
        className="flex flex-1 flex-col"
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
    </div>
  );
}
