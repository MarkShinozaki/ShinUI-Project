"use client";

// Generated from Design Studio's gallery previews (default props).
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

export function RamenCartDemo() {
  const props = { pixelSize: 3, speed: 1, autoRotate: false, palette: "classic", showOutlines: false, zoom: 1, interactiveZoom: true } as const
  return (
    <BlockPreview height={560} fit="fill">
      <RamenCart {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function CarTrackDemo() {
  const props = { pixelSize: 3, speed: 1, carColor: "#e5483d", cars: 2, autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const
  return (
    <BlockPreview height={560} fit="fill">
      <CarTrack {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function KoiPondDemo() {
  const props = { pixelSize: 3, speed: 1, koiCount: 5, showBridge: true, autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const
  return (
    <BlockPreview height={560} fit="fill">
      <KoiPond {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function LighthouseDemo() {
  const props = { pixelSize: 3, speed: 1, night: false, beamColor: "#fff1a8", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const
  return (
    <BlockPreview height={560} fit="fill">
      <Lighthouse {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function FishingPondDemo() {
  const props = { pixelSize: 3, speed: 1, biteInterval: 7, timeOfDay: "day", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const
  return (
    <BlockPreview height={560} fit="fill">
      <FishingPond {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function SoccerJuggleDemo() {
  const props = { pixelSize: 3, speed: 1, kitColor: "#e5483d", trickSet: "full", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const
  return (
    <BlockPreview height={560} fit="fill">
      <SoccerJuggle {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function PenguinArcticDemo() {
  const props = { pixelSize: 3, speed: 1, penguinCount: 5, snow: true, autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const
  return (
    <BlockPreview height={560} fit="fill">
      <PenguinArctic {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function BusStopDemo() {
  const props = { pixelSize: 3, speed: 1, busType: "commuter", waitTime: 3, coatColor: "#e0703a", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const
  return (
    <BlockPreview height={560} fit="fill">
      <BusStop {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function BeachTideDemo() {
  const props = { pixelSize: 3, speed: 1, tideSpeed: 1, waveHeight: 1, timeOfDay: "day", autoRotate: false, showOutlines: false, zoom: 1, interactiveZoom: true } as const
  return (
    <BlockPreview height={560} fit="fill">
      <BeachTide {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function WindowCatDemo() {
  const props = { pixelSize: 4, speed: 1, paused: false, fps: 12, timeOfDay: "dusk", catColor: "ginger", rain: "steady" } as const
  return (
    <BlockPreview height={520} fit="fill">
      <WindowCat {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function ForestRunnerDemo() {
  const props = { pixelSize: 4, speed: 1, paused: false, fps: 12, timeOfDay: "day", shirtColor: "#e5483d", obstacles: true } as const
  return (
    <BlockPreview height={520} fit="fill">
      <ForestRunner {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function CampfireNightDemo() {
  const props = { pixelSize: 4, speed: 1, paused: false, fps: 12, fire: "campfire", shootingStars: true, showTent: true } as const
  return (
    <BlockPreview height={520} fit="fill">
      <CampfireNight {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function CityDuskDemo() {
  const props = { pixelSize: 4, speed: 1, paused: false, fps: 12, timeOfDay: "dusk", trainInterval: 9, windowColor: "#ffd27a" } as const
  return (
    <BlockPreview height={520} fit="fill">
      <CityDusk {...props} className="flex flex-1" />
    </BlockPreview>
  )
}

export function ReefBubblesDemo() {
  const props = { pixelSize: 4, speed: 1, paused: false, fps: 12, palette: "tropical", fishCount: 6, bubbles: true } as const
  return (
    <BlockPreview height={520} fit="fill">
      <ReefBubbles {...props} className="flex flex-1" />
    </BlockPreview>
  )
}
