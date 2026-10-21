"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Pixel-art cherry blossom tree beside a Japanese stream (hero "Figure 1").
 *
 * Drawn into a tiny 200×138 buffer and scaled up with crisp pixels, in the
 * same ordered-dither (Bayer 4×4) style as DitherField. The tree is grown
 * procedurally (seeded, so it is identical on every load) in the shape of a
 * somei-yoshino: a dark, gnarled trunk with horizontal lenticel bands that
 * splits into a few heavy limbs, then tapering branches that spread wide and
 * arch down at the tips into a broad umbrella canopy. Blossoms are clumpy
 * clusters along the twigs, shaded darker toward the inside and underside,
 * dotted with five-petal flowers (pale petals around a deeper pink eye),
 * with bare twig tips poking out. A red paper chōchin hangs from a limb on a
 * thin cord and swings with the branch, casting a warm glow (stronger in
 * dark mode). Petals detach, tumble in the wind and either settle on the
 * grass or drift down the stream.
 *
 * ~20fps via rAF, pauses offscreen, renders a single still frame for reduced
 * motion, and repaints on theme change.
 */

const W = 200;
const H = 138;
const HORIZON = 40;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bayer = (x: number, y: number) => BAYER[(y & 3) * 4 + (x & 3)];

function hash(x: number, y: number, seed = 1) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

/** "#rrggbb" → packed ABGR for a little-endian Uint32Array over ImageData. */
const px = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return (255 << 24) | ((n & 255) << 16) | (n & 0xff00) | ((n >> 16) & 255);
};

type Palette = Record<
  | "sky"
  | "mount"
  | "grass"
  | "bank"
  | "water"
  | "shine"
  | "bark"
  | "bloom"
  | "eye"
  | "petal"
  | "bridge"
  | "cap",
  number[]
>;

const LIGHT: Palette = {
  sky: ["#fdf7f3", "#fbeeec", "#f7e1e4"].map(px),
  mount: ["#ecd3dc", "#dfbccb", "#cfa6ba"].map(px),
  grass: ["#e6e9d8", "#d2ddbf", "#bccda6", "#a2b78d"].map(px),
  bank: ["#d9c8c4", "#bba6a6", "#9a8489", "#77636c"].map(px),
  water: ["#eaf0f6", "#d3e0ee", "#b9cbe4", "#9fb3d7", "#8398c4"].map(px),
  shine: ["#ffffff", "#fbe9f1"].map(px),
  bark: ["#76606a", "#55404b", "#3c2a34", "#281a22"].map(px),
  bloom: ["#fffafb", "#fdebf0", "#f8d5e0", "#f0b9cb", "#e199b2", "#c97795", "#a35a78"].map(px),
  eye: ["#e8869f", "#cf6585"].map(px),
  petal: ["#ffffff", "#f9d3df", "#efa3bb"].map(px),
  bridge: ["#e07a8f", "#c4566f", "#8f3a52"].map(px),
  cap: ["#3a2a2e", "#1c1416"].map(px),
};

const DARK: Palette = {
  sky: ["#140c19", "#1c1122", "#2a1a2e"].map(px),
  mount: ["#2e1d35", "#3a2541", "#47304d"].map(px),
  grass: ["#221f28", "#272a2e", "#2d3532", "#354238"].map(px),
  bank: ["#4a3a48", "#3a2c3a", "#2c212d", "#1f1721"].map(px),
  water: ["#2c2140", "#261c39", "#211832", "#1b142a", "#160f22"].map(px),
  shine: ["#f6cfe0", "#b98fb4"].map(px),
  bark: ["#4f3d49", "#3a2b36", "#281c25", "#170f15"].map(px),
  bloom: ["#fbe8ef", "#f3d0dd", "#e6b0c4", "#cf8ea9", "#b06f8e", "#87506f", "#5e3550"].map(px),
  eye: ["#d9608a", "#a8416a"].map(px),
  petal: ["#ffe3ee", "#f4b4cb", "#d8769c"].map(px),
  bridge: ["#d86a8a", "#a94767", "#6e2d48"].map(px),
  cap: ["#221a1e", "#0c0809"].map(px),
};

export type SakuraLanternColor = "red" | "white";

/** Paper ramps for the chōchin, brightest (lit core) first. */
const LANTERN: Record<SakuraLanternColor, { body: number[]; glow: [number, number, number] }> = {
  red: {
    body: ["#ffe2a8", "#ffab6b", "#f0663f", "#d63a32", "#a8232a", "#721620"].map(px),
    glow: [255, 150, 92],
  },
  white: {
    body: ["#fffdf0", "#fff3cf", "#f6e4b8", "#e7cf9f", "#c9ad7d", "#9a805a"].map(px),
    glow: [255, 214, 150],
  },
};

/** Pick from a ramp with ordered dithering: v in [0, ramp.length - 1]. */
function ramp(colors: number[], v: number, x: number, y: number) {
  const c = Math.max(0, Math.min(colors.length - 1, v));
  const i = Math.floor(c);
  const f = c - i;
  return colors[Math.min(colors.length - 1, f > bayer(x, y) ? i + 1 : i)];
}

/** Mix a packed colour toward rgb by a (0..1). */
function mix(c: number, r: number, g: number, b: number, a: number) {
  const cr = c & 255;
  const cg = (c >> 8) & 255;
  const cb = (c >> 16) & 255;
  return (
    (255 << 24) |
    ((cb + (b - cb) * a) << 16) |
    ((cg + (g - cg) * a) << 8) |
    (cr + (r - cr) * a)
  );
}

/* ── Stream geometry: t = 0 at the horizon, 1 at the bottom edge ── */
const tOf = (y: number) => Math.max(0, (y - HORIZON) / (H - HORIZON));
const streamX = (t: number) => 148 - 78 * t + 12 * Math.sin(t * 3.4);
const streamW = (t: number) => 2.5 + 40 * Math.pow(t, 1.6);
const face = (t: number) => 1 + Math.round(5 * t);

function inStream(x: number, y: number) {
  if (y <= HORIZON) return false;
  const t = tOf(y);
  return Math.abs(x - streamX(t)) < streamW(t);
}

/* ── The tree, grown once from a fixed seed ── */

const BASE_X = 72;
const BASE_Y = 99;

type Seg = {
  x0: number;
  y0: number;
  cx: number;
  cy: number;
  x1: number;
  y1: number;
  w0: number;
  w1: number;
  depth: number;
};
type Flower = { dx: number; dy: number };
type Puff = { x: number; y: number; r: number; back: boolean; seed: number; flowers: Flower[] };
type Tree = { segs: Seg[]; puffs: Puff[]; anchor: { x: number; y: number } };

function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const bez = (s: Seg, u: number) => {
  const a = (1 - u) * (1 - u);
  const b = 2 * u * (1 - u);
  const c = u * u;
  return [a * s.x0 + b * s.cx + c * s.x1, a * s.y0 + b * s.cy + c * s.y1] as const;
};

/** Lantern hook: where the cord ties onto a limb. */
const LANTERN_TARGET = { x: 104, y: 58 };
/** Cord length and the lantern's extent below the hook (local units). */
const CORD = 6;
const LANTERN_DROP = CORD + 19;

function growTree(): Tree {
  const r = mulberry(0x5a6b);
  const segs: Seg[] = [];
  const puffs: Puff[] = [];

  const puff = (x: number, y: number, rad: number, back: boolean) => {
    const flowers: Flower[] = [];
    const n = Math.round(rad * 0.9 + r() * 1.5);
    for (let k = 0; k < n; k++) {
      // Bias flowers toward the lit upper-left of each clump.
      const a = -2.2 + (r() - 0.5) * 3.4;
      const d = Math.sqrt(r()) * rad * 0.85;
      flowers.push({ dx: Math.round(Math.cos(a) * d), dy: Math.round(Math.sin(a) * d) });
    }
    puffs.push({ x, y, r: rad, back, seed: Math.floor(r() * 1000), flowers });
  };

  const seg = (x0: number, y0: number, x1: number, y1: number, w0: number, w1: number, depth: number, bend: number) => {
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const len = Math.hypot(x1 - x0, y1 - y0) || 1;
    const s: Seg = {
      x0,
      y0,
      x1,
      y1,
      w0,
      w1,
      depth,
      cx: mx + (-(y1 - y0) / len) * bend * len,
      cy: my + ((x1 - x0) / len) * bend * len,
    };
    segs.push(s);
    return s;
  };

  const branch = (x: number, y: number, a: number, len: number, w: number, depth: number) => {
    const bend = (r() - 0.5) * 0.35;
    const x1 = x + Math.cos(a) * len;
    const y1 = y + Math.sin(a) * len;
    const w1 = Math.max(0.35, w * 0.68);
    const s = seg(x, y, x1, y1, w, w1, depth, bend);
    const terminal = depth >= 5 || len < 4;

    // Blossom clumps hug the outer branches; tips stay a little bare.
    if (depth >= 2) {
      const bare = terminal && r() < 0.18;
      if (!bare) {
        const n = Math.max(1, Math.round(len / (depth >= 4 ? 2.2 : 3.2)));
        for (let k = 0; k < n; k++) {
          const u = (terminal ? 0.05 + 0.7 * (k / n) : 0.25 + 0.75 * (k / n)) + r() * 0.12;
          const [bx, by] = bez(s, Math.min(u, 1));
          const rad = depth >= 4 ? 1.8 + r() * 1.6 : 2.6 + r() * 2;
          puff(bx + (r() - 0.5) * 3, by - rad * 0.45 + (r() - 0.5) * 2, rad, r() < 0.3);
        }
      }
    }
    if (terminal) return;

    const n = depth < 2 ? 3 : r() < 0.3 ? 3 : 2;
    const spread = depth < 2 ? 0.62 : 0.5;
    for (let k = 0; k < n; k++) {
      let ca = a + spread * (k - (n - 1) / 2) * (0.75 + r() * 0.5) + (r() - 0.5) * 0.25;
      const dir = Math.cos(ca) >= 0 ? 1 : -1;
      // Spread outward rather than up, and let outer branches droop into an arch.
      if (Math.sin(ca) < -0.75) ca += dir * 0.28;
      if (depth >= 2) ca += dir * 0.06 * (depth - 1);
      // Arch, don't weep: tips may dip a little below horizontal, never hang.
      if (Math.sin(ca) > 0.3) ca = Math.atan2(0.3, Math.cos(ca) >= 0 ? 0.95 : -0.95);
      branch(x1, y1, ca, len * (0.7 + r() * 0.12), w1, depth + 1);
    }
  };

  // Trunk: a short, gnarled, slightly twisting bole with a flared foot.
  const trunk: [number, number, number][] = [
    [BASE_X, BASE_Y, 4.8],
    [BASE_X - 1, BASE_Y - 7, 3.9],
    [BASE_X + 2, BASE_Y - 13, 4],
    [BASE_X, BASE_Y - 19, 3.8],
    [BASE_X + 3, BASE_Y - 25, 3.6],
    [BASE_X + 3.5, BASE_Y - 29, 3.4],
  ];
  for (let i = 0; i < trunk.length - 1; i++) {
    const [x0, y0, w0] = trunk[i];
    const [x1, y1, w1] = trunk[i + 1];
    seg(x0, y0, x1, y1, w0, w1, 0, i % 2 ? 0.12 : -0.12);
  }
  // A low limb leaving the trunk early, then the main fork into heavy limbs.
  const fx = BASE_X + 3.5;
  const fy = BASE_Y - 29;
  const deg = Math.PI / 180;
  branch(BASE_X + 1, BASE_Y - 17, -164 * deg, 15, 1.7, 2);
  branch(fx, fy, -152 * deg, 25, 2.6, 1);
  branch(fx, fy, -118 * deg, 22, 2.6, 1);
  branch(fx, fy, -72 * deg, 21, 2.7, 1);
  branch(fx, fy, -26 * deg, 27, 2.6, 1);
  // A couple of tiny clusters sprouting straight from the trunk, as on old yoshino.
  puff(BASE_X - 4, BASE_Y - 11, 1.8, false);
  puff(BASE_X + 6, BASE_Y - 21, 1.6, false);

  // Hook the lantern onto the nearest point of a sturdy limb.
  let best = { x: LANTERN_TARGET.x, y: LANTERN_TARGET.y, d: Infinity };
  for (const s of segs) {
    if (s.depth < 1 || s.depth > 3) continue;
    for (let u = 0; u <= 1; u += 0.05) {
      const [x, y] = bez(s, u);
      const d = Math.hypot(x - LANTERN_TARGET.x, (y - LANTERN_TARGET.y) * 1.5);
      if (d < best.d) best = { x, y, d };
    }
  }
  const anchor = { x: Math.round(best.x), y: Math.round(best.y) };
  // Keep the cord and the lantern clear of blossoms.
  const clear = puffs.filter(
    (p) =>
      !(
        Math.abs(p.x - anchor.x) < 7 + p.r &&
        p.y > anchor.y + 1 &&
        p.y < anchor.y + LANTERN_DROP + p.r
      ),
  );
  return { segs, puffs: clear, anchor };
}

const TREE = growTree();
const CANOPY = (() => {
  let x0 = W;
  let x1 = 0;
  let y0 = H;
  let y1 = 0;
  for (const p of TREE.puffs) {
    x0 = Math.min(x0, p.x - p.r);
    x1 = Math.max(x1, p.x + p.r);
    y0 = Math.min(y0, p.y - p.r);
    y1 = Math.max(y1, p.y + p.r);
  }
  return { x0, x1, y0, y1 };
})();

/** Wind displacement: stronger high up and far out along the limbs, nil at the root. */
function sway(x: number, y: number, t: number, wind: number) {
  if (!wind) return 0;
  const h = Math.max(0, (BASE_Y - y) / 85);
  const reach = Math.min(1.3, Math.abs(x - BASE_X - 3) / 60);
  const k = wind * (0.55 * h * h + 1.1 * reach * reach * h + 0.25 * reach * h);
  return k * (Math.sin(t * 1.15 + x * 0.035) * 0.8 + Math.sin(t * 2.6 + y * 0.12 + x * 0.02) * 0.25);
}

/** Static layers: sky, hills, banks, grass, petal carpet, shadow, bridge, far tree. */
function paintBase(buf: Uint32Array, pal: Palette, waterMask: Uint8Array) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      waterMask[i] = 0;
      if (y <= HORIZON) {
        // Sky gradient, then two layers of soft hills on the horizon.
        let c = ramp(pal.sky, (y / HORIZON) * 2, x, y);
        const far = HORIZON - 9 - 6 * Math.sin(x * 0.035 + 1.2) - 3 * Math.sin(x * 0.11);
        const near = HORIZON - 4 - 4 * Math.sin(x * 0.05 + 3.1) - 2 * Math.sin(x * 0.17);
        if (y > far) c = ramp(pal.mount, 0.2 + (y - far) * 0.08, x, y);
        if (y > near) c = ramp(pal.mount, 1.2 + (y - near) * 0.18, x, y);
        buf[i] = c;
        continue;
      }
      const t = tOf(y);
      const cx = streamX(t);
      const w = streamW(t);
      const f = face(t);
      const d = x - cx;
      if (Math.abs(d) < w) {
        // Stone bank faces at both edges: the water sits below the grass.
        const fromEdge = w - Math.abs(d);
        if (fromEdge < f) {
          const stone = hash(x >> 1, y >> 1, 3) > 0.55 ? 0.6 : 0;
          buf[i] = ramp(pal.bank, (d < 0 ? 1 : 0.4) + (1 - fromEdge / f) * 1.4 + stone, x, y);
        } else if (t > 0.35 && fromEdge < f + 2.5 && hash(x >> 1, y >> 1, 15) > 0.82) {
          buf[i] = ramp(pal.bank, 0.3 + (y & 1) * 0.8 + hash(x, y, 16), x, y); // wet stones
        } else {
          waterMask[i] = 1;
          buf[i] = 0;
        }
        continue;
      }
      // Grass with atmospheric perspective, a lit lip along the bank edge.
      let g = 0.4 + t * 2.2 + (hash(x, y, 7) - 0.5) * 0.7;
      const edge = Math.abs(d) - w;
      if (edge < 1.2 + t) g -= 0.9;
      if (hash(x, y >> 1, 8) > 0.965 && t > 0.15) g += 1.2; // tufts
      buf[i] = ramp(pal.grass, g, x, y);
      if (t < 0.12 && bayer(x, y) > t / 0.12) buf[i] = ramp(pal.mount, 0.6, x, y); // haze
      // Soft canopy shadow, then the fallen-petal carpet, densest at the foot.
      const sh = Math.hypot((x - BASE_X - 6) / 44, (y - BASE_Y + 1) / 6.5);
      if (sh < 1 && bayer(x, y) > sh * 0.9) buf[i] = ramp(pal.grass, 3, x, y);
      const carpet = Math.hypot((x - BASE_X - 4) / 46, (y - BASE_Y) / 9);
      const carpet2 = Math.hypot((x - 175) / 10, (y - 46) / 2.5);
      const drift = (hash(x >> 2, y >> 1, 14) - 0.5) * 0.5;
      if ((carpet + drift < 1 && hash(x, y, 11) > 0.4 + (carpet + drift) * 0.6) || (carpet2 < 1 && hash(x, y, 12) > 0.7)) {
        buf[i] = ramp(pal.petal, 0.3 + hash(x, y, 13) * 1.7, x, y);
      }
    }
  }

  // A small arched taiko bridge across the stream in the middle distance.
  {
    const by = 76;
    const t = tOf(by);
    const cx = streamX(t);
    const half = streamW(t) + 7;
    for (let x = Math.floor(cx - half); x <= cx + half; x++) {
      const u = (x - (cx - half)) / (2 * half);
      const top = Math.round(by - Math.sin(u * Math.PI) * 7);
      if (x < 0 || x >= W) continue;
      for (let y = top; y <= top + 2; y++) {
        buf[y * W + x] = ramp(pal.bridge, (y - top) * 0.9, x, y);
        waterMask[y * W + x] = 0;
      }
      const rail = top - 4;
      buf[rail * W + x] = pal.bridge[0];
      waterMask[rail * W + x] = 0;
      if (x % 3 === 0)
        for (let y = rail + 1; y < top; y++) {
          buf[y * W + x] = pal.bridge[2];
          waterMask[y * W + x] = 0;
        }
      // Reflection of the arch on the water below.
      const ry = by + 3 + Math.round(Math.sin(u * Math.PI) * 4);
      if (ry < H && waterMask[ry * W + x] && bayer(x, ry) > 0.4) {
        buf[ry * W + x] = pal.bridge[2];
        waterMask[ry * W + x] = 0;
      }
    }
  }

  // A small far-off sakura across the stream: a few hazy clumps on a thin trunk.
  for (let y = 40; y < 47; y++) {
    buf[y * W + 174] = pal.bark[2];
    buf[y * W + 175] = pal.bark[3];
  }
  for (const c of [
    { x: 169, y: 38, r: 4 },
    { x: 180, y: 37, r: 4 },
    { x: 174, y: 34, r: 5 },
    { x: 177, y: 39, r: 3 },
  ]) {
    for (let y = c.y - c.r; y <= c.y + c.r; y++)
      for (let x = c.x - c.r; x <= c.x + c.r; x++) {
        const d2 = ((x - c.x) ** 2 + (y - c.y) ** 2) / (c.r * c.r);
        if (d2 > 1 || (d2 > 0.6 && hash(x, y, 21) < (d2 - 0.6) * 2.4)) continue;
        buf[y * W + x] = ramp(pal.bloom, 2 + (y - c.y + c.r) / c.r + (hash(x >> 1, y, 22) - 0.5), x, y);
      }
  }
}

/** Draw the tree (branches and blossom clumps) with wind sway at time t. */
function paintTree(out: Uint32Array, pal: Palette, t: number, wind: number) {
  const put = (x: number, y: number, c: number) => {
    if (x >= 0 && x < W && y >= 0 && y < H) out[y * W + x] = c;
  };

  const drawPuff = (p: Puff) => {
    const ox = Math.round(p.x + sway(p.x, p.y, t, wind));
    const oy = Math.round(p.y);
    const rr = p.r;
    // Deeper, pinker shade toward the underside and the heart of the canopy.
    const under = Math.max(0, Math.min(1, (p.y - CANOPY.y0) / (CANOPY.y1 - CANOPY.y0)));
    const inner = 1 - Math.min(1, Math.abs(p.x - (CANOPY.x0 + CANOPY.x1) / 2) / ((CANOPY.x1 - CANOPY.x0) / 2));
    const depth = under * 1.5 + inner * 0.5 + (p.back ? 1.1 : 0) + night;
    for (let y = Math.floor(-rr); y <= rr; y++) {
      for (let x = Math.floor(-rr); x <= rr; x++) {
        const nx = x / rr;
        const ny = y / rr;
        const d2 = nx * nx + ny * ny;
        if (d2 > 1) continue;
        const gx = ox + x;
        const gy = oy + y;
        if (d2 > 0.5 && hash(x + p.seed, y, 31) < (d2 - 0.5) * 1.6) continue; // ragged edge
        const nz = Math.sqrt(1 - d2);
        const lit = Math.max(0, -0.55 * nx - 0.65 * ny + 0.55 * nz);
        const tex = (hash((gx >> 1) + p.seed, gy, 33) - 0.5) * 1.2;
        put(gx, gy, ramp(pal.bloom, (1 - lit) * 2.4 + depth + tex, gx, gy));
      }
    }
    // Individual five-petal flowers: a deep-pink eye ringed by pale petals.
    for (const f of p.flowers) {
      const fx = ox + f.dx;
      const fy = oy + f.dy;
      const shade = p.back ? 2 : depth > 1.2 ? 1 : 0;
      const petal = pal.bloom[shade];
      put(fx - 1, fy, petal);
      put(fx + 1, fy, petal);
      put(fx, fy - 1, petal);
      put(fx, fy + 1, hash(fx, fy, 35) > 0.5 ? petal : pal.bloom[shade + 1]);
      if (hash(fx, fy, 36) > 0.55) put(fx + 1, fy + 1, pal.bloom[shade + 1]);
      // Only some flowers face the viewer, so only some show their eye.
      put(fx, fy, hash(fx, fy, 37) > 0.45 ? pal.eye[shade > 1 ? 1 : 0] : pal.bloom[shade + 2]);
    }
  };

  // Under the night palette the canopy reads moonlit, a touch dimmer.
  const night = pal === DARK ? 0.45 : 0;

  // Blossoms behind the branches first, so limbs thread through the canopy.
  for (const p of TREE.puffs) if (p.back) drawPuff(p);

  for (const s of TREE.segs) {
    const len = Math.hypot(s.x1 - s.x0, s.y1 - s.y0);
    const steps = Math.max(2, Math.ceil(len * 2));
    for (let j = 0; j <= steps; j++) {
      const u = j / steps;
      const [bx, by] = bez(s, u);
      const x = bx + (s.depth ? sway(bx, by, t, wind) : 0);
      const w = s.w0 + (s.w1 - s.w0) * u;
      if (w < 0.75) {
        put(Math.round(x), Math.round(by), s.depth >= 4 ? pal.bark[1] : pal.bark[2]);
        continue;
      }
      const R = Math.ceil(w);
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          if (dx * dx + dy * dy > w * w) continue;
          const gx = Math.round(x + dx);
          const gy = Math.round(by + dy);
          // Lit from the upper left; horizontal lenticel bands on the trunk.
          let v = 1.5 + ((dx * 0.8 + dy * 0.35) / w) * 1.2;
          if (s.depth === 0 && (gy % 4 === 0 || gy % 7 === 0) && hash(gx, gy, 41) > 0.35) v -= 0.9;
          v += (hash(gx, gy >> 1, 42) - 0.5) * 0.7;
          put(gx, gy, ramp(pal.bark, v, gx, gy));
        }
      }
    }
  }

  for (const p of TREE.puffs) if (!p.back) drawPuff(p);
}

/** The chōchin: cord, black caps, ribbed paper body, tassel and a warm glow. */
function paintLantern(
  out: Uint32Array,
  pal: Palette,
  color: SakuraLanternColor,
  dark: boolean,
  t: number,
  wind: number,
) {
  const { anchor } = TREE;
  const L = LANTERN[color];
  const ax = anchor.x + sway(anchor.x, anchor.y, t, wind);
  const ay = anchor.y;
  // Pendulum: lags the branch sway, plus a little flutter.
  const theta = wind ? wind * (0.13 * Math.sin(t * 1.15 + ax * 0.035 - 0.9) + 0.03 * Math.sin(t * 3.1)) : 0;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const bodyTop = CORD + 2;
  const bodyH = 12;
  const mid = bodyTop + bodyH / 2;

  // Warm light on everything around the paper body.
  const gcx = ax - sin * mid;
  const gcy = ay + cos * mid;
  const R = dark ? 30 : 20;
  const strength = dark ? 0.62 : 0.2;
  const [gr, gg, gb] = L.glow;
  for (let y = Math.max(0, Math.floor(gcy - R)); y < Math.min(H, gcy + R); y++) {
    for (let x = Math.max(0, Math.floor(gcx - R)); x < Math.min(W, gcx + R); x++) {
      const d = Math.hypot(x - gcx, (y - gcy) * 1.05) / R;
      if (d >= 1) continue;
      const a = strength * (1 - d) * (1 - d);
      // Quantise with the dither matrix so the glow stays pixel-art.
      const q = Math.floor(a * 6 + bayer(x, y)) / 6;
      if (q > 0) out[y * W + x] = mix(out[y * W + x], gr, gg, gb, q);
    }
  }

  const top = Math.floor(ay) - 1;
  const bottom = Math.ceil(ay + LANTERN_DROP + 2);
  for (let y = top; y <= bottom; y++) {
    for (let x = Math.floor(ax - 9); x <= ax + 9; x++) {
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      // Rotate back into the lantern's local frame (cord along +y from the hook).
      const rx = x + 0.5 - ax;
      const ry = y + 0.5 - ay;
      const lx = rx * cos + ry * sin;
      const ly = -rx * sin + ry * cos;
      const i = y * W + x;
      if (ly < 0) continue;
      if (ly < CORD) {
        if (Math.abs(lx) < 0.55) out[i] = pal.cap[0];
        continue;
      }
      if (ly < bodyTop) {
        // Top cap (a short black rim with a ring for the cord).
        if (Math.abs(lx) < (ly < CORD + 1 ? 1.1 : 2.9)) out[i] = pal.cap[ly < CORD + 1 ? 0 : 1];
        continue;
      }
      if (ly < bodyTop + bodyH) {
        const v = (ly - mid) / (bodyH / 2 + 0.6);
        const half = 4.9 * Math.sqrt(Math.max(0, 1 - v * v * 0.82));
        if (Math.abs(lx) > half) continue;
        const edge = Math.abs(lx) / half;
        const rib = Math.floor(ly - bodyTop) % 2 === 1 ? 0.75 : 0;
        const core = Math.max(0, 1 - Math.hypot(lx / 3.4, (ly - mid) / 4.6));
        let s = 1.4 + edge * 2.2 + rib - core * (dark ? 2.2 : 1.1) + Math.abs(v) * 0.6;
        // A painted dark band near each end, as on festival lanterns.
        if (Math.abs(v) > 0.66 && Math.abs(v) < 0.8) s += 1.2;
        out[i] = ramp(L.body, s, x, y);
        continue;
      }
      if (ly < bodyTop + bodyH + 2) {
        if (Math.abs(lx) < 3) out[i] = pal.cap[1];
        continue;
      }
      // Tassel: a cord with a little flared fringe.
      const tl = ly - (bodyTop + bodyH + 2);
      if (tl < 3 && Math.abs(lx) < 0.6) out[i] = L.body[4];
      else if (tl >= 3 && tl < 6 && Math.abs(lx) < 0.6 + (tl - 3) * 0.45) out[i] = L.body[tl > 5 ? 5 : 3];
    }
  }
}

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  land: number;
  state: 0 | 1 | 2; // falling, floating on the stream, resting on grass
  life: number;
};

const FRONT_PUFFS = TREE.puffs.filter((p) => !p.back);

function spawn(p: Petal, rnd: () => number, wind: number) {
  const c = FRONT_PUFFS[Math.floor(rnd() * FRONT_PUFFS.length)];
  const a = rnd() * Math.PI * 2;
  const r = Math.sqrt(rnd()) * c.r;
  p.x = c.x + Math.cos(a) * r;
  p.y = c.y + Math.sin(a) * r * 0.8;
  p.vx = 0.04 + (0.12 + rnd() * 0.22) * Math.max(0.2, wind);
  p.vy = 0.2 + rnd() * 0.22;
  p.phase = rnd() * 10;
  p.land = Math.min(H - 2, Math.max(p.y + 8, 84 + rnd() * 52));
  p.state = 0;
  p.life = 0;
}

function step(p: Petal, rnd: () => number, time: number, wind: number) {
  p.phase += 0.18;
  if (p.state === 0) {
    p.x += p.vx + Math.sin(p.phase) * 0.35 + Math.sin(time * 0.4) * 0.1 * wind;
    p.y += p.vy + Math.cos(p.phase * 0.7) * 0.08;
    if (p.y >= p.land) {
      p.state = inStream(Math.round(p.x), Math.round(p.y)) ? 1 : 2;
      p.life = 0;
    }
  } else if (p.state === 1) {
    // Follow the stream toward the viewer, faster where it is wider.
    const t = tOf(p.y);
    const vy = 0.12 + t * 0.45;
    const dx = streamX(tOf(p.y + 1)) - streamX(t);
    p.y += vy;
    p.x += dx * vy + Math.sin(p.phase * 0.5) * 0.08;
    if (p.y > H + 1) spawn(p, rnd, wind);
  } else {
    p.life += 1;
    if (p.life > 90) spawn(p, rnd, wind);
  }
  if (p.x > W + 2 || p.x < -2) spawn(p, rnd, wind);
}

export type SakuraStreamProps = {
  className?: string;
  /** Hang a paper chōchin from a limb. Default true. */
  showLantern?: boolean;
  /** Paper colour of the lantern. Default "red". */
  lanternColor?: SakuraLanternColor;
  /** Falling-petal density, 0 (none) to 2. Default 1. */
  petalFall?: number;
  /** How hard the breeze sways the branches and lantern, 0 (still) to 2. Default 1. */
  windStrength?: number;
};

export function SakuraStream({
  className,
  showLantern = true,
  lanternColor = "red",
  petalFall = 1,
  windStrength = 1,
}: SakuraStreamProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = W;
    canvas.height = H;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wind = reduce ? 0 : Math.max(0, Math.min(2, windStrength));
    const color: SakuraLanternColor = lanternColor === "white" ? "white" : "red";
    const img = ctx.createImageData(W, H);
    const out = new Uint32Array(img.data.buffer);
    const base = new Uint32Array(W * H);
    const water = new Uint8Array(W * H);
    let pal = LIGHT;
    let dark = false;

    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const count = Math.round(46 * Math.max(0, Math.min(2, petalFall)));
    const petalWind = Math.max(0.35, wind || 1);
    const petals: Petal[] = Array.from({ length: count }, () => {
      const p = {} as Petal;
      spawn(p, rnd, petalWind);
      return p;
    });

    // Where the canopy overhangs the stream, its pink shows in the water.
    const reflX = Math.min(CANOPY.x1 - 10, 120);

    const repaint = () => {
      dark = document.documentElement.classList.contains("dark");
      pal = dark ? DARK : LIGHT;
      paintBase(base, pal, water);
    };

    let time = 0;
    const render = () => {
      out.set(base);
      // Water: depth ramp plus drifting shimmer streaks and a pink canopy reflection.
      for (let y = HORIZON + 1; y < H; y++) {
        const t = tOf(y);
        const cx = streamX(t);
        const w = streamW(t);
        const row = y * W;
        for (let x = Math.max(0, Math.floor(cx - w)); x <= Math.min(W - 1, Math.ceil(cx + w)); x++) {
          const i = row + x;
          if (!water[i]) continue;
          const across = Math.abs(x - cx) / w;
          let c = ramp(pal.water, 0.6 + (1 - t) * 1.8 + across * 1.6, x, y);
          const reflect = Math.hypot((x - reflX) / 14, (y - 106) / 13);
          if (reflect < 1 && bayer(x, y) > 0.55 + reflect * 0.45) c = pal.petal[2];
          const s =
            Math.sin((x / (1 + t * 2.4)) * 1.05 + y * 2.1 - time * 1.6) *
            Math.sin(y * 0.9 + time * 0.7 + x * 0.05);
          if (s > 0.86) c = pal.shine[0];
          else if (s > 0.7 && bayer(x, y) > 0.5) c = pal.shine[1];
          out[i] = c;
        }
      }
      paintTree(out, pal, time, wind);
      if (showLantern) paintLantern(out, pal, color, dark, time, wind);
      for (const p of petals) {
        const x = Math.round(p.x);
        const y = Math.round(p.y);
        if (x < 0 || x >= W - 1 || y < 0 || y >= H - 1) continue;
        const flip = Math.sin(p.phase);
        if (p.state === 0) {
          // Tumbling two-pixel petal.
          out[y * W + x] = pal.petal[0];
          out[(flip > 0 ? y : y + 1) * W + (flip > 0 ? x + 1 : x)] = pal.petal[flip > 0.5 ? 2 : 1];
        } else if (p.state === 1) {
          out[y * W + x] = pal.petal[0];
          out[y * W + x + 1] = pal.petal[1];
          if (Math.sin(p.phase * 0.3) > 0.8) out[(y + 1) * W + x] = pal.shine[1];
        } else if (p.life < 70 || bayer(x, y) > (p.life - 70) / 20) {
          out[y * W + x] = pal.petal[1];
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    repaint();
    if (reduce) {
      // Settle petals into a natural-looking spread for the single static frame.
      for (let k = 0; k < 400; k++) for (const p of petals) step(p, rnd, k * 0.05, petalWind);
      render();
    }

    let raf = 0;
    let last = 0;
    let visible = true;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 50) return;
      last = now;
      time += 0.05;
      for (const p of petals) step(p, rnd, time, petalWind);
      render();
    };
    if (!reduce) {
      // Warm up so the first frame already has petals in the air and on the water.
      for (let k = 0; k < 300; k++) for (const p of petals) step(p, rnd, k * 0.05, petalWind);
      render();
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      repaint();
      render();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
    };
  }, [showLantern, lanternColor, petalFall, windStrength]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={
        showLantern
          ? "Pixel art of a cherry blossom tree beside a stream, a paper lantern hanging from a branch and petals drifting onto the water"
          : "Pixel art of a cherry blossom tree beside a stream, petals drifting onto the water"
      }
      className={cn("block aspect-[200/138] w-full [image-rendering:pixelated]", className)}
    />
  );
}
