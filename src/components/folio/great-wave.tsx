"use client";

import { useEffect, useRef } from "react";

import { WAVE_H, WAVE_RLE, WAVE_W } from "./great-wave-data";

type RGB = [number, number, number];

/** Sakura palettes — no blue or teal anywhere. Index = class id (see great-wave-data). */
type Palette = {
  blush: RGB; // sky colour at the horizon (top of the sky is the page paper)
  glow: RGB; // horizon glow
  cls: Record<3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, RGB>;
};

const LIGHT: Palette = {
  blush: [248, 223, 228],
  glow: [240, 199, 210],
  cls: {
    3: [255, 248, 239], // foam / petal cream
    4: [247, 212, 222], // pale blush band
    5: [235, 165, 187], // rose band
    6: [207, 113, 146], // mid rose
    7: [138, 63, 99], // deep plum
    8: [74, 29, 59], // deepest plum body
    9: [216, 163, 143], // boats — muted rose-tan
    10: [207, 113, 146], // contour line
  },
};

const DARK: Palette = {
  blush: [58, 32, 52],
  glow: [79, 44, 70],
  cls: {
    3: [241, 225, 216],
    4: [227, 178, 197],
    5: [201, 131, 159],
    6: [156, 79, 116],
    7: [92, 39, 72],
    8: [42, 15, 34],
    9: [184, 133, 118],
    10: [156, 79, 116],
  },
};

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => (v + 0.5) / 16,
);

/** Horizon row in the art (sky gradient bottoms out here). */
const HORIZON = 150;
/** Calm sea level for the procedurally extended sea. */
const CALM = 126;

let decoded: Uint8Array | null = null;
function decode(): Uint8Array {
  if (decoded) return decoded;
  const out = new Uint8Array(WAVE_W * WAVE_H);
  const rows = WAVE_RLE.split("/");
  for (let r = 0; r < WAVE_H; r++) {
    const row = rows[r] ?? "";
    let x = 0;
    let i = 0;
    while (i < row.length) {
      const cls = row.charCodeAt(i) - 97;
      i++;
      let n = 0;
      while (i < row.length && row.charCodeAt(i) >= 48 && row.charCodeAt(i) <= 57) {
        n = n * 10 + (row.charCodeAt(i) - 48);
        i++;
      }
      const len = n || 1;
      out.fill(cls, r * WAVE_W + x, r * WAVE_W + Math.min(WAVE_W, x + len));
      x += len;
    }
  }
  decoded = out;
  return out;
}

function hash(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

/** Hokusai-style swell height (0..1) at column x — sharp crests, broad troughs. */
function swellAt(x: number): number {
  const a = Math.pow(Math.abs(Math.sin(x * 0.083 + 0.6)), 4);
  const b = Math.pow(Math.abs(Math.sin(x * 0.051 + 2.1)), 6) * 0.6;
  return Math.min(1, a * 0.75 + b);
}

/** First non-sky row of the art's right-hand edge; the extended sea starts at this level. */
const EDGE_TOP = 88;

/**
 * Class for a pixel of the sea extended to the right of the art, or -1 for sky.
 * d = columns past the art's right edge. The water below the surface reuses the art's own
 * right-edge swell (its bands, streaks and foam) sheared to follow the procedural surface, so
 * the seam is continuous; only the surface shape is new.
 */
function seaClass(art: Uint8Array, x: number, y: number, d: number): number {
  const h = swellAt(x) * smooth(d / 30);
  const k = smooth(d / 48);
  const calm = CALM - h * 16 + Math.sin(x * 0.019) * 2;
  const surface = EDGE_TOP * (1 - k) + calm * k;
  const dd = y - surface;
  if (dd < 0) {
    // foam fingers just above sharp crests, and spray dots drifting up from them
    if (h > 0.55 && dd > -2.5 && hash(x, y) < 0.6) return 3;
    if (dd > -30 && hash(x * 3 + 7, y * 5 + 1) < 0.003 + h * 0.03) return 3;
    return -1;
  }
  if (k > 0.3) {
    if (dd < 1) return 10;
    if (dd < 2 + h * 3) return 3; // cream rim, thicker on crests
  }
  // sample one of the last 9 art columns, shifted down with the surface; further out, skip
  // most of the edge swell's thick foam rim so the open sea reads as plum body + bands
  const j = Math.round(smooth(d / 16) * (4 + 4 * Math.sin(x * 0.045)));
  const skip = Math.round(k * (16 - h * 10));
  const row = Math.min(WAVE_H - 1, Math.round(EDGE_TOP + skip + dd));
  const c = art[row * WAVE_W + (WAVE_W - 1 - j)];
  const v = c <= 2 ? 3 : c;
  // open water: keep only a few cream streaks below the rim so the plum body reads
  if (v === 3 && dd > 5 && k > 0.4) return (Math.floor(dd) + Math.floor(x / 9)) % 3 ? 4 : 3;
  return v;
}

function paperRGB(ctx: CanvasRenderingContext2D, fallback: RGB): RGB {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--fo-paper").trim();
  if (!v) return fallback;
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  ctx.restore();
  return [d[0], d[1], d[2]];
}

/**
 * Footer strip: the Great Wave redrawn as pixel art in sakura pink. The art keeps its native
 * 192-row grid (scaled by an integer factor) and is anchored flush left; on wider strips
 * the sky and a swelling sea are extended procedurally to the right (the wave never tiles).
 */
export function GreatWave({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const art = decode();

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const rows = WAVE_H;
      const cols = Math.max(1, Math.round((w / h) * rows));
      canvas.width = cols;
      canvas.height = rows;

      const dark = document.documentElement.classList.contains("dark");
      const pal = dark ? DARK : LIGHT;
      const paper = paperRGB(ctx, dark ? [24, 16, 22] : [253, 248, 246]);

      // The art is anchored flush left (its left edge is the rising back of the wave); wider
      // strips get open sea to the right, narrower ones crop the far-right swells.
      const img = ctx.createImageData(cols, rows);
      const px = img.data;
      for (let y = 0; y < rows; y++) {
        const t = smooth(y / HORIZON);
        for (let x = 0; x < cols; x++) {
          const c = x < WAVE_W ? art[y * WAVE_W + x] : seaClass(art, x, y, x - WAVE_W + 1);

          let rgb: RGB;
          if (c < 0 || c === 0 || c === 1) {
            // sky: paper at the top → blush toward the horizon, ordered-dithered in 4 steps
            const b = BAYER[(y & 3) * 4 + (x & 3)];
            const q = Math.min(1, Math.floor(t * 4 + b) / 4);
            rgb = [
              paper[0] + (pal.blush[0] - paper[0]) * q,
              paper[1] + (pal.blush[1] - paper[1]) * q,
              paper[2] + (pal.blush[2] - paper[2]) * q,
            ];
          } else if (c === 2) {
            rgb = pal.glow;
          } else {
            rgb = pal.cls[c as 3];
          }
          const i = (y * cols + x) * 4;
          px[i] = rgb[0];
          px[i + 1] = rgb[1];
          px[i + 2] = rgb[2];
          px[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className ?? "block h-full w-full"}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
