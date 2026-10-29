import { DiaButton, DiaHeading, DiaMark, Eyebrow, Sunrise } from '@/registry/blocks/dia-kit'
import { cn } from '@/lib/utils'

export interface DiaFooterProps {
  /** cta: closing headline, sticky arch dock and link columns. columns: links only. */
  variant?: 'cta' | 'columns'
  brand?: string
  headline?: string
  ctaLabel?: string
  note?: string
  animate?: boolean
  className?: string
}

const COLUMNS: [string, string[]][] = [
  ['Library', ['Blocks', 'Components', 'Kits', 'Changelog']],
  ['Learn', ['Install', 'Theming', 'Accessibility', 'FAQ']],
  ['Project', ['GitHub', 'Roadmap', 'License', 'Contact']],
]

/**
 * The arch-shaped download dock. It is `position: sticky; bottom: 0`, so it
 * pins to the bottom of whatever scrolls (the window, or a preview frame)
 * while the page moves underneath, and settles into place at the end.
 * Render it as a direct child of the long page container so it can stick
 * for the whole scroll.
 */
export function DiaDock({ ctaLabel = 'Start building', note = 'Works with Next.js, Vite and Remix', className }: { ctaLabel?: string; note?: string; className?: string }) {
  return (
    <div className={cn('pointer-events-none sticky bottom-0 z-20 h-40 overflow-x-clip', className)}>
      <div aria-hidden className="absolute inset-x-[-15%] bottom-0 h-full rounded-t-[50%] bg-(--di-paper) shadow-[0_-1px_0_var(--di-line),0_-24px_48px_-28px_rgb(60_40_0/0.35)]" />
      <div className="pointer-events-auto relative flex h-full flex-col items-center justify-center gap-2 pt-6">
        <DiaButton className="h-12 min-w-64 px-8">{ctaLabel}</DiaButton>
        <span className="text-[12px] text-(--di-soft)">{note}</span>
      </div>
    </div>
  )
}

export function DiaFooterColumns({ brand = 'shinUI', className }: { brand?: string; className?: string }) {
  return (
    <footer className={cn('relative z-30 border-t border-(--di-line) bg-(--di-paper)', className)}>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-3">
          <a href="#" className="flex items-center gap-2 text-[15px] font-medium">
            <DiaMark />
            {brand}
          </a>
          <p className="max-w-[24ch] text-[13px] leading-relaxed text-(--di-soft)">Calm, original blocks for pages people enjoy using.</p>
        </div>
        {COLUMNS.map(([h, links]) => (
          <nav key={h} aria-label={h} className="flex flex-col gap-2.5">
            <Eyebrow>{h}</Eyebrow>
            {links.map((l) => (
              <a key={l} href="#" className="w-fit text-[13.5px] text-(--di-soft) transition-colors hover:text-(--di-ink)">
                {l}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-(--di-line) px-6 py-5">
        <Eyebrow>© {brand}</Eyebrow>
        <Eyebrow>Made slowly, on purpose</Eyebrow>
      </div>
    </footer>
  )
}

/**
 * cta: a closing headline, the sticky arch dock and the link columns. It
 * returns siblings (no wrapper) so the dock sticks across the whole page it
 * is placed in. columns: links only.
 */
export function DiaFooter({
  variant = 'cta',
  brand = 'shinUI',
  headline = 'Ready for an easier build?',
  ctaLabel = 'Start building',
  note = 'Works with Next.js, Vite and Remix',
  animate = true,
  className,
}: DiaFooterProps) {
  if (variant === 'columns') return <DiaFooterColumns brand={brand} className={className} />
  return (
    <>
      <section className={cn('relative isolate overflow-hidden px-6 pt-28 pb-4 text-center', className)}>
        <Sunrise animate={animate} horizon={false} className="-z-10 [mask-image:radial-gradient(60%_80%_at_50%_100%,black,transparent)] opacity-70" />
        <DiaHeading className="text-[38px] leading-tight sm:text-[52px]">{headline}</DiaHeading>
      </section>
      <DiaDock ctaLabel={ctaLabel} note={note} />
      <DiaFooterColumns brand={brand} />
    </>
  )
}
