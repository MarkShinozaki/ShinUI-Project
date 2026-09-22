"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * Component to sync iOS safe area theme colors with the current theme.
 * This ensures that the notch area and home indicator area match the theme.
 */
export function ThemeSync() {
  const { theme, resolvedTheme } = useTheme();
  const lastThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const updateThemeColor = () => {
      const currentTheme = theme === "system" ? resolvedTheme : theme;
      if (!currentTheme) return;

      const color = currentTheme === "dark" ? "#09090b" : "#ffffff";

      // Only trigger reflow if theme actually changed
      if (lastThemeRef.current === currentTheme) return;
      lastThemeRef.current = currentTheme;

      // Update meta theme-color for iOS
      let metaThemeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = "theme-color";
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute("content", color);

      // Update apple-mobile-web-app-status-bar-style
      let metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') as HTMLMetaElement;
      if (!metaStatusBar) {
        metaStatusBar = document.createElement('meta');
        metaStatusBar.name = "apple-mobile-web-app-status-bar-style";
        document.head.appendChild(metaStatusBar);
      }
      metaStatusBar.setAttribute("content", currentTheme === "dark" ? "black-translucent" : "default");

      // Force iOS to repaint safe areas by manipulating the body
      document.body.style.display = 'none';
      // Force a reflow
      void document.body.offsetHeight;
      document.body.style.display = '';

      // Also try toggling a class on html to force repaint
      document.documentElement.classList.add('ios-theme-change');
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('ios-theme-change');
      });
    };

    // Small delay to ensure theme is resolved
    const timeoutId = setTimeout(updateThemeColor, 50);

    return () => clearTimeout(timeoutId);
  }, [theme, resolvedTheme]);

  return null;
}