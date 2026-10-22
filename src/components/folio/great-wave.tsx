"use client";

import { useEffect, useRef } from "react";

import { makeBuffers, renderWave, type RGB, type WaveBuffers, type WavePalette } from "./great-wave-scene";

/**
 * Sakura palettes — no blue or teal anywhere. The water ramp is the same cream → rose →
 * plum banding the footer has always used; the boats are pale wood.
 */
const LIGHT: Omit<WavePalette, "paper"> = {
  blush: [248, 223, 228],
  glow: [240, 199, 210],
  cloud: [255, 251, 248],
  foam: [255, 248, 239],
  pale: [247, 212, 222],
  light: [235, 165, 187],
  mid: [207, 113, 146],
  deep: [138, 63, 99],
  body: [74, 29, 59],
  line: [207, 113, 146],
  hull: [238, 208, 174],
  hullShade: [206, 162, 136],
  crew: [74, 29, 59],
  head: [252, 240, 228],
};

const DARK: Omit<WavePalette, "paper"> = {
  blush: [58, 32, 52],
  glow: [79, 44, 70],
  cloud: [72, 44, 64],
  foam: [241, 225, 216],
  pale: [227, 178, 197],
  light: [201, 131, 159],
  mid: [156, 79, 116],
  deep: [92, 39, 72],
  body: [42, 15, 34],
  line: [156, 79, 116],
  hull: [204, 162, 132],
  hullShade: [156, 112, 96],
  crew: [28, 10, 22],
  head: [236, 214, 202],
};

/** Native height of the pixel grid; the canvas is scaled up with crisp pixels. */
const ROWS = 192;
/** Scene time used for the single still frame under prefers-reduced-motion. */
const STILL_T = 3;

function paperRGB(ctx: CanvasRenderingContext2D, fallback: RGB): RGB {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--fo-paper").trim();
  if (!v) return fallback;
  ctx.save();
  ctx.fillStyle = "#000";
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  ctx.clearRect(0, 0, 1, 1);
  ctx.restore();
  return [d[0], d[1], d[2]];
}

/**
 * Footer strip: a pixel-art homage to Hokusai's Great Wave in sakura pink, drawn
 * procedurally (see great-wave-scene.ts). The curl is anchored flush left; wider strips
 * see more open sea to the right. Calm ~20fps motion that pauses offscreen, a still frame
 * for reduced motion, and a repaint on theme change.
 */
export function GreatWave({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let buf: WaveBuffers | null = null;
    let img: ImageData | null = null;
    let px: Uint32Array | null = null;
    let pal: WavePalette | null = null;
    let time = STILL_T;

    const loadPalette = () => {
      const dark = document.documentElement.classList.contains("dark");
      const base = dark ? DARK : LIGHT;
      pal = { ...base, paper: paperRGB(ctx, dark ? [24, 16, 22] : [253, 248, 246]) };
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return false;
      const cols = Math.max(1, Math.round((w / h) * ROWS));
      if (buf && buf.cols === cols) return true;
      canvas.width = cols;
      canvas.height = ROWS;
      buf = makeBuffers(cols, ROWS);
      img = ctx.createImageData(cols, ROWS);
      px = new Uint32Array(img.data.buffer);
      return true;
    };

    const draw = () => {
      if (!buf || !img || !px || !pal) return;
      renderWave(px, time, pal, buf);
      ctx.putImageData(img, 0, 0);
    };

    loadPalette();
    if (resize()) draw();

    let raf = 0;
    let last = 0;
    let visible = false;
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 50) return;
      // Advance by real elapsed time (capped) so a slow frame never makes the sea jump.
      time += last ? Math.min(0.1, (now - last) / 1000) : 0.05;
      last = now;
      draw();
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
      if (resize()) draw();
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      loadPalette();
      draw();
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
