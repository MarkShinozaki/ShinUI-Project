import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { GitHubIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { categories } from "@/data/categories";
import { resources } from "@/data/resources";
import { registry } from "@/registry";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "How ShinUI is built, how the index is structured, and how to add a resource.",
};

const exampleEntry = `{
  slug: "shadcn-ui",
  name: "shadcn/ui",
  tagline: "Copy-paste components you actually own",
  description: "Not a dependency — a registry. …",
  url: "https://ui.shadcn.com/",
  category: "component-libraries",
  tags: ["registry", "accessible", "cli"],
  stack: ["React", "Tailwind", "Radix"],
  pricing: "open-source",
  authorId: "shadcn",
  featured: true,
  install: "npx shadcn@latest add button",
  addedAt: "2026-01-04",
}`;

export default function AboutPage() {
  const stats = [
    { label: "Resources", value: resources.length },
    { label: "Categories", value: categories.length },
    { label: "Live components", value: registry.length },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        title="About ShinUI"
        description="A design and UI resource index that shows you the thing, not just a link to the thing."
      />

      <div className="mt-8 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border p-4">
            <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-lg font-semibold tracking-tight">Why</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Every good designer on X ships their own component site, and every
            one of them is a separate tab, a separate search box and a separate
            mental model. This started as a{" "}
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground underline underline-offset-4"
            >
              README full of links
            </a>{" "}
            and became a site so those links can be searched, filtered,
            previewed and attributed in one place.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            How it is structured
          </h2>
          <ul className="text-muted-foreground mt-2 space-y-2 text-sm leading-relaxed">
            <li>
              <span className="text-foreground font-medium">Resources</span> are
              external sites and libraries. Each one gets a detail page with an
              optional inline preview of the real site, the maker&apos;s links,
              and an install command where one exists.
            </li>
            <li>
              <span className="text-foreground font-medium">Components</span>{" "}
              are built here and render live. Their source is read off disk at
              build time, so the code you copy is byte-for-byte the code
              producing the preview above it.
            </li>
            <li>
              <span className="text-foreground font-medium">Categories</span>{" "}
              cut across both, so a category page shows the live components and
              the external resources side by side.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">Attribution</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            An author is listed only where the maker is publicly and
            unambiguously credited on the project itself. Everything else is
            deliberately left blank rather than guessed — a wrong byline is
            worse than none.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            Adding a resource
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            The index is one typed array in{" "}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              src/data/resources.ts
            </code>
            . Add an object and it appears in search, browse, its category page
            and the command palette with no other changes.
          </p>
          <CodeBlock
            code={exampleEntry}
            filename="src/data/resources.ts"
            maxHeight={null}
            className="mt-4"
          />
        </section>

        <section>
          <h2 className="text-lg font-semibold tracking-tight">Built with</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            Next.js App Router, Tailwind CSS v4, shadcn/ui primitives on Radix,
            Lucide icons and next-themes. No CMS and no database — the whole
            index is typed data, which means the build fails if a category slug
            is wrong.
          </p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <a href={SITE.repo} target="_blank" rel="noreferrer">
            <GitHubIcon className="size-4" />
            View the repository
          </a>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/browse">Start browsing</Link>
        </Button>
      </div>
    </div>
  );
}
