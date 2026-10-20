"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GitHubIcon } from "@/components/icons";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { FolioButton, FolioLabel, FolioMark } from "@/components/folio/kit";

import { categories } from "@/data/categories";
import { primaryNav } from "@/lib/nav";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Folio brand: folded-page mark + wordmark. */
function Brand() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 text-[17px] font-semibold tracking-[-0.02em]"
    >
      <FolioMark />
      ShinUI
    </Link>
  );
}

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className="flex cursor-pointer items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-(--fo-soft) uppercase"
    >
      {open ? "Close" : "Menu"}
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
        {open ? <path d="M4 4l8 8M12 4l-8 8" /> : <path d="M2.5 6h11M2.5 10h11" />}
      </svg>
    </button>
  );
}

/**
 * Folio topbar (Design Studio `FolioNavbar variant="topbar"`): sticky hairline
 * bar, brand left, links with an accent underline on the current page, CTA
 * right. Collapses to a "Menu" bar with a stacked sheet below `lg`.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-(--fo-line) bg-(--fo-paper)/90 backdrop-blur pt-safe">
      {/* Mobile / tablet */}
      <div className="lg:hidden">
        <div className="flex h-14 items-center justify-between gap-4 px-5">
          <Brand />
          <div className="flex items-center gap-3">
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

      {/* Desktop */}
      <div className="mx-auto hidden h-16 max-w-6xl items-center gap-8 px-8 lg:flex">
        <Brand />
        <ul className="flex flex-1 items-center gap-5 text-[13.5px]">
          {primaryNav.map((item) => {
            const on = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-1 py-5 whitespace-nowrap transition-colors duration-200",
                    on ? "text-(--fo-ink)" : "text-(--fo-soft) hover:text-(--fo-ink)"
                  )}
                >
                  {item.label}
                  {on && <span className="absolute inset-x-0 -bottom-px h-px bg-(--fo-accent)" />}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-1">
          <CommandMenu className="w-44 sm:w-44" />
          <ThemeToggle />
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="grid size-9 place-items-center text-(--fo-soft) transition-colors hover:text-(--fo-ink)"
          >
            <GitHubIcon className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
