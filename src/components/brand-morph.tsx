"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const WORD = "ShinUI".split("");
const KANJI = ["篠", "崎"];
const KANJI_FONT = '600 27px "Shippori Mincho"';

/**
 * Header wordmark. Reads "ShinUI"; on hover (fine pointers only) or keyboard focus the
 * letters glide up and fade out while 篠崎 rises in, then it reverses. Pure CSS
 * (transform + opacity only, see `.brand-morph` in globals.css): no scramble, no blur, no
 * font/weight/size changes, fixed width, shared baseline.
 *
 * The morph is only armed once Shippori Mincho has loaded (or failed, after which a
 * single fallback mincho is used for good), so the kanji never swap fonts mid-hover.
 * Touch devices just show "ShinUI".
 */
export function BrandMorph({ className }: { className?: string }) {
  const [ready, setReady] = React.useState<"" | "font" | "fallback">("");

  React.useEffect(() => {
    let done = false;
    const finish = (v: "font" | "fallback") => {
      if (!done) {
        done = true;
        setReady(v);
      }
    };
    const fonts = typeof document !== "undefined" ? document.fonts : undefined;
    if (!fonts) {
      finish("fallback");
      return;
    }
    if (fonts.check(KANJI_FONT, "篠崎")) {
      finish("font");
      return;
    }
    const timer = window.setTimeout(() => finish("fallback"), 2500);
    fonts
      .load(KANJI_FONT, "篠崎")
      .then((faces) => finish(faces.length ? "font" : "fallback"))
      .catch(() => finish("fallback"));
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Link
      href="/"
      aria-label="ShinUI"
      data-ready={ready || undefined}
      className={cn(
        "brand-morph relative inline-grid h-9 w-[3.9rem] shrink-0 items-center",
        className
      )}
    >
      <span
        aria-hidden
        className="col-start-1 row-start-1 flex text-[17px] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap"
      >
        {WORD.map((g, i) => (
          <span key={i} className="brand-morph-letter inline-block" style={{ "--i": i } as React.CSSProperties}>
            {g}
          </span>
        ))}
      </span>
      <span
        aria-hidden
        className={cn(
          "brand-morph-kanji pointer-events-none col-start-1 row-start-1 flex items-center justify-center leading-none text-(--fo-accent)",
          ready === "fallback" && "brand-morph-kanji--fallback"
        )}
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
