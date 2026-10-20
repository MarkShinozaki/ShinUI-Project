import { HeroKanjiPond } from "@/components/hero-kanji-pond";
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
 * dotted figure right. Shin UI keeps its embossed 篠崎 pond inside the figure.
 */
export function HomeHero({
  resourceCount,
  componentCount,
  categoryCount,
}: {
  resourceCount: number;
  componentCount: number;
  categoryCount: number;
}) {
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
        <p className="max-w-lg text-[16px] leading-relaxed text-(--fo-soft)">
          {resourceCount} external tools and libraries, indexed, searchable and credited to whoever
          built them. Plus {componentCount} components you can preview live and copy straight into
          your project.
        </p>
        <div className="flex w-full max-w-sm flex-col gap-2 sm:max-w-none">
          <div className="flex flex-col gap-2 sm:flex-row">
            <FolioButton href="/browse" size="lg">
              Browse resources
            </FolioButton>
            <FolioButton href="/components" variant="secondary" size="lg" className="justify-center">
              See live components
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
        caption={`Figure 1. ${resourceCount} resources across ${categoryCount} categories, sorted, credited and one search away. 篠崎 (Shinozaki), embossed on the pond.`}
      >
        <span className="absolute -top-2 left-3 z-10 bg-(--fo-paper) px-1 font-mono text-[9px] tracking-[0.14em] uppercase">
          Index
        </span>
        <span className="absolute top-3 right-3 z-10 font-mono text-[9px] tracking-[0.14em] text-(--fo-accent) uppercase">
          {String(resourceCount).padStart(3, "0")}
        </span>
        <HeroKanjiPond className="relative aspect-[400/275] w-full" />
      </FolioFigure>
    </FolioWrap>
  );
}
