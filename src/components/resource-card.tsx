import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getAuthor } from "@/data/authors";
import { getCategory } from "@/data/categories";
import type { Resource } from "@/data/types";
import { cn, faviconFor, hostnameOf } from "@/lib/utils";

const pricingLabel: Record<Resource["pricing"], string> = {
  free: "Free",
  "open-source": "Open source",
  freemium: "Freemium",
  paid: "Paid",
};

export function ResourceCard({
  resource,
  className,
}: {
  resource: Resource;
  className?: string;
}) {
  const author = getAuthor(resource.authorId);
  const category = getCategory(resource.category);

  return (
    <article
      className={cn(
        "group bg-card relative flex flex-col rounded-xl border p-4 transition-all hover:shadow-md sm:p-5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="bg-muted grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border">
          {/* Favicons keep the grid recognisable without hosting logo assets. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faviconFor(resource.url)}
            alt=""
            width={20}
            height={20}
            loading="lazy"
            className="size-5"
          />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="leading-tight font-semibold tracking-tight">
            <Link
              href={`/resource/${resource.slug}`}
              className="after:absolute after:inset-0"
            >
              {resource.name}
            </Link>
          </h3>
          <p className="text-muted-foreground mt-0.5 truncate text-xs">
            {hostnameOf(resource.url)}
          </p>
        </div>

        <ArrowUpRight className="text-muted-foreground size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <p className="text-muted-foreground mt-3 line-clamp-2 text-sm">
        {resource.tagline}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {category && (
          <Badge variant="muted" className="text-[11px]">
            {category.short}
          </Badge>
        )}
        <Badge
          variant={
            resource.pricing === "paid"
              ? "outline"
              : resource.pricing === "freemium"
                ? "secondary"
                : "brand"
          }
          className="text-[11px]"
        >
          {pricingLabel[resource.pricing]}
        </Badge>
        {resource.stack.slice(0, 2).map((item) => (
          <Badge key={item} variant="outline" className="text-[11px]">
            {item}
          </Badge>
        ))}
      </div>

      {author && (
        <p className="text-muted-foreground mt-3 border-t pt-3 text-xs">
          by <span className="text-foreground font-medium">{author.name}</span>
          {author.handle && <span className="ml-1">{author.handle}</span>}
        </p>
      )}
    </article>
  );
}
