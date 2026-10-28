"use client";

import Link from "next/link";

import { BrandMorph } from "@/components/brand-morph";
import { CommandMenu } from "@/components/command-menu";
import { GitHubStarLink } from "@/components/github-stars";
import { ThemeToggle } from "@/components/theme-toggle";
import { primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

import { GridEdge, GridSection } from "./frame";

const cell =
  "relative flex items-center border-(--gf-line) font-mono text-[11px] tracking-wider uppercase transition-colors";

/**
 * Desktop top navigation, ported from Design Studio's `GridNavbar` (variant "boxed"): every
 * item sits in its own ruled cell between the page rails, with plus markers where the cell
 * edges meet the rules, and a filled accent cell on the right (here: the ⌘K search).
 */
export function GridNavbar({
  isActive,
  stars,
}: {
  isActive: (href: string) => boolean;
  stars: Promise<number | null>;
}) {
  return (
    <GridSection edges="bottom">
      <nav className="flex h-14 items-stretch" aria-label="Primary">
        <div className="relative flex items-center border-r border-(--gf-line) px-5 font-sans">
          <BrandMorph />
          <GridEdge />
        </div>

        {primaryNav.map((item) => {
          const on = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={on ? "page" : undefined}
              className={cn(
                cell,
                "border-r px-4 whitespace-nowrap xl:px-5",
                on
                  ? "bg-(--gf-tint) text-(--fo-ink)"
                  : "text-(--fo-soft) hover:bg-(--gf-tint) hover:text-(--fo-ink)"
              )}
            >
              {item.label}
              {on && <span aria-hidden className="absolute inset-x-0 -bottom-px z-10 h-0.5 bg-(--gf-accent)" />}
              <GridEdge />
            </Link>
          );
        })}

        <div className="flex-1" />

        <div className={cn(cell, "border-l")}>
          <ThemeToggle className="size-14 rounded-none text-(--fo-soft) hover:bg-(--gf-tint) hover:text-(--fo-ink)" />
          <GridEdge side="left" />
        </div>
        <div className={cn(cell, "border-l")}>
          <GitHubStarLink
            stars={stars}
            className="h-full min-w-14 justify-center px-4 text-(--fo-soft) transition-colors hover:bg-(--gf-tint) hover:text-(--fo-ink)"
          />
          <GridEdge side="left" />
        </div>
        <CommandMenu variant="cell" className="border-l border-(--gf-line)" />
      </nav>
    </GridSection>
  );
}
