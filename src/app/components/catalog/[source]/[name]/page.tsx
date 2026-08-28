import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";

import { CodeBlock } from "@/components/code-block";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getResource } from "@/data/resources";
import {
  getCatalogItem,
  getRegistryCatalog,
  getRegistrySource,
} from "@/lib/registry-catalog";

type Props = { params: Promise<{ source: string; name: string }> };

export async function generateStaticParams() {
  const catalog = await getRegistryCatalog();
  return catalog.items.map((item) => ({
    source: item.sourceId,
    name: item.name,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { source, name } = await params;
  const item = await getCatalogItem(source, name);
  if (!item) return {};
  return {
    title: `${item.displayName} — ${item.sourceName}`,
    description: item.description ?? `Install ${item.displayName} from ${item.sourceName}.`,
  };
}

export default async function CatalogComponentPage({ params }: Props) {
  const { source, name } = await params;
  const item = await getCatalogItem(source, name);
  const registrySource = getRegistrySource(source);
  if (!item || !registrySource) notFound();

  const resource = getResource(item.resourceSlug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <PageHeader
        breadcrumbs={[
          { href: "/components", label: "Components" },
          {
            href: `/components#catalog`,
            label: "Catalog",
          },
          {
            href: `/components/catalog/${item.sourceId}/${item.name}`,
            label: item.displayName,
          },
        ]}
        title={item.displayName}
        description={
          item.description ??
          `Installable from the ${item.sourceName} registry. Not a live ShinUI preview — run the command below in your own project.`
        }
        actions={
          <div className="flex flex-wrap gap-2">
            {item.docUrl && (
              <Button variant="outline" asChild>
                <a href={item.docUrl} target="_blank" rel="noreferrer">
                  Official docs
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            )}
            {resource && (
              <Button asChild>
                <Link href={`/resource/${resource.slug}`}>
                  View registry
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            )}
          </div>
        }
      />

      <div className="mt-5 flex flex-wrap gap-1.5">
        <Badge variant="secondary">{item.sourceName}</Badge>
        <Badge variant="outline">{item.kind}</Badge>
        {item.category && <Badge variant="muted">{item.category}</Badge>}
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight">Install</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Copies source into your repo via the shadcn CLI. You own the code
          after install.
        </p>
        <CodeBlock
          code={item.installCommand}
          language="bash"
          filename="terminal"
          maxHeight={null}
          className="mt-3"
        />
      </section>

      <p className="text-muted-foreground mt-8 text-sm">
        ShinUI cannot render third-party registry code in the browser without
        installing it. For a live preview built here, see the{" "}
        <Link href="/components" className="text-foreground underline">
          live components
        </Link>{" "}
        section ({registrySource.name} has {item.sourceName === "shadcn/ui" ? "dozens" : "many"}{" "}
        more in its catalog).
      </p>
    </div>
  );
}
