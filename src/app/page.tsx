import Link from "next/link";

import { ComponentCard } from "@/components/component-card";
import { DitherField } from "@/components/folio/dither-field";
import { HomeHero } from "@/components/folio/home-hero";
import {
  ArrowUpRight,
  FolioLabel,
  FolioLink,
  FolioSectionHead,
  FolioWrap,
  Inked,
  PixelBars,
  SparkGlyph,
} from "@/components/folio/kit";
import { ResourceCard } from "@/components/resource-card";
import { categories } from "@/data/categories";
import { resources } from "@/data/resources";
import type { Pricing } from "@/data/types";
import { registry } from "@/registry";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Indexed and credited.",
    body: "Every library, block set, shader tool and icon pack is one typed entry with its author, stack and pricing, so you can find it again and know who made it.",
    shape: "orb" as const,
    link: { href: "/browse", label: "Browse the index" },
  },
  {
    title: "Live, not screenshots.",
    body: "Components render right on the page with the exact source file beside them. Save the ones you reuse; they stay in your browser.",
    shape: "field" as const,
    link: { href: "/components", label: "See components" },
  },
  {
    title: "Tools that run locally.",
    body: "Favicon Studio turns an image, text or emoji into ICO, PNG sizes, SVG and a manifest, all in the browser with nothing uploaded.",
    shape: "wave" as const,
    link: { href: "/design-tools/favicon-studio", label: "Open Favicon Studio" },
  },
];

const PRICING: [Pricing, string][] = [
  ["free", "Free"],
  ["open-source", "OSS"],
  ["freemium", "Freemium"],
  ["paid", "Paid"],
];

function Card({
  title,
  sub,
  children,
  className,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-(--fo-line) bg-(--fo-paper) p-5 transition-colors duration-200 hover:border-(--fo-line-strong)",
        className
      )}
    >
      <h3 className="text-[14px] font-medium">{title}</h3>
      <FolioLabel className="mt-1 text-[9.5px]">{sub}</FolioLabel>
      {children}
    </div>
  );
}

function Big({ value, unit }: { value: string | number; unit?: string }) {
  return (
    <p className="mt-5 text-[40px] leading-none tracking-[-0.04em]">
      {value}
      {unit && <span className="ml-0.5 align-baseline text-[16px] text-(--fo-soft)">{unit}</span>}
    </p>
  );
}

export default function HomePage() {
  const perCategory = categories.map((c) => ({
    ...c,
    count: resources.filter((r) => r.category === c.slug).length,
  }));
  const maxCount = Math.max(1, ...perCategory.map((c) => c.count));
  const topIndex = perCategory.findIndex((c) => c.count === maxCount);
  const top = perCategory[topIndex];
  const pricing = PRICING.map(([key, label]) => ({
    label,
    count: resources.filter((r) => r.pricing === key).length,
  }));
  const maxPricing = Math.max(1, ...pricing.map((p) => p.count));
  const topPricing = pricing.findIndex((p) => p.count === maxPricing);
  const freeShare = Math.round(
    (resources.filter((r) => r.pricing === "free" || r.pricing === "open-source").length /
      Math.max(1, resources.length)) *
      100
  );
  const featured = resources.filter((r) => r.featured).slice(0, 6);
  const showcase = registry.slice(0, 3);

  return (
    <>
      <HomeHero
        resourceCount={resources.length}
        componentCount={registry.length}
        categoryCount={categories.length}
      />

      {/* FolioFeatures — list, wide */}
      <FolioWrap className="py-12 md:py-14">
        <FolioSectionHead
          eyebrow="What it is"
          title="A small index that keeps growing."
          lede="Three rules sit behind every entry, so whatever you pull from here still looks like it came from the same shelf."
        />
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="group flex gap-5 md:flex-col">
              <div className="size-14 shrink-0 overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5">
                <DitherField shape={f.shape} cell={2} inverse />
              </div>
              <div>
                <h3 className="text-[15.5px] font-medium tracking-[-0.01em]">{f.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-(--fo-soft)">{f.body}</p>
                <p className="mt-3 text-[14px]">
                  <FolioLink href={f.link.href}>{f.link.label}</FolioLink>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </FolioWrap>

      {/* FolioMetrics — bento, wide */}
      <FolioWrap className="py-12 md:py-14">
        <div className="border-t border-(--fo-line) pt-10">
          <FolioLabel className="mb-4">In the index</FolioLabel>
          <h2 className="max-w-xl text-[clamp(1.4rem,2.8vw,1.9rem)] leading-snug font-normal tracking-[-0.02em] text-balance text-(--fo-faint)">
            <Inked text="The point is a shelf you *actually reach for*, not a bookmarks folder you *never open*." />
          </h2>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-3">
            <Card title="Resources indexed" sub={`Across ${categories.length} categories`}>
              <Big value={resources.length} unit="+" />
              <table className="mt-5 w-full text-left text-[12px]">
                <thead>
                  <tr>
                    <th />
                    <th className="pb-1 font-normal">
                      <FolioLabel className="text-[9px]">Live</FolioLabel>
                    </th>
                    <th className="pb-1 font-normal">
                      <FolioLabel className="text-[9px]">Free / OSS</FolioLabel>
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr>
                    <th className="py-1.5 text-[10px] font-normal tracking-[0.1em] uppercase">Share</th>
                    <td className="py-1.5 font-sans text-[22px] tracking-[-0.03em]">
                      {registry.length}
                      <span className="ml-0.5 text-[11px] text-(--fo-faint) italic">items</span>
                    </td>
                    <td className="py-1.5 font-sans text-[22px] tracking-[-0.03em]">
                      {freeShare}
                      <span className="ml-0.5 text-[11px] text-(--fo-faint) italic">%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
            <Card title="Per category" sub="Resources in each bucket">
              <Big value={categories.length} />
              <PixelBars
                values={perCategory.map((c) => c.count / maxCount)}
                rows={5}
                highlight={topIndex}
                className="mt-5"
              />
            </Card>
          </div>
          <Card title="Biggest shelf" sub="Most-indexed category, by pricing" className="flex flex-col">
            <Big value="#1" />
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-(--fo-soft)">
              <span className="bg-(--fo-tint-strong) text-(--fo-ink)">{top?.name}</span> holds{" "}
              {top?.count} entries. Below: how the whole index splits by price.
            </p>
            <div className="relative mt-auto flex h-40 items-end gap-2 pt-8">
              <div
                aria-hidden
                className="absolute inset-x-0 top-8 bottom-0 bg-[linear-gradient(var(--fo-line)_1px,transparent_1px)] bg-[size:100%_33.3%]"
              />
              {pricing.map((p, i) => (
                <div key={p.label} className="relative flex h-full flex-1 flex-col justify-end">
                  <div
                    className={cn(
                      "relative transition-[height] duration-500",
                      i === topPricing
                        ? "bg-(--fo-accent) text-(--fo-on-accent)"
                        : "bg-(--fo-well) ring-1 ring-(--fo-line)"
                    )}
                    style={{ height: `${Math.max(6, (p.count / maxPricing) * 100)}%` }}
                  >
                    {i === topPricing && (
                      <SparkGlyph className="absolute top-2 left-1/2 -translate-x-1/2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              {pricing.map((p) => (
                <span
                  key={p.label}
                  className="flex-1 truncate text-center font-mono text-[9.5px] tracking-[0.1em] text-(--fo-faint) uppercase"
                >
                  {p.label} · {p.count}
                </span>
              ))}
            </div>
            <Link
              href="/categories"
              className="mt-5 flex items-center gap-1 text-[12.5px] font-medium hover:text-(--fo-accent)"
            >
              See every category <ArrowUpRight />
            </Link>
          </Card>
        </div>
        <blockquote className="mt-10 border-l-2 border-(--fo-accent) py-1 pl-5">
          <p className="text-[16px] leading-relaxed text-(--fo-faint)">
            <Inked text="“Stop re-googling the same shader playground. *Save it once*, find it with *⌘K*.”" />
          </p>
          <footer className="mt-2 flex items-center gap-1 text-[12px] text-(--fo-faint)">
            The idea behind Shin UI
            <ArrowUpRight />
          </footer>
        </blockquote>
      </FolioWrap>

      {/* FolioCards — numbered, wide: live components */}
      <FolioWrap className="py-12 md:py-14">
        <FolioSectionHead
          eyebrow="Live components"
          title="Not screenshots. These render right here."
          lede="Each one is a plain file with its source one tab away. Open a card for props, code and a copy button."
          link={{ href: "/components", label: `All ${registry.length} components` }}
        />
        <ol className="mt-8 grid gap-3 md:grid-cols-3">
          {showcase.map((item, i) => (
            <li key={item.slug} className="flex min-w-0">
              <ComponentCard item={item} index={i} />
            </li>
          ))}
        </ol>
      </FolioWrap>

      {/* FolioCards — index, wide: categories */}
      <FolioWrap className="py-12 md:py-14">
        <FolioSectionHead
          eyebrow="Browse by category"
          title={`${categories.length} buckets, from headless primitives to shader playgrounds.`}
          link={{ href: "/categories", label: "All categories" }}
        />
        <ol className="mt-8 border-t border-(--fo-line)">
          {perCategory.slice(0, 8).map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/categories/${c.slug}`}
                className="group flex items-baseline gap-5 border-b border-(--fo-line) py-4 transition-colors duration-200 hover:bg-(--fo-tint)"
              >
                <span className="w-6 pl-1 font-mono text-[11px] text-(--fo-faint) group-hover:text-(--fo-accent)">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[15px]">{c.name}</span>
                <span className="hidden font-mono text-[10.5px] tracking-[0.1em] text-(--fo-faint) uppercase sm:inline">
                  {c.count} {c.count === 1 ? "resource" : "resources"}
                </span>
                <ArrowUpRight className="mr-2 text-(--fo-faint) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--fo-accent)" />
              </Link>
            </li>
          ))}
        </ol>
      </FolioWrap>

      {/* FolioCards — numbered, wide: featured resources */}
      <FolioWrap className="py-12 md:py-14">
        <FolioSectionHead
          eyebrow="Featured"
          title="Worth knowing about, even if you never use them."
          link={{ href: "/browse", label: "Browse all" }}
        />
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((resource, i) => (
            <li key={resource.slug} className="flex">
              <ResourceCard resource={resource} index={i} className="w-full" />
            </li>
          ))}
        </ol>
      </FolioWrap>
    </>
  );
}
