import Link from "next/link";

import { SakuraStream } from "@/components/folio/sakura-stream";
import { CommandMenu } from "@/components/command-menu";
import {
  FolioAnnouncement,
  FolioButton,
  FolioFigure,
  FolioLabel,
  FolioWrap,
} from "@/components/folio/kit";

/**
 * Folio hero, `split` variant (Design Studio `FolioHero`): copy left, a
 * dotted figure right. The figure is a pixel sakura tree beside a stream.
 */
export function HomeHero() {
  const worksWith = ["React 19", "Tailwind v4", "shadcn/ui", "Next.js"];
  return (
    <FolioWrap className="grid items-center gap-12 py-16 md:grid-cols-[1fr_1.05fr] md:py-24">
      <div className="flex flex-col items-start gap-7">
        <FolioAnnouncement
          label="New on Shin UI"
          link="Favicon Studio"
          href="/design-tools/favicon-studio"
        />
        <h1 className="text-[clamp(2rem,5vw,3.1rem)] leading-[1.08] font-normal tracking-[-0.03em] text-balance">
          Every design resource you keep losing, in one place.
        </h1>
        <div className="flex w-full max-w-sm flex-col gap-2 sm:max-w-none">
          <div className="flex flex-col gap-2 sm:flex-row">
            <FolioButton href="/browse" size="lg">
              Browse resources
            </FolioButton>
            <FolioButton href="/components" variant="secondary" size="lg" className="justify-center">
              See components
            </FolioButton>
          </div>
          <CommandMenu hotkey={false} className="fo-hatch w-full sm:w-full sm:max-w-[23rem]" />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <FolioLabel>Works with</FolioLabel>
          {worksWith.map((item) => (
            <span
              key={item}
              className="border border-(--fo-line) px-2 py-0.5 font-mono text-[11px] text-(--fo-soft)"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <FolioFigure
        caption={
          <>
            From the{" "}
            <Link
              href="/components?section=pixel-art"
              className="text-(--fo-ink) underline decoration-(--fo-line-strong) underline-offset-3 transition-colors hover:text-(--fo-accent)"
            >
              Pixel Art
            </Link>{" "}
            library — 2D scenes and isometric 3D dioramas you can preview live.
          </>
        }
      >
        <SakuraStream />
      </FolioFigure>
    </FolioWrap>
  );
}
