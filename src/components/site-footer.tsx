import Link from "next/link";

import { GitHubIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { categories } from "@/data/categories";
import { primaryNav } from "@/lib/nav";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t">
      <div className="from-muted/40 via-background to-background bg-gradient-to-b">
        <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div className="max-w-md">
              <Link
                href="/"
                className="text-lg font-semibold tracking-tight"
              >
                ShinUI
              </Link>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                A curated index of UI libraries, blocks, motion systems and
                design tools — searchable, credited and ready to copy.
              </p>
              <a
                href={SITE.repo}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground mt-5 inline-flex items-center gap-2 text-sm transition-colors"
              >
                <GitHubIcon className="size-4" />
                Source on GitHub
              </a>
            </div>

            <div>
              <p className="text-xs font-medium tracking-wide uppercase">
                Site
              </p>
              <ul className="mt-4 space-y-2.5">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-medium tracking-wide uppercase">
                Popular categories
              </p>
              <ul className="mt-4 space-y-2.5">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-muted-foreground text-xs leading-relaxed">
              Built by{" "}
              <a
                href={SITE.author.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground underline underline-offset-4"
              >
                {SITE.author.name}
              </a>
              . Every listed resource belongs to its own author.
            </p>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <p className="text-muted-foreground text-xs">
                Next.js · Tailwind · shadcn/ui
              </p>
              <ThemeToggle className="border-border/70 bg-background hover:bg-accent rounded-full border" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
