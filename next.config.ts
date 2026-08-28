import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip auto-generating AGENTS.md / CLAUDE.md in the repo root.
  agentRules: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
