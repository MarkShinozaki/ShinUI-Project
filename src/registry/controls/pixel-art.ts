import type { Controls } from "@/registry/playground";

/**
 * Playground controls for the pixel-art scenes, keyed by registry slug.
 * Defaults match what each scene renders with no props, so the gallery
 * thumbnails and an untouched playground look the same.
 */

/** Shared by every 3D scene (props of the Iso Scene kit). */
const isoLook: Controls = {
  pixelSize: { type: "number", label: "Pixel size", min: 1, max: 8, step: 1, default: 3, unit: "px" },
  speed: { type: "number", min: 0, max: 3, step: 0.1, default: 1, unit: "×" },
};

const isoView: Controls = {
  autoRotate: { type: "boolean", label: "Auto rotate", default: false },
  showOutlines: { type: "boolean", label: "Outlines", default: false },
  zoom: { type: "number", label: "Zoom", min: 0.5, max: 2.5, step: 0.1, default: 1, unit: "×" },
  interactiveZoom: { type: "boolean", label: "Interactive zoom", default: true },
};

/** Shared by every 2D scene (props of the Pixel 2D kit). */
const flatLook: Controls = {
  pixelSize: { type: "number", label: "Pixel size", min: 2, max: 8, step: 1, default: 4, unit: "px" },
  speed: { type: "number", min: 0, max: 3, step: 0.1, default: 1, unit: "×" },
  paused: { type: "boolean", default: false },
  fps: { type: "number", label: "FPS", min: 4, max: 30, step: 1, default: 12 },
};

export const PIXEL_ART_CONTROLS: Record<string, Controls> = {
  // ----------------------------------------------------------------------- 3D
  "ramen-cart": {
    ...isoLook,
    palette: { type: "select", options: ["classic", "matcha", "sakura"], default: "classic" },
    ...isoView,
  },
  "car-track": {
    ...isoLook,
    carColor: { type: "color", label: "Car color", default: "#e5483d" },
    cars: { type: "number", min: 1, max: 3, step: 1, default: 2 },
    ...isoView,
  },
  "koi-pond": {
    ...isoLook,
    koiCount: { type: "number", label: "Koi", min: 1, max: 7, step: 1, default: 5 },
    showBridge: { type: "boolean", label: "Bridge", default: true },
    ...isoView,
  },
  lighthouse: {
    ...isoLook,
    night: { type: "boolean", default: false },
    beamColor: { type: "color", label: "Beam color", default: "#fff1a8" },
    ...isoView,
  },
  "fishing-pond": {
    ...isoLook,
    biteInterval: { type: "number", label: "Bite interval", min: 2, max: 20, step: 1, default: 7, unit: "s" },
    timeOfDay: { type: "select", label: "Time of day", options: ["day", "sunset", "night"], default: "day" },
    ...isoView,
  },
  "soccer-juggle": {
    ...isoLook,
    kitColor: { type: "color", label: "Kit color", default: "#e5483d" },
    trickSet: { type: "select", label: "Tricks", options: ["full", "keepy-uppies", "skills"], default: "full" },
    ...isoView,
  },
  "penguin-arctic": {
    ...isoLook,
    penguinCount: { type: "number", label: "Penguins", min: 4, max: 7, step: 1, default: 5 },
    snow: { type: "boolean", default: true },
    ...isoView,
  },
  "bus-stop": {
    ...isoLook,
    busType: { type: "select", label: "Bus type", options: ["commuter", "school", "double-decker"], default: "commuter" },
    busColor: { type: "color", label: "Bus color", default: "", auto: true },
    trimColor: { type: "color", label: "Trim color", default: "", auto: true },
    routeLabel: {
      type: "text",
      label: "Route sign",
      default: "",
      placeholder: "Auto (12 HARBOR)",
      maxLength: 10,
    },
    waitTime: { type: "number", label: "Wait before bus", min: 1, max: 12, step: 1, default: 3, unit: "s" },
    arriveDuration: { type: "number", label: "Arrival", min: 1, max: 8, step: 0.5, default: 3, unit: "s" },
    dwellTime: { type: "number", label: "Dwell at stop", min: 0, max: 6, step: 0.5, default: 0, unit: "s" },
    coatColor: { type: "color", label: "Rider coat", default: "#e0703a" },
    ...isoView,
  },
  "beach-tide": {
    ...isoLook,
    tideSpeed: { type: "number", label: "Tide speed", min: 0, max: 4, step: 0.1, default: 1, unit: "×" },
    waveHeight: { type: "number", label: "Wave height", min: 0.2, max: 2, step: 0.1, default: 1, unit: "×" },
    timeOfDay: { type: "select", label: "Time of day", options: ["day", "sunset", "night"], default: "day" },
    ...isoView,
  },

  // ----------------------------------------------------------------------- 2D
  "window-cat": {
    ...flatLook,
    timeOfDay: { type: "select", label: "Time of day", options: ["day", "dusk", "night"], default: "dusk" },
    catColor: { type: "select", label: "Cat", options: ["ginger", "tuxedo", "grey"], default: "ginger" },
    rain: { type: "select", options: ["drizzle", "steady", "storm"], default: "steady" },
  },
  "forest-runner": {
    ...flatLook,
    timeOfDay: { type: "select", label: "Time of day", options: ["day", "sunset", "night"], default: "day" },
    shirtColor: { type: "color", label: "Shirt", default: "#e5483d" },
    obstacles: { type: "boolean", default: true },
  },
  "campfire-night": {
    ...flatLook,
    fire: { type: "select", options: ["campfire", "driftwood", "ember"], default: "campfire" },
    shootingStars: { type: "boolean", label: "Shooting stars", default: true },
    showTent: { type: "boolean", label: "Tent", default: true },
  },
  "city-dusk": {
    ...flatLook,
    timeOfDay: { type: "select", label: "Time of day", options: ["dusk", "night", "dawn"], default: "dusk" },
    trainInterval: { type: "number", label: "Train every", min: 4, max: 30, step: 1, default: 9, unit: "s" },
    windowColor: { type: "color", label: "Windows", default: "#ffd27a" },
  },
  "reef-bubbles": {
    ...flatLook,
    palette: { type: "select", options: ["tropical", "deep", "lagoon"], default: "tropical" },
    fishCount: { type: "number", label: "Fish", min: 1, max: 12, step: 1, default: 6 },
    bubbles: { type: "boolean", default: true },
  },
};
