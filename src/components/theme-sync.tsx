"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Component to sync iOS safe area theme colors with the current theme.
 * This ensures that the notch area and home indicator area match the theme.
 */
export function ThemeSync() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const updateThemeColor = () => {
      const currentTheme = theme === "system" ? resolvedTheme : theme;
      const color = currentTheme === "dark" ? "#09090b" : "#ffffff";

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
    };

    updateThemeColor();
  }, [theme, resolvedTheme]);

  return null;
}