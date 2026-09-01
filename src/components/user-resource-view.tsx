"use client";

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { SaveButton } from "@/components/save-button";
import { SitePreview } from "@/components/site-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCategory } from "@/data/categories";
import {
  findUserResourceBySlug,
  getServerUserResourcesSnapshot,
  getUserResourcesSnapshot,
  removeUserResource,
  subscribeUserResources,
} from "@/lib/user-resources";
import { faviconFor, hostnameOf } from "@/lib/utils";

const pricingLabel = {
  free: "Free",
  "open-source": "Open source",
  freemium: "Freemium",
  paid: "Paid",
} as const;

export function UserResourcePage({ slug }: { slug: string }) {
  const resources = React.useSyncExternalStore(
    subscribeUserResources,
    getUserResourcesSnapshot,
    getServerUserResourcesSnapshot
  );
  const resource = React.useMemo(() => {
    const fromStore = resources.find((r) => r.slug === slug);
    return fromStore ?? findUserResourceBySlug(slug);
  }, [resources, slug]);

  if (!resource) {
    notFound();
  }

  const item = resource;
  const category = getCategory(item.category);

  function handleRemove() {
    removeUserResource(item.slug);
    toast.success("Removed from your browse list");
    window.location.href = "/browse";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        breadcrumbs={[
          { href: "/browse", label: "Browse" },
          { href: `/resource/added/${item.slug}`, label: item.name },
        ]}
        eyebrow={
          <span className="bg-card mb-3 grid size-12 place-items-center rounded-xl border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconFor(item.url, 128)}
              alt=""
              width={24}
              height={24}
              className="size-6"
            />
          </span>
        }
        title={item.name}
        description={item.tagline}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SaveButton
              kind="resource"
              id={item.slug}
              url={item.url}
              showLabel
              size="sm"
            />
            <Button variant="outline" onClick={handleRemove}>
              <Trash2 className="size-3.5" />
              Remove
            </Button>
            <Button asChild>
              <a href={item.url} target="_blank" rel="noreferrer">
                Visit site
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        }
      />

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary">Your submission</Badge>
        {category && (
          <Badge variant="secondary" asChild>
            <Link href={`/categories/${category.slug}`}>{category.name}</Link>
          </Badge>
        )}
        <Badge variant="brand">{pricingLabel[item.pricing]}</Badge>
        {item.stack.map((stackItem) => (
          <Badge key={stackItem} variant="outline">
            {stackItem}
          </Badge>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-8">
          <SitePreview url={item.url} name={item.name} />

          <section>
            <h2 className="text-lg font-semibold tracking-tight">What it is</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
              {item.description}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold tracking-tight">Tags</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
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
              Link
            </p>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand mt-2 block truncate text-sm font-medium transition-colors"
            >
              {hostnameOf(item.url)}
            </a>
            <p className="text-muted-foreground mt-3 text-xs">
              Saved in your browser on{" "}
              {new Date(item.addedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="bg-card rounded-xl border p-4 text-sm">
            <p className="font-medium">Personal list only</p>
            <p className="text-muted-foreground mt-1">
              This site lives in your browser until you remove it. Save it to
              find it quickly from browse.
            </p>
            <Button variant="outline" size="sm" asChild className="mt-3 w-full">
              <Link href="/browse">
                Back to browse
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </aside>
      </div>

      <Separator className="my-12" />
    </div>
  );
}
