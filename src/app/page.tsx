import Link from "next/link";
import { ArrowRight, Layers, Search, Sparkles } from "lucide-react";

import { GitHubIcon } from "@/components/icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/category-icon";
import { ResourceCard } from "@/components/resource-card";
import { RegistryDemo } from "@/registry/demo-map";
import { categories } from "@/data/categories";
import { resources } from "@/data/resources";
import { registry } from "@/registry";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const featured = resources.filter((r) => r.featured).slice(0, 6);
  const showcase = registry.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="grid-pattern absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden
          className="bg-brand/20 absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full blur-[120px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="bg-background/60 backdrop-blur">
              <Sparkles className="size-3" />
              {resources.length} resources · {categories.length} categories ·{" "}
              {registry.length} live components
            </Badge>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Every design resource you keep losing,{" "}
              <span className="text-brand">in one place</span>
            </h1>

            <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base text-pretty sm:text-lg">
              {resources.length} external tools and libraries — indexed, searchable
              and credited to whoever built them. Plus {registry.length} components
              you can preview live and copy straight into your project.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="xl" asChild>
                <Link href="/browse">
                  <Search className="size-4" />
                  Browse resources
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/components">
                  <Layers className="size-4" />
                  See live components
                </Link>
              </Button>
            </div>

            <p className="text-muted-foreground mt-4 text-xs">
              Press{" "}
              <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono">
                ⌘K
              </kbd>{" "}
              anywhere to search
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading
          title="Browse by category"
          description="Seventeen buckets, from headless primitives to shader playgrounds."
          href="/categories"
          linkLabel="All categories"
        />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const count = resources.filter(
              (r) => r.category === category.slug
            ).length;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group bg-card relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md"
              >
                <div
                  aria-hidden
                  className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                />
                <div className="relative">
                  <span className="bg-background grid size-9 place-items-center rounded-lg border">
                    <CategoryIcon
                      name={category.icon}
                      className="text-muted-foreground group-hover:text-foreground size-4 transition-colors"
                    />
                  </span>
                  <p className="mt-3 text-sm leading-tight font-medium">
                    {category.name}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs tabular-nums">
                    {count} {count === 1 ? "resource" : "resources"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeading
            title="Live components"
            description="Not screenshots. These render right here, and the source is one tab away."
            href="/components"
            linkLabel="All components"
          />

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {showcase.map((item) => (
              <Link
                key={item.slug}
                href={`/components/${item.slug}`}
                className="group bg-background overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
              >
                <div className="flex min-h-44 items-center justify-center overflow-hidden p-6">
                  <div className="pointer-events-none w-full">
                    <div className="flex w-full justify-center">
                      <RegistryDemo name={item.demoExport} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {item.tags.slice(0, 3).join(" · ")}
                    </p>
                  </div>
                  <ArrowRight className="text-muted-foreground ml-auto size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading
          title="Featured resources"
          description="The ones worth knowing about even if you never use them."
          href="/browse"
          linkLabel="Browse all"
        />

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border p-8 text-center sm:p-12">
          <div
            aria-hidden
            className="bg-brand/15 absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full blur-[90px]"
          />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Know something that belongs here?
            </h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm sm:text-base">
              The index lives in a single typed file. Add an entry, open a pull
              request, and it shows up everywhere — search, categories, filters.
            </p>
            <Button size="lg" variant="outline" asChild className="mt-6">
              <a href={SITE.repo} target="_blank" rel="noreferrer">
                <GitHubIcon className="size-4" />
                Contribute on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link href={href}>
          {linkLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
