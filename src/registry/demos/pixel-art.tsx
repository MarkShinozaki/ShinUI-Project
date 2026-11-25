"use client";

// Generated from Design Studio's gallery previews (default props).
// Each demo takes playground props on top of those defaults (see registry/controls).
import type { ComponentProps } from "react";

import { BlockPreview } from "@/registry/demos/block-preview";
import { BeachTide } from "@/registry/pixel-art/beach-tide";
import { BusStop } from "@/registry/pixel-art/bus-stop";
import { CampfireNight } from "@/registry/pixel-art/campfire-night";
import { CarTrack } from "@/registry/pixel-art/car-track";
import { CityDusk } from "@/registry/pixel-art/city-dusk";
import { FishingPond } from "@/registry/pixel-art/fishing-pond";
import { ForestRunner } from "@/registry/pixel-art/forest-runner";
import { KoiPond } from "@/registry/pixel-art/koi-pond";
import { Lighthouse } from "@/registry/pixel-art/lighthouse";
import { PenguinArctic } from "@/registry/pixel-art/penguin-arctic";
import { RamenCart } from "@/registry/pixel-art/ramen-cart";
import { ReefBubbles } from "@/registry/pixel-art/reef-bubbles";
import { SoccerJuggle } from "@/registry/pixel-art/soccer-juggle";
import { WindowCat } from "@/registry/pixel-art/window-cat";

const RAMEN_CART_DEFAULTS = { pixelSize: 3, speed: 1, autoRotate: false, palette: "classic", showOutlines: false, zoom: 1, interactiveZoom: true } as const

export function RamenCartDemo(props: Partial<ComponentProps<typeof RamenCart>>) {
  return (
    <BlockPreview height={560} fit="fill">
      <RamenCart {...RAMEN_CART_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const CAR_TRACK_DEFAULTS = { pixelSize: 3, speed: 1, carColor: "#e5483d", cars: 2, autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const

export function CarTrackDemo(props: Partial<ComponentProps<typeof CarTrack>>) {
  return (
    <BlockPreview height={560} fit="fill">
      <CarTrack {...CAR_TRACK_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const KOI_POND_DEFAULTS = { pixelSize: 3, speed: 1, koiCount: 5, showBridge: true, autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const

export function KoiPondDemo(props: Partial<ComponentProps<typeof KoiPond>>) {
  return (
    <BlockPreview height={560} fit="fill">
      <KoiPond {...KOI_POND_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const LIGHTHOUSE_DEFAULTS = { pixelSize: 3, speed: 1, night: false, beamColor: "#fff1a8", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const

export function LighthouseDemo(props: Partial<ComponentProps<typeof Lighthouse>>) {
  return (
    <BlockPreview height={560} fit="fill">
      <Lighthouse {...LIGHTHOUSE_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const FISHING_POND_DEFAULTS = { pixelSize: 3, speed: 1, biteInterval: 7, timeOfDay: "day", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const

export function FishingPondDemo(props: Partial<ComponentProps<typeof FishingPond>>) {
  return (
    <BlockPreview height={560} fit="fill">
      <FishingPond {...FISHING_POND_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const SOCCER_JUGGLE_DEFAULTS = { pixelSize: 3, speed: 1, kitColor: "#e5483d", trickSet: "full", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const

export function SoccerJuggleDemo(props: Partial<ComponentProps<typeof SoccerJuggle>>) {
  return (
    <BlockPreview height={560} fit="fill">
      <SoccerJuggle {...SOCCER_JUGGLE_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const PENGUIN_ARCTIC_DEFAULTS = { pixelSize: 3, speed: 1, penguinCount: 5, snow: true, autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const

export function PenguinArcticDemo(props: Partial<ComponentProps<typeof PenguinArctic>>) {
  return (
    <BlockPreview height={560} fit="fill">
      <PenguinArctic {...PENGUIN_ARCTIC_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const BUS_STOP_DEFAULTS = { pixelSize: 3, speed: 1, busType: "commuter", waitTime: 3, coatColor: "#e0703a", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const

export function BusStopDemo(props: Partial<ComponentProps<typeof BusStop>>) {
  return (
    <BlockPreview height={560} fit="fill">
      <BusStop {...BUS_STOP_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const BEACH_TIDE_DEFAULTS = { pixelSize: 3, speed: 1, tideSpeed: 1, waveHeight: 1, timeOfDay: "day", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const

export function BeachTideDemo(props: Partial<ComponentProps<typeof BeachTide>>) {
  return (
    <BlockPreview height={560} fit="fill">
      <BeachTide {...BEACH_TIDE_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const WINDOW_CAT_DEFAULTS = { pixelSize: 4, speed: 1, paused: false, fps: 12, timeOfDay: "dusk", catColor: "ginger", rain: "steady" } as const

export function WindowCatDemo(props: Partial<ComponentProps<typeof WindowCat>>) {
  return (
    <BlockPreview height={520} fit="fill">
      <WindowCat {...WINDOW_CAT_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const FOREST_RUNNER_DEFAULTS = { pixelSize: 4, speed: 1, paused: false, fps: 12, timeOfDay: "day", shirtColor: "#e5483d", obstacles: true } as const

export function ForestRunnerDemo(props: Partial<ComponentProps<typeof ForestRunner>>) {
  return (
    <BlockPreview height={520} fit="fill">
      <ForestRunner {...FOREST_RUNNER_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const CAMPFIRE_NIGHT_DEFAULTS = { pixelSize: 4, speed: 1, paused: false, fps: 12, fire: "campfire", shootingStars: true, showTent: true } as const

export function CampfireNightDemo(props: Partial<ComponentProps<typeof CampfireNight>>) {
  return (
    <BlockPreview height={520} fit="fill">
      <CampfireNight {...CAMPFIRE_NIGHT_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const CITY_DUSK_DEFAULTS = { pixelSize: 4, speed: 1, paused: false, fps: 12, timeOfDay: "dusk", trainInterval: 9, windowColor: "#ffd27a" } as const

export function CityDuskDemo(props: Partial<ComponentProps<typeof CityDusk>>) {
  return (
    <BlockPreview height={520} fit="fill">
      <CityDusk {...CITY_DUSK_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

const REEF_BUBBLES_DEFAULTS = { pixelSize: 4, speed: 1, paused: false, fps: 12, palette: "tropical", fishCount: 6, bubbles: true } as const

export function ReefBubblesDemo(props: Partial<ComponentProps<typeof ReefBubbles>>) {
  return (
    <BlockPreview height={520} fit="fill">
      <ReefBubbles {...REEF_BUBBLES_DEFAULTS} {...props} className="flex flex-1" />
    </BlockPreview>
  )
}
