'use client'

import { GridCell, GridCells, GridLogo, GridRule, GridSection, type GridAccent, type GridMarkerKind } from '@/registry/blocks/grid-frame'
import { cn } from '@/lib/utils'

export interface GridFooterProps {
  /** columns: brand cell + link columns. compact: one ruled row. wordmark: columns over a giant hatched brand name. */
  variant?: 'columns' | 'compact' | 'wordmark'
  brand?: string
  tagline?: string
  /** Show a call-to-action band above the footer. */
  showCta?: boolean
  ctaTitle?: string
  ctaLabel?: string
  status?: string
  accent?: GridAccent
  marker?: GridMarkerKind
  dashed?: boolean
  edges?: 'both' | 'top' | 'bottom' | 'none'
  className?: string
}

const COLUMNS: [string, string[]][] = [
  ['Library', ['Blocks', 'Backgrounds', 'Components', 'Changelog']],
  ['Tools', ['Favicon Studio', 'Token builder', 'Registry', 'Playground']],
  ['Learn', ['Docs', 'Guides', 'Design notes', 'FAQ']],
  ['Studio', ['About', 'Contact', 'License', 'Privacy']],
]

const YEAR = new Date().getFullYear()

/** A grid footer with three layouts and an optional CTA band. */
export function GridFooter({
  variant = 'columns',
  brand = 'shinUI',
  tagline = 'Free, original design tools and blocks for people who ship.',
  showCta = true,
  ctaTitle = 'Ready when your next page is.',
  ctaLabel = 'Get started',
  status = 'All systems normal',
  accent = 'primary',
  marker = 'plus',
  dashed = false,
  edges = 'both',
  className,
}: GridFooterProps) {
  const line = cn('border-(--gf-line)', dashed && 'border-dashed')

  const cta = showCta && (
    <>
      <div className="relative overflow-hidden bg-(--gf-accent) px-6 py-16 text-ds-primary-foreground sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '12px 12px' }}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-lg font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{ctaTitle}</h2>
          <a href="#" className="inline-flex h-11 items-center gap-2 bg-background px-5 font-mono text-xs tracking-wider text-foreground uppercase transition-opacity hover:opacity-90">
            {ctaLabel} <span aria-hidden>-&gt;</span>
          </a>
        </div>
      </div>
      <GridRule />
    </>
  )

  const bottom = (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 font-mono text-[11px] tracking-wider text-ds-muted uppercase sm:px-10">
      <span>
        (c) {YEAR} {brand}
      </span>
      <span className="flex items-center gap-2">
        <span className="gf-anim size-1.5 rounded-full bg-emerald-500" style={{ animation: 'gf-blink 1.4s ease-in-out infinite alternate' }} />
        {status}
      </span>
      <span className="flex gap-5">
        {['GitHub', 'X', 'RSS'].map((s) => (
          <a key={s} href="#" className="transition-colors hover:text-foreground">
            {s}
          </a>
        ))}
      </span>
    </div>
  )

  const columns = (
    <GridCells className="sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
      <GridCell className="gap-4 p-6 sm:col-span-2 sm:p-8 lg:col-span-1">
        <a href="#" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
          <GridLogo />
          {brand}
        </a>
        <p className="max-w-xs text-sm text-pretty text-ds-muted">{tagline}</p>
      </GridCell>
      {COLUMNS.map(([title, links]) => (
        <GridCell key={title} className="p-6 sm:p-8">
          <h3 className="font-mono text-[10px] tracking-wider text-ds-muted uppercase">{title}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l}>
                <a href="#" className="group inline-flex items-center gap-1.5 transition-colors hover:text-(--gf-accent)">
                  <span className="w-0 overflow-hidden font-mono text-xs transition-all group-hover:w-3">&gt;</span>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </GridCell>
      ))}
    </GridCells>
  )

  return (
    <GridSection edges={edges} marker={marker} dashed={dashed} accent={accent} className={className}>
      {cta}
      {variant === 'compact' ? (
        <div className="flex flex-col gap-6 px-6 py-8 sm:px-10 md:flex-row md:items-center md:justify-between">
          <a href="#" className="flex items-center gap-2.5 font-display text-base font-semibold tracking-tight">
            <GridLogo />
            {brand}
          </a>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ds-muted">
            {COLUMNS.flatMap(([, links]) => links.slice(0, 1)).concat(['Docs', 'License']).map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-foreground">
                {l}
              </a>
            ))}
          </nav>
        </div>
      ) : (
        columns
      )}
      {variant === 'wordmark' && (
        <>
          <GridRule />
          <div className={cn('relative overflow-hidden px-4 pt-6 select-none sm:px-6', line)} aria-hidden>
            <p
              className="text-center font-display text-[22vw] leading-[0.8] font-bold tracking-tighter text-transparent lg:text-[15rem]"
              style={{
                backgroundImage: 'repeating-linear-gradient(-45deg, var(--gf-cross) 0 1px, transparent 1px 6px)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextStroke: '1px var(--gf-cross)',
              }}
            >
              {brand}
            </p>
          </div>
        </>
      )}
      <GridRule />
      {bottom}
    </GridSection>
  )
}
