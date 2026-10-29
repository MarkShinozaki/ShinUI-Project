"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import * as demos from "./demos";
import * as blockDemos from "./demos/blocks";
import * as footerDemos from "./demos/footers";

// Pixel-art scenes pull in three.js, so they load on the client only, on demand.
const PIXEL_ART_DEMOS = [
  "RamenCartDemo",
  "CarTrackDemo",
  "KoiPondDemo",
  "LighthouseDemo",
  "FishingPondDemo",
  "SoccerJuggleDemo",
  "PenguinArcticDemo",
  "BusStopDemo",
  "BeachTideDemo",
  "WindowCatDemo",
  "ForestRunnerDemo",
  "CampfireNightDemo",
  "CityDuskDemo",
  "ReefBubblesDemo",
] as const;

type PixelArtDemo = (typeof PIXEL_ART_DEMOS)[number];

const pixelArtDemos = Object.fromEntries(
  PIXEL_ART_DEMOS.map((name: PixelArtDemo) => [
    name,
    dynamic(() => import("./demos/pixel-art").then((m) => m[name]), {
      ssr: false,
      loading: () => <div className="min-h-36 w-full" />,
    }),
  ]),
);

const demoMap = {
  ...demos,
  ...footerDemos,
  ...blockDemos,
  ...pixelArtDemos,
} as unknown as Record<string, ComponentType>;

export function RegistryDemo({ name }: { name: string }) {
  const Demo = demoMap[name];
  if (!Demo) {
    return (
      <p className="text-sm text-muted-foreground">
        No preview registered for <code>{name}</code>.
      </p>
    );
  }
  return <Demo />;
}
