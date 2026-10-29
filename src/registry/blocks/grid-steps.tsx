'use client'

import { GridCell, GridCells, GridLabel, GridRule, GridSection, type GridAccent, type GridMarkerKind } from '@/registry/blocks/grid-frame'
import { cn } from '@/lib/utils'

export interface GridStepsProps {
  /** cards: three bordered step cells with code. rail: a vertical timeline. pricing: three plan cells. */
  variant?: 'cards' | 'rail' | 'pricing'
  index?: string
  eyebrow?: string
  title?: string
  accent?: GridAccent
  marker?: GridMarkerKind
  dashed?: boolean
  edges?: 'both' | 'top' | 'bottom' | 'none'
  className?: string
}

const STEPS = [
  { title: 'Pick a block', body: 'Browse the gallery and tune props in the live playground.', code: 'open /blocks/grid-hero' },
  { title: 'Install it', body: 'One registry command copies the file and its tokens into your app.', code: 'npx shadcn add shinui/grid-hero' },
  { title: 'Make it yours', body: 'It is plain React and Tailwind, so rename, restyle or rewrite freely.', code: 'git commit -m "my hero"' },
]

const PLANS = [
  { name: 'Starter', price: '$0', note: 'forever', perks: ['All blocks', 'Light + dark', 'Registry installs'], cta: 'Start free' },
  { name: 'Studio', price: '$12', note: 'per month', perks: ['Everything in Starter', 'Figma kit', 'Early drops', 'Priority requests'], cta: 'Go Studio', featured: true },
  { name: 'Team', price: '$39', note: 'per month', perks: ['Everything in Studio', '5 seats', 'Private registry'], cta: 'Talk to us' },
]

/** Steps, a timeline or pricing tiers, all in bordered grid cells. */
export function GridSteps({
  variant = 'cards',
  index = '03',
  eyebrow = 'How it works',
  title = 'From gallery to production in three moves',
  accent = 'primary',
  marker = 'plus',
  dashed = false,
  edges = 'both',
  className,
}: GridStepsProps) {
  const pricing = variant === 'pricing'
  return (
    <GridSection edges={edges} marker={marker} dashed={dashed} accent={accent} className={className}>
      <header className="px-6 pt-16 pb-12 text-center sm:px-10">
        <GridLabel index={index} className="justify-center">
          {pricing ? 'Pricing' : eyebrow}
        </GridLabel>
        <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {pricing ? 'Free to start, simple to grow' : title}
        </h2>
      </header>
      <GridRule />

      {variant === 'cards' && (
        <GridCells className="md:grid-cols-3">
          {STEPS.map((s, i) => (
            <GridCell key={s.title} interactive className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center border border-(--gf-accent) font-mono text-xs text-(--gf-accent)">{i + 1}</span>
                <span className="h-px flex-1 border-t border-dashed border-(--gf-cross)" />
                <span className="font-mono text-[10px] tracking-wider text-ds-muted uppercase">step</span>
              </div>
              <h3 className="mt-8 font-display text-xl font-medium tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-pretty text-ds-muted">{s.body}</p>
              <code className="mt-8 block border border-(--gf-line) bg-(--gf-tint) px-3 py-2 font-mono text-[12px]">
                <span className="text-(--gf-accent)">$</span> {s.code}
              </code>
            </GridCell>
          ))}
        </GridCells>
      )}

      {variant === 'rail' && (
        <GridCells>
          {STEPS.map((s, i) => (
            <GridCell key={s.title} interactive className="grid gap-4 px-6 py-8 sm:grid-cols-[6rem_1fr_1fr] sm:px-10">
              <div className="relative flex sm:justify-center">
                <span className="relative z-10 grid size-10 place-items-center bg-(--gf-accent) font-mono text-sm text-ds-primary-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {i < STEPS.length - 1 && (
                  <span aria-hidden className="absolute top-10 -bottom-8 left-5 hidden border-l border-dashed border-(--gf-accent)/60 sm:left-1/2 sm:block" />
                )}
              </div>
              <div>
                <h3 className="font-display text-xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-pretty text-ds-muted">{s.body}</p>
              </div>
              <code className="self-start border border-(--gf-line) px-3 py-2 font-mono text-[12px]">
                <span className="text-(--gf-accent)">$</span> {s.code}
              </code>
            </GridCell>
          ))}
        </GridCells>
      )}

      {pricing && (
        <GridCells className="md:grid-cols-3">
          {PLANS.map((p) => (
            <GridCell key={p.name} interactive={!p.featured} filled={p.featured} className="p-6 sm:p-8">
              <div className="flex items-center justify-between font-mono text-[11px] tracking-wider uppercase">
                <span>{p.name}</span>
                {p.featured && <span className="border border-current/40 px-1.5 py-0.5 text-[10px]">popular</span>}
              </div>
              <p className="mt-8 flex items-baseline gap-2">
                <span className="font-display text-5xl font-semibold tracking-tight">{p.price}</span>
                <span className={cn('font-mono text-xs', p.featured ? 'opacity-80' : 'text-ds-muted')}>{p.note}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-2.5 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5">
                    <span className={cn('font-mono text-xs', !p.featured && 'text-(--gf-accent)')}>+</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={cn(
                  'mt-10 flex h-10 items-center justify-center font-mono text-xs tracking-wider uppercase transition-colors',
                  p.featured ? 'bg-background text-foreground hover:opacity-90' : 'border border-(--gf-cross) hover:border-(--gf-accent) hover:text-(--gf-accent)',
                )}
              >
                {p.cta}
              </a>
            </GridCell>
          ))}
        </GridCells>
      )}
    </GridSection>
  )
}
