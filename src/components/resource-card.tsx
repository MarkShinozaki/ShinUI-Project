"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SaveButton } from "@/components/save-button";
import { getAuthor } from "@/data/authors";
import { getCategory } from "@/data/categories";
import type { Resource } from "@/data/types";
import { cn, faviconFor, hostnameOf } from "@/lib/utils";

const pricingLabel: Record<Resource["pricing"], string> = {
  free: "Free",
  "open-source": "Open source",
  freemium: "Freemium",
  paid: "Paid",
  unknown: "Unknown",
};

export function ResourceCard({
  resource,
  index,
  className,
}: {
  resource: Resource;
  /** Optional position; renders a folio-style 001 index. */
  index?: number;
  className?: string;
}) {
  const author = getAuthor(resource.authorId);
  const category = getCategory(resource.category);
  const href = resource.userSubmitted
    ? `/resource/added/${resource.slug}`
    : `/resource/${resource.slug}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col border border-(--fo-line) bg-(--fo-paper) p-4 transition-colors duration-200 hover:border-(--fo-accent)",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center overflow-hidden border border-(--fo-line) bg-(--fo-well)">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faviconFor(resource.url)}
            alt=""
            width={18}
            height={18}
            loading="lazy"
            decoding="async"
            className="size-[18px]"
          />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-[14.5px] leading-snug font-medium">
            <Link href={href} className="transition-colors hover:text-(--fo-accent)">
              {resource.name}
            </Link>
          </h3>
          <p className="mt-0.5 truncate font-mono text-[10.5px] tracking-[0.06em] text-(--fo-faint)">
            {hostnameOf(resource.url)}
          </p>
        </div>

        <div className="relative z-10 flex shrink-0 items-center gap-1.5">
          {index !== undefined && (
            <span className="font-mono text-[10px] text-(--fo-faint) group-hover:text-(--fo-accent)">
              {String(index + 1).padStart(3, "0")}
            </span>
          )}
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${resource.name} in a new tab`}
            className="inline-flex h-8 items-center gap-1 border border-(--fo-line) bg-(--fo-paper) px-2 font-mono text-[10px] tracking-[0.1em] text-(--fo-soft) uppercase transition-colors hover:border-(--fo-accent) hover:text-(--fo-ink)"
          >
            Open
            <ArrowUpRight className="size-3" />
          </a>
          <SaveButton kind="resource" id={resource.slug} url={resource.url} />
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-[13.5px] leading-relaxed text-(--fo-soft)">
        {resource.tagline}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {resource.userSubmitted && <Badge variant="brand">Yours</Badge>}
        {category && <Badge variant="muted">{category.short}</Badge>}
        {resource.linkStatus === "dead" && (
          <Badge variant="outline" title={resource.notes}>
            Link down
          </Badge>
        )}
        {resource.linkStatus === "uncertain" && (
          <Badge variant="outline" title={resource.notes}>
            Unverified
          </Badge>
        )}
        <Badge variant={resource.pricing === "paid" || resource.pricing === "freemium" ? "outline" : "brand"}>
          {pricingLabel[resource.pricing] ?? "Unknown"}
        </Badge>
        {resource.stack.slice(0, 2).map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <p className="w-full border-t border-dashed border-(--fo-line-strong) pt-3 text-[12px] text-(--fo-faint)">
          {author ? (
            <>
              by <span className="text-(--fo-ink)">{author.name}</span>
              {author.handle && <span className="ml-1">{author.handle}</span>}
            </>
          ) : (
            hostnameOf(resource.url)
          )}
        </p>
      </div>
    </article>
  );
}
