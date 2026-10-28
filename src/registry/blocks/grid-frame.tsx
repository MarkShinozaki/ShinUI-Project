'use client'

import { createContext, useContext, type ComponentProps, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Grid Frame: the shared kit behind the shinUI "grid" blocks.
 *
 * Every grid block is a <GridSection>: a centered container framed by two
 * vertical rails, with hairline rules that run edge to edge across the page
 * and markers (plus signs or small squares) wherever lines meet. Lines are
 * opaque mixes of the theme colors, so borders that overlap never double up.
 *
 *   <GridSection edges="both">
 *     <GridCells className="sm:grid-cols-3">
 *       <GridCell>...</GridCell>
 *     </GridCells>
 *   </GridSection>
 */

export type GridAccent = 'primary' | 'accent' | 'highlight'
export type GridMarkerKind = 'plus' | 'square' | 'none'

interface GridSettings {
  marker: GridMarkerKind
  dashed: boolean
}

const GridContext = createContext<GridSettings>({ marker: 'plus', dashed: false })

const RAIL = 'color-mix(in oklab, var(--color-foreground) 11%, var(--color-background))'

function vars(accent: GridAccent) {
  return {
    '--gf-accent': `var(--color-${accent})`,
    '--gf-line': RAIL,
    '--gf-cross': 'color-mix(in oklab, var(--color-foreground) 38%, var(--color-background))',
    '--gf-tint': `color-mix(in oklab, var(--color-${accent}) 6%, var(--color-background))`,
  } as CSSProperties
}

const PATTERNS: Record<'dots' | 'lines' | 'grid', CSSProperties> = {
  dots: { backgroundImage: 'radial-gradient(var(--gf-cross) 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.35 },
  lines: { backgroundImage: 'repeating-linear-gradient(-45deg, var(--gf-line) 0 1px, transparent 1px 8px)' },
  grid: {
    backgroundImage: 'linear-gradient(var(--gf-line) 1px, transparent 1px), linear-gradient(90deg, var(--gf-line) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
  },
}

const KEYFRAMES = `
@keyframes gf-scan{from{top:-6rem}to{top:100%}}
@keyframes gf-bar{0%,100%{transform:scaleX(.35)}50%{transform:scaleX(1)}}
@keyframes gf-grow{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}
@keyframes gf-blink{to{opacity:.15}}
@media (prefers-reduced-motion:reduce){.gf-anim{animation:none!important}}
`

export interface GridSectionProps extends Omit<ComponentProps<'section'>, 'children'> {
  children?: ReactNode
  /** Which full-bleed rules to draw. Stack sections with "bottom" so lines never double. */
  edges?: 'both' | 'top' | 'bottom' | 'none'
  /** Shape drawn where lines meet. */
  marker?: GridMarkerKind
  /** Dashed rails and inner cell lines (Cloudflare-style). */
  dashed?: boolean
  /** Token color for hovers, markers and fills. */
  accent?: GridAccent
  /** Faint pattern in the gutters outside the rails. */
  pattern?: 'dots' | 'lines' | 'grid' | 'none'
  /** Classes for the inner railed container. */
  innerClassName?: string
}

/** A centered container with vertical rails and full-bleed hairline rules. */
export function GridSection({
  children,
  edges = 'both',
  marker = 'plus',
  dashed = false,
  accent = 'primary',
  pattern = 'none',
  className,
  innerClassName,
  style,
  ...props
}: GridSectionProps) {
  return (
    <GridContext.Provider value={{ marker, dashed }}>
      <section
        className={cn('relative overflow-x-clip text-foreground', className)}
        style={{ ...vars(accent), ...style }}
        {...props}
      >
        <style>{KEYFRAMES}</style>
        {pattern !== 'none' && <div aria-hidden className="pointer-events-none absolute inset-0" style={PATTERNS[pattern]} />}
        <div
          className={cn(
            'relative mx-auto flex w-full max-w-6xl flex-col border-x border-(--gf-line) bg-background',
            dashed && 'border-dashed',
            innerClassName,
          )}
        >
          {(edges === 'both' || edges === 'top') && <GridRule />}
          {children}
          {(edges === 'both' || edges === 'bottom') && <GridRule />}
        </div>
      </section>
    </GridContext.Provider>
  )
}

/** A marker centered on a point; x and y are CSS lengths inside the parent. */
export function GridMarker({ x, y, kind }: { x: string; y: string; kind?: GridMarkerKind }) {
  const settings = useContext(GridContext)
  const shape = kind ?? settings.marker
  if (shape === 'none') return null
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-20 size-[11px]"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      {shape === 'plus' ? (
        <>
          <span className="absolute top-0 left-[5px] h-full w-px bg-(--gf-cross)" />
          <span className="absolute top-[5px] left-0 h-px w-full bg-(--gf-cross)" />
        </>
      ) : (
        <span className="absolute inset-[2px] border border-(--gf-cross) bg-background" />
      )}
    </span>
  )
}

/** A full-bleed horizontal hairline with markers where it crosses the rails. */
export function GridRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('relative h-px shrink-0 bg-(--gf-line)', className)}>
      <span className="absolute top-0 right-full h-px w-screen bg-(--gf-line)" />
      <span className="absolute top-0 left-full h-px w-screen bg-(--gf-line)" />
      <GridMarker x="-0.5px" y="0.5px" />
      <GridMarker x="calc(100% + 0.5px)" y="0.5px" />
    </div>
  )
}

/**
 * A grid of bordered cells. Put it right after a GridRule (or a section edge)
 * and give it grid-cols-* classes. Empty slots show a hatched fill.
 */
export function GridCells({ className, style, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative -mr-px -mb-px grid grid-cols-1', className)}
      style={{ backgroundImage: 'repeating-linear-gradient(-45deg, var(--gf-line) 0 1px, transparent 1px 6px)', ...style }}
      {...props}
    />
  )
}

export interface GridCellProps extends ComponentProps<'div'> {
  /** Tint the cell, show corner brackets and an accent top line on hover. */
  interactive?: boolean
  /** Fill the cell with the accent color. */
  filled?: boolean
}

/** One bordered cell inside GridCells. Draws markers on its corners. */
export function GridCell({ interactive = false, filled = false, className, children, ...props }: GridCellProps) {
  const { dashed } = useContext(GridContext)
  return (
    <div
      className={cn(
        'group/cell relative flex flex-col border-r border-b border-(--gf-line) bg-background',
        dashed && 'border-dashed',
        interactive && 'transition-colors duration-300 hover:bg-(--gf-tint)',
        filled && 'bg-(--gf-accent) text-ds-primary-foreground hover:bg-(--gf-accent)',
        className,
      )}
      {...props}
    >
      <GridMarker x="-0.5px" y="-0.5px" />
      <GridMarker x="calc(100% - 0.5px)" y="calc(100% - 0.5px)" />
      {interactive && (
        <>
          <span aria-hidden className="pointer-events-none absolute inset-2 opacity-0 transition-opacity duration-300 group-hover/cell:opacity-100">
            <span className="absolute top-0 left-0 size-2.5 border-t border-l border-(--gf-accent)" />
            <span className="absolute top-0 right-0 size-2.5 border-t border-r border-(--gf-accent)" />
            <span className="absolute bottom-0 left-0 size-2.5 border-b border-l border-(--gf-accent)" />
            <span className="absolute right-0 bottom-0 size-2.5 border-r border-b border-(--gf-accent)" />
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-(--gf-accent) transition-transform duration-500 group-hover/cell:scale-x-100"
          />
        </>
      )}
      {children}
    </div>
  )
}

/** Monospace eyebrow: accent square, index number, short rule, label. */
export function GridLabel({ index, children, className }: { index?: string; children?: ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-ds-muted uppercase', className)}>
      <span className="size-1.5 bg-(--gf-accent)" />
      {index && <span className="text-foreground">{index}</span>}
      {index && <span className="h-px w-6 bg-(--gf-cross)" />}
      {children}
    </p>
  )
}

export interface GridButtonProps extends ComponentProps<'a'> {
  variant?: 'primary' | 'outline' | 'ghost'
}

/** A square-cornered link button that fits the grid look. */
export function GridButton({ variant = 'primary', className, children, ...props }: GridButtonProps) {
  return (
    <a
      className={cn(
        'group/btn inline-flex h-10 items-center gap-2 px-4 font-mono text-xs tracking-wider uppercase transition-colors',
        variant === 'primary' && 'bg-(--gf-accent) text-ds-primary-foreground hover:opacity-90',
        variant === 'outline' && 'border border-(--gf-cross) bg-background hover:border-(--gf-accent) hover:text-(--gf-accent)',
        variant === 'ghost' && 'text-ds-muted hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
      <span aria-hidden className="transition-transform group-hover/btn:translate-x-0.5">
        -&gt;
      </span>
    </a>
  )
}

/** The original shinUI grid mark: a 2x2 of squares, one in the accent color. */
export function GridLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={cn('size-5', className)}>
      <rect x="1" y="1" width="8" height="8" fill="currentColor" />
      <rect x="11" y="1" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="11" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="8" height="8" fill="var(--gf-accent)" />
    </svg>
  )
}
