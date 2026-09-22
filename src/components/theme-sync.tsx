"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * Component to sync iOS safe area theme colors with the current theme.
 * This ensures the notch area and home indicator area match the theme.
 *
 * iOS 26+ Safari ignores theme-color meta tags and instead samples the background
 * of fixed/sticky edge elements. We use fixed strips at top/bottom that are bound
 * to CSS variables, and trigger a resize event to force Safari to re-sample.
 */
export function ThemeSync() {
  const { theme, resolvedTheme } = useTheme();
  const lastThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    if (!currentTheme) return;

    // Only trigger resample if theme actually changed
    if (lastThemeRef.current === currentTheme) return;
    lastThemeRef.current = currentTheme;

    // Force Safari to re-sample the safe area background by dispatching resize
    // This is a legitimate trigger that Safari actually listens for
    window.dispatchEvent(new Event('resize'));
  }, [theme, resolvedTheme]);

  return null;
}