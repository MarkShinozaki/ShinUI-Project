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
      <CounterStat value={128} label="Resources indexed" />
      <CounterStat value={17} label="Categories" />
      <CounterStat value={98} suffix="%" label="Lighthouse score" />
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
