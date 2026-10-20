"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Pixel-art cherry blossom tree beside a Japanese stream (hero "Figure 1").
 *
 * Drawn into a tiny 200×138 buffer and scaled up with crisp pixels, in the
 * same ordered-dither (Bayer 4×4) style as DitherField. The scene is
 * pseudo-3D: a perspective stream that widens toward the viewer, stone bank
 * faces, a shaded trunk and sphere-lit foliage clusters. Petals detach from
 * the canopy, tumble in the wind and either settle on the grass or land on
 * the water and drift downstream. ~20fps via rAF, pauses offscreen, renders
 * a single settled frame for reduced motion, and repaints on theme change.
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
  "sky" | "mount" | "grass" | "bank" | "water" | "shine" | "bark" | "bloom" | "petal" | "bridge",
  number[]
>;

const LIGHT: Palette = {
  sky: ["#fdf7f3", "#fbeeec", "#f7e1e4"].map(px),
  mount: ["#ecd3dc", "#dfbccb", "#cfa6ba"].map(px),
  grass: ["#e6e9d8", "#d2ddbf", "#bccda6", "#a2b78d"].map(px),
  bank: ["#d9c8c4", "#bba6a6", "#9a8489", "#77636c"].map(px),
  water: ["#eaf0f6", "#d3e0ee", "#b9cbe4", "#9fb3d7", "#8398c4"].map(px),
  shine: ["#ffffff", "#fbe9f1"].map(px),
  bark: ["#8e6b6f", "#6e4e57", "#523843", "#3b2733"].map(px),
  bloom: ["#ffffff", "#fde4ec", "#f8c3d4", "#ef9bb6", "#dc6f93", "#b84d74"].map(px),
  petal: ["#ffffff", "#f9c6d6", "#ee8fae"].map(px),
  bridge: ["#e07a8f", "#c4566f", "#8f3a52"].map(px),
};

const DARK: Palette = {
  sky: ["#140c19", "#1c1122", "#2a1a2e"].map(px),
  mount: ["#2e1d35", "#3a2541", "#47304d"].map(px),
  grass: ["#221f28", "#272a2e", "#2d3532", "#354238"].map(px),
  bank: ["#4a3a48", "#3a2c3a", "#2c212d", "#1f1721"].map(px),
  water: ["#2c2140", "#261c39", "#211832", "#1b142a", "#160f22"].map(px),
  shine: ["#f6cfe0", "#b98fb4"].map(px),
  bark: ["#5b4252", "#46313f", "#33232f", "#231821"].map(px),
  bloom: ["#ffe3ee", "#f9bcd2", "#ef94b4", "#d86d95", "#b34f78", "#7f3558"].map(px),
  petal: ["#ffe3ee", "#f4a8c4", "#d8769c"].map(px),
  bridge: ["#d86a8a", "#a94767", "#6e2d48"].map(px),
};

/** Pick from a ramp with ordered dithering: v in [0, ramp.length - 1]. */
function ramp(colors: number[], v: number, x: number, y: number) {
  const c = Math.max(0, Math.min(colors.length - 1, v));
  const i = Math.floor(c);
  const f = c - i;
  return colors[Math.min(colors.length - 1, f > bayer(x, y) ? i + 1 : i)];
}

/* ── Stream geometry: t = 0 at the horizon, 1 at the bottom edge ── */
const tOf = (y: number) => Math.max(0, (y - HORIZON) / (H - HORIZON));
const streamX = (t: number) => 148 - 78 * t + 12 * Math.sin(t * 3.4);
const streamW = (t: number) => 2.5 + 40 * Math.pow(t, 1.6);
const face = (t: number) => 1 + Math.round(5 * t);

type Cluster = { x: number; y: number; r: number };

const TREE: Cluster[] = [
  { x: 58, y: 44, r: 11 },
  { x: 104, y: 46, r: 10 },
  { x: 70, y: 30, r: 13 },
  { x: 96, y: 30, r: 12 },
  { x: 82, y: 20, r: 12 },
  { x: 64, y: 50, r: 10 },
  { x: 84, y: 42, r: 15 },
  { x: 100, y: 54, r: 8 },
  { x: 74, y: 56, r: 9 },
];
const FAR_TREE: Cluster[] = [
  { x: 170, y: 39, r: 6 },
  { x: 178, y: 37, r: 5 },
  { x: 174, y: 33, r: 5 },
];
const BRANCHES: [number, number, number, number][] = [
  [82, 60, 60, 46],
  [82, 58, 102, 48],
  [82, 56, 72, 32],
  [83, 54, 95, 32],
  [83, 52, 82, 24],
];

function inStream(x: number, y: number) {
  if (y <= HORIZON) return false;
  const t = tOf(y);
  return Math.abs(x - streamX(t)) < streamW(t);
}

/** Static layers: sky, hills, banks, grass, shadow, trunk, foliage. */
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
      // Fallen-petal carpet around the tree and the far tree.
      const carpet = Math.hypot((x - 82) / 34, (y - 92) / 9);
      const carpet2 = Math.hypot((x - 175) / 10, (y - 46) / 2.5);
      if ((carpet < 1 && hash(x, y, 11) > 0.55 + carpet * 0.4) || (carpet2 < 1 && hash(x, y, 12) > 0.7)) {
        buf[i] = ramp(pal.petal, 0.5 + hash(x, y, 13) * 1.5, x, y);
      }
      // Soft canopy shadow.
      const sh = Math.hypot((x - 86) / 30, (y - 93) / 6);
      if (sh < 1 && bayer(x, y) > sh * 0.9) buf[i] = ramp(pal.grass, 3, x, y);
    }
  }

  // Trunk: tapered S-curve, lit from the upper left.
  for (let s = 0; s <= 1; s += 0.01) {
    const yy = 92 - s * 40;
    const xx = 78 + 4 * s + 2.5 * Math.sin(s * 3);
    const half = 4 - s * 2.2 + (s < 0.08 ? (0.08 - s) * 30 : 0);
    for (let k = -half; k <= half; k += 0.5) {
      const x = Math.round(xx + k);
      const y = Math.round(yy);
      if (x < 0 || x >= W || y < 0 || y >= H) continue;
      const shade = ((k + half) / (2 * half)) * 2.6 + (hash(x, y, 5) > 0.8 ? 0.6 : 0);
      buf[y * W + x] = ramp(pal.bark, shade, x, y);
    }
  }
  for (const [x0, y0, x1, y1] of BRANCHES) {
    const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
    for (let j = 0; j <= n; j++) {
      const u = j / n;
      const x = Math.round(x0 + (x1 - x0) * u);
      const y = Math.round(y0 + (y1 - y0) * u);
      for (const [ox, shade] of [
        [0, 1.4],
        [1, 2.6],
      ] as const) {
        const xx = x + ox;
        if (xx >= 0 && xx < W && y >= 0 && y < H && (u < 0.7 || ox === 0)) buf[y * W + xx] = ramp(pal.bark, shade, xx, y);
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

  // Foliage: sphere-lit clusters, back to front, with fluffy dithered edges.
  const lx = -0.5;
  const ly = -0.65;
  const lz = 0.58;
  const draw = (clusters: Cluster[], seed: number, dim: number) => {
    for (const c of [...clusters].sort((a, b) => a.y + a.r - (b.y + b.r))) {
      for (let y = Math.floor(c.y - c.r); y <= c.y + c.r; y++) {
        for (let x = Math.floor(c.x - c.r); x <= c.x + c.r; x++) {
          if (x < 0 || x >= W || y < 0 || y >= H) continue;
          const nx = (x - c.x) / c.r;
          const ny = (y - c.y) / c.r;
          const d2 = nx * nx + ny * ny;
          if (d2 > 1) continue;
          if (d2 > 0.72 && hash(x, y, seed) < (d2 - 0.72) * 3) continue;
          const nz = Math.sqrt(1 - d2);
          const lit = Math.max(0, nx * lx + ny * ly + nz * lz);
          const tex = (hash(x >> 1, y >> 1, seed + 2) - 0.5) * 1.1;
          buf[y * W + x] = ramp(pal.bloom, (1 - lit) * 4.4 + tex + dim, x, y);
        }
      }
    }
  };
  draw(FAR_TREE, 21, 0.8);
  // Far tree trunk.
  for (let y = 40; y < 47; y++) {
    buf[y * W + 174] = pal.bark[2];
    buf[y * W + 175] = pal.bark[3];
  }
  draw(TREE, 31, 0);
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

function spawn(p: Petal, rnd: () => number) {
  const c = TREE[Math.floor(rnd() * TREE.length)];
  const a = rnd() * Math.PI * 2;
  const r = Math.sqrt(rnd()) * c.r * 0.9;
  p.x = c.x + Math.cos(a) * r;
  p.y = c.y + Math.sin(a) * r * 0.8;
  p.vx = 0.18 + rnd() * 0.25;
  p.vy = 0.22 + rnd() * 0.22;
  p.phase = rnd() * 10;
  p.land = Math.min(H - 2, 70 + rnd() * 66);
  p.state = 0;
  p.life = 0;
}

function step(p: Petal, rnd: () => number, time: number) {
  p.phase += 0.18;
  if (p.state === 0) {
    p.x += p.vx + Math.sin(p.phase) * 0.35 + Math.sin(time * 0.4) * 0.1;
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
    if (p.y > H + 1) spawn(p, rnd);
  } else {
    p.life += 1;
    if (p.life > 90) spawn(p, rnd);
  }
  if (p.x > W + 2) spawn(p, rnd);
}

export function SakuraStream({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = W;
    canvas.height = H;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = ctx.createImageData(W, H);
    const out = new Uint32Array(img.data.buffer);
    const base = new Uint32Array(W * H);
    const water = new Uint8Array(W * H);
    let pal = LIGHT;

    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const petals: Petal[] = Array.from({ length: 46 }, () => {
      const p = {} as Petal;
      spawn(p, rnd);
      return p;
    });

    const repaint = () => {
      pal = document.documentElement.classList.contains("dark") ? DARK : LIGHT;
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
          const reflect = Math.hypot((x - 102) / 13, (y - 104) / 14);
          if (reflect < 1 && bayer(x, y) > 0.35 + reflect * 0.6) c = pal.petal[2];
          const s =
            Math.sin((x / (1 + t * 2.4)) * 1.05 + y * 2.1 - time * 1.6) *
            Math.sin(y * 0.9 + time * 0.7 + x * 0.05);
          if (s > 0.86) c = pal.shine[0];
          else if (s > 0.7 && bayer(x, y) > 0.5) c = pal.shine[1];
          out[i] = c;
        }
      }
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
      for (let k = 0; k < 400; k++) for (const p of petals) step(p, rnd, k * 0.05);
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
      for (const p of petals) step(p, rnd, time);
      render();
    };
    if (!reduce) {
      // Warm up so the first frame already has petals in the air and on the water.
      for (let k = 0; k < 300; k++) for (const p of petals) step(p, rnd, k * 0.05);
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
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Pixel art of a cherry blossom tree beside a stream, petals drifting onto the water"
      className={cn("block aspect-[200/138] w-full [image-rendering:pixelated]", className)}
    />
  );
}
