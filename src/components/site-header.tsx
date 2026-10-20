"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandMorph } from "@/components/brand-morph";
import { FolioButton, FolioLabel } from "@/components/folio/kit";
import { GridNavbar } from "@/components/grid/navbar";
import { GitHubStarLink } from "@/components/github-stars";

import { categories } from "@/data/categories";
import { primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Wordmark only: "ShinUI", morphing into 篠崎 on hover / focus. */
function Brand() {
  return <BrandMorph />;
}

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className="-mr-2 flex h-10 cursor-pointer items-center gap-2 px-2 font-mono text-[11px] tracking-[0.12em] text-(--fo-soft) uppercase"
    >
      {open ? "Close" : "Menu"}
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
        {open ? <path d="M4 4l8 8M12 4l-8 8" /> : <path d="M2.5 6h11M2.5 10h11" />}
      </svg>
    </button>
  );
}

/**
 * Sticky site header. Desktop (`lg`+) is the Design Studio grid navbar (boxed cells
 * between the page rails, see grid/navbar.tsx); below `lg` it collapses to a "Menu" bar
 * with a stacked sheet.
 */
export function SiteHeader({ stars }: { stars: Promise<number | null> }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-(--fo-paper) pt-safe">
      {/* Mobile / tablet */}
      <div className="border-b border-(--fo-line) bg-(--fo-paper)/90 backdrop-blur lg:hidden">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          <Brand />
          <div className="flex items-center gap-3">
            <GitHubStarLink
              stars={stars}
              className="h-10 px-1 text-(--fo-soft) transition-colors hover:text-(--fo-ink)"
            />
            <ThemeToggle className="size-8" />
            <MenuButton open={open} onClick={() => setOpen((o) => !o)} />
          </div>
        </div>
        {open && (
          <div className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t border-(--fo-line) px-5 pt-4 pb-6 [animation:fo-rise_.2s_ease-out]">
            <CommandMenu className="w-full sm:w-full" hotkey={false} />
            <nav className="mt-3">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-1.5 border-b border-(--fo-line) py-3 text-[15px]",
                    isActive(item.href) ? "text-(--fo-ink)" : "text-(--fo-soft)"
                  )}
                >
                  {isActive(item.href) && <span className="size-1.5 bg-(--fo-accent)" />}
                  {item.label}
                </Link>
              ))}
            </nav>
            <FolioLabel className="mt-6">Categories</FolioLabel>
            <nav className="mt-2 grid grid-cols-2 gap-x-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="truncate py-1.5 text-[13.5px] text-(--fo-soft) transition-colors hover:text-(--fo-ink)"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
            <FolioButton href="/browse" size="lg" className="mt-6 w-full">
              Browse the index
            </FolioButton>
          </div>
        )}
      </div>

      {/* Desktop: Design Studio grid navbar */}
      <div className="hidden lg:block">
        <GridNavbar isActive={isActive} stars={stars} />
      </div>
    </header>
  );
}
