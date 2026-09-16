"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/** Matches light/dark page backgrounds used for Safari chrome sampling. */
export const THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
} as const;

function applyThemeColor(color: string) {
  // Recreate the tag — some WebKit builds ignore in-place content updates.
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.remove());

  const meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("content", color);
  document.head.appendChild(meta);
}

/**
 * Sync browser chrome with the class-based theme.
 *
 * iOS Safari 26+ largely ignores `theme-color` and instead samples solid
 * `background-color` on `html`/`body` and fixed/sticky edge elements. We still
 * update the meta tag for Chrome/Android and older iOS, and force opaque
 * document backgrounds so Liquid Glass chrome follows a one-tap toggle.
 */
export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
    if (!resolvedTheme) return;

    const isDark = resolvedTheme === "dark";
    const color = isDark ? THEME_COLORS.dark : THEME_COLORS.light;
    const root = document.documentElement;

    root.style.colorScheme = isDark ? "dark" : "light";
    root.style.backgroundColor = color;
    document.body.style.backgroundColor = color;

    applyThemeColor(color);

    let statusBar = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (!statusBar) {
      statusBar = document.createElement("meta");
      statusBar.setAttribute("name", "apple-mobile-web-app-status-bar-style");
      document.head.appendChild(statusBar);
    }
    // With viewport-fit=cover, translucent lets the page background fill the
    // notch/home-indicator. Dynamic swaps of this value are unreliable on
    // installed PWAs, but keep it translucent so html/body paint shows through.
    statusBar.setAttribute("content", "black-translucent");
  }, [resolvedTheme]);

  return null;
}
