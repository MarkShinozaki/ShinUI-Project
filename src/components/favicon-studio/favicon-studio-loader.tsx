"use client";

import dynamic from "next/dynamic";

export const FaviconStudioLoader = dynamic(
  () =>
    import("@/components/favicon-studio/favicon-studio-app").then(
      (m) => m.FaviconStudioApp
    ),
  {
    ssr: false,
    loading: () => (
      <p className="text-muted-foreground text-sm">Loading Favicon Studio…</p>
    ),
  }
);
