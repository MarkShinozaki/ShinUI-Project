"use client";

import * as React from "react";
import { Star } from "lucide-react";

import { GitHubIcon } from "@/components/icons";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/** 950 → "950", 1234 → "1.2k", 12500 → "12.5k", 1_200_000 → "1.2m". */
export function formatStars(n: number): string {
  if (n < 1000) return String(n);
  const [v, unit] = n < 999_950 ? [n / 1000, "k"] : [n / 1_000_000, "m"];
  return `${v >= 100 ? Math.round(v) : Number(v.toFixed(1))}${unit}`;
}

function StarCount({ stars }: { stars: Promise<number | null> }) {
  const n = React.use(stars);
  if (n == null) return null;
  return (
    <span className="flex items-center gap-1 font-mono text-[11px] tracking-wider tabular-nums" aria-hidden>
      <Star className="size-3.5 fill-current text-(--fo-accent)" strokeWidth={1.5} />
      {formatStars(n)}
    </span>
  );
}

function Label({ stars }: { stars: Promise<number | null> }) {
  const n = React.use(stars);
  return (
    <span className="sr-only">
      {n == null
        ? "ShinUI on GitHub"
        : `Star ShinUI on GitHub, ${n.toLocaleString("en-US")} ${n === 1 ? "star" : "stars"}`}
    </span>
  );
}

/**
 * GitHub link with the repo's star count. The count streams in from a server promise
 * (fetched in the root layout, cached for an hour) so it never blocks rendering; while
 * pending, or if the fetch failed / was rate-limited, it is just the GitHub icon.
 */
export function GitHubStarLink({
  stars,
  className,
}: {
  stars: Promise<number | null>;
  className?: string;
}) {
  return (
    <a href={SITE.repo} target="_blank" rel="noreferrer" className={cn("flex items-center gap-2", className)}>
      <GitHubIcon className="size-4 shrink-0" />
      <React.Suspense fallback={<span className="sr-only">ShinUI on GitHub</span>}>
        <Label stars={stars} />
        <StarCount stars={stars} />
      </React.Suspense>
    </a>
  );
}
