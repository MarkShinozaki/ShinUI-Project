import { DiaButton, DiaHeading, DiaMark, Eyebrow, Sunrise } from '@/registry/blocks/dia-kit'
import { cn } from '@/lib/utils'

export interface DiaFooterProps {
  /** cta: a warm closing call to action above the link columns. columns: links only. */
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

export function DiaFooter({
  variant = 'cta',
  brand = 'shinUI',
  headline = 'Ready for an easier build?',
  ctaLabel = 'Start building',
  note = 'Works with Next.js, Vite and Remix',
  animate = true,
  className,
}: DiaFooterProps) {
  return (
    <footer className={cn('relative isolate overflow-hidden', className)}>
      {variant === 'cta' && (
        <div className="relative px-6 pt-28 pb-24 text-center">
          <Sunrise animate={animate} horizon={false} className="-z-10 [mask-image:radial-gradient(60%_70%_at_50%_100%,black,transparent)] opacity-70" />
          <DiaHeading className="text-[38px] leading-tight sm:text-[52px]">{headline}</DiaHeading>
          <div className="mt-8 flex flex-col items-center gap-2">
            <DiaButton>{ctaLabel}</DiaButton>
            <span className="text-[12px] text-(--di-soft)">{note}</span>
          </div>
        </div>
      )}
      <div className="border-t border-(--di-line) bg-(--di-paper)">
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
      </div>
    </footer>
  )
}
