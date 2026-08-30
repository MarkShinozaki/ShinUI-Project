"use client";

import Link from "next/link";
import { Layers, Search, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CloudShader } from "@/components/ui/cloud-shader";

type HeroSectionProps = {
  resourceCount: number;
  categoryCount: number;
  registryCount: number;
};

export function HeroSection({
  resourceCount,
  categoryCount,
  registryCount,
}: HeroSectionProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <section className="relative overflow-hidden border-b">
      <CloudShader
        count={5}
        speed={0.75}
        cloudColor={isDark ? "#e2e8f0" : "#fbf8f2"}
        skyTopColor={isDark ? "#1e1b4b" : "#4338ca"}
        skyBottomColor={isDark ? "#3730a3" : "#818cf8"}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className="border-white/20 bg-white/10 text-white backdrop-blur"
            >
              <Sparkles className="size-3" />
              {resourceCount} resources · {categoryCount} categories ·{" "}
              {registryCount} live components
            </Badge>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance text-white drop-shadow-sm sm:text-6xl">
              Every design resource you keep losing,{" "}
              <span className="text-white/90">in one place</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-white/80 sm:text-lg">
              {resourceCount} external tools and libraries — indexed, searchable
              and credited to whoever built them. Plus {registryCount} components
              you can preview live and copy straight into your project.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="xl" asChild>
                <Link href="/browse">
                  <Search className="size-4" />
                  Browse resources
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                asChild
                className="border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
              >
                <Link href="/components">
                  <Layers className="size-4" />
                  See live components
                </Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-white/70">
              Press{" "}
              <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono">
                ⌘K
              </kbd>{" "}
              anywhere to search
            </p>
          </div>
        </div>
      </CloudShader>
    </section>
  );
}
