"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/** Matches `viewport.themeColor` in `app/layout.tsx`. */
const THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
} as const;

/**
 * Keeps iOS Safari / PWA chrome (`theme-color` + status-bar-style) in sync
 * with the next-themes class, not only `prefers-color-scheme`.
 */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!resolvedTheme) return;

    const isDark = resolvedTheme === "dark";
    const color = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

    const metas = Array.from(
      document.querySelectorAll('meta[name="theme-color"]')
    );
    // Collapse media-query variants into one tag so a manual theme wins
    // over prefers-color-scheme.
    const [primary, ...extras] = metas;
    extras.forEach((meta) => meta.remove());
    if (primary) {
      primary.removeAttribute("media");
      primary.setAttribute("content", color);
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      meta.setAttribute("content", color);
      document.head.appendChild(meta);
    }

    let statusBar = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (!statusBar) {
      statusBar = document.createElement("meta");
      statusBar.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      document.head.appendChild(statusBar);
    }
    // `black-translucent` lets the page background fill the notch; `default`
    // keeps a light status bar that would clash after switching to dark.
    statusBar.setAttribute(
      "content",
      isDark ? "black-translucent" : "default"
    );
  }, [resolvedTheme]);

  return null;
}
