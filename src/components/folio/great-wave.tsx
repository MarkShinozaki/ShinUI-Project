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
    9: [216, 163, 143], // baked boats (painted out at load; see withoutBakedBoats)
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

/* ── Boats ───────────────────────────────────────────────────────────────────
 * The traced art has three boats baked in (class 9). They are painted out once at load
 * (each hull pixel takes the nearest non-hull class above or below it in its column, so
 * the water and foam around them carry straight through) and redrawn as sprites that sit
 * where they were: the bottom edge of each baked hull is sampled as that boat's waterline.
 */

/** Pixel boxes (in art pixels) around each baked boat, and the way its bow points. */
const BAKED_BOATS: { x0: number; x1: number; y0: number; y1: number; facing: 1 | -1; phase: number }[] = [
  { x0: 0, x1: 60, y0: 86, y1: 140, facing: -1, phase: 0.4 }, // left, under the curl
  { x0: 92, x1: 180, y0: 142, y1: 184, facing: -1, phase: 2.3 }, // front, in the trough
  { x0: 130, x1: 220, y0: 100, y1: 144, facing: 1, phase: 4.1 }, // behind Fuji, climbing right
];

type Boat = {
  x0: number;
  x1: number;
  facing: 1 | -1;
  phase: number;
  /** Waterline row for each column x0..x1 (smoothed bottom edge of the baked hull). */
  water: Float32Array;
  /** Least-squares slope and centre of the waterline. */
  slope: number;
  cx: number;
  cy: number;
};

function withoutBakedBoats(src: Uint8Array): { art: Uint8Array; boats: Boat[] } {
  const boats: Boat[] = [];
  for (const b of BAKED_BOATS) {
    const n = b.x1 - b.x0 + 1;
    const raw = new Float32Array(n).fill(NaN);
    for (let x = b.x0; x <= b.x1; x++) {
      for (let y = b.y1; y >= b.y0; y--) {
        if (src[y * WAVE_W + x] === 9) {
          raw[x - b.x0] = y + 1;
          break;
        }
      }
    }
    let first = -1;
    let last = -1;
    for (let i = 0; i < n; i++) {
      if (!Number.isNaN(raw[i])) {
        if (first < 0) first = i;
        last = i;
      }
    }
    if (first < 0) continue;
    // Fit a line, then blend it with a smoothed sample so the waterline follows the
    // swell's curve without the baked hull's ragged edge.
    let sx = 0;
    let sy = 0;
    let sxx = 0;
    let sxy = 0;
    let m = 0;
    for (let i = first; i <= last; i++) {
      if (Number.isNaN(raw[i])) continue;
      sx += i;
      sy += raw[i];
      sxx += i * i;
      sxy += i * raw[i];
      m++;
    }
    const slope = m > 1 ? (m * sxy - sx * sy) / (m * sxx - sx * sx || 1) : 0;
    const icpt = (sy - slope * sx) / m;
    const water = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let acc = 0;
      let k = 0;
      for (let j = Math.max(first, i - 6); j <= Math.min(last, i + 6); j++) {
        if (Number.isNaN(raw[j])) continue;
        acc += raw[j];
        k++;
      }
      const line = icpt + slope * i;
      water[i] = k && i >= first && i <= last ? line * 0.4 + (acc / k) * 0.6 : line;
    }
    const mid = (first + last) / 2;
    boats.push({
      x0: b.x0 + first,
      x1: b.x0 + last,
      facing: b.facing,
      phase: b.phase,
      water: water.subarray(first, last + 1),
      slope,
      cx: b.x0 + mid,
      cy: icpt + slope * mid,
    });
  }

  const art = src.slice();
  for (let x = 0; x < WAVE_W; x++) {
    for (let y = 0; y < WAVE_H; y++) {
      if (src[y * WAVE_W + x] !== 9) continue;
      let u = y;
      while (u >= 0 && src[u * WAVE_W + x] === 9) u--;
      let d = y;
      while (d < WAVE_H && src[d * WAVE_W + x] === 9) d++;
      const up = u >= 0 ? src[u * WAVE_W + x] : 0;
      const down = d < WAVE_H ? src[d * WAVE_W + x] : 8;
      art[y * WAVE_W + x] = d - y <= y - u ? down : up;
    }
  }
  return { art, boats };
}

type Wood = { hull: RGB; shade: RGB; crew: RGB; head: RGB };
const WOOD_LIGHT: Wood = { hull: [238, 208, 174], shade: [206, 162, 136], crew: [74, 29, 59], head: [252, 240, 228] };
const WOOD_DARK: Wood = { hull: [204, 162, 132], shade: [156, 112, 96], crew: [28, 10, 22], head: [236, 214, 202] };

/** RGB → packed ABGR for a little-endian Uint32Array view over ImageData. */
const pack = (c: RGB) => (255 << 24) | (Math.round(c[2]) << 16) | (Math.round(c[1]) << 8) | Math.round(c[0]);

type Ink = { hull: number; shade: number; crew: number; head: number; edge: number; bow: number };

/**
 * An oshiokuri-bune: long, slender, low in the water, prow sweeping up, a tight row of
 * crouching rowers. It heaves and pitches gently around its waterline and the hull is
 * hidden below that line, so it always sits in the water rather than floating over it.
 */
function drawBoat(out: Uint32Array, cols: number, rows: number, b: Boat, t: number, ink: Ink) {
  const half = (b.x1 - b.x0) / 2 + 2;
  const heave = 1.2 * Math.sin(t * 1.05 + b.phase) + 0.4 * Math.sin(t * 0.47 + b.phase * 2);
  const pitch = 0.03 * Math.sin(t * 0.8 + b.phase + 1.1);
  const ang = Math.atan(b.slope) + pitch;
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const freeboard = 5;
  const cxp = b.cx + 0.5;
  const cyp = b.cy - freeboard + heave;
  const bowRise = 6;
  const depth = 9;
  const headR = 1.7;
  const crewTop = 2;
  const crew = Math.max(4, Math.round((half * 1.18) / 5));
  const headGap = (half * 1.18) / crew;

  const waterAt = (x: number) => {
    const i = Math.max(0, Math.min(b.water.length - 1, x - b.x0));
    if (x >= b.x0 && x <= b.x1) return b.water[i];
    return b.water[i] + b.slope * (x < b.x0 ? x - b.x0 : x - b.x1);
  };

  const reach = half + 3;
  const minX = Math.max(0, Math.floor(cxp - reach - 2));
  const maxX = Math.min(cols - 1, Math.ceil(cxp + reach + 2));
  const minY = Math.max(0, Math.floor(cyp - reach * Math.abs(sin) - bowRise - 8));
  const maxY = Math.min(rows - 1, Math.ceil(cyp + reach * Math.abs(sin) + depth + 3));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (y + 0.5 > waterAt(x) + 0.6) continue; // the rest of the hull is under water
      const dx = x + 0.5 - cxp;
      const dy = y + 0.5 - cyp;
      const a = dx * cos + dy * sin; // along the hull
      const v = -dx * sin + dy * cos; // across (down is +)
      const sa = (a / half) * b.facing; // +1 at the bow
      if (sa < -1.02 || sa > 1.06) continue;
      const rise =
        sa > 0.5 ? bowRise * Math.pow((sa - 0.5) / 0.5, 2.2) : sa < -0.85 ? 1.2 * ((-sa - 0.85) / 0.15) : 0;
      const top = -rise;
      const bot = depth * (1 - Math.pow(Math.abs(Math.min(1, sa)), 5));
      const i = y * cols + x;
      if (v >= top - 0.5 && v <= bot) {
        const edge = v < top + 0.9 || sa > 0.985 || sa < -0.975;
        if (edge) out[i] = sa > 0.6 || sa < -0.9 ? ink.bow : ink.edge;
        else if (v > bot - 1.4 || Math.abs(v - 1.8) < 0.5) out[i] = ink.shade;
        else out[i] = ink.hull;
        continue;
      }
      // Rowers: dark crouched backs with a tight row of pale heads above them.
      if (sa > -0.72 && sa < 0.46 && v < top) {
        const along = (sa + 0.72) * half;
        const k = Math.round(along / headGap);
        if (k > crew) continue;
        const hx = k * headGap - along;
        if (v > top - crewTop) {
          out[i] = ink.crew;
          continue;
        }
        const hy = v - (top - crewTop - headR * 0.55);
        const d = Math.hypot(hx, hy);
        if (d < headR) out[i] = hy < -headR * 0.35 ? ink.crew : ink.head;
        else if (d < headR + 0.85) out[i] = ink.crew;
      }
    }
  }
}

/* ── Spray ─────────────────────────────────────────────────────────────────── */

/** Region of the curl's claws (art pixels) that sheds spray and twinkles. */
const CLAWS = { x0: 88, x1: 150, y0: 18, y1: 92 };
const SPRAY_N = 46;

/**
 * Footer strip: the Great Wave redrawn as pixel art in sakura pink. The art keeps its native
 * 192-row grid (scaled by an integer factor) and is anchored flush left; on wider strips
 * the sky and a swelling sea are extended procedurally to the right (the wave never tiles).
 *
 * The wave itself is still. Its only life is a sparse twinkle along the claws and a few spray
 * dots falling from them; the gentle motion comes from the three boats, which heave and pitch
 * on their waterlines. ~20fps, pauses offscreen and in hidden tabs, a still frame for reduced
 * motion, and a repaint on theme change or resize.
 */
export function GreatWave({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const { art, boats } = withoutBakedBoats(decode());
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rows = WAVE_H;
    let cols = 0;
    let img: ImageData | null = null;
    let out: Uint32Array | null = null;
    let base = new Uint32Array(0);
    /** Per pixel: 1 if sky. */
    let sky = new Uint8Array(0);
    /** Sky pixels touching claw foam: where twinkles and spray start. */
    let edge: number[] = [];
    let ink: Ink | null = null;
    let foamPx = 0;
    let time = 3;

    const paint = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return false;
      const nextCols = Math.max(1, Math.round((w / h) * rows));
      if (nextCols !== cols || !img) {
        cols = nextCols;
        canvas.width = cols;
        canvas.height = rows;
        img = ctx.createImageData(cols, rows);
        out = new Uint32Array(img.data.buffer);
      }

      const dark = document.documentElement.classList.contains("dark");
      const pal = dark ? DARK : LIGHT;
      const paper = paperRGB(ctx, dark ? [24, 16, 22] : [253, 248, 246]);

      // The art is anchored flush left (its left edge is the rising back of the wave); wider
      // strips get open sea to the right, narrower ones crop the far-right swells.
      base = new Uint32Array(cols * rows);
      sky = new Uint8Array(cols * rows);
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
            sky[y * cols + x] = 1;
          } else if (c === 2) {
            rgb = pal.glow;
          } else {
            rgb = pal.cls[c as 3];
          }
          base[y * cols + x] = pack(rgb);
        }
      }

      edge = [];
      for (let y = CLAWS.y0; y <= CLAWS.y1; y++) {
        for (let x = CLAWS.x0; x <= Math.min(CLAWS.x1, cols - 2); x++) {
          const i = y * cols + x;
          if (!sky[i]) continue;
          const j = y * WAVE_W + x;
          if (art[j - 1] === 3 || art[j + 1] === 3 || art[j - WAVE_W] === 3) edge.push(i);
        }
      }

      const wood = dark ? WOOD_DARK : WOOD_LIGHT;
      ink = {
        hull: pack(wood.hull),
        shade: pack(wood.shade),
        crew: pack(wood.crew),
        head: pack(wood.head),
        edge: pack(pal.cls[7]),
        bow: pack(pal.cls[8]),
      };
      foamPx = pack(pal.cls[3]);
      return true;
    };

    const render = () => {
      if (!img || !out || !ink) return;
      out.set(base);
      if (!reduce && edge.length) {
        // A sparse twinkle along the claws, re-rolled a few times a second.
        const tick = Math.floor(time * 3);
        for (let k = 0; k < edge.length; k++) {
          if (hash(k, tick) < 0.035) out[edge[k]] = foamPx;
        }
        // A few spray dots falling slowly from the claws into the hollow.
        for (let n = 0; n < SPRAY_N; n++) {
          const period = 2.6 + 1.8 * hash(n, 91);
          const age0 = time / period + hash(n, 92);
          const cycle = Math.floor(age0);
          const age = (age0 - cycle) * period;
          const start = edge[Math.floor(hash(n, cycle + 7) * edge.length)];
          const sx = start % cols;
          const sy = (start - sx) / cols;
          const x = Math.round(sx + age * (0.8 + 1.6 * hash(n, cycle + 3)));
          const y = Math.round(sy + 1 + age * 3 + age * age * 1.4);
          if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
          const i = y * cols + x;
          const life = age / period;
          if (!sky[i] || (life > 0.75 && BAYER[(y & 3) * 4 + (x & 3)] < (life - 0.75) / 0.25)) continue;
          out[i] = foamPx;
        }
      }
      for (const b of boats) drawBoat(out, cols, rows, b, time, ink);
      ctx.putImageData(img, 0, 0);
    };

    if (paint()) render();

    let raf = 0;
    let last = 0;
    let visible = false;
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 50) return;
      // Advance by real elapsed time (capped) so a slow frame never makes the boats jump.
      time += last ? Math.min(0.1, (now - last) / 1000) : 0.05;
      last = now;
      render();
    };
    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(canvas);
    const onVisibility = () => start();
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(() => {
      if (paint()) render();
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      if (paint()) render();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
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
