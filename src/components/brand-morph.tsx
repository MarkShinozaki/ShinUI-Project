"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const WORD = "ShinUI".split("");
const KANJI = ["篠", "崎"];
/** Katakana and a few kanji the letters flicker through while they scramble. */
const POOL = "シノザキアカサタナハマヤラワンヲ桜川篠崎ｼﾉｻﾞｷ";

const rand = () => POOL[Math.floor(Math.random() * POOL.length)];

/**
 * Header wordmark. Reads "ShinUI"; on hover or keyboard focus each letter
 * scrambles through katakana and flips away while 篠崎 flips in in sakura
 * pink, then reverses on leave. Fixed width (no layout shift), accessible
 * name "ShinUI", and a plain crossfade for reduced motion.
 */
export function BrandMorph({ className }: { className?: string }) {
  const [on, setOn] = React.useState(false);
  const [glyphs, setGlyphs] = React.useState<string[]>(WORD);
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      if (reduce) {
        setGlyphs(WORD);
        return;
      }
      if (now - last > 45) {
        last = now;
        setGlyphs(
          WORD.map((ch, i) => {
            // Entering: scramble left→right, then keep a random glyph while it flips out.
            // Leaving: scramble right→left, then settle back on the real letter.
            const settle = on ? 70 + i * 40 : 60 + (WORD.length - 1 - i) * 45;
            if (on) return t < settle + 120 ? rand() : ch;
            return t < settle ? rand() : ch;
          })
        );
      }
      if (t < 420) raf = requestAnimationFrame(tick);
      else setGlyphs(WORD);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  return (
    <Link
      href="/"
      aria-label="ShinUI"
      data-on={on ? "true" : "false"}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      className={cn(
        "brand-morph relative inline-grid h-9 w-[3.9rem] shrink-0 items-center [perspective:400px]",
        className
      )}
    >
      <span
        aria-hidden
        className="col-start-1 row-start-1 flex text-[17px] font-semibold tracking-[-0.02em] whitespace-nowrap"
      >
        {glyphs.map((g, i) => (
          <span
            key={i}
            className={cn(
              "brand-morph-letter inline-block",
              g !== WORD[i] && "w-[0.6em] text-center text-[0.9em] font-normal text-(--fo-accent)"
            )}
            style={{ "--i": i } as React.CSSProperties}
          >
            {g}
          </span>
        ))}
      </span>
      <span
        aria-hidden
        className="brand-morph-kanji pointer-events-none col-start-1 row-start-1 flex items-center justify-center leading-none text-(--fo-accent)"
      >
        {KANJI.map((k, i) => (
          <span key={k} className="inline-block" style={{ "--i": i } as React.CSSProperties}>
            {k}
          </span>
        ))}
      </span>
    </Link>
  );
}
