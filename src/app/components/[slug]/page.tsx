import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Package } from "lucide-react";

import { ComponentPreview } from "@/components/component-preview";
import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAuthor } from "@/data/authors";
import { getCategory } from "@/data/categories";
import { readRegistrySource } from "@/lib/registry-source";
import { getRegistryItem, registry } from "@/registry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return registry.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getRegistryItem(slug);
  if (!item) return {};
  return { title: item.name, description: item.description };
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const item = getRegistryItem(slug);
  if (!item) notFound();

  const source = await readRegistrySource(item.file);
  const category = getCategory(item.category);
  const author = getAuthor(item.authorId);
  const filename = item.file.split("/").pop() ?? item.file;

  const related = registry
    .filter((r) => r.slug !== item.slug && r.category === item.category)
    .slice(0, 3);

  const usage = buildUsageSnippet(item.file, source);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        breadcrumbs={[
          { href: "/components", label: "Components" },
          { href: `/components/${item.slug}`, label: item.name },
        ]}
        title={item.name}
        description={item.description}
        actions={
          category && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/categories/${category.slug}`}>
                {category.short}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          )
        }
      />

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {item.tags.map((tag) => (
          <Badge key={tag} variant="muted" className="text-[11px]">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-8">
        <ComponentPreview
          demoName={item.demoExport}
          code={source}
          filename={filename}
          previewClassName={item.previewClassName}
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0 space-y-8">
          <section>
            <h2 className="text-lg font-semibold tracking-tight">Usage</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Drop the file into your project and import it. There is no package
              to install.
            </p>
            <CodeBlock
              code={usage}
              filename="usage.tsx"
              maxHeight={null}
              className="mt-4"
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              Install prerequisites
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Every component here relies only on Tailwind and the{" "}
              <code className="bg-muted rounded px-1 py-0.5 text-xs">cn</code>{" "}
              helper from shadcn/ui.
            </p>
            <CodeBlock
              code={
                item.dependencies.length > 0
                  ? `npm i clsx tailwind-merge ${item.dependencies
                      .filter((d) => d !== "react")
                      .join(" ")}`.trim()
                  : "npm i clsx tailwind-merge"
              }
              language="bash"
              filename="terminal"
              maxHeight={null}
              className="mt-4"
            />
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-card rounded-xl border p-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Built by
            </p>
            {author ? (
              <>
                <p className="mt-2 font-medium">{author.name}</p>
                {author.handle && (
                  <p className="text-muted-foreground text-sm">
                    {author.handle}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {author.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.github} target="_blank" rel="noreferrer">
                        GitHub
                        <ExternalLink className="size-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground mt-2 text-sm">Unattributed</p>
            )}
          </div>

          {item.inspiredBy && (
            <div className="bg-card rounded-xl border p-4">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Inspired by
              </p>
              <a
                href={item.inspiredBy.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-brand mt-2 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                {item.inspiredBy.name}
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          <div className="bg-card rounded-xl border p-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Dependencies
            </p>
            <ul className="mt-2 space-y-1.5">
              {(item.dependencies.length > 0
                ? item.dependencies
                : ["none"]
              ).map((dep) => (
                <li key={dep} className="flex items-center gap-2 text-sm">
                  <Package className="text-muted-foreground size-3.5" />
                  <code className="text-xs">{dep}</code>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <>
          <Separator className="my-12" />
          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              More in {category?.short ?? "this category"}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {related.map((other) => (
                <Link
                  key={other.slug}
                  href={`/components/${other.slug}`}
                  className="group bg-card rounded-xl border p-4 transition-shadow hover:shadow-md"
                >
                  <p className="font-medium">{other.name}</p>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {other.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/** Derives a realistic import line plus JSX from the component's exports. */
function buildUsageSnippet(file: string, source: string | null) {
  const importPath = `@/${file.replace(/\.tsx?$/, "")}`;
  const exports = source
    ? Array.from(source.matchAll(/export function ([A-Z][\w]*)/g)).map(
        (m) => m[1]
      )
    : [];

  if (exports.length === 0) {
    return `import { Component } from "${importPath}";`;
  }

  const primary = exports[0];
  return [
    `import { ${exports.join(", ")} } from "${importPath}";`,
    "",
    "export function Example() {",
    `  return <${primary} />;`,
    "}",
  ].join("\n");
}
