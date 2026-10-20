import Link from "next/link";
import { ArrowRight, Layers, Search, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

import { GitHubIcon } from "@/components/icons";

import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/category-icon";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { HeroKanjiPond } from "@/components/hero-kanji-pond";
import { BentoCard, BentoGrid } from "@/registry/components/bento-grid";
import { categories } from "@/data/categories";
import { resources } from "@/data/resources";
import { registry } from "@/registry";
import { SITE } from "@/lib/site";

const LiveComponentsSection = dynamic(
  () => import("./components/live-components-section"),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-2xl bg-muted/30" />
    ),
  }
);

const FeaturedResourcesSection = dynamic(
  () => import("./components/featured-resources-section"),
  {
    loading: () => (
      <div className="h-96 animate-pulse rounded-2xl bg-muted" />
    ),
  }
);

export default function HomePage() {
  const topCategories = categories.slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden border-b">
        <HeroBackdrop />

        <FolioContainer className="relative py-16 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground mb-4 text-xs font-medium tracking-[0.2em] uppercase">
              Design resource index
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Every design resource you keep losing,{" "}
              <span className="text-gradient-sakura">in one place</span>
            </h1>

            <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-base text-pretty sm:text-lg">
              {resources.length} external tools and libraries — indexed, searchable
              and credited to whoever built them. Plus {registry.length} components
              you can preview live and copy straight into your project.
            </p>
          </div>

          <HeroKanjiPond />

          <div className="mx-auto max-w-3xl text-center">
            <div className="mt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="xl" variant="brand" asChild>
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
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">
                ⌘K
              </kbd>{" "}
              anywhere to search
            </p>
          </div>
        </FolioContainer>
      </section>

      <FolioSection grid className="py-14 sm:py-16">
        <FolioContainer>
          <div className="folio-block gradient-border mb-8 p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Start here
                </h2>
                <p className="text-muted-foreground mt-1 max-w-xl text-sm">
                  Modular folio blocks — jump to browse, components, tools, or
                  portfolios without hunting through menus.
                </p>
              </div>
            </div>

            <BentoGrid className="mt-6 lg:auto-rows-[10rem]">
              <BentoCard
                span={2}
                href="/browse"
                title="Browse the index"
                description={`Search ${resources.length} curated links across every category.`}
                icon={<Search className="size-4" />}
                className="gradient-border"
              />
              <BentoCard
                href="/components"
                title="Live components"
                description={`${registry.length} previews with copyable source.`}
                icon={<Layers className="size-4" />}
              />
              <BentoCard
                href="/design-tools/favicon-studio"
                title="Favicon Studio"
                description="ICO, PNG, SVG, manifest — in your browser."
                icon={<Sparkles className="size-4" />}
              />
              <BentoCard
                span={2}
                href="/portfolios"
                title="Portfolios"
                description="Personal sites and craft pages worth studying."
              />
              <BentoCard
                href="/design-tools"
                title="Design tools"
                description="Motion, 3D, shaders, and utilities on the web."
              />
            </BentoGrid>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Browse by category
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Seventeen buckets, from headless primitives to shader playgrounds.
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/categories">
                All categories
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {topCategories.map((category) => {
              const count = resources.filter(
                (r) => r.category === category.slug
              ).length;
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="folio-block group relative overflow-hidden rounded-xl p-4 transition-all hover:shadow-md"
                >
                  <div
                    aria-hidden
                    className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <span className="grid size-9 place-items-center rounded-lg border bg-background">
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
        </FolioContainer>
      </FolioSection>

      <LiveComponentsSection />

      <FeaturedResourcesSection />

      <FolioSection className="pb-16">
        <FolioContainer>
          <div className="folio-block gradient-border relative overflow-hidden p-8 text-center sm:p-12">
            <div
              aria-hidden
              className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-brand/20 blur-[90px]"
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
        </FolioContainer>
      </FolioSection>
    </>
  );
}
