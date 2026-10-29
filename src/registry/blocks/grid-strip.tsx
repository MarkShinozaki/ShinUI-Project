'use client'

import { GridCell, GridCells, GridSection, type GridAccent, type GridMarkerKind } from '@/registry/blocks/grid-frame'
import { cn } from '@/lib/utils'

export interface GridStripProps {
  /** stats: four boxed numbers with live bars. marquee: a scrolling row of stack names in cells. */
  variant?: 'stats' | 'marquee'
  /** Label cell on the left. */
  label?: string
  /** Comma separated names for the marquee. */
  items?: string
  /** Seconds per marquee loop. */
  speed?: number
  accent?: GridAccent
  marker?: GridMarkerKind
  dashed?: boolean
  edges?: 'both' | 'top' | 'bottom' | 'none'
  className?: string
}

const STATS: [string, string, number[]][] = [
  ['Blocks shipped', '24', [3, 5, 4, 6, 7, 6, 8, 9]],
  ['Avg. bundle', '2.1kb', [8, 7, 7, 5, 6, 4, 4, 3]],
  ['Lighthouse a11y', '100', [9, 9, 8, 9, 9, 9, 9, 9]],
  ['Setup time', '< 1 min', [6, 4, 5, 3, 3, 2, 2, 1]],
]

/** A thin band between sections: a stats row or a marquee of cells. */
export function GridStrip({
  variant = 'stats',
  label = 'Plays well with',
  items = 'React 19, Tailwind v4, Vite, TypeScript, shadcn, Next.js, Astro, Remix',
  speed = 30,
  accent = 'primary',
  marker = 'plus',
  dashed = false,
  edges = 'both',
  className,
}: GridStripProps) {
  const names = items
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <GridSection edges={edges} marker={marker} dashed={dashed} accent={accent} className={className}>
      {variant === 'stats' ? (
        <GridCells className="grid-cols-2 lg:grid-cols-4">
          {STATS.map(([name, value, bars], i) => (
            <GridCell key={name} interactive className="gap-4 px-6 py-6 sm:px-8">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-ds-muted uppercase">
                <span>{name}</span>
                <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <span className="font-display text-3xl font-semibold tracking-tight tabular-nums">{value}</span>
                <span aria-hidden className="flex h-8 items-end gap-0.5">
                  {bars.map((h, j) => (
                    <span
                      key={j}
                      className="gf-anim w-1 origin-bottom bg-(--gf-accent)/70"
                      style={{ height: `${h * 11}%`, animation: `gf-grow 2.6s ${j * 0.12}s ease-in-out infinite` }}
                    />
                  ))}
                </span>
              </div>
            </GridCell>
          ))}
        </GridCells>
      ) : (
        <div className="flex items-stretch">
          <div className={cn('relative hidden shrink-0 items-center border-r border-(--gf-line) px-6 font-mono text-[11px] tracking-wider text-ds-muted uppercase sm:flex', dashed && 'border-dashed')}>
            {label}
          </div>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
            <div className="gf-anim flex w-max" style={{ animation: `gf-marquee ${speed}s linear infinite` }}>
              <style>{'@keyframes gf-marquee{to{transform:translateX(-50%)}}'}</style>
              {[...names, ...names].map((name, i) => (
                <span
                  key={i}
                  aria-hidden={i >= names.length}
                  className={cn('flex h-16 items-center gap-3 border-r border-(--gf-line) px-8 font-display text-lg font-medium tracking-tight text-ds-muted', dashed && 'border-dashed')}
                >
                  <span className="size-1.5 bg-(--gf-accent)" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </GridSection>
  )
}
