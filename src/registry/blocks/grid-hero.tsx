'use client'

import type { CSSProperties } from 'react'
import { GridButton, GridCell, GridCells, GridLabel, GridRule, GridSection, type GridAccent, type GridMarkerKind } from '@/registry/blocks/grid-frame'
import { cn } from '@/lib/utils'

export interface GridHeroProps {
  /** centered: big centered headline. split: copy left, terminal cell right. stats: headline over a stats row. */
  variant?: 'centered' | 'split' | 'stats'
  eyebrow?: string
  title?: string
  /** Second part of the headline, set in the accent color. */
  accentText?: string
  description?: string
  primaryCta?: string
  secondaryCta?: string
  showSecondary?: boolean
  /** Command shown in the terminal cell (split variant). */
  command?: string
  /** Texture inside the hero frame. */
  pattern?: 'dots' | 'grid' | 'none'
  accent?: GridAccent
  marker?: GridMarkerKind
  dashed?: boolean
  edges?: 'both' | 'top' | 'bottom' | 'none'
  className?: string
}

const STATS = [
  ['24', 'blocks', 'and counting'],
  ['02', 'themes', 'light + dark'],
  ['00', 'runtime deps', 'beyond React'],
  ['1 cmd', 'to install', 'via the registry'],
]

function texture(pattern: GridHeroProps['pattern'], fade: string): CSSProperties | undefined {
  if (pattern === 'none') return undefined
  const mask = { maskImage: fade, WebkitMaskImage: fade }
  return pattern === 'dots'
    ? { backgroundImage: 'radial-gradient(var(--gf-cross) 1px, transparent 1px)', backgroundSize: '14px 14px', opacity: 0.45, ...mask }
    : {
        backgroundImage: 'linear-gradient(var(--gf-line) 1px, transparent 1px), linear-gradient(90deg, var(--gf-line) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        ...mask,
      }
}

function Terminal({ command }: { command: string }) {
  const rows: [string, string][] = [
    ['ok', 'resolved grid-frame'],
    ['ok', 'wrote components/shinui/grid-hero.tsx'],
    ['ok', 'tokens linked (light + dark)'],
  ]
  return (
    <div className="flex h-full flex-col border border-(--gf-line) bg-background font-mono text-[12px]">
      <div className="flex items-center gap-1.5 border-b border-(--gf-line) px-3 py-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 border border-(--gf-cross)" />
        ))}
        <span className="ml-auto text-[10px] tracking-wider text-ds-muted uppercase">terminal</span>
      </div>
      <div className="flex-1 space-y-1.5 p-4 leading-relaxed">
        <p>
          <span className="text-(--gf-accent)">$</span> {command}
        </p>
        {rows.map(([s, t]) => (
          <p key={t} className="text-ds-muted">
            <span className="text-(--gf-accent)">[{s}]</span> {t}
          </p>
        ))}
        <p className="pt-1">
          <span className="text-(--gf-accent)">$</span>{' '}
          <span className="gf-anim inline-block h-3.5 w-2 translate-y-0.5 bg-foreground" style={{ animation: 'gf-blink 1s steps(2) infinite' }} />
        </p>
      </div>
    </div>
  )
}

/** A hero framed by the grid, in three layouts. */
export function GridHero({
  variant = 'centered',
  eyebrow = 'New / grid blocks',
  title = 'Build pages that',
  accentText = 'line up on purpose',
  description = 'Hairline frames, crosshair joints and monospace details. Original blocks you can copy, tweak and ship in an afternoon.',
  primaryCta = 'Start building',
  secondaryCta = 'Read the docs',
  showSecondary = true,
  command = 'npx shadcn add shinui/grid-hero',
  pattern = 'dots',
  accent = 'primary',
  marker = 'plus',
  dashed = false,
  edges = 'both',
  className,
}: GridHeroProps) {
  const centered = variant === 'centered'
  const heading = (
    <h1
      className={cn(
        'font-display font-semibold tracking-tight text-balance',
        centered ? 'mx-auto max-w-3xl text-4xl sm:text-6xl lg:text-7xl' : 'max-w-2xl text-4xl sm:text-5xl lg:text-6xl',
      )}
    >
      {title} {accentText && <span className="text-(--gf-accent)">{accentText}</span>}
    </h1>
  )
  const copy = (
    <p className={cn('mt-6 max-w-xl text-base text-pretty text-ds-muted sm:text-lg', centered && 'mx-auto')}>{description}</p>
  )
  const ctas = (
    <div className={cn('mt-9 flex flex-wrap items-center gap-3', centered && 'justify-center')}>
      <GridButton href="#">{primaryCta}</GridButton>
      {showSecondary && (
        <GridButton href="#" variant="outline">
          {secondaryCta}
        </GridButton>
      )}
    </div>
  )

  return (
    <GridSection edges={edges} marker={marker} dashed={dashed} accent={accent} className={className}>
      {centered && (
        <div className="relative overflow-hidden px-6 py-24 text-center sm:py-32">
          <div aria-hidden className="pointer-events-none absolute inset-0" style={texture(pattern, 'radial-gradient(ellipse at center, #000 10%, transparent 70%)')} />
          <div className="relative">
            <div className="mb-8 inline-flex items-center gap-3 border border-(--gf-line) bg-background py-1 pr-3 pl-1 font-mono text-[11px] tracking-wider text-ds-muted uppercase">
              <span className="bg-(--gf-accent) px-1.5 py-0.5 text-ds-primary-foreground">new</span>
              {eyebrow}
            </div>
            {heading}
            {copy}
            {ctas}
          </div>
        </div>
      )}

      {variant === 'split' && (
        <GridCells className="lg:grid-cols-[1.15fr_1fr]">
          <GridCell className="relative overflow-hidden px-6 py-16 sm:px-10 sm:py-24">
            <div aria-hidden className="pointer-events-none absolute inset-0" style={texture(pattern, 'linear-gradient(to bottom right, #000, transparent 70%)')} />
            <div className="relative">
              <GridLabel index="01" className="mb-6">
                {eyebrow}
              </GridLabel>
              {heading}
              {copy}
              {ctas}
            </div>
          </GridCell>
          <GridCell className="p-6 sm:p-10">
            <Terminal command={command} />
          </GridCell>
        </GridCells>
      )}

      {variant === 'stats' && (
        <>
          <div className="relative overflow-hidden px-6 pt-20 pb-16 sm:px-10 sm:pt-28">
            <div aria-hidden className="pointer-events-none absolute inset-0" style={texture(pattern, 'linear-gradient(to bottom, #000, transparent 85%)')} />
            <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
              <div>
                <GridLabel index="00" className="mb-6">
                  {eyebrow}
                </GridLabel>
                {heading}
              </div>
              <div>
                <p className="max-w-md text-base text-pretty text-ds-muted">{description}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <GridButton href="#">{primaryCta}</GridButton>
                  {showSecondary && (
                    <GridButton href="#" variant="ghost">
                      {secondaryCta}
                    </GridButton>
                  )}
                </div>
              </div>
            </div>
          </div>
          <GridRule />
          <GridCells className="grid-cols-2 lg:grid-cols-4">
            {STATS.map(([value, label, note]) => (
              <GridCell key={label} interactive className="px-6 py-7 sm:px-8">
                <span className="font-mono text-[10px] tracking-wider text-ds-muted uppercase">{label}</span>
                <span className="mt-3 font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{value}</span>
                <span className="mt-1 text-xs text-ds-muted">{note}</span>
              </GridCell>
            ))}
          </GridCells>
        </>
      )}
    </GridSection>
  )
}
