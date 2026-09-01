"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { GitHubIcon } from "@/components/icons";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CommandMenu } from "@/components/command-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { categories } from "@/data/categories";
import { primaryNav } from "@/lib/nav";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          ShinUI
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:block">
            <CommandMenu />
          </div>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:inline-flex"
          >
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <GitHubIcon className="size-4" />
            </a>
          </Button>

          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] p-0 sm:max-w-sm">
              <SheetHeader className="border-b">
                <SheetTitle>ShinUI</SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4 pb-8">
                <div className="mb-4">
                  <CommandMenu className="w-full" />
                </div>

                <nav className="flex flex-col">
                  {primaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-accent"
                          : "text-muted-foreground hover:bg-accent/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <Separator className="my-4" />

                <p className="text-muted-foreground px-3 pb-2 text-xs font-medium tracking-wide uppercase">
                  Categories
                </p>
                <nav className="flex flex-col">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/categories/${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-muted-foreground hover:bg-accent/60 hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
