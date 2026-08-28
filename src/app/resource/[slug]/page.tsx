import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Globe, Tag } from "lucide-react";

import { CodeBlock } from "@/components/code-block";
import { GitHubIcon } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { SitePreview } from "@/components/site-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAuthor } from "@/data/authors";
import { getCategory } from "@/data/categories";
import { getResource, resources } from "@/data/resources";
import { getRegistryItem } from "@/registry";
import { faviconFor, hostnameOf } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};
  return {
    title: resource.name,
    description: resource.tagline,
  };
}

const pricingLabel = {
  free: "Free",
  "open-source": "Open source",
  freemium: "Freemium",
  paid: "Paid",
} as const;

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const category = getCategory(resource.category);
  const author = getAuthor(resource.authorId);
  const liveComponent = resource.componentSlug
    ? getRegistryItem(resource.componentSlug)
    : undefined;

  const related = resources
    .filter((r) => r.slug !== resource.slug && r.category === resource.category)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        breadcrumbs={[
          { href: "/browse", label: "Browse" },
          ...(category
            ? [
                {
                  href: `/categories/${category.slug}`,
                  label: category.short,
                },
              ]
            : []),
          { href: `/resource/${resource.slug}`, label: resource.name },
        ]}
        eyebrow={
          <span className="bg-card mb-3 grid size-12 place-items-center rounded-xl border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconFor(resource.url, 128)}
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </span>
        }
        title={resource.name}
        description={resource.tagline}
        actions={
          <div className="flex flex-wrap gap-2">
            {liveComponent && (
              <Button variant="outline" asChild>
                <Link href={`/components/${liveComponent.slug}`}>
                  Try live on ShinUI
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
            <Button asChild>
              <a href={resource.url} target="_blank" rel="noreferrer">
                Visit site
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        }
      />

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {category && (
          <Badge variant="secondary" asChild>
            <Link href={`/categories/${category.slug}`}>{category.name}</Link>
          </Badge>
        )}
        <Badge variant="brand">{pricingLabel[resource.pricing]}</Badge>
        {resource.stack.map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-8">
          <SitePreview url={resource.url} name={resource.name} />

          <section>
            <h2 className="text-lg font-semibold tracking-tight">
              What it is
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
              {resource.description}
            </p>
          </section>

          {resource.install && (
            <section>
              <h2 className="text-lg font-semibold tracking-tight">
                Get started
              </h2>
              <CodeBlock
                code={resource.install}
                language="bash"
                filename="terminal"
                maxHeight={null}
                className="mt-3"
              />
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold tracking-tight">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="muted">
                  <Tag className="size-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="bg-card rounded-xl border p-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Made by
            </p>
            {author ? (
              <>
                <p className="mt-2 font-medium">{author.name}</p>
                {author.handle && (
                  <p className="text-muted-foreground text-sm">
                    {author.handle}
                  </p>
                )}
                <div className="mt-3 flex flex-col gap-2">
                  {author.x && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.x} target="_blank" rel="noreferrer">
                        Profile on X
                        <ExternalLink className="ml-auto size-3" />
                      </a>
                    </Button>
                  )}
                  {author.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.github} target="_blank" rel="noreferrer">
                        <GitHubIcon className="size-3.5" />
                        GitHub
                        <ExternalLink className="ml-auto size-3" />
                      </a>
                    </Button>
                  )}
                  {author.site && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={author.site} target="_blank" rel="noreferrer">
                        <Globe className="size-3.5" />
                        Website
                        <ExternalLink className="ml-auto size-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground mt-2 text-sm">
                No verified attribution yet. If you know who built this,{" "}
                <a
                  href="https://github.com/MarkShinozaki/ShinUI"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground underline underline-offset-4"
                >
                  open a PR
                </a>
                .
              </p>
            )}
          </div>

          <div className="bg-card rounded-xl border p-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Link
            </p>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand mt-2 block truncate text-sm font-medium transition-colors"
            >
              {hostnameOf(resource.url)}
            </a>
            <p className="text-muted-foreground mt-3 text-xs">
              Added {new Date(resource.addedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <>
          <Separator className="my-12" />
          <section>
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight">
                Related in {category?.short}
              </h2>
              {category && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/categories/${category.slug}`}>
                    View all
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {related.map((other) => (
                <ResourceCard key={other.slug} resource={other} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
