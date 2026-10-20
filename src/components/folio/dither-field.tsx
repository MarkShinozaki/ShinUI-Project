"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/** Deterministic 0..1 hash, so pixel art looks the same on every render. */
function hash(x: number, y: number, seed = 1) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

/**
 * Folio DitherField (ported from Design Studio). A slowly drifting field of
 * pixels, ordered-dithered (Bayer 4x4) from layered sine noise. On Shin UI the
 * pixels are painted with a sakura gradient (rose → bloom) instead of cobalt.
 * Canvas, ~12fps, pauses offscreen and for reduced motion.
 */
export function DitherField({
  cell = 4,
  animate = true,
  shape = "field",
  inverse = false,
  className,
}: {
  cell?: number;
  animate?: boolean;
  shape?: "field" | "orb" | "wave";
  /** Light pixels on a sakura ground instead of sakura on paper. */
  inverse?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    let visible = true;
    let t = 0;

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      const cols = Math.max(1, Math.ceil(w / cell));
      const rows = Math.max(1, Math.ceil(h / cell));
      if (canvas.width !== cols || canvas.height !== rows) {
        canvas.width = cols;
        canvas.height = rows;
      }
      const style = getComputedStyle(canvas);
      const accent = style.getPropertyValue("--fo-accent").trim() || "#e0487a";
      const accent2 = style.getPropertyValue("--fo-accent-2").trim() || accent;
      const paper = style.getPropertyValue("--fo-paper").trim() || "#fffafa";
      const grad = ctx.createLinearGradient(0, 0, cols, rows);
      grad.addColorStop(0, accent);
      grad.addColorStop(1, accent2);
      ctx.fillStyle = inverse ? grad : paper;
      ctx.fillRect(0, 0, cols, rows);
      ctx.fillStyle = inverse ? "rgba(255,255,255,0.82)" : grad;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const u = x / cols;
          const v = y / rows;
          let d: number;
          if (shape === "orb") {
            const dx = (u - 0.5) * (cols / rows);
            const dy = v - 0.5;
            const r = Math.sqrt(dx * dx + dy * dy) / 0.42;
            const light = 1 - Math.hypot(dx + 0.14, dy + 0.16) / 0.55;
            d = r > 1 ? 0 : 0.25 + 0.75 * Math.max(0, light) + 0.08 * Math.sin(u * 22 + v * 9 - t * 1.4);
          } else if (shape === "wave") {
            const crest = 0.55 + 0.12 * Math.sin(u * 6.5 + t * 0.8) + 0.05 * Math.sin(u * 17 - t * 1.3);
            d = v < crest ? 0 : 0.35 + 0.65 * Math.min(1, (v - crest) * 2.4) + 0.06 * Math.sin(u * 40 + v * 30 + t);
          } else {
            d =
              0.5 +
              0.28 * Math.sin(u * 5.1 + t * 0.6 + Math.sin(v * 4.2 - t * 0.4) * 1.6) +
              0.22 * Math.sin(v * 7.3 - u * 2.2 + t * 0.9) +
              0.05 * (hash(x, y) - 0.5);
          }
          if (d > BAYER[(y % 4) * 4 + (x % 4)]) ctx.fillRect(x, y, 1, 1);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 80) return;
      last = now;
      t += 0.08;
      draw();
    };

    draw();
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    // Re-read colors when the theme class flips.
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    if (animate && !reduce) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
    };
  }, [cell, animate, shape, inverse]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("block size-full [image-rendering:pixelated]", className)}
    />
  );
}
