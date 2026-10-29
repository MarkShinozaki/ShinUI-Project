'use client'

import type { ReactNode } from 'react'
import { GridCell, GridCells, GridLabel, GridRule, GridSection, type GridAccent, type GridMarkerKind } from '@/registry/blocks/grid-frame'
import { cn } from '@/lib/utils'

type IconName = 'tokens' | 'sliders' | 'terminal' | 'contrast' | 'pulse' | 'unlock'

export interface GridFeature {
  title: string
  description: string
  /** Short monospace tag in the cell corner, e.g. "cli". */
  tag?: string
  icon?: IconName
}

export interface GridFeaturesProps {
  /** Section number shown before the eyebrow, e.g. "02". */
  index?: string
  eyebrow?: string
  title?: string
  description?: string
  ctaLabel?: string
  features?: GridFeature[]
  /** bento: a 2x2 lead cell with a live token panel. columns: an even grid. list: numbered full-width rows. */
  variant?: 'bento' | 'columns' | 'list'
  /** Columns on large screens for bento/columns (drops to 2, then 1). */
  columns?: number
  /** Fill one cell with the accent color (Cloudflare-style). */
  filledCell?: boolean
  /** Shape drawn where lines meet. */
  marker?: GridMarkerKind
  /** Dashed rails and lines between cells. */
  dashed?: boolean
  /** A slow scanning line sweeping down the grid. */
  scan?: boolean
  /** Which token color drives icons, hovers and the scan line. */
  accent?: GridAccent
  /** Cell padding. */
  density?: 'comfortable' | 'compact'
  /** Faint pattern in the gutters outside the rails. */
  pattern?: 'dots' | 'lines' | 'grid' | 'none'
  edges?: 'both' | 'top' | 'bottom' | 'none'
  className?: string
}

const DEFAULT_FEATURES: GridFeature[] = [
  {
    title: 'Tokens first',
    description: 'Every color, radius and font is a CSS variable, so one edit restyles the whole set.',
    tag: 'core',
    icon: 'tokens',
  },
  {
    title: 'Live playground',
    description: 'Tweak props and watch the preview change before you copy a single line.',
    tag: 'dx',
    icon: 'sliders',
  },
  {
    title: 'One-line installs',
    description: 'Pull any piece into your app with a single registry command.',
    tag: 'cli',
    icon: 'terminal',
  },
  {
    title: 'Light and dark',
    description: 'Both themes are designed side by side, not bolted on afterwards.',
    tag: 'theme',
    icon: 'contrast',
  },
  {
    title: 'Motion that rests',
    description: 'Animations pause on their own for people who prefer reduced motion.',
    tag: 'a11y',
    icon: 'pulse',
  },
  {
    title: 'Zero lock-in',
    description: 'Plain React and Tailwind files that you own and can rewrite.',
    tag: 'oss',
    icon: 'unlock',
  },
]

const COLS: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

const ICONS: Record<IconName, ReactNode> = {
  tokens: (
    <>
      <circle cx="7" cy="7" r="3" />
      <circle cx="17" cy="7" r="3" />
      <circle cx="7" cy="17" r="3" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  sliders: <path d="M4 7h10m4 0h2M4 17h4m4 0h8M14 4v6M8 14v6" />,
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 10 3 2-3 2m5 1h5" />
    </>
  ),
  contrast: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
    </>
  ),
  pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
  unlock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 7.5-2" />
    </>
  ),
}

function Icon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      {ICONS[name]}
    </svg>
  )
}

/** The 2x2 bento visual: live token swatches read from the current theme. */
function TokenPanel() {
  const swatches = ['primary', 'accent', 'highlight', 'foreground', 'muted']
  return (
    <div
      className="relative mt-6 flex-1 overflow-hidden border border-(--gf-line) bg-background"
      style={{
        backgroundImage: 'radial-gradient(var(--gf-line) 1px, transparent 1px)',
        backgroundSize: '12px 12px',
      }}
    >
      <div className="flex items-center justify-between border-b border-(--gf-line) bg-background px-3 py-2 font-mono text-[10px] tracking-wider text-ds-muted uppercase">
        <span>tokens.css</span>
        <span className="flex items-center gap-1.5">
          <span className={'gf-anim size-1.5 bg-(--gf-accent)'} style={{ animation: 'gf-blink 1.6s steps(2) infinite' }} />
          live
        </span>
      </div>
      <div className="grid gap-px p-3 font-mono text-[11px]">
        {swatches.map((name, i) => (
          <div key={name} className="flex items-center gap-3 bg-background/80 py-1">
            <span className="size-4 shrink-0 border border-(--gf-line)" style={{ background: `var(--color-${name})` }} />
            <span className="text-foreground">--ds-{name}</span>
            <span className="h-px flex-1 border-t border-dotted border-(--gf-cross)" />
            <span
              className={'gf-anim h-1.5 origin-left bg-(--gf-accent)/70'}
              style={{ width: `${28 + ((i * 37) % 44)}px`, animation: `gf-bar 3.2s ${i * 0.25}s ease-in-out infinite` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * A boxy feature section on the Grid Frame kit: hairline cells, markers at
 * the joints, monospace labels, hover-lit cells and an optional scan line.
 */
export function GridFeatures({
  index = '02',
  eyebrow = 'Toolkit',
  title = 'Everything snaps to the grid',
  description = 'A small set of rules behind every shinUI piece, so things you mix and match still look like they belong together.',
  ctaLabel = 'Browse the library',
  features = DEFAULT_FEATURES,
  variant = 'bento',
  columns = 3,
  filledCell = false,
  marker = 'plus',
  dashed = false,
  scan = true,
  accent = 'primary',
  density = 'comfortable',
  pattern = 'dots',
  edges = 'both',
  className,
}: GridFeaturesProps) {
  const cols = COLS[Math.min(4, Math.max(2, Math.round(columns)))]
  const bento = variant === 'bento'
  const pad = density === 'compact' ? 'p-4 sm:p-5' : 'p-6 sm:p-8'

  return (
    <GridSection edges={edges} marker={marker} dashed={dashed} accent={accent} pattern={pattern} className={className}>
      <header className="grid gap-8 px-6 pt-16 pb-12 sm:px-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <GridLabel index={index}>{eyebrow}</GridLabel>
          <h2 className="mt-5 max-w-xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl">{title}</h2>
          <p className="mt-4 max-w-lg text-base text-pretty text-ds-muted">{description}</p>
        </div>
        <dl className="grid min-w-56 gap-1.5 font-mono text-[11px] tracking-wider text-ds-muted uppercase">
          {[
            ['modules', String(features.length).padStart(2, '0')],
            ['themes', '02'],
            ['runtime deps', '00'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline gap-2">
              <dt>{k}</dt>
              <span className="flex-1 border-b border-dotted border-(--gf-cross)" />
              <dd className="text-foreground tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </header>
      <GridRule />

      <div className="relative">
        {variant === 'list' ? (
          <GridCells>
            {features.map((f, i) => (
              <GridCell
                key={f.title}
                interactive
                filled={filledCell && i === 1}
                className={cn('grid items-center gap-x-8 gap-y-2 sm:grid-cols-[4rem_14rem_1fr_auto]', density === 'compact' ? 'px-5 py-4' : 'px-6 py-6 sm:px-10')}
              >
                <span className="font-mono text-2xl tabular-nums opacity-40">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="flex items-center gap-3 font-display text-lg font-medium tracking-tight">
                  <span className={cn(filledCell && i === 1 ? '' : 'text-(--gf-accent)')}>
                    <Icon name={f.icon ?? 'tokens'} />
                  </span>
                  {f.title}
                </h3>
                <p className={cn('text-sm text-pretty', filledCell && i === 1 ? 'opacity-85' : 'text-ds-muted')}>{f.description}</p>
                {f.tag && (
                  <span className="hidden border border-current/20 px-1.5 py-0.5 font-mono text-[10px] tracking-wider uppercase opacity-70 sm:block">{f.tag}</span>
                )}
              </GridCell>
            ))}
          </GridCells>
        ) : (
          <GridCells className={cn('sm:grid-cols-2', cols)}>
            {features.map((f, i) => {
              const hero = bento && i === 0
              const filled = filledCell && i === (bento ? 2 : 1)
              return (
                <GridCell
                  key={f.title}
                  interactive
                  filled={filled}
                  className={cn('group', pad, hero && 'sm:col-span-2', hero && columns >= 3 && 'lg:row-span-2')}
                >
                  <div className={cn('flex items-center justify-between font-mono text-[10px] tracking-wider uppercase', filled ? 'opacity-80' : 'text-ds-muted')}>
                    <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    {f.tag && (
                      <span
                        className={cn(
                          'border px-1.5 py-0.5 transition-colors',
                          filled ? 'border-current/30' : 'border-(--gf-line) group-hover:border-(--gf-accent) group-hover:text-(--gf-accent)',
                        )}
                      >
                        {f.tag}
                      </span>
                    )}
                  </div>
                  <div
                    className={cn(
                      'mt-6 grid size-11 place-items-center border transition-colors',
                      filled ? 'border-current/30' : 'border-(--gf-line) bg-background text-(--gf-accent) group-hover:border-(--gf-accent)',
                    )}
                    style={filled ? undefined : { backgroundImage: 'repeating-linear-gradient(-45deg, var(--gf-line) 0 1px, transparent 1px 5px)' }}
                  >
                    <span className={cn('grid size-8 place-items-center', !filled && 'bg-background')}>
                      <Icon name={f.icon ?? 'tokens'} />
                    </span>
                  </div>
                  <h3 className={cn('mt-6 font-display font-medium tracking-tight', hero ? 'text-2xl' : 'text-lg')}>{f.title}</h3>
                  <p className={cn('mt-2 text-sm text-pretty', filled ? 'opacity-85' : 'text-ds-muted', hero && 'max-w-md sm:text-base')}>{f.description}</p>
                  {hero && <TokenPanel />}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute right-5 bottom-5 font-mono text-sm opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100',
                      !filled && 'text-(--gf-accent)',
                    )}
                  >
                    -&gt;
                  </span>
                </GridCell>
              )
            })}
          </GridCells>
        )}

        {scan && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <div
              className="gf-anim absolute inset-x-0 h-24 border-b border-(--gf-accent)/50"
              style={{
                background: 'linear-gradient(to bottom, transparent, color-mix(in oklab, var(--gf-accent) 9%, transparent))',
                animation: 'gf-scan 7s linear infinite',
              }}
            />
          </div>
        )}
      </div>
      <GridRule />

      <footer className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 font-mono text-[11px] tracking-wider text-ds-muted uppercase sm:px-10">
        <span>Built on tokens / light + dark</span>
        <a href="#" className="group inline-flex items-center gap-2 text-foreground transition-colors hover:text-(--gf-accent)">
          {ctaLabel}
          <span className="transition-transform group-hover:translate-x-0.5">-&gt;</span>
        </a>
      </footer>
    </GridSection>
  )
}
