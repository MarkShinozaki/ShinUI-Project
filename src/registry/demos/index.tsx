"use client";

import {
  ArrowRight,
  Calendar,
  Compass,
  Folder,
  LayoutGrid,
  List,
  Mail,
  Music,
  Rows3,
  Settings,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

import { AnimatedTabs } from "@/registry/components/animated-tabs";
import { AvatarStack } from "@/registry/components/avatar-stack";
import { BentoCard, BentoGrid } from "@/registry/components/bento-grid";
import { CounterStat } from "@/registry/components/counter-stat";
import { Dock } from "@/registry/components/dock";
import { GlowButton } from "@/registry/components/glow-button";
import { GradientMesh } from "@/registry/components/gradient-mesh";
import { IosToggle } from "@/registry/components/ios-toggle";
import { Marquee } from "@/registry/components/marquee";
import { SegmentedControl } from "@/registry/components/segmented-control";
import { ShimmerText } from "@/registry/components/shimmer-text";
import { SpotlightCard } from "@/registry/components/spotlight-card";
import { ThinkingOrbs } from "@/registry/components/thinking-orbs";
import { TypingDots } from "@/registry/components/typing-dots";
import { CopyButton } from "@/registry/components/copy-button";
import { KbdGroup } from "@/registry/components/kbd";
import { GradientBorder } from "@/registry/components/gradient-border";
import { DotPattern } from "@/registry/components/dot-pattern";
import { ProgressRing } from "@/registry/components/progress-ring";
import { StatusBadge } from "@/registry/components/status-badge";
import { FlipCard } from "@/registry/components/flip-card";
import { LdrsRing } from "@/registry/components/ldrs-ring";
import { GlassCard } from "@/registry/components/glass-card";
import { CookieConsent } from "@/registry/components/cookie-consent";
import { Timeline } from "@/registry/components/timeline";

export function SpotlightCardDemo() {
  return (
    <SpotlightCard className="max-w-sm">
      <Sparkles className="mb-3 size-5 text-brand" />
      <h3 className="font-semibold">Move your cursor across this card</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        A radial gradient tracks the pointer, so the surface reads as lit rather
        than merely hovered.
      </p>
    </SpotlightCard>
  );
}

export function DockDemo() {
  return (
    <Dock
      items={[
        { id: "finder", label: "Finder", icon: <Folder /> },
        { id: "mail", label: "Mail", icon: <Mail /> },
        { id: "calendar", label: "Calendar", icon: <Calendar /> },
        { id: "music", label: "Music", icon: <Music /> },
        { id: "terminal", label: "Terminal", icon: <Terminal /> },
        { id: "settings", label: "Settings", icon: <Settings /> },
      ]}
    />
  );
}

export function AnimatedTabsDemo() {
  return (
    <AnimatedTabs
      tabs={[
        { value: "preview", label: "Preview" },
        { value: "code", label: "Code" },
        { value: "usage", label: "Usage" },
      ]}
    />
  );
}

export function IosToggleDemo() {
  return (
    <div className="flex flex-col gap-4">
      <IosToggle label="Airplane Mode" />
      <IosToggle label="Wi-Fi" defaultChecked />
      <IosToggle label="Bluetooth" defaultChecked />
    </div>
  );
}

export function MarqueeDemo() {
  const logos = ["Vercel", "Linear", "Raycast", "Stripe", "Supabase", "Resend"];
  return (
    <Marquee className="py-2">
      {logos.map((logo) => (
        <div
          key={logo}
          className="flex h-11 items-center rounded-lg border bg-card px-5 text-sm font-medium whitespace-nowrap"
        >
          {logo}
        </div>
      ))}
    </Marquee>
  );
}

export function GradientMeshDemo() {
  return (
    <GradientMesh className="grid h-56 w-full place-items-center">
      <div className="text-center">
        <p className="text-xs tracking-[0.2em] text-white/60 uppercase">
          Pure CSS
        </p>
        <p className="mt-1 text-2xl font-semibold text-white">Mesh Gradient</p>
      </div>
    </GradientMesh>
  );
}

export function BentoGridDemo() {
  return (
    <BentoGrid className="w-full">
      <BentoCard
        span={2}
        title="Search everything"
        description="Every component and resource in one command palette."
        icon={<Compass />}
      />
      <BentoCard
        title="Instant themes"
        description="Dark and light, driven by CSS variables."
        icon={<Zap />}
      />
      <BentoCard
        title="Copy the source"
        description="No package to install."
        icon={<Terminal />}
      />
      <BentoCard
        span={2}
        title="Credit the maker"
        description="Every entry links back to whoever built it."
        icon={<Sparkles />}
      />
    </BentoGrid>
  );
}

export function AvatarStackDemo() {
  return (
    <AvatarStack
      max={4}
      people={[
        { name: "Ada Lovelace" },
        { name: "Grace Hopper" },
        { name: "Alan Turing" },
        { name: "Katherine Johnson" },
        { name: "Margaret Hamilton" },
        { name: "Barbara Liskov" },
      ]}
    />
  );
}

export function CounterStatDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
      <CounterStat value={140} label="Resources indexed" />
      <CounterStat value={17} label="Categories" />
      <CounterStat value={22} label="Live components" />
    </div>
  );
}

export function GlowButtonDemo() {
  return (
    <GlowButton>
      Get started
      <ArrowRight className="size-4" />
    </GlowButton>
  );
}

export function ShimmerTextDemo() {
  return (
    <div className="space-y-2">
      <ShimmerText className="text-lg font-medium">
        Generating your component…
      </ShimmerText>
      <ShimmerText className="text-sm" duration={3.2}>
        Reading the registry and resolving dependencies
      </ShimmerText>
    </div>
  );
}

export function SegmentedControlDemo() {
  return (
    <SegmentedControl
      options={[
        { value: "grid", label: "Grid", icon: <LayoutGrid /> },
        { value: "list", label: "List", icon: <List /> },
        { value: "rows", label: "Rows", icon: <Rows3 /> },
      ]}
    />
  );
}

export function ThinkingOrbsDemo() {
  return (
    <div className="flex items-center gap-3">
      <ThinkingOrbs />
      <span className="text-sm text-muted-foreground">Agent is thinking…</span>
    </div>
  );
}

export function TypingDotsDemo() {
  return <TypingDots />;
}

export function CopyButtonDemo() {
  return <CopyButton value="pnpm dlx shadcn@latest add button" label="Copy install" />;
}

export function KbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
      <span>Search</span>
      <KbdGroup keys={["⌘", "K"]} />
      <span className="text-border">·</span>
      <span>Save</span>
      <KbdGroup keys={["⌘", "S"]} />
    </div>
  );
}

export function GradientBorderDemo() {
  return (
    <GradientBorder className="max-w-xs">
      <p className="text-xs tracking-[0.18em] text-brand uppercase">Featured</p>
      <p className="mt-2 font-semibold">Gradient border card</p>
      <p className="mt-1 text-sm text-muted-foreground">
        One pixel of brand colour around the edge, no extra wrapper divs.
      </p>
    </GradientBorder>
  );
}

export function DotPatternDemo() {
  return (
    <DotPattern className="grid h-40 w-full place-items-center">
      <p className="text-sm font-medium">Dot pattern surface</p>
    </DotPattern>
  );
}

export function ProgressRingDemo() {
  return (
    <div className="flex items-center gap-6">
      <ProgressRing value={68} label="Upload progress" />
      <ProgressRing value={92} size={56} stroke={5} label="Sync progress" />
    </div>
  );
}

export function StatusBadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="online" label="Live" />
      <StatusBadge status="away" label="Away" />
      <StatusBadge status="busy" label="In a call" />
      <StatusBadge status="offline" label="Offline" />
    </div>
  );
}

export function FlipCardDemo() {
  return (
    <FlipCard
      front={
        <>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Hover to flip</p>
          <p className="mt-2 text-lg font-semibold">ShinUI</p>
          <p className="mt-1 text-sm text-muted-foreground">Design resources, indexed.</p>
        </>
      }
      back={
        <>
          <p className="text-lg font-semibold">Copy the source</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Every component ships with the exact file that renders above it.
          </p>
        </>
      }
    />
  );
}

export function LdrsRingDemo() {
  return (
    <div className="flex items-center gap-4">
      <LdrsRing />
      <LdrsRing size={28} stroke={2.5} />
      <span className="text-sm text-muted-foreground">Loading…</span>
    </div>
  );
}

export function GlassCardDemo() {
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#6366f1,#ec4899,#f59e0b)] p-8">
      <GlassCard>
        <p className="text-xs tracking-[0.18em] text-white/70 uppercase">GlassCN style</p>
        <p className="mt-2 text-lg font-semibold text-white">Frosted card</p>
        <p className="mt-1 text-sm text-white/75">
          Backdrop blur and a soft border over any colourful surface.
        </p>
      </GlassCard>
    </div>
  );
}

export function CookieConsentDemo() {
  return <CookieConsent />;
}

export function TimelineDemo() {
  return (
    <Timeline
      className="max-w-sm text-left"
      items={[
        {
          date: "Aug 2026",
          title: "Public launch",
          description: "Ship the searchable index and live component registry.",
        },
        {
          date: "Jul 2026",
          title: "Registry grows",
          description: "Add docks, loaders, glass cards and AI chat patterns.",
        },
        {
          date: "Jun 2026",
          title: "First commit",
          description: "Seed the index from the original ShinUI README list.",
        },
      ]}
    />
  );
}
