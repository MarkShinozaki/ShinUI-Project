/**
 * Procedural pixel-art homage to Hokusai's "The Great Wave off Kanagawa" (1831, public
 * domain), drawn from scratch in the ShinUI sakura palette. Pure rendering code with no DOM
 * access, so it can run in a worker or a test.
 *
 * The scene is laid out in "units" of the canvas height (1 unit = rows pixels), anchored
 * left, so the composition keeps its proportions at any height and wider strips simply see
 * more open sea to the right:
 *
 *   sky (paper → blush, dithered) · soft clouds · Mt. Fuji in the trough · back swells
 *   · far boat · the great curl with claw-like foam fingers · foreground swells · two boats
 *   · falling spray.
 *
 * Motion is deliberately slow: the swells rise and fall on 7–12 s cycles, the crest fingers
 * drift a pixel or two, foam flickers sparsely, spray falls under the curl, and the boats
 * heave and pitch with the local slope of the water they sit on.
 */

export type RGB = [number, number, number];

export type WavePalette = {
  paper: RGB;
  blush: RGB;
  glow: RGB;
  cloud: RGB;
  /** foam · pale band · light band · mid band · deep band · deepest body · contour */
  foam: RGB;
  pale: RGB;
  light: RGB;
  mid: RGB;
  deep: RGB;
  body: RGB;
  line: RGB;
  hull: RGB;
  hullShade: RGB;
  crew: RGB;
  head: RGB;
};

// Pixel classes in the class buffer.
const SKY = 0;
const CLOUD = 1;
const FOAM = 3;
const PALE = 4;
const LIGHT = 5;
const MID = 6;
const DEEP = 7;
const BODY = 8;
const LINE = 10;
const HULL = 11;
const HULL_SHADE = 12;
const CREW = 13;
const HEAD = 14;

// Which layer owns each pixel (so boats can be hidden behind nearer water).
const L_SKY = 0;
const L_BACK = 2;
const L_BIG = 3;
const L_FRONT = 4;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bayer = (x: number, y: number) => BAYER[(y & 3) * 4 + (x & 3)];

function hash(x: number, y: number, s = 0): number {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (v: number) => {
  const c = clamp01(v);
  return c * c * (3 - 2 * c);
};
const frac = (v: number) => v - Math.floor(v);

/* ── Geometry (units of canvas height) ─────────────────────────────────────── */

/** Horizon line. */
const HZ = 0.735;

/** Centre of the great curl, and its crest (where the back turns into the lip). */
const CX = 0.685;
const CY = 0.355;
const CREST_X = 0.565;
const CREST_Y = 0.095;
const R0 = Math.hypot(CREST_X - CX, CREST_Y - CY);
const TH0 = Math.atan2(CREST_X - CX, -(CREST_Y - CY));
const TH1 = 2.2;

/** Back of the great wave: rises from the left edge to the crest. */
function backTop(X: number): number {
  const u = clamp01(X / CREST_X);
  return 0.46 - (0.46 - CREST_Y) * Math.pow(Math.sin((u * Math.PI) / 2), 2.1);
}

/** The concave front face under the curl (x position for a given y). */
function faceX(Y: number): number {
  return 0.715 - 0.13 * Math.exp(-(((Y - 0.42) / 0.17) ** 2));
}

/** Outer radius and thickness of the lip along the spiral, p = 0 at the crest → 1 at the tip. */
const lipOuter = (p: number) => R0 * (1 - 0.33 * Math.pow(p, 1.2));
const lipThick = (p: number) => 0.15 * Math.pow(1 - p, 1.1) + 0.035;

/** A Hokusai swell bump: pointed crest, long flanks; separate left/right widths. */
function bump(X: number, at: number, height: number, wl: number, wr: number): number {
  const z = (X - at) / (X < at ? wl : wr);
  return height * Math.exp(-Math.pow(Math.abs(z), 1.35));
}

/** Extra swells for wide strips, seeded so they never look tiled. */
function extension(X: number, start: number, gap: number, h: number, seed: number): number {
  if (X < start - gap) return 0;
  const k = Math.floor((X - start) / gap);
  let y = 0;
  for (let j = k - 1; j <= k + 1; j++) {
    if (j < 0) continue;
    const r = hash(j, seed);
    const at = start + j * gap + (r - 0.5) * gap * 0.35;
    y += bump(X, at, h * (0.65 + 0.6 * r), gap * 0.42, gap * 0.6);
  }
  return y;
}

/** Foreground swells (nearest water): the small "second Fuji" wave and its neighbours. */
function frontSurface(X: number, t: number): number {
  return (
    0.885 -
    bump(X, 0.0, 0.36, 0.3, 0.3) -
    bump(X, 0.63, 0.31, 0.17, 0.3) -
    extension(X, 1.62, 0.62, 0.1, 11) +
    0.007 * Math.sin(t * 0.78 - X * 5.2) +
    0.0035 * Math.sin(t * 0.52 + X * 9.1)
  );
}

/** Back swells: the trough that frames Fuji, then the tall swell on the right. */
function backSurface(X: number, t: number): number {
  return (
    0.762 -
    bump(X, 0.86, 0.03, 0.05, 0.07) -
    bump(X, 1.53, 0.29, 0.27, 0.2) -
    extension(X, 2.1, 0.55, 0.14, 23) +
    0.0055 * Math.sin(t * 0.66 - X * 6.3) +
    0.003 * Math.sin(t * 0.41 + X * 11)
  );
}

/** How high (0..1) a swell stands at X — used to thicken foam on crests. */
const crestness = (base: number, y: number, span: number) => clamp01((base - y) / span);

/* ── Banding ───────────────────────────────────────────────────────────────── */

/**
 * Woodblock banding under a swell surface: contour line, a cream foam cap with claws hanging
 * from it, then pale and light bands and light streaks running parallel to the surface over
 * the deep body. d is pixels below the surface, s is pixels per 1/192 of the height.
 */
function swellBand(ds: number, cap: number, hang: number, c: number, wob: number, xs: number, seed: number): number {
  if (ds < 1) return LINE;
  if (ds < cap) return FOAM;
  if (ds < hang) return ds > hang - 1 ? LINE : FOAM;
  const e = ds - cap;
  if (e < 1.5) return PALE;
  if (e < 4.5 + 2 * c) return LIGHT;
  if (e < 9 + 3 * c) return MID;
  const v = (e + wob) / 5.5;
  const deep = e > 24;
  if (frac(v) < 0.22) {
    const fv = Math.floor(v);
    if (hash(Math.floor(xs / 14 + fv * 0.37), fv, seed * 10) > 0.25) return deep ? MID : LIGHT;
  }
  return deep ? BODY : DEEP;
}

/** Per-column foam cap, hanging-finger depth and streak wobble for a swell (in s units). */
function swellColumn(xs: number, c: number, t: number, seed: number, out: Float32Array, k: number) {
  const sway = Math.sin(t * 0.3 + xs * 0.015 + seed) * 0.6;
  const cap = 1.6 + 8 * c * c;
  const fing = Math.max(0, Math.sin(xs * (0.3 + 0.1 * c) + seed + sway));
  out[k] = cap;
  out[k + 1] = cap + Math.pow(fing, 6) * (1.5 + 10 * c);
  out[k + 2] = c;
  out[k + 3] = 1.6 * Math.sin(xs * 0.05 + seed * 3);
}

/** Small claws standing on a high crest (h px above the surface), or -1. */
function crestClaw(h: number, x: number, c: number, s: number, t: number, seed: number): number {
  if (c < 0.45) return -1;
  const lim = (c - 0.45) * 14;
  const e = h / s;
  if (e >= lim) return -1;
  const f = frac(x / s / 5 + e * 0.18 + 0.15 * Math.sin(t * 0.4 + seed));
  const w = 0.55 * (1 - e / lim);
  if (f < w) return f < 0.12 ? LINE : FOAM;
  return -1;
}

/* ── The great curl ────────────────────────────────────────────────────────── */

/**
 * Class of the great wave at (X, Y), or -1 outside it. fingers drifts the crest claws.
 */
function greatWave(
  X: number,
  Y: number,
  x: number,
  y: number,
  s: number,
  R: number,
  t: number,
  top: number,
  fx: number,
): number {
  if (X > 1.05 || Y > 0.95) return -1;
  const dx = X - CX;
  const dy = Y - CY;
  const r = Math.hypot(dx, dy);
  const th = Math.atan2(dx, -dy);
  const drift = 0.035 * Math.sin(t * 0.45) + 0.02 * Math.sin(t * 0.23 + 1.3);

  // Lip: the spiral band from the crest over to the tip.
  if (th >= TH0 && th <= TH1) {
    const p = (th - TH0) / (TH1 - TH0);
    const ro = lipOuter(p) + 0.0025 * Math.sin(t * 0.5 + p * 4);
    const tk = lipThick(p) * (1 - smooth((p - 0.8) / 0.2) * 0.85);
    const ri = ro - tk;
    if (r <= ro && r >= ri) {
      const fromOut = (ro - r) * R;
      if (fromOut < 1) return LINE;
      if ((r - ri) * R < 1) return LINE;
      const q = (ro - r) / tk;
      // Cream foam rim with fingers reaching back into the body; the tip is all foam.
      const fingers = Math.pow(Math.max(0, Math.sin(th * 20 + drift * 6 + q * 3)), 3);
      const foamQ = 0.2 + 0.8 * Math.pow(p, 1.6) + fingers * (0.2 + 0.3 * p);
      if (q < foamQ) {
        if (q > foamQ - 0.07 && fingers > 0.2) return LINE;
        // faint combed lines through the foam, like the print's blue hatching
        return q > 0.12 && frac(q * 5 + th * 4) < 0.14 ? PALE : FOAM;
      }
      const v = q * 6 + 0.5 * Math.sin(th * 5 + 1);
      if (frac(v) < 0.34) return LIGHT;
      return q > 0.7 ? BODY : DEEP;
    }
  }

  // Main mass: everything below the back and left of the face under the curl.
  if (X >= fx) return -1;
  let dB: number;
  const u = clamp01(X / CREST_X);
  if (X <= CREST_X) {
    if (Y < top) {
      // A row of small claws along the back's ridge, pointing up the slope.
      const e = ((top - Y) * R) / s;
      const lim = 1.5 + 6 * u * u;
      if (u > 0.3 && e < lim) {
        const f = frac(X * 55 - e * 0.14 + drift * 3);
        const w = 0.42 * (1 - e / lim);
        if (f < w) return f < 0.08 ? LINE : FOAM;
      }
      return -1;
    }
    dB = Y - top;
  } else {
    // Wedge between the crest and the lip's root.
    if (r > R0 || th >= TH0) return -1;
    dB = R0 - r;
  }
  const dF = fx - X;
  if (dB * R < 1 || dF * R < 1) return LINE;
  // g runs 0 at the back → 1 at the face; its level sets are flow lines streaming up into
  // the crest, so the stripes converge toward the top like the print's.
  const g = dB / (dB + dF);
  const xs = x / s;
  const ys = y / s;
  const fing = Math.pow(Math.max(0, Math.sin(ys * 0.35 - xs * 0.12 + drift * 4)), 4);
  const foam = 0.12 + 0.22 * u * u + fing * 0.12;
  if (g < foam) return g > foam - 0.025 && fing > 0.3 ? LINE : FOAM;
  if (g < foam + 0.04) return PALE;
  const v = g * 11 + 0.35 * Math.sin(ys * 0.05 + xs * 0.03);
  const stripe = frac(v);
  if (stripe < 0.3) return g > 0.75 ? MID : LIGHT;
  if (g < foam + 0.12) return MID;
  return g > 0.62 ? BODY : DEEP;
}

/* ── Talons: the claw-like fingers on the crest ──────────────────────────── */

const TALONS = Array.from({ length: 15 }, (_, i) => {
  const p = 0.06 + (0.94 * (i + 0.3 * hash(i, 61))) / 15;
  return { p, len: 0.7 + 0.5 * hash(i, 62), curl: 0.8 + 0.5 * hash(i, 63), seed: i };
});

/** Stamp a tapered, curling stroke of foam into the class buffer (sky pixels only). */
function stroke(
  cls: Uint8Array,
  cols: number,
  rows: number,
  bx: number,
  by: number,
  nx: number,
  ny: number,
  tx: number,
  ty: number,
  len: number,
  curl: number,
  width: number,
) {
  const steps = Math.max(6, Math.ceil(len * 1.5));
  for (let k = 0; k <= steps; k++) {
    const u = k / steps;
    const out = len * u * (1 - 0.35 * u * curl);
    const side = len * 0.85 * curl * u * u;
    const px = bx + nx * out + tx * side;
    const py = by + ny * out + ty * side;
    const rad = width * Math.pow(1 - u, 0.8) + 0.45;
    const fill = u < 0.3 ? PALE : FOAM;
    const x0 = Math.max(0, Math.floor(px - rad));
    const x1 = Math.min(cols - 1, Math.ceil(px + rad));
    const y0 = Math.max(0, Math.floor(py - rad));
    const y1 = Math.min(rows - 1, Math.ceil(py + rad));
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x + 0.5 - px;
        const dy = y + 0.5 - py;
        if (dx * dx + dy * dy > rad * rad) continue;
        const i = y * cols + x;
        if (cls[i] <= CLOUD) cls[i] = fill;
      }
    }
  }
}

function drawTalons(cls: Uint8Array, cols: number, rows: number, t: number, s: number) {
  const R = rows;
  for (const tl of TALONS) {
    const sway = 0.012 * Math.sin(t * 0.45 + tl.seed * 0.9) + 0.006 * Math.sin(t * 0.21 + tl.seed);
    const p = tl.p;
    const th = TH0 + (TH1 - TH0) * p;
    const ro = lipOuter(p) - 0.004;
    const nx = Math.sin(th);
    const ny = -Math.cos(th);
    // Clockwise tangent: the direction the wave is curling.
    const tx = Math.cos(th);
    const ty = Math.sin(th);
    const bx = (CX + nx * ro) * R;
    const by = (CY + ny * ro) * R;
    const len = (0.03 + 0.07 * Math.pow(p, 0.8)) * tl.len * R * (1 + sway * 4);
    const width = (1.6 + 2.2 * p) * s;
    const curl = tl.curl + sway * 8;
    stroke(cls, cols, rows, bx, by, nx, ny, tx, ty, len, curl, width);
    // Two smaller hooks branching off the talon toward its end.
    for (let j = 0; j < 2; j++) {
      const at = 0.45 + j * 0.2;
      const out = len * at * (1 - 0.35 * at * curl);
      const side = len * 0.85 * curl * at * at;
      const sx = bx + nx * out + tx * side;
      const sy = by + ny * out + ty * side;
      const a = th + 0.9 + j * 0.5;
      stroke(cls, cols, rows, sx, sy, Math.sin(a), -Math.cos(a), Math.cos(a), Math.sin(a), len * (0.4 - j * 0.1), 1.2, width * 0.55);
    }
  }
}

/* ── Mt. Fuji ──────────────────────────────────────────────────────────────── */

const FUJI_X = 1.03;
const FUJI_PEAK = 0.6;
const FUJI_HALF = 0.135;

function fuji(X: number, Y: number, x: number, s: number): number {
  const a = Math.abs(X - FUJI_X);
  if (a > FUJI_HALF || Y > HZ + 0.01) return -1;
  const k = Math.max(0, a - 0.008) / (FUJI_HALF - 0.008);
  const top = FUJI_PEAK + (HZ - FUJI_PEAK) * (1 - (1 - k) * (1 - k));
  if (Y < top) return -1;
  if (Y - top < 0.006) return LINE;
  const snow = FUJI_PEAK + 0.03 + 0.012 * hash(Math.floor(x / (2 * s)), 5) + 0.01 * Math.max(0, Math.sin(X * 140));
  if (Y < snow) return FOAM;
  return Y > HZ - 0.02 ? MID : LIGHT;
}

/* ── Clouds ────────────────────────────────────────────────────────────────── */

type Puff = [number, number, number];
const CLOUDS: Puff[][] = [
  [
    [1.07, 0.23, 0.045],
    [1.15, 0.19, 0.07],
    [1.27, 0.17, 0.085],
    [1.4, 0.2, 0.065],
    [1.5, 0.235, 0.04],
  ],
  [
    [0.12, 0.17, 0.035],
    [0.2, 0.14, 0.05],
    [0.3, 0.16, 0.035],
  ],
  [
    [2.18, 0.29, 0.04],
    [2.27, 0.25, 0.06],
    [2.37, 0.27, 0.045],
  ],
  [
    [2.95, 0.15, 0.04],
    [3.05, 0.12, 0.065],
    [3.18, 0.15, 0.05],
  ],
];

function cloudAt(X: number, Y: number, x: number, y: number): boolean {
  const shift = 0;
  for (const c of CLOUDS) {
    const base = c[0][1] + c[0][2] * 0.6;
    if (Y > base + 0.01) continue;
    for (const [px, py, pr] of c) {
      const d = Math.hypot((X - px - shift) * 0.8, Y - py) / pr;
      if (d < 0.8) return Y < base;
      if (d < 1.05 && Y < base && bayer(x, y) > (d - 0.8) / 0.25) return true;
    }
  }
  return false;
}

/* ── Boats ─────────────────────────────────────────────────────────────────── */

type Boat = {
  x: number; // centre, in units
  len: number; // hull length, in units
  facing: 1 | -1; // which way the bow points
  layer: "front" | "back";
  phase: number;
  crew: number;
};

const BOATS: Boat[] = [
  { x: 0.2, len: 0.37, facing: -1, layer: "front", phase: 0.4, crew: 7 },
  { x: 0.96, len: 0.46, facing: -1, layer: "front", phase: 2.2, crew: 9 },
  { x: 1.3, len: 0.4, facing: 1, layer: "back", phase: 4.1, crew: 8 },
];

/* ── Spray ─────────────────────────────────────────────────────────────────── */

const SPRAY = Array.from({ length: 200 }, (_, i) => ({
  p: 0.3 + 0.68 * hash(i, 41),
  inner: hash(i, 47) < 0.6,
  period: 4.5 + 3.5 * hash(i, 42),
  offset: hash(i, 43),
  vx: -0.004 + 0.018 * hash(i, 44),
  vy: -0.006 + 0.01 * hash(i, 45),
  big: hash(i, 46) > 0.82,
}));

/* ── Renderer ──────────────────────────────────────────────────────────────── */

export type WaveBuffers = {
  cols: number;
  rows: number;
  cls: Uint8Array;
  layer: Uint8Array;
  front: Float32Array;
  back: Float32Array;
  /** 4 floats per column for each swell: cap, hang, crestness, wobble. */
  frontCol: Float32Array;
  backCol: Float32Array;
  backTop: Float32Array;
  faceX: Float32Array;
  /** Static sky classes (sky, cloud or Fuji) and their colours for the current palette. */
  still: Uint8Array;
  skyRGB: Uint32Array;
  pal: WavePalette | null;
  lut: Uint32Array;
};

export function makeBuffers(cols: number, rows: number): WaveBuffers {
  const R = rows;
  const s = rows / 192;
  const still = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    const Y = (y + 0.5) / R;
    for (let x = 0; x < cols; x++) {
      const X = (x + 0.5) / R;
      let c = fuji(X, Y, x, s);
      if (c < 0) c = cloudAt(X, Y, x, y) ? CLOUD : SKY;
      still[y * cols + x] = c;
    }
  }
  const backTopArr = new Float32Array(cols);
  for (let x = 0; x < cols; x++) backTopArr[x] = backTop((x + 0.5) / R);
  const faceArr = new Float32Array(rows);
  for (let y = 0; y < rows; y++) faceArr[y] = faceX((y + 0.5) / R);
  return {
    cols,
    rows,
    cls: new Uint8Array(cols * rows),
    layer: new Uint8Array(cols * rows),
    front: new Float32Array(cols),
    back: new Float32Array(cols),
    frontCol: new Float32Array(cols * 4),
    backCol: new Float32Array(cols * 4),
    backTop: backTopArr,
    faceX: faceArr,
    still,
    skyRGB: new Uint32Array(cols * rows),
    pal: null,
    lut: new Uint32Array(16),
  };
}

/** RGB → packed ABGR for a little-endian Uint32Array view over ImageData. */
const pack = (c: RGB) => (255 << 24) | (c[2] << 16) | (c[1] << 8) | c[0];

function applyPalette(buf: WaveBuffers, pal: WavePalette) {
  const { cols, rows, still, skyRGB, lut } = buf;
  const hzPx = HZ * rows;
  for (let y = 0; y < rows; y++) {
    const ty = smooth((y + 0.5) / (hzPx * 0.8));
    const near = clamp01(((y + 0.5) / rows - (HZ - 0.12)) / 0.12);
    for (let x = 0; x < cols; x++) {
      const bq = bayer(x, y);
      const q = Math.min(1, Math.floor(ty * 4 + bq) / 4);
      const g = Math.min(1, Math.floor(near * near * 3 + bq) / 3);
      const r0 = pal.paper[0] + (pal.blush[0] - pal.paper[0]) * q;
      const g0 = pal.paper[1] + (pal.blush[1] - pal.paper[1]) * q;
      const b0 = pal.paper[2] + (pal.blush[2] - pal.paper[2]) * q;
      const i = y * cols + x;
      skyRGB[i] =
        still[i] === CLOUD
          ? pack(pal.cloud)
          : pack([
              Math.round(r0 + (pal.glow[0] - r0) * g),
              Math.round(g0 + (pal.glow[1] - g0) * g),
              Math.round(b0 + (pal.glow[2] - b0) * g),
            ]);
    }
  }
  lut[FOAM] = pack(pal.foam);
  lut[PALE] = pack(pal.pale);
  lut[LIGHT] = pack(pal.light);
  lut[MID] = pack(pal.mid);
  lut[DEEP] = pack(pal.deep);
  lut[BODY] = pack(pal.body);
  lut[LINE] = pack(pal.line);
  lut[HULL] = pack(pal.hull);
  lut[HULL_SHADE] = pack(pal.hullShade);
  lut[CREW] = pack(pal.crew);
  lut[HEAD] = pack(pal.head);
  buf.pal = pal;
}

/**
 * Render one frame into a packed-pixel view (cols × rows) of an ImageData buffer.
 * t is seconds of scene time; buffers come from makeBuffers(cols, rows).
 */
export function renderWave(out: Uint32Array, t: number, pal: WavePalette, buf: WaveBuffers) {
  const { cols, rows, cls, layer, front, back, frontCol, backCol, still } = buf;
  if (buf.pal !== pal) applyPalette(buf, pal);
  const R = rows;
  const s = rows / 192;
  const fBase = 0.885 * R;
  const bBase = 0.762 * R;

  for (let x = 0; x < cols; x++) {
    const X = (x + 0.5) / R;
    const xs = x / s;
    front[x] = frontSurface(X, t) * R;
    back[x] = backSurface(X, t) * R;
    swellColumn(xs, crestness(fBase, front[x], 0.3 * R), t, 1.7, frontCol, x * 4);
    swellColumn(xs, crestness(bBase, back[x], 0.3 * R), t, 4.2, backCol, x * 4);
  }

  const hzPx = HZ * R;
  const bigCols = Math.min(cols, Math.ceil(1.05 * R));
  const bigRows = Math.ceil(0.95 * R);
  for (let y = 0; y < rows; y++) {
    const Y = (y + 0.5) / R;
    const yc = y + 0.5;
    const fx = buf.faceX[y];
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const k = x * 4;
      const xs = x / s;
      let c = -1;
      let l = L_SKY;
      const fy = front[x];
      if (yc >= fy) {
        c = swellBand((yc - fy) / s, frontCol[k], frontCol[k + 1], frontCol[k + 2], frontCol[k + 3], xs, 1.7);
        l = L_FRONT;
      } else if (fy - yc < 14 * s) {
        c = crestClaw(fy - yc, x, frontCol[k + 2], s, t, 1.7);
        if (c >= 0) l = L_FRONT;
      }
      if (c < 0 && x < bigCols && y < bigRows) {
        c = greatWave((x + 0.5) / R, Y, x, y, s, R, t, buf.backTop[x], fx);
        if (c >= 0) l = L_BIG;
      }
      if (c < 0) {
        const by = back[x];
        if (yc >= by) {
          c = swellBand((yc - by) / s, backCol[k], backCol[k + 1], backCol[k + 2], backCol[k + 3], xs, 4.2);
          l = L_BACK;
        } else if (by - yc < 14 * s) {
          c = crestClaw(by - yc, x, backCol[k + 2], s, t, 4.2);
          if (c >= 0) l = L_BACK;
        }
      }
      if (c < 0 && yc >= hzPx) {
        // Far sea between the horizon and the back swells.
        c = (y + x * 0.02) % 3 < 1 ? MID : DEEP;
        l = L_BACK;
      }
      if (c < 0) c = still[i];
      cls[i] = c;
      layer[i] = l;
    }
  }

  drawTalons(cls, cols, rows, t, s);

  // Ink every foam edge that touches the sky, so the cream claws read against the paper.
  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const i = y * cols + x;
      if (cls[i] !== FOAM && cls[i] !== PALE) continue;
      if (cls[i - 1] <= CLOUD || cls[i + 1] <= CLOUD || cls[i - cols] <= CLOUD || cls[i + cols] <= CLOUD) {
        cls[i] = LINE;
      }
    }
  }

  for (const b of BOATS) drawBoat(b, cols, rows, t, s, buf);
  drawSpray(cols, rows, t, s, buf);

  const { lut, skyRGB } = buf;
  for (let i = 0; i < cols * rows; i++) {
    const c = cls[i];
    out[i] = c <= CLOUD ? skyRGB[i] : lut[c];
  }
}

function surfaceAtPx(buf: WaveBuffers, layer: Boat["layer"], xf: number, cols: number): number {
  const arr = layer === "front" ? buf.front : buf.back;
  const x0 = Math.max(0, Math.min(cols - 1, Math.floor(xf)));
  const x1 = Math.min(cols - 1, x0 + 1);
  const f = Math.max(0, Math.min(1, xf - x0));
  return arr[x0] * (1 - f) + arr[x1] * f;
}

/**
 * An oshiokuri-bune: long, slender, low in the water, prow sweeping up, a row of crouching
 * rowers. Placed on its swell: heave from the water height, pitch from the local slope.
 */
function drawBoat(b: Boat, cols: number, rows: number, t: number, s: number, buf: WaveBuffers) {
  const R = rows;
  const half = (b.len * R) / 2;
  const cxp = (b.x + 0.004 * Math.sin(t * 0.21 + b.phase)) * R;
  if (cxp - half > cols + 2) return;
  const span = half * 0.75;
  const yA = surfaceAtPx(buf, b.layer, cxp - span, cols);
  const yB = surfaceAtPx(buf, b.layer, cxp + span, cols);
  const yC = surfaceAtPx(buf, b.layer, cxp, cols);
  const ang = Math.atan2(yB - yA, 2 * span) + 0.012 * Math.sin(t * 0.9 + b.phase);
  const freeboard = 6 * s;
  const cyp = (yA + yB) * 0.25 + yC * 0.5 - freeboard;
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);

  const bowRise = 6 * s;
  const depth = 7 * s;
  const headR = 1.7 * s;
  const crewTop = 2 * s;
  const reach = half + 3 * s;
  const minX = Math.max(0, Math.floor(cxp - reach - 2));
  const maxX = Math.min(cols - 1, Math.ceil(cxp + reach + 2));
  const minY = Math.max(0, Math.floor(cyp - reach * Math.abs(sin) - bowRise - 8 * s));
  const maxY = Math.min(rows - 1, Math.ceil(cyp + reach * Math.abs(sin) + depth + 3));
  const blocking = b.layer === "back" ? L_BIG : 99;
  const headGap = (half * 1.18) / b.crew;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const i = y * cols + x;
      if (buf.layer[i] >= blocking) continue;
      const water = surfaceAtPx(buf, b.layer, x + 0.5, cols);
      if (y + 0.5 > water + 0.6 * s) continue; // the rest of the hull is under water
      const dx = x + 0.5 - cxp;
      const dy = y + 0.5 - cyp;
      const a = dx * cos + dy * sin; // along the hull
      const v = -dx * sin + dy * cos; // across (down is +)
      const sa = (a / half) * b.facing; // +1 at the bow
      if (sa < -1.02 || sa > 1.06) continue;
      const rise = sa > 0.5 ? bowRise * Math.pow((sa - 0.5) / 0.5, 2.2) : sa < -0.85 ? s * 1.2 * ((-sa - 0.85) / 0.15) : 0;
      const top = -rise;
      const bot = depth * (1 - Math.pow(Math.abs(Math.min(1, sa)), 5));
      if (v >= top - 0.5 && v <= bot) {
        const edge = v < top + 0.9 || sa > 0.985 || sa < -0.975;
        if (edge) buf.cls[i] = sa > 0.6 || sa < -0.9 ? BODY : DEEP;
        else if (v > bot - 1.4 * s) buf.cls[i] = HULL_SHADE;
        else if (Math.abs(v - 1.8 * s) < 0.5) buf.cls[i] = HULL_SHADE;
        else buf.cls[i] = HULL;
        continue;
      }
      // Rowers: dark crouched backs with a tight row of pale heads above them.
      if (sa > -0.72 && sa < 0.46 && v < top) {
        const along = (sa + 0.72) * half;
        const k = Math.round(along / headGap);
        if (k > b.crew) continue;
        const hx = k * headGap - along;
        if (v > top - crewTop) {
          buf.cls[i] = CREW;
          continue;
        }
        const hy = v - (top - crewTop - headR * 0.55);
        const d = Math.hypot(hx, hy);
        if (d < headR) buf.cls[i] = HEAD;
        else if (d < headR + 0.85) buf.cls[i] = CREW;
      }
    }
  }

  // Foam where the hull meets the water: a few flickering pixels at bow and along the side.
  for (let k = -1; k <= 1; k += 2) {
    const ex = cxp + k * half * cos * 0.98;
    for (let j = 0; j < 3; j++) {
      const fx = Math.round(ex + k * (j + 1) * s);
      if (fx < 0 || fx >= cols) continue;
      const fy = Math.round(surfaceAtPx(buf, b.layer, fx + 0.5, cols));
      if (fy < 0 || fy >= rows) continue;
      if (hash(fx, j, Math.floor(t * 3 + b.phase)) < 0.65) {
        const i = fy * cols + fx;
        if (buf.layer[i] < blocking) buf.cls[i] = FOAM;
      }
    }
  }
}

function drawSpray(cols: number, rows: number, t: number, s: number, buf: WaveBuffers) {
  const R = rows;
  for (const d of SPRAY) {
    const age = frac(t / d.period + d.offset) * d.period;
    const th = TH0 + (TH1 - TH0) * d.p;
    const ro = d.inner ? lipOuter(d.p) - lipThick(d.p) - 0.006 : lipOuter(d.p) + 0.02;
    const sx = CX + Math.sin(th) * ro;
    const sy = CY - Math.cos(th) * ro;
    const X = sx + d.vx * age;
    const Y = sy + d.vy * age + 0.5 * 0.014 * age * age;
    const x = Math.round(X * R);
    const y = Math.round(Y * R);
    if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
    const life = age / d.period;
    if (life > 0.8 && bayer(x, y) < (life - 0.8) / 0.2) continue;
    const i = y * cols + x;
    if (buf.layer[i] !== L_SKY || buf.cls[i] > CLOUD) continue;
    buf.cls[i] = FOAM;
    if (d.big && s >= 0.9 && x + 1 < cols && buf.cls[i + 1] <= CLOUD) buf.cls[i + 1] = FOAM;
  }
}
