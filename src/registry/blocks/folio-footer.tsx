'use client'

import { ArrowUpRight, DitherField, FolioButton, FolioCommand, FolioLabel, FolioMark, FolioRoot } from '@/registry/blocks/folio-kit'
import { cn } from '@/lib/utils'

/** Split a comma list prop into trimmed items. */
const list = (value: string | undefined) =>
  (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export interface FolioFooterProps {
  /** cta: closing call to action, link columns and a dithered horizon. columns: links and status only. minimal: one quiet line. */
  variant?: 'cta' | 'columns' | 'minimal'
  brand?: string
  tagline?: string
  ctaTitle?: string
  ctaBody?: string
  ctaLabel?: string
  command?: string
  /** Shows a green "all systems normal" style status. Empty hides it. */
  status?: string
  /** Comma separated bottom links. */
  legal?: string
  animate?: boolean
  className?: string
}

const YEAR = new Date().getFullYear()

const COLUMNS: [string, string[]][] = [
  ['Library', ['Backgrounds', 'Components', 'Blocks', 'Folio set']],
  ['Studio', ['Favicon Studio', 'Registry', 'Changelog', 'Roadmap']],
  ['About', ['Journal', 'Notes', 'Contact', 'Docs ↗']],
]

function Columns() {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
      {COLUMNS.map(([head, links]) => (
        <div key={head}>
          <FolioLabel>{head}</FolioLabel>
          <ul className="mt-4 flex flex-col gap-2.5 text-[13.5px]">
            {links.map((l) => (
              <li key={l}>
                <a href="#" className="inline-flex items-center gap-1 text-(--fo-soft) transition-colors duration-200 hover:text-(--fo-ink)">
                  {l.replace('↗', '').trim()}
                  {l.endsWith('↗') && <ArrowUpRight className="text-(--fo-faint)" />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Status({ label }: { label: string }) {
  if (!label) return null
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em] text-(--fo-soft) uppercase">
      <span className="fo-anim size-1.5 rounded-full bg-(--fo-ok) [animation:fo-pulse_2.4s_ease-in-out_infinite]" />
      {label}
    </span>
  )
}

/** Folio footer in three variants. */
export function FolioFooter({
  variant = 'cta',
  brand = 'shinUI',
  tagline = 'Free, original design tools for people who ship.',
  ctaTitle = 'Shipping a page this week?',
  ctaBody = 'Start from a block that already works on phones, in the dark and with a keyboard, then make it yours.',
  ctaLabel = 'Start building',
  command = 'npx shadcn add shinui/folio-landing',
  status = 'All systems normal',
  legal = 'Privacy, Terms, License',
  animate = true,
  className,
}: FolioFooterProps) {
  const bottom = (
    <div className="flex flex-col gap-3 border-t border-(--fo-line) py-6 text-[12px] text-(--fo-faint) sm:flex-row sm:items-center sm:justify-between">
      <span>
        © {YEAR} {brand}
      </span>
      <div className="flex flex-wrap items-center gap-5">
        <Status label={status} />
        {list(legal).map((l) => (
          <a key={l} href="#" className="transition-colors hover:text-(--fo-ink)">
            {l}
          </a>
        ))}
      </div>
    </div>
  )

  if (variant === 'minimal') {
    return (
      <FolioRoot className={cn('w-full', className)}>
        <footer className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-(--fo-line) px-6 py-7 text-[12.5px] text-(--fo-faint) sm:flex-row sm:items-center sm:justify-between md:px-10">
          <a href="#" className="flex items-center gap-2 text-[14px] font-semibold text-(--fo-ink)">
            <FolioMark className="size-4" />
            {brand}
          </a>
          <span className="sm:mr-auto sm:ml-6">{tagline}</span>
          <div className="flex flex-wrap items-center gap-5">
            <Status label={status} />
            {list(legal).map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-(--fo-ink)">
                {l}
              </a>
            ))}
          </div>
        </footer>
      </FolioRoot>
    )
  }

  return (
    <FolioRoot className={cn('w-full', className)}>
      <footer className="mx-auto max-w-6xl px-6 md:px-10">
        {variant === 'cta' && (
          <div className="grid gap-10 border-t border-(--fo-line) py-16 md:grid-cols-[1.2fr_1fr] md:items-end">
            <div>
              <h2 className="max-w-lg text-[clamp(1.6rem,3.4vw,2.4rem)] leading-tight font-normal tracking-[-0.03em] text-balance">{ctaTitle}</h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-(--fo-soft)">{ctaBody}</p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <FolioButton size="lg">{ctaLabel}</FolioButton>
              {command && <FolioCommand command={command} className="w-full md:max-w-[23rem]" />}
            </div>
          </div>
        )}
        <div className="grid gap-10 border-t border-(--fo-line) py-12 md:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col items-start gap-3">
            <a href="#" className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em]">
              <FolioMark />
              {brand}
            </a>
            <p className="max-w-xs text-[13.5px] leading-relaxed text-(--fo-soft)">{tagline}</p>
          </div>
          <Columns />
        </div>
        {bottom}
      </footer>
      {variant === 'cta' && (
        <div className="h-24 w-full overflow-hidden sm:h-32">
          <DitherField shape="wave" cell={4} animate={animate} />
        </div>
      )}
    </FolioRoot>
  )
}
