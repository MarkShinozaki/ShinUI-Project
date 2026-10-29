"use client";

// Generated from Design Studio's gallery previews (default props).
import { BlockPreview } from "@/registry/demos/block-preview";
import type { GridAccent, GridMarkerKind } from "@/registry/blocks/grid-frame";
import { ContextFeatures } from "@/registry/blocks/context-features";
import { ContextFooter } from "@/registry/blocks/context-footer";
import { ContextHero } from "@/registry/blocks/context-hero";
import { Blueprint, ContextRoot, DashedBox, DoubleCard, Pill, PixelStream } from "@/registry/blocks/context-kit";
import { ContextLanding } from "@/registry/blocks/context-landing";
import { ContextNavbar } from "@/registry/blocks/context-navbar";
import { ContextStories } from "@/registry/blocks/context-stories";
import { FolioCards } from "@/registry/blocks/folio-cards";
import { FolioFeatures } from "@/registry/blocks/folio-features";
import { FolioFooter } from "@/registry/blocks/folio-footer";
import { FolioHero } from "@/registry/blocks/folio-hero";
import { DitherField, FolioButton, FolioCommand, FolioLabel, FolioRoot, PixelBars } from "@/registry/blocks/folio-kit";
import { FolioLanding } from "@/registry/blocks/folio-landing";
import { FolioMetrics } from "@/registry/blocks/folio-metrics";
import { FolioNavbar } from "@/registry/blocks/folio-navbar";
import { GeneralLanding } from "@/registry/blocks/general-landing";
import { GridFeatures } from "@/registry/blocks/grid-features";
import { GridFooter } from "@/registry/blocks/grid-footer";
import { GridCell, GridCells, GridLabel, GridRule, GridSection } from "@/registry/blocks/grid-frame";
import { GridHero } from "@/registry/blocks/grid-hero";
import { GridLanding } from "@/registry/blocks/grid-landing";
import { GridNavbar } from "@/registry/blocks/grid-navbar";
import { GridSteps } from "@/registry/blocks/grid-steps";
import { GridStrip } from "@/registry/blocks/grid-strip";
import { Hero } from "@/registry/blocks/hero";
import { Navbar } from "@/registry/blocks/navbar";
import { OroFooter } from "@/registry/blocks/oro-footer";
import { OroHero } from "@/registry/blocks/oro-hero";
import { CountUp, DataPanel, GrowthChart, OroButton, OroHeading, OroRoot, SunGlow } from "@/registry/blocks/oro-kit";
import { OroLanding } from "@/registry/blocks/oro-landing";
import { OroNavbar } from "@/registry/blocks/oro-navbar";
import { OroStats } from "@/registry/blocks/oro-stats";
import { OroTracks } from "@/registry/blocks/oro-tracks";
import { DiaBento } from "@/registry/blocks/dia-bento";
import { DiaControls } from "@/registry/blocks/dia-controls";
import { DiaFooter } from "@/registry/blocks/dia-footer";
import { DiaHero } from "@/registry/blocks/dia-hero";
import { DiaButton, DiaHeading, DiaMark, DiaRoot, Eyebrow as DiaEyebrow, Sunrise, WindowFrame } from "@/registry/blocks/dia-kit";
import { DiaLanding } from "@/registry/blocks/dia-landing";
import { DiaNavbar } from "@/registry/blocks/dia-navbar";
import { DiaSteps } from "@/registry/blocks/dia-steps";
import { NousAgent } from "@/registry/blocks/nous-agent";
import { NousFeed } from "@/registry/blocks/nous-feed";
import { NousFooter } from "@/registry/blocks/nous-footer";
import { NousHero } from "@/registry/blocks/nous-hero";
import { CommandBar, Eyebrow as NousEyebrow, Halftone, NousButton, NousDisplay, NousMark, NousRoot } from "@/registry/blocks/nous-kit";
import { NousLanding } from "@/registry/blocks/nous-landing";
import { NousNavbar } from "@/registry/blocks/nous-navbar";
import { NousPillars } from "@/registry/blocks/nous-pillars";
import { ScoutFeatures } from "@/registry/blocks/scout-features";
import { ScoutFooter } from "@/registry/blocks/scout-footer";
import { ScoutHero } from "@/registry/blocks/scout-hero";
import { Cross, GridBand, Mono, Reticle, ScoutButton, ScoutMark, ScoutRoot, Terrain } from "@/registry/blocks/scout-kit";
import { ScoutLanding } from "@/registry/blocks/scout-landing";
import { ScoutNavbar } from "@/registry/blocks/scout-navbar";
import { ScoutPinned } from "@/registry/blocks/scout-pinned";
import { ScoutProduct } from "@/registry/blocks/scout-product";
import { HexAgent } from "@/registry/blocks/hex-agent";
import { HexFaq } from "@/registry/blocks/hex-faq";
import { HexFooter } from "@/registry/blocks/hex-footer";
import { HexHero } from "@/registry/blocks/hex-hero";
import { HexIntegrations } from "@/registry/blocks/hex-integrations";
import { Card as HexCard, Chip as HexChip, GridPaper, HexButton, HexMark, HexRoot, Mono as HexMono, Serif as HexSerif } from "@/registry/blocks/hex-kit";
import { HexLanding } from "@/registry/blocks/hex-landing";
import { HexNavbar } from "@/registry/blocks/hex-navbar";
import { HeroMagnet } from "@/registry/blocks/hero-magnet";
import { HeroMarquee } from "@/registry/blocks/hero-marquee";
import { HeroParallax } from "@/registry/blocks/hero-parallax";
import { HexOrbit } from "@/registry/blocks/hex-orbit";
import { AsideBenchmarks } from "@/registry/blocks/aside-benchmarks";
import { AsideCapabilities } from "@/registry/blocks/aside-capabilities";
import { AsideCta } from "@/registry/blocks/aside-cta";
import { AsideFooter } from "@/registry/blocks/aside-footer";
import { AsideHero } from "@/registry/blocks/aside-hero";
import { AsideIntro } from "@/registry/blocks/aside-intro";
import { AppWindow, AsideMark, AsideRoot, Eyebrow as AsideEyebrow, Sky, SplitButton } from "@/registry/blocks/aside-kit";
import { AsideLanding } from "@/registry/blocks/aside-landing";
import { AsideNavbar } from "@/registry/blocks/aside-navbar";
import { AsidePrivacy } from "@/registry/blocks/aside-privacy";
import { RomaCards } from "@/registry/blocks/roma-cards";
import { RomaFooter } from "@/registry/blocks/roma-footer";
import { RomaHero } from "@/registry/blocks/roma-hero";
import { Bubble, Mosaic, PhoneMock, RomaButton, RomaHeading, RomaRoot } from "@/registry/blocks/roma-kit";
import { RomaLanding } from "@/registry/blocks/roma-landing";
import { RomaNavbar } from "@/registry/blocks/roma-navbar";
import { RomaSteps } from "@/registry/blocks/roma-steps";
import { SplitHero } from "@/registry/blocks/split-hero";

export function HeroDemo() {
  const props = { eyebrow: "New · shinUI components", title: "Design faster, ship something beautiful", description: "Backgrounds, components and blocks you can drop into any React + Tailwind project. Free, open and built to be remixed.", primaryCta: "Get started", secondaryCta: "Browse components", showSecondary: true, shimmer: true, align: "center", background: "vivid" } as const
  return (
    <BlockPreview height={640}>
      <Hero {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function SplitHeroDemo() {
  const props = { kicker: "shinUI · studio drop", title: "Build the part nobody else has.", description: "Original blocks and backgrounds, tuned in the gallery, then shipped as registry installs or an npm package.", primaryCta: "Start a block", secondaryCta: "Browse backgrounds", showSecondary: true, metaLabel: "Format", metaValue: "Registry + npm" } as const
  return (
    <BlockPreview height={640}>
      <SplitHero {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function GeneralLandingDemo() {
  const props = { brand: "shinUI", nav: "glass", background: "vivid", showSplit: true } as const
  return (
    <BlockPreview height={960}>
      <GeneralLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function NavbarDemo() {
  const props = { brand: "shinUI", links: "Product, Components, Pricing, Docs", ctaLabel: "Get started", showSignIn: true, variant: "glass" } as const
  return (
    <BlockPreview height={420}>
      <div className="flex flex-1 flex-col bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--ds-primary)_18%,transparent),transparent_60%)]">
        <Navbar {...props} />
        <div className="mx-auto grid w-full max-w-6xl flex-1 gap-4 p-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="min-h-32 rounded-lg border border-dashed border-border" />
          ))}
        </div>
      </div>
    </BlockPreview>
  )
}

export function GridNavbarDemo() {
  const props = { variant: "boxed", brand: "shinUI", badge: "v0.4", links: "Blocks, Backgrounds, Components, Docs", ctaLabel: "Get started", showSignIn: true, accent: "primary", marker: "plus", dashed: false } as const
  return (
    <BlockPreview height={360}>
      <div className="flex flex-1 flex-col pt-6">
        <GridNavbar {...props} />
        <GridSection edges="bottom" className="flex-1" innerClassName="h-full" accent={props.accent as GridAccent} marker={props.marker as GridMarkerKind} dashed={Boolean(props.dashed)}>
          <div className="min-h-48 flex-1" />
        </GridSection>
      </div>
    </BlockPreview>
  )
}

export function GridHeroDemo() {
  const props = { variant: "centered", eyebrow: "New / grid blocks", title: "Build pages that", accentText: "line up on purpose", description: "Hairline frames, crosshair joints and monospace details. Original blocks you can copy, tweak and ship in an afternoon.", primaryCta: "Start building", secondaryCta: "Read the docs", showSecondary: true, command: "npx shadcn add shinui/grid-hero", pattern: "dots", accent: "primary", marker: "plus", dashed: false } as const
  return (
    <BlockPreview height={680}>
      <div className="flex flex-1 flex-col justify-center py-8">
        <GridHero {...props} />
      </div>
    </BlockPreview>
  )
}

export function GridFeaturesDemo() {
  const props = { index: "02", eyebrow: "Toolkit", title: "Everything snaps to the grid", description: "A small set of rules behind every shinUI piece, so things you mix and match still look like they belong together.", ctaLabel: "Browse the library", variant: "bento", columns: 3, filledCell: false, scan: true, accent: "primary", marker: "plus", dashed: false, density: "comfortable", pattern: "dots" } as const
  return (
    <BlockPreview height={1200}>
      <div className="flex flex-1 flex-col justify-center py-8">
        <GridFeatures {...props} />
      </div>
    </BlockPreview>
  )
}

export function GridStripDemo() {
  const props = { variant: "stats", label: "Plays well with", items: "React 19, Tailwind v4, Vite, TypeScript, shadcn, Next.js, Astro, Remix", speed: 30, accent: "primary", marker: "plus", dashed: false } as const
  return (
    <BlockPreview height={260}>
      <div className="flex flex-1 flex-col justify-center">
        <GridStrip {...props} />
      </div>
    </BlockPreview>
  )
}

export function GridStepsDemo() {
  const props = { variant: "cards", index: "03", eyebrow: "How it works", title: "From gallery to production in three moves", accent: "primary", marker: "plus", dashed: false } as const
  return (
    <BlockPreview height={780}>
      <div className="flex flex-1 flex-col justify-center py-8">
        <GridSteps {...props} />
      </div>
    </BlockPreview>
  )
}

export function GridFooterDemo() {
  const props = { variant: "columns", brand: "shinUI", tagline: "Free, original design tools and blocks for people who ship.", showCta: true, ctaTitle: "Ready when your next page is.", ctaLabel: "Get started", status: "All systems normal", accent: "primary", marker: "plus", dashed: false } as const
  return (
    <BlockPreview height={720}>
      <div className="flex flex-1 flex-col justify-end pt-10">
        <GridFooter {...props} />
      </div>
    </BlockPreview>
  )
}

export function GridLandingDemo() {
  const props = { preset: "blueprint", accent: "preset", brand: "shinUI", showSteps: true } as const
  return (
    <BlockPreview height={960}>
      <GridLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function GridFrameDemo() {
  const props = { edges: "both", pattern: "dots", accent: "primary", marker: "plus", dashed: false } as const
  return (
    <BlockPreview height={460}>
      <div className="flex flex-1 flex-col justify-center">
        <GridSection {...props}>
          <div className="px-6 py-10 sm:px-10">
            <GridLabel index="00">Grid frame</GridLabel>
            <p className="mt-4 max-w-md text-sm text-ds-muted">Rails, rules, cells and markers. Every grid block is built from these pieces.</p>
          </div>
          <GridRule />
          <GridCells className="sm:grid-cols-3">
            {['GridCell', 'interactive', 'filled'].map((label, i) => (
              <GridCell key={label} interactive={i > 0} filled={i === 2} className="min-h-28 p-6 font-mono text-xs">
                {label}
              </GridCell>
            ))}
          </GridCells>
        </GridSection>
      </div>
    </BlockPreview>
  )
}

export function FolioNavbarDemo() {
  const props = { variant: "sidebar", brand: "shinUI", links: "Home, Library, Journal, Changelog, Pricing, Docs ↗", active: "Home", sections: "Overview, Principles, In use, Install, Notes", toggle: "Design, Code", ctaLabel: "Open the studio" } as const
  return (
    <BlockPreview height={560}>
      {props.variant === 'sidebar' ? (
        <FolioRoot className="flex flex-1 flex-col md:grid md:grid-cols-[17rem_minmax(0,1fr)]">
          <FolioNavbar {...props} />
          <div className="hidden flex-col gap-4 p-10 md:flex">
            <div className="h-8 w-2/3 bg-(--fo-well)" />
            <div className="h-4 w-1/2 bg-(--fo-well)" />
            <div className="mt-6 h-48 border border-dashed border-(--fo-line-strong)" />
          </div>
        </FolioRoot>
      ) : (
        <FolioRoot className="flex flex-1 flex-col">
          <FolioNavbar {...props} />
          <div className="mx-auto grid w-full max-w-6xl flex-1 gap-3 p-8 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="min-h-32 border border-dashed border-(--fo-line-strong)" />
            ))}
          </div>
        </FolioRoot>
      )}
    </BlockPreview>
  )
}

export function FolioHeroDemo() {
  const props = { variant: "editorial", announcement: "New in the library", announcementLink: "Read the note", title: "shinUI is a free, growing kit of design tools for people who *ship* their own *interfaces*.", description: "Backgrounds, components and blocks as plain React files. Copy them, install them, or pull them from the registry.", primaryCta: "Start building", secondaryCta: "Browse the library", command: "npx shadcn add shinui/folio-hero", worksWith: "React 19, Tailwind v4, Vite, Next.js", art: "field", animate: true } as const
  return (
    <BlockPreview height={820}>
      <FolioHero {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function FolioFeaturesDemo() {
  const props = { variant: "list", eyebrow: "What it is", title: "A small library that keeps growing.", lede: "Three rules sit behind every piece, so blocks you mix still look like they came from the same hand.", showTags: true, width: "narrow", animate: true } as const
  return (
    <BlockPreview height={720}>
      <FolioFeatures {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function FolioMetricsDemo() {
  const props = { variant: "bento", eyebrow: "In use", title: "The point is pages people *enjoy* using, not pages that just *pass* a checklist.", quote: "“Swapped our whole marketing page in an afternoon and it finally *looks like us*.”", quoteSource: "Indie maker, on a weekend build", width: "narrow" } as const
  return (
    <BlockPreview height={900}>
      <FolioMetrics {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function FolioCardsDemo() {
  const props = { variant: "numbered", eyebrow: "Where it runs", title: "Use it wherever your project lives.", lede: "Each block is a plain file, so it works the same in a fresh Vite app, an old Next.js codebase or a weekend prototype.", linkLabel: "See install options", width: "narrow", animate: true } as const
  return (
    <BlockPreview height={640}>
      <FolioCards {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function FolioFooterDemo() {
  const props = { variant: "cta", brand: "shinUI", tagline: "Free, original design tools for people who ship.", ctaTitle: "Shipping a page this week?", ctaLabel: "Start building", command: "npx shadcn add shinui/folio-landing", status: "All systems normal", legal: "Privacy, Terms, License", animate: true } as const
  return (
    <BlockPreview height={720}>
      <div className="flex flex-1 flex-col justify-end bg-(--fo-paper)">
        <FolioFooter {...props} />
      </div>
    </BlockPreview>
  )
}

export function FolioLandingDemo() {
  const props = { preset: "docs", brand: "shinUI", animate: true } as const
  return (
    <BlockPreview height={960}>
      <FolioLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function FolioKitDemo() {
  const props = { shape: "field", cell: 4, animate: true } as const
  return (
    <BlockPreview height={520}>
      <FolioRoot className="flex flex-1 flex-col gap-6 p-8">
        <FolioLabel>Folio kit</FolioLabel>
        <div className="flex flex-wrap gap-2">
          <FolioButton>Primary</FolioButton>
          <FolioButton variant="secondary">Secondary</FolioButton>
          <FolioButton variant="ghost">Ghost</FolioButton>
        </div>
        <FolioCommand command="npx shadcn add shinui/folio-kit" className="max-w-sm" />
        <div className="grid flex-1 gap-4 sm:grid-cols-[2fr_1fr]">
          <div className="min-h-40">
            <DitherField shape={props.shape as 'field'} cell={Number(props.cell)} animate={Boolean(props.animate)} />
          </div>
          <PixelBars values={[0.3, 0.5, 0.4, 0.8, 1, 0.6, 0.45]} highlight={4} rows={7} className="self-end" />
        </div>
      </FolioRoot>
    </BlockPreview>
  )
}

export function ContextNavbarDemo() {
  const props = { variant: "bar", brand: "shinUI", links: "Library ▾, Use cases ▾, Showcase ▾, Pricing, Docs", announcement: "40 new blocks this month. Free, forever.", secondaryCta: "Book a tour", ctaLabel: "Start for free" } as const
  return (
    <BlockPreview height={380}>
      <ContextRoot className="flex flex-1 flex-col">
        <ContextNavbar {...props} />
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-32 opacity-70">
            <PixelStream animate={false} />
          </div>
        </div>
      </ContextRoot>
    </BlockPreview>
  )
}

export function ContextHeroDemo() {
  const props = { variant: "console", kicker: "Free and open · 120+ blocks", title: "Give your *pages* a head start", description: "Search, preview and install original blocks for React and Tailwind, from one prompt.", primaryCta: "Start for free", secondaryCta: "Connect your editor", tabs: "Search blocks, Preview, Install, Theme, Tokens", prompts: "pricing table with a yearly toggle|footer with a giant wordmark|hero with a live code card|navbar that floats on scroll", streams: true, animate: true } as const
  return (
    <BlockPreview height={820}>
      <ContextHero {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function ContextFeaturesDemo() {
  const props = { variant: "grid", title: "Everything your page needs, *in one library*.", description: "Search, preview, install and theme original blocks without leaving your editor.", rails: true } as const
  return (
    <BlockPreview height={980}>
      <ContextFeatures {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function ContextStoriesDemo() {
  const props = { variant: "carousel", title: "How teams *shipped faster* with shinUI", description: "From weekend projects to product launches, built from the same blocks you can install today.", ctaLabel: "See all stories", rails: true, animate: true } as const
  return (
    <BlockPreview height={720}>
      <ContextRoot className="flex flex-1 flex-col justify-center">
        <ContextStories {...props} />
      </ContextRoot>
    </BlockPreview>
  )
}

export function ContextFooterDemo() {
  const props = { variant: "night", brand: "shinUI", tagline: "Original blocks for people who ship. Search it, preview it, install it.", wordmark: "shinui", status: "All systems normal" } as const
  return (
    <BlockPreview height={760}>
      <ContextRoot className="flex flex-1 flex-col justify-end">
        <ContextFooter {...props} />
      </ContextRoot>
    </BlockPreview>
  )
}

export function ContextLandingDemo() {
  const props = { preset: "console", brand: "shinUI", animate: true } as const
  return (
    <BlockPreview height={960}>
      <ContextLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function ContextKitDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={460}>
      <ContextRoot className="relative flex flex-1 items-center justify-center overflow-hidden p-8">
        <div className="absolute inset-y-0 left-0 w-36">
          <PixelStream animate={Boolean(props.animate)} />
        </div>
        <DoubleCard className="relative w-full max-w-md" innerClassName="flex flex-col gap-4">
          <div className="flex gap-2">
            <Pill>Solid</Pill>
            <Pill variant="outline">Outline</Pill>
            <Pill variant="blue">Blue</Pill>
          </div>
          <Blueprint className="p-4">
            <DashedBox label="blueprint">dashed box</DashedBox>
          </Blueprint>
        </DoubleCard>
      </ContextRoot>
    </BlockPreview>
  )
}

export function OroNavbarDemo() {
  const props = { variant: "simple", brand: "shinui", links: "Journal, Library ▾, Research ▾", ctaLabel: "Request a demo" } as const
  return (
    <BlockPreview height={360}>
      <OroRoot className="relative flex flex-1 flex-col overflow-hidden">
        <SunGlow animate={false} className="-top-40 -right-40 size-[30rem] opacity-60" />
        <div className="relative">
          <OroNavbar {...props} />
        </div>
      </OroRoot>
    </BlockPreview>
  )
}

export function OroHeroDemo() {
  const props = { variant: "glow", title: "Blocks tested\non real pages.", description: "We build and score layouts in live projects, so the ones that reach the library have already earned their place.", primaryCta: "Request a sample", secondaryCta: "Read the method", count: 4729412, countLabel: "Page views served by shinUI blocks.", animate: true } as const
  return (
    <BlockPreview height={800}>
      <OroHero {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function OroTracksDemo() {
  const props = { variant: "flow", title: "Every block earns its spot.", description: "Each candidate goes through the same brief, the same budget and the same scorer. Only the winner ships.", animate: true } as const
  return (
    <BlockPreview height={720}>
      <OroTracks {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function OroStatsDemo() {
  const props = { variant: "chart", title: "Every round leaves a record.", description: "Scores, briefs and the losing candidates are all published, so you can see why a block made the cut.", count: 128604, countLabel: "Scored comparisons.", animate: true } as const
  return (
    <BlockPreview height={760}>
      <OroStats {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function OroFooterDemo() {
  const props = { variant: "cta", brand: "shinui", ctaTitle: "See how your pages score.", ctaBody: "Tell us what you are building. We will send back the blocks that won on briefs like yours.", ctaLabel: "Request a sample", backers: "Northwind, Paperlane, Tidepool, Kiln & Co" } as const
  return (
    <BlockPreview height={640}>
      <OroRoot className="flex flex-1 flex-col justify-end">
        <OroFooter {...props} />
      </OroRoot>
    </BlockPreview>
  )
}

export function OroLandingDemo() {
  const props = { preset: "research", brand: "shinui", animate: true } as const
  return (
    <BlockPreview height={960}>
      <OroLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function OroKitDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={520}>
      <OroRoot className="relative grid flex-1 items-center gap-8 overflow-hidden p-8 md:grid-cols-2">
        <SunGlow animate={Boolean(props.animate)} className="-top-20 -right-20 size-[28rem]" />
        <div className="relative flex flex-col gap-5">
          <OroHeading className="text-5xl">
            <CountUp value={2814} />
          </OroHeading>
          <div className="flex gap-2">
            <OroButton>Solid</OroButton>
            <OroButton variant="outline">Outline</OroButton>
          </div>
          <GrowthChart points={[1, 2, 4, 5, 8, 9, 13, 18]} animate={Boolean(props.animate)} />
        </div>
        <DataPanel stats={[['12', 'Rounds'], ['96%', 'Kept']]} className="relative">
          <p className="p-4 text-[12px] text-white/60">Data panel</p>
        </DataPanel>
      </OroRoot>
    </BlockPreview>
  )
}

export function RomaNavbarDemo() {
  const props = { variant: "dark", brand: "shinUI", links: "News, Changelog, Blocks, Connections", ctaLabel: "Sign in" } as const
  return (
    <BlockPreview height={360}>
      <RomaRoot className="flex flex-1 flex-col bg-(--rm-chip)">
        <RomaNavbar {...props} />
      </RomaRoot>
    </BlockPreview>
  )
}

export function RomaHeroDemo() {
  const props = { variant: "mosaic", badge: "Free and open source", title: "Your next page,\nalready half built.", description: "Original blocks you can drop into any React project, so the boring parts are done before you start.", primaryCta: "Browse blocks", secondaryCta: "Install the CLI", animate: true } as const
  return (
    <BlockPreview height={760}>
      <RomaHero {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function RomaStepsDemo() {
  const props = { variant: "orange", title: "From idea to page\nin three moves.", body: "Pages should not take a week. Most of a landing page is the same ten sections arranged with taste, and that part should be instant. So we drew the sections once, carefully, and left the interesting decisions to you.", animate: true } as const
  return (
    <BlockPreview height={720}>
      <RomaSteps {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function RomaCardsDemo() {
  const props = { variant: "integrations", title: "Works with what you use.", description: "Blocks are plain React files, so they fit wherever your work already happens." } as const
  return (
    <BlockPreview height={640}>
      <RomaCards {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function RomaFooterDemo() {
  const props = { variant: "statement", brand: "shinUI", slogan: "Pick it. Tweak it. Ship it.", primaryCta: "Browse blocks", secondaryCta: "Install the CLI" } as const
  return (
    <BlockPreview height={640}>
      <RomaRoot className="flex flex-1 flex-col justify-end">
        <RomaFooter {...props} />
      </RomaRoot>
    </BlockPreview>
  )
}

export function RomaLandingDemo() {
  const props = { preset: "app", brand: "shinUI", animate: true } as const
  return (
    <BlockPreview height={960}>
      <RomaLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function RomaKitDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={600}>
      <RomaRoot className="relative grid flex-1 items-center gap-8 overflow-hidden bg-black p-8 text-white md:grid-cols-[1fr_auto]">
        <Mosaic animate={Boolean(props.animate)} cols={16} rows={6} className="absolute inset-x-0 top-0" />
        <div className="relative flex flex-col items-start gap-5">
          <RomaHeading className="text-5xl">Roma kit</RomaHeading>
          <div className="flex flex-wrap gap-2">
            <RomaButton icon="laptop">White</RomaButton>
            <RomaButton variant="orange">Orange</RomaButton>
          </div>
          <div className="rounded-2xl bg-white p-4 text-black">
            <Bubble who="Aiko" time="10:02">
              Bubbles, rows and phones.
            </Bubble>
          </div>
        </div>
        <PhoneMock
          animate={Boolean(props.animate)}
          tasks={[
            { title: 'Tile mosaic', due: 'Done' },
            { title: 'Pill buttons', due: 'Today', hot: true },
            { title: 'Phone frame', due: 'Tue' },
          ]}
          className="relative"
        />
      </RomaRoot>
    </BlockPreview>
  )
}

export function DiaLandingDemo() {
  const props = { brand: "shinUI", animate: true } as const
  return (
    <BlockPreview height={960}>
      <DiaLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function DiaNavbarDemo() {
  const props = { variant: "pill", brand: "shinUI", links: "Blocks, Kits, Changelog", ctaLabel: "Get started" } as const
  return (
    <BlockPreview height={320}>
      <DiaRoot className="flex flex-1 flex-col">
        <DiaNavbar {...props} />
      </DiaRoot>
    </BlockPreview>
  )
}

export function DiaHeroDemo() {
  const props = { variant: "sunrise", brand: "shinUI", title: "Less tab juggling.\nMore good pages.", primaryCta: "Start building", note: "Free, open source, copy-paste React", animate: true } as const
  return (
    <BlockPreview height={900}>
      <DiaRoot className="flex flex-1 flex-col">
        <DiaHero {...props} className="flex-1" />
      </DiaRoot>
    </BlockPreview>
  )
}

export function DiaStepsDemo() {
  const props = { title: "Fewer tabs, more flow", animate: true, interval: 6 } as const
  return (
    <BlockPreview height={720}>
      <DiaRoot className="flex flex-1 flex-col">
        <DiaSteps {...props} className="flex-1" />
      </DiaRoot>
    </BlockPreview>
  )
}

export function DiaBentoDemo() {
  const props = { title: "Shaped around a working day" } as const
  return (
    <BlockPreview height={860}>
      <DiaRoot className="flex flex-1 flex-col">
        <DiaBento {...props} className="flex-1" />
      </DiaRoot>
    </BlockPreview>
  )
}

export function DiaControlsDemo() {
  const props = { title: "Your settings,\nyour call", linkLabel: "Read how data is handled", animate: true } as const
  return (
    <BlockPreview height={620}>
      <DiaRoot className="flex flex-1 flex-col justify-center">
        <DiaControls {...props} />
      </DiaRoot>
    </BlockPreview>
  )
}

export function DiaFooterDemo() {
  const props = { variant: "cta", brand: "shinUI", headline: "Ready for an easier build?", ctaLabel: "Start building", animate: true } as const
  return (
    <BlockPreview height={720}>
      {/* A scrolling box of its own, so the arch dock can be seen sticking. */}
      <DiaRoot className="h-[720px] overflow-y-auto overscroll-contain">
        <div className="flex flex-col gap-4 px-6 pt-10 pb-24">
          <DiaEyebrow className="text-center">Scroll inside the preview</DiaEyebrow>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="mx-auto h-40 w-full max-w-4xl rounded-2xl border border-(--di-line) bg-(--di-card)" />
          ))}
        </div>
        <DiaFooter {...props} />
      </DiaRoot>
    </BlockPreview>
  )
}

export function DiaKitDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={560}>
      <DiaRoot className="relative isolate grid flex-1 items-center gap-8 overflow-hidden p-10 md:grid-cols-2">
        <Sunrise animate={Boolean(props.animate)} className="-z-10" />
        <div className="flex flex-col items-start gap-4">
          <DiaEyebrow>Dia kit</DiaEyebrow>
          <DiaHeading className="text-5xl">
            <span className="flex items-center gap-3">
              <DiaMark className="size-9" /> Soft serif
            </span>
          </DiaHeading>
          <div className="flex gap-2">
            <DiaButton>Ink pill</DiaButton>
            <DiaButton variant="light">Light pill</DiaButton>
          </div>
        </div>
        <WindowFrame tabs={["Window", "Frame"]}>
          <p className="p-6 text-[13px] text-(--di-soft)">Any content goes inside the window frame.</p>
        </WindowFrame>
      </DiaRoot>
    </BlockPreview>
  )
}

export function NousLandingDemo() {
  const props = { brand: "shinUI", animate: true } as const
  return (
    <BlockPreview height={960}>
      <NousLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function NousNavbarDemo() {
  const props = { brand: "shinUI", links: "Blocks, Kits, Lab, Changelog" } as const
  return (
    <BlockPreview height={240}>
      <NousRoot className="flex flex-1 flex-col">
        <NousNavbar {...props} />
      </NousRoot>
    </BlockPreview>
  )
}

export function NousHeroDemo() {
  const props = { wordmark: "Open Blocks", primaryCta: "Read the manifesto", secondaryCta: "Browse blocks", animate: true } as const
  return (
    <BlockPreview height={680}>
      <NousRoot className="flex flex-1 flex-col">
        <NousHero {...props} className="flex-1" />
      </NousRoot>
    </BlockPreview>
  )
}

export function NousPillarsDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={820}>
      <NousRoot className="flex flex-1 flex-col justify-center py-10">
        <NousPillars {...props} />
      </NousRoot>
    </BlockPreview>
  )
}

export function NousAgentDemo() {
  const props = { heading: "Ship it today", command: "npx shinui add nous-hero" } as const
  return (
    <BlockPreview height={860}>
      <NousRoot className="flex flex-1 flex-col">
        <NousAgent {...props} />
      </NousRoot>
    </BlockPreview>
  )
}

export function NousFeedDemo() {
  const props = { heading: "Changelog", animate: true } as const
  return (
    <BlockPreview height={560}>
      <NousRoot className="flex flex-1 flex-col justify-center">
        <NousFeed {...props} />
      </NousRoot>
    </BlockPreview>
  )
}

export function NousFooterDemo() {
  const props = { brand: "shinUI", wordmark: "Open Blocks", animate: true } as const
  return (
    <BlockPreview height={720}>
      {/* A scrolling box of its own, so the reveal can be seen. */}
      <NousRoot className="relative h-[720px] overflow-y-auto overscroll-contain">
        <div className="relative z-10 flex flex-col gap-4 bg-(--nr-paper) px-6 pt-10 pb-16">
          <NousEyebrow className="text-center">Scroll inside the preview</NousEyebrow>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="relative mx-auto h-40 w-full max-w-4xl overflow-hidden border border-(--nr-line) bg-(--nr-card)">
              <Halftone shape={(["glow", "rings", "wave", "ridge", "fade"] as const)[i]} animate={false} />
            </div>
          ))}
        </div>
        <NousFooter {...props} />
      </NousRoot>
    </BlockPreview>
  )
}

export function NousKitDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={600}>
      <NousRoot className="relative isolate grid flex-1 items-center gap-10 overflow-hidden p-10 md:grid-cols-2">
        <div className="flex flex-col items-start gap-5">
          <NousEyebrow>Nous kit</NousEyebrow>
          <NousDisplay align="left" className="text-7xl">Tall type</NousDisplay>
          <div className="flex gap-2">
            <NousButton>Solid</NousButton>
            <NousButton variant="outline">Outline</NousButton>
          </div>
          <CommandBar questions={["Any question, typed out", "Then erased, then the next"]} animate={props.animate} />
        </div>
        <div className="relative aspect-square overflow-hidden border border-(--nr-line) bg-(--nr-card)">
          <Halftone shape="rings" animate={props.animate} />
          <NousMark className="absolute top-4 left-4 h-10" />
        </div>
      </NousRoot>
    </BlockPreview>
  )
}

export function ScoutLandingDemo() {
  const props = { brand: "shinUI", animate: true } as const
  return (
    <BlockPreview height={960}>
      <ScoutLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function ScoutNavbarDemo() {
  const props = { brand: "shinUI", links: "Blocks, Kits, Changelog", ctaLabel: "Contact" } as const
  return (
    <BlockPreview height={240}>
      <ScoutRoot className="flex flex-1 flex-col">
        <ScoutNavbar {...props} />
      </ScoutRoot>
    </BlockPreview>
  )
}

export function ScoutHeroDemo() {
  const props = { ctaLabel: "Watch the tour", animate: true } as const
  return (
    <BlockPreview height={640}>
      <ScoutRoot className="flex flex-1 flex-col">
        <ScoutHero {...props} className="flex-1" />
      </ScoutRoot>
    </BlockPreview>
  )
}

export function ScoutPinnedDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={720}>
      {/* Scrolls on its own so the pinning can be seen. */}
      <ScoutRoot className="h-[720px] overflow-y-auto overscroll-contain">
        <Mono className="block px-6 pt-8 text-(--sc-dim)">Scroll inside the preview</Mono>
        <ScoutPinned {...props} />
        <div className="h-40" />
      </ScoutRoot>
    </BlockPreview>
  )
}

export function ScoutProductDemo() {
  const props = { name: "Field Kit" } as const
  return (
    <BlockPreview height={700}>
      <ScoutRoot className="flex flex-1 flex-col justify-center">
        <ScoutProduct {...props} />
      </ScoutRoot>
    </BlockPreview>
  )
}

export function ScoutFeaturesDemo() {
  const props = { heading: "Built to hold up" } as const
  return (
    <BlockPreview height={560}>
      <ScoutRoot className="flex flex-1 flex-col justify-center">
        <ScoutFeatures {...props} />
      </ScoutRoot>
    </BlockPreview>
  )
}

export function ScoutFooterDemo() {
  const props = { brand: "shinUI" } as const
  return (
    <BlockPreview height={420}>
      <ScoutRoot className="flex flex-1 flex-col justify-end">
        <ScoutFooter {...props} />
      </ScoutRoot>
    </BlockPreview>
  )
}

export function ScoutKitDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={560}>
      <ScoutRoot className="relative isolate grid flex-1 items-center gap-10 overflow-hidden p-10 md:grid-cols-2">
        <div className="flex flex-col items-start gap-5">
          <Mono className="text-(--sc-accent)">Scout kit</Mono>
          <h3 className="flex items-center gap-3 text-5xl tracking-[-0.03em]">
            <ScoutMark className="size-10" /> Field ready
          </h3>
          <div className="flex flex-wrap gap-2">
            <ScoutButton>Outline</ScoutButton>
            <ScoutButton variant="accent">Accent</ScoutButton>
          </div>
        </div>
        <GridBand className="relative h-72 overflow-hidden">
          <Terrain animate={props.animate} />
          <Reticle animate={props.animate} className="top-1/3 left-1/2" />
          <Cross className="top-1/2 left-1/4" />
        </GridBand>
      </ScoutRoot>
    </BlockPreview>
  )
}

export function HexLandingDemo() {
  const props = { brand: "shinUI", animate: true } as const
  return (
    <BlockPreview height={960}>
      <HexLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function HexNavbarDemo() {
  const props = { brand: "shinUI", links: "Product, Solutions, Teams, Docs, Pricing", ctaLabel: "Start free" } as const
  return (
    <BlockPreview height={420}>
      {/* Scrolls on its own so the header can fold. */}
      <HexRoot className="relative h-[420px] overflow-y-auto overscroll-contain">
        <div className="sticky top-0 z-10">
          <HexNavbar {...props} />
        </div>
        <div className="relative h-[900px]">
          <GridPaper />
          <HexMono className="relative block pt-16 text-center text-(--hx-faint)">Scroll inside the preview</HexMono>
        </div>
      </HexRoot>
    </BlockPreview>
  )
}

export function HexHeroDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={760}>
      <HexRoot className="flex flex-1 flex-col">
        <HexHero {...props} className="flex-1" />
      </HexRoot>
    </BlockPreview>
  )
}

export function HexAgentDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={720}>
      {/* Scrolls on its own so the pinning can be seen. */}
      <HexRoot className="h-[720px] overflow-y-auto overscroll-contain">
        <HexAgent {...props} />
        <div className="h-40" />
      </HexRoot>
    </BlockPreview>
  )
}

export function HexOrbitDemo() {
  const props = { heading: "Every answer makes the next one better" } as const
  return (
    <BlockPreview height={640}>
      <HexRoot className="h-[640px] overflow-y-auto overscroll-contain">
        <HexMono className="block px-6 pt-8 text-center text-(--hx-faint)">Scroll to turn the ring</HexMono>
        <div className="h-48" />
        <HexOrbit {...props} />
        <div className="h-64" />
      </HexRoot>
    </BlockPreview>
  )
}

export function HexIntegrationsDemo() {
  const props = { heading: "Fits into the stack" } as const
  return (
    <BlockPreview height={760}>
      <HexRoot className="flex flex-1 flex-col justify-center">
        <HexIntegrations {...props} />
      </HexRoot>
    </BlockPreview>
  )
}

export function HexFaqDemo() {
  const props = { heading: "Questions" } as const
  return (
    <BlockPreview height={760}>
      <HexRoot className="flex flex-1 flex-col justify-center">
        <HexFaq {...props} />
      </HexRoot>
    </BlockPreview>
  )
}

export function HexFooterDemo() {
  const props = { brand: "shinUI" } as const
  return (
    <BlockPreview height={560}>
      <HexRoot className="flex flex-1 flex-col justify-end">
        <HexFooter {...props} />
      </HexRoot>
    </BlockPreview>
  )
}

export function HexKitDemo() {
  const props = { note: "Paper cards, graph-paper grounds, corner ticks and scroll hooks." } as const
  return (
    <BlockPreview height={520}>
      <HexRoot className="relative isolate grid flex-1 items-center gap-10 overflow-hidden p-10 md:grid-cols-2">
        <GridPaper />
        <div className="relative flex flex-col items-start gap-5">
          <HexMono className="text-(--hx-accent)">Hex kit</HexMono>
          <h3 className="flex items-center gap-3 text-5xl font-semibold tracking-[-0.04em]">
            <HexMark className="size-10" /> Plain <HexSerif>and calm</HexSerif>
          </h3>
          <p className="text-lg text-(--hx-dim)">
            Mix <HexChip icon="◆">chips</HexChip> into a sentence.
          </p>
          <div className="flex flex-wrap gap-3">
            <HexButton>Primary</HexButton>
            <HexButton variant="ghost">Ghost</HexButton>
          </div>
        </div>
        <HexCard className="relative p-6">
          <HexMono className="text-(--hx-faint)">Card</HexMono>
          <p className="mt-2 text-[15px] text-(--hx-dim)">{props.note}</p>
        </HexCard>
      </HexRoot>
    </BlockPreview>
  )
}

export function AsideLandingDemo() {
  const props = { brand: "shinUI", animate: true } as const
  return (
    <BlockPreview height={960}>
      <AsideLanding {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function AsideNavbarDemo() {
  const props = { brand: "shinUI", links: "Features, Use cases, Guides, Pricing", ctaLabel: "Download" } as const
  return (
    <BlockPreview height={420}>
      {/* Scrolls on its own: scroll down to hide the bar, up to bring it back. */}
      <AsideRoot className="relative h-[420px] overflow-y-auto overscroll-contain">
        <div className="sticky top-0 z-10">
          <AsideNavbar {...props} />
        </div>
        <div className="h-[1400px] bg-(--as-soft) px-6 pt-16 text-center text-sm text-(--as-dim)">Scroll down, then back up</div>
      </AsideRoot>
    </BlockPreview>
  )
}

export function AsideHeroDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={760}>
      {/* Scrolls on its own so the window can flatten. */}
      <AsideRoot className="h-[760px] overflow-y-auto overscroll-contain">
        <AsideHero {...props} />
        <div className="h-[500px]" />
      </AsideRoot>
    </BlockPreview>
  )
}

export function AsideIntroDemo() {
  const props = { eyebrow: "Why we built it" } as const
  return (
    <BlockPreview height={560}>
      <AsideRoot className="h-[560px] overflow-y-auto overscroll-contain">
        <p className="px-6 pt-10 text-center text-sm text-(--as-dim)">Scroll to read it in</p>
        <div className="h-[420px]" />
        <AsideIntro {...props} />
        <div className="h-[300px]" />
      </AsideRoot>
    </BlockPreview>
  )
}

export function AsideCapabilitiesDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={900}>
      <AsideRoot className="flex flex-1 flex-col justify-center">
        <AsideCapabilities {...props} />
      </AsideRoot>
    </BlockPreview>
  )
}

export function AsideBenchmarksDemo() {
  const props = { brand: "shinUI" } as const
  return (
    <BlockPreview height={620}>
      <AsideRoot className="flex flex-1 flex-col justify-center">
        <AsideBenchmarks {...props} />
      </AsideRoot>
    </BlockPreview>
  )
}

export function AsidePrivacyDemo() {
  const props = { heading: "Safe enough for your real accounts." } as const
  return (
    <BlockPreview height={620}>
      <AsideRoot className="flex flex-1 flex-col justify-center">
        <AsidePrivacy {...props} />
      </AsideRoot>
    </BlockPreview>
  )
}

export function AsideCtaDemo() {
  const props = { animate: true } as const
  return (
    <BlockPreview height={420}>
      <AsideRoot className="flex flex-1 flex-col justify-center">
        <AsideCta {...props} />
      </AsideRoot>
    </BlockPreview>
  )
}

export function AsideFooterDemo() {
  const props = { brand: "shinUI" } as const
  return (
    <BlockPreview height={360}>
      <AsideRoot className="flex flex-1 flex-col justify-end">
        <AsideFooter {...props} />
      </AsideRoot>
    </BlockPreview>
  )
}

export function AsideKitDemo() {
  const props = { title: "Bright and light" } as const
  return (
    <BlockPreview height={520}>
      <AsideRoot className="grid flex-1 items-center gap-8 p-8 md:grid-cols-2">
        <div className="flex flex-col items-start gap-5">
          <AsideEyebrow>Aside kit</AsideEyebrow>
          <h3 className="flex items-center gap-3 text-4xl font-medium tracking-[-0.035em]">
            <AsideMark className="size-9" /> {props.title}
          </h3>
          <SplitButton />
        </div>
        <div className="relative isolate overflow-hidden rounded-2xl p-6">
          <Sky />
          <AppWindow title="New tab">
            <div className="h-40 p-4 text-sm text-(--as-dim)">App window frame</div>
          </AppWindow>
        </div>
      </AsideRoot>
    </BlockPreview>
  )
}

export function HeroMagnetDemo() {
  const props = { kicker: "Fresh out of the oven", title: "Make it move.", mode: "push", radius: 140, accent: "#ff5c39" } as const
  return (
    <BlockPreview height={640}>
      <HeroMagnet {...props} className="flex-1" />
    </BlockPreview>
  )
}

export function HeroParallaxDemo() {
  const props = { title: "Interfaces that feel", depth: 30, animate: true } as const
  return (
    <BlockPreview height={680}>
      {/* Scrolls on its own so the shapes can drift with scroll. */}
      <div className="h-[680px] overflow-y-auto overscroll-contain">
        <HeroParallax {...props} className="min-h-[680px]" />
        <div className="h-[400px]" />
      </div>
    </BlockPreview>
  )
}

export function HeroMarqueeDemo() {
  const props = { kicker: "Now shipping", title: "Loud launches, made easy.", speed: 1, animate: true } as const
  return (
    <BlockPreview height={680}>
      <div className="h-[680px] overflow-y-auto overscroll-contain">
        <HeroMarquee {...props} className="min-h-[680px]" />
        <div className="h-[400px]" />
      </div>
    </BlockPreview>
  )
}
