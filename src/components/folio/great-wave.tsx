"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Static pixel-art homage to Hokusai's "The Great Wave off Kanagawa", for the
 * footer strip. Procedural (no image): a clawed curling crest with foam
 * fingers and spray, a striped indigo body, a small snow-capped Mt Fuji seen
 * under the curl, boats in the trough and smaller echoing waves across the
 * rest of the width. Ordered-dithered like DitherField, redrawn on resize and
 * on theme change, light/dark aware. Pixels are `cell` CSS px, crisp-scaled.
 */

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bayer = (x: number, y: number) => BAYER[(y & 3) * 4 + (x & 3)];

function hash(x: number, y: number, seed = 1) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
const pack = ([r, g, b]: [number, number, number]) => (255 << 24) | (b << 16) | (g << 8) | r;

type Pal = Record<"skyLow" | "deep" | "mid" | "light" | "foam" | "foamShade" | "pink" | "fuji" | "snow" | "boat" | "ink", number> & {
  skyTop: [number, number, number];
  skyLowRgb: [number, number, number];
};

function palette(dark: boolean, paper: [number, number, number]): Pal {
  const c = dark
    ? {
        skyLow: "#2b1a31", deep: "#0f1028", mid: "#272d60", light: "#5f6ca3", foam: "#efe3d6",
        foamShade: "#b4a4b6", pink: "#e98fb2", fuji: "#3b2d55", snow: "#e9ddd0", boat: "#d7c4ae", ink: "#140c18",
      }
    : {
        skyLow: "#f5dde2", deep: "#22244d", mid: "#3d4786", light: "#8f9dc7", foam: "#fdf6ea",
        foamShade: "#e6d7cb", pink: "#f0a3bb", fuji: "#5c4a7a", snow: "#fdf6ea", boat: "#f1e2cb", ink: "#4a2f45",
      };
  return {
    skyLow: pack(rgb(c.skyLow)),
    deep: pack(rgb(c.deep)),
    mid: pack(rgb(c.mid)),
    light: pack(rgb(c.light)),
    foam: pack(rgb(c.foam)),
    foamShade: pack(rgb(c.foamShade)),
    pink: pack(rgb(c.pink)),
    fuji: pack(rgb(c.fuji)),
    snow: pack(rgb(c.snow)),
    boat: pack(rgb(c.boat)),
    ink: pack(rgb(c.ink)),
    skyTop: paper,
    skyLowRgb: rgb(c.skyLow),
  };
}

const DEG = Math.PI / 180;
const smooth = (a: number, b: number, v: number) => {
  const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Wave = { cx: number; cy: number; R: number; r: number; tail: number; base: number; fingers: boolean };

/** Returns a color for (x, y) if it is part of this wave, else -1. */
function wavePixel(w: Wave, x: number, y: number, p: Pal, s: number): number {
  const dx = x - w.cx;
  const dy = y - w.cy;
  const d = Math.hypot(dx, dy);
  const th = Math.atan2(-dy, dx); // math angle, y up
  const end = -26 * DEG;

  // Foam fingers ("claws"): the lip keeps curling inward as two spirals of
  // shrinking foam blobs, like Hokusai's grasping crest.
  if (w.fingers) {
    for (const [start, scale] of [
      [end + 2 * DEG, 1],
      [end + 24 * DEG, 0.8],
    ] as const) {
      for (let j = 0; j < 5; j++) {
        const a = start - j * 13 * DEG;
        const rho = w.R * (0.93 - j * 0.1 * scale);
        const br = w.R * (0.1 - j * 0.016) * scale;
        if (br <= 0.6) break;
        const fx = w.cx + Math.cos(a) * rho;
        const fy = w.cy - Math.sin(a) * rho;
        const dd = Math.hypot(x - fx, y - fy);
        if (dd < br) return dd > br - 1 ? p.foamShade : p.foam;
      }
    }
  }

  // The curl: an annulus from the back (left) over the top to the clawed tip.
  const inArc = th >= end || th <= -150 * DEG;
  if (inArc && d < w.R) {
    const k = th >= end && th < 25 * DEG ? (th - end) / (25 * DEG - end) : 1;
    const rIn = w.R - (w.R - w.r) * (0.3 + 0.7 * k);
    if (d >= rIn) {
      const q = (d - rIn) / (w.R - rIn); // 0 inner, 1 outer rim
      const scallop = 0.74 + Math.sin(th * 46) * 0.06 + (hash(x, y, 4) - 0.5) * 0.08;
      if (q > scallop) return th < 140 * DEG && th > -150 * DEG ? p.foam : p.foamShade;
      if (q > scallop - 0.1 && bayer(x, y) > 0.45) return p.foamShade;
      const stripe = (q * 4.5 + th * 0.35) % 1;
      if (stripe < 0.22) return p.light;
      if (stripe < 0.3 && bayer(x, y) > 0.5) return p.light;
      return q < 0.15 ? p.mid : th > 100 * DEG || th < -150 * DEG ? p.deep : p.mid;
    }
  }

  // The body: a sloped back running from the curl down to the sea.
  if (y >= w.cy && y <= w.base && x <= w.cx && d >= w.r) {
    const v = (y - w.cy) / Math.max(1, w.base - w.cy);
    const xl = w.cx - w.R - Math.pow(v, 1.4) * w.tail;
    if (x >= xl) {
      const u = x - xl;
      if (u < 1.2 + v) return p.foamShade;
      const stripe = (u / (0.07 * s) + v * 0.8) % 1;
      if (stripe < 0.18) return p.light;
      if (stripe < 0.26 && bayer(x, y) > 0.5) return p.mid;
      return v > 0.7 ? p.mid : p.deep;
    }
  }

  // Spray: loose foam pixels flung off the crest.
  if (w.fingers && d > w.R && d < w.R * 1.35 && th > 15 * DEG && th < 135 * DEG && hash(x, y, 9) > 0.9 + (d / w.R - 1) * 0.3) {
    return hash(x, y, 10) > 0.75 ? p.pink : p.foam;
  }
  return -1;
}

function paint(out: Uint32Array, cols: number, rows: number, p: Pal) {
  const s = rows;
  const sea = Math.round(rows * 0.82);

  const big: Wave = { cx: 0.62 * s + 0.1 * s, cy: 0.5 * s, R: 0.44 * s, r: 0.2 * s, tail: 0.55 * s, base: sea + 2, fingers: true };
  const waves: Wave[] = [big];
  waves.push({ cx: big.cx + 1.02 * s, cy: sea - 0.09 * s, R: 0.15 * s, r: 0.065 * s, tail: 0.18 * s, base: sea + 2, fingers: true });
  // Echoes across wide screens.
  for (let x = big.cx + 1.75 * s, k = 0; x < cols + 0.6 * s; x += (k % 2 ? 1.25 : 1.6) * s, k++) {
    const R = (k % 2 ? 0.17 : 0.26) * s;
    waves.push({ cx: x, cy: sea - R * 0.85, R, r: R * 0.48, tail: R * 1.3, base: sea + 2, fingers: true });
  }

  const fuji = { x: big.cx + 0.64 * s, h: 0.16 * s, hw: 0.25 * s };
  const boats = [
    { x: big.cx + 0.2 * s, y: sea + 0.05 * s, len: 0.2 * s, tilt: 0.16 },
    { x: big.cx - 0.55 * s, y: sea + 0.09 * s, len: 0.2 * s, tilt: -0.12 },
  ];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      let c: number;
      // Sky: paper at the top, sakura blush toward the horizon.
      const v = smooth(0, 1, y / sea);
      const mix = v > bayer(x, y) ? 1 : 0;
      const sky = mix ? p.skyLow : pack(p.skyTop);
      c = sky;

      // Mt Fuji, small, behind everything.
      const fh = fuji.h * (1 - Math.abs(x - fuji.x) / fuji.hw);
      if (y < sea && y >= sea - fh) {
        const snowLine = sea - fuji.h * 0.52 + Math.sin(x * 1.7) * 1.2;
        c = y < snowLine ? p.snow : Math.abs(x - fuji.x) / fuji.hw > 0.85 && bayer(x, y) > 0.5 ? p.mid : p.fuji;
      }

      // Sea with horizontal swell lines.
      const surface = sea + Math.sin(x * 0.22) * 0.8 + Math.sin(x * 0.07 + 1) * 0.6;
      if (y >= surface) {
        const depth = (y - surface) / Math.max(1, rows - sea);
        c = (y + Math.round(Math.sin(x * 0.3) * 1.2)) % 4 === 0 ? p.light : depth > 0.5 ? p.deep : p.mid;
        if (y - surface < 1 && hash(x, y, 2) > 0.4) c = p.foamShade;
      }

      // Boats in the troughs: long cream hulls with a plum line of rowers.
      for (const b of boats) {
        const lx = x - b.x;
        const ly = y - (b.y + lx * b.tilt);
        if (Math.abs(lx) < b.len && Math.abs(ly) < 1.6 * (1 - (lx / b.len) ** 2) + 0.4) {
          c = ly < -0.4 ? p.ink : p.boat;
        }
      }

      for (const w of waves) {
        const wc = wavePixel(w, x, y, p, s);
        if (wc !== -1) c = wc;
      }
      out[i] = c;
    }
  }
}

export function GreatWave({ cell = 3, className }: { cell?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    /** Resolve the paper token (oklch) to RGB through the canvas itself. */
    const paperRgb = (): [number, number, number] => {
      const v = getComputedStyle(canvas).getPropertyValue("--fo-paper").trim() || "#fdf9f7";
      ctx.fillStyle = "#fdf9f7";
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };

    const draw = () => {
      const cols = Math.max(1, Math.ceil(canvas.clientWidth / cell));
      const rows = Math.max(1, Math.ceil(canvas.clientHeight / cell));
      if (canvas.width !== cols || canvas.height !== rows) {
        canvas.width = cols;
        canvas.height = rows;
      }
      const dark = document.documentElement.classList.contains("dark");
      const img = ctx.createImageData(cols, rows);
      paint(new Uint32Array(img.data.buffer), cols, rows, palette(dark, paperRgb()));
      ctx.putImageData(img, 0, 0);
    };

    draw();
    let pending = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(draw);
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      cancelAnimationFrame(pending);
      ro.disconnect();
      mo.disconnect();
    };
  }, [cell]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Pixel art after Hokusai's The Great Wave off Kanagawa"
      className={cn("block size-full [image-rendering:pixelated]", className)}
    />
  );
}
