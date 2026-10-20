import type { Metadata } from "next";
import Link from "next/link";

import { ArrowUpRight, FolioSectionHead } from "@/components/folio/kit";
import { FolioContainer, FolioSection } from "@/components/folio-section";
import { PageHeader } from "@/components/page-header";
import { ResourceCard } from "@/components/resource-card";
import { portfolioResources } from "@/lib/collections";
import { hostnameOf } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Portfolios",
  description:
    "Personal sites and craft pages worth studying — portfolios, component registries and living experiments.",
};

export default function PortfoliosPage() {
  const items = portfolioResources();
  const featured = items.slice(0, 3);
  const rest = items.slice(3);

  return (
    <FolioSection className="min-h-[50vh]">
      <FolioContainer>
        <PageHeader
          eyebrow="Folio"
          title="Portfolios"
          description="Sites people actually shipped. Component registries, personal labs and interactive pieces: the kind of page you open when you want the work, not the template."
        />

        {featured.length > 0 && (
          <section className="pt-12">
            <FolioSectionHead
              className="border-t-0 pt-0"
              eyebrow="Featured"
              title="Start with these."
            />
            <ol className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((resource, i) => (
                <li key={resource.slug} className="flex">
                  <ResourceCard resource={resource} index={i} className="w-full" />
                </li>
              ))}
            </ol>
          </section>
        )}

        {rest.length > 0 && (
          <section className="mt-16">
            <FolioSectionHead eyebrow={`Index · ${rest.length}`} title="Everything else, as a reading list." />
            <ol className="mt-8 border-t border-(--fo-line)">
              {rest.map((resource, i) => (
                <li key={resource.slug}>
                  <Link
                    href={resource.userSubmitted ? `/resource/added/${resource.slug}` : `/resource/${resource.slug}`}
                    className="group flex items-baseline gap-5 border-b border-(--fo-line) py-4 transition-colors duration-200 hover:bg-(--fo-tint)"
                  >
                    <span className="w-6 pl-1 font-mono text-[11px] text-(--fo-faint) group-hover:text-(--fo-accent)">
                      {String(i + featured.length + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-[15px]">{resource.name}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-(--fo-soft)">{resource.tagline}</span>
                    </span>
                    <span className="hidden font-mono text-[10.5px] tracking-[0.06em] text-(--fo-faint) sm:inline">
                      {hostnameOf(resource.url)}
                    </span>
                    <ArrowUpRight className="mr-2 text-(--fo-faint) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--fo-accent)" />
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </FolioContainer>
    </FolioSection>
  );
}
