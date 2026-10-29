'use client'

import { useEffect, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Context Kit: shared pieces behind the shinUI "Context" blocks.
 *
 * A blueprint look: white page framed by vertical guide rails with plus
 * joints, light-weight headlines with one phrase in blue, double-bordered
 * cards (a pale blue frame around a white card), dotted blueprint panels with
 * dashed boxes, pill buttons, and streams of pixel dots drifting down the
 * page edges. Wrap blocks in <ContextRoot> for the palette.
 */

const VARS = [
  '[--cx-paper:#ffffff] [--cx-ink:#030712] [--cx-soft:rgb(3_7_18/0.62)] [--cx-faint:rgb(3_7_18/0.42)] [--cx-line:#e7e9ef] [--cx-rail:#e2e5ec]',
  '[--cx-blue:#3b73ed] [--cx-blue-ink:#ffffff] [--cx-frame:#d9e4fc] [--cx-tint:#f2f6fe] [--cx-dot:#c7d6f8] [--cx-night:#121316] [--cx-night-ink:#f4f4f5]',
  'dark:[--cx-paper:#0e0f12] dark:[--cx-ink:#f4f4f5] dark:[--cx-soft:rgb(244_244_245/0.66)] dark:[--cx-faint:rgb(244_244_245/0.42)] dark:[--cx-line:#24262b] dark:[--cx-rail:#23252a]',
  'dark:[--cx-blue:#5b8cf5] dark:[--cx-frame:#1f2d4f] dark:[--cx-tint:#141b2b] dark:[--cx-dot:#2a3a62] dark:[--cx-night:#08090b]',
].join(' ')

const KEYFRAMES = `
@keyframes cx-twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes cx-caret{50%{opacity:0}}
@keyframes cx-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes cx-marquee{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.cx-anim{animation:none!important}}
`

export function ContextRoot({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(VARS, 'bg-(--cx-paper) font-sans text-(--cx-ink) antialiased', className)} {...props}>
      <style>{KEYFRAMES}</style>
      {children}
    </div>
  )
}

/** "Give your *agents* the internet" → the starred phrase in blue. */
export function Accent({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') ? (
          <span key={i} className="text-(--cx-blue)">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

/** A plus mark centered on a rail joint. Parent must be relative. */
export function Joint({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 text-(--cx-faint)', className)}>
      <span className="absolute top-1/2 left-0 h-px w-full bg-current" />
      <span className="absolute top-0 left-1/2 h-full w-px bg-current" />
    </span>
  )
}

/**
 * A section framed by two vertical rails. `rule` draws a full-bleed line on
 * top with plus joints where it crosses the rails.
 */
export function RailSection({
  children,
  rule = true,
  className,
  innerClassName,
}: {
  children: ReactNode
  rule?: boolean
  className?: string
  innerClassName?: string
}) {
  return (
    <section className={cn('relative', rule && 'border-t border-(--cx-rail)', className)}>
      <div className={cn('relative mx-auto max-w-6xl border-x border-(--cx-rail)', innerClassName)}>
        {rule && (
          <>
            <Joint className="top-0 left-0" />
            <Joint className="top-0 left-full" />
          </>
        )}
        {children}
      </div>
    </section>
  )
}

/** Pale blue frame around a white card: the signature Context card. */
export function DoubleCard({ children, className, innerClassName }: { children: ReactNode; className?: string; innerClassName?: string }) {
  return (
    <div className={cn('rounded-[14px] border border-(--cx-frame) bg-(--cx-tint) p-1.5 transition-colors duration-300 hover:border-(--cx-blue)/50', className)}>
      <div className={cn('h-full rounded-[10px] border border-(--cx-line) bg-(--cx-paper) p-5', innerClassName)}>{children}</div>
    </div>
  )
}

/** Dotted blueprint well for illustrations. */
export function Blueprint({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-md border border-(--cx-frame)', className)}
      style={{ backgroundImage: 'radial-gradient(var(--cx-dot) 1px, transparent 1.2px)', backgroundSize: '8px 8px' }}
    >
      {children}
    </div>
  )
}

/** A dashed box with a tiny caption, used inside blueprints. */
export function DashedBox({ label, children, className }: { label?: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn('relative rounded-sm border border-dashed border-(--cx-blue)/60 bg-(--cx-paper)/85 px-3 py-2 font-mono text-[10px] text-(--cx-blue)', className)}>
      {label && <span className="mb-1 block text-[9px] text-(--cx-faint)">{label}</span>}
      {children}
    </div>
  )
}

type PillVariant = 'solid' | 'outline' | 'blue' | 'ghost'

export function Pill({ variant = 'solid', className, children, ...props }: ComponentProps<'a'> & { variant?: PillVariant }) {
  return (
    <a
      href="#"
      className={cn(
        'inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 active:scale-[.98]',
        variant === 'solid' && 'bg-(--cx-ink) text-(--cx-paper) hover:opacity-85',
        variant === 'outline' && 'border border-(--cx-line) bg-(--cx-paper) text-(--cx-ink) hover:border-(--cx-ink)/40',
        variant === 'blue' && 'border border-(--cx-blue)/50 text-(--cx-blue) hover:bg-(--cx-tint)',
        variant === 'ghost' && 'text-(--cx-soft) hover:text-(--cx-ink)',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-md border border-(--cx-line) px-2 py-0.5 text-[11px] text-(--cx-soft)', className)}>{children}</span>
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={cn('size-3', className)} fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
      <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" />
    </svg>
  )
}

/** Original mark: two offset blue squares. */
export function ContextMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 16" className={cn('h-4 w-[22px]', className)} aria-hidden>
      <rect x="0" y="5" width="11" height="11" rx="2" fill="var(--cx-blue)" opacity={0.55} />
      <rect x="8" y="0" width="14" height="14" rx="2.5" fill="var(--cx-blue)" />
    </svg>
  )
}

function rand(i: number, j: number) {
  const s = Math.sin(i * 91.7 + j * 47.3) * 43758.5453
  return s - Math.floor(s)
}

/**
 * Pixel dots drifting down a page edge in a diagonal band: rings, faint dots
 * and a few solid blue ones that twinkle. Pure SVG; pass `side` to mirror.
 */
export function PixelStream({
  side = 'left',
  rows = 64,
  cols = 16,
  animate = true,
  className,
}: {
  side?: 'left' | 'right'
  rows?: number
  cols?: number
  animate?: boolean
  className?: string
}) {
  const cells: ReactNode[] = []
  for (let r = 0; r < rows; r++) {
    const center = (r / rows) * cols * 0.9 + Math.sin(r / 7) * 2
    for (let c = 0; c < cols; c++) {
      const d = Math.abs(c - center)
      const n = rand(r, c)
      if (d > 3.2 + n * 2) continue
      const x = (side === 'left' ? c : cols - 1 - c) * 6 + 3
      const y = r * 6 + 3
      const solid = n > 0.88
      cells.push(
        solid ? (
          <circle
            key={`${r}-${c}`}
            cx={x}
            cy={y}
            r={1.7}
            fill="var(--cx-blue)"
            className={cn(animate && 'cx-anim')}
            style={animate ? { animation: `cx-twinkle ${2 + n * 3}s ease-in-out ${n * -5}s infinite` } : undefined}
          />
        ) : (
          <circle key={`${r}-${c}`} cx={x} cy={y} r={1.6} fill={n > 0.5 ? 'var(--cx-dot)' : 'none'} stroke="var(--cx-dot)" strokeWidth={0.7} />
        ),
      )
    }
  }
  return (
    <svg aria-hidden viewBox={`0 0 ${cols * 6} ${rows * 6}`} className={cn('pointer-events-none h-full w-auto', className)} preserveAspectRatio="xMidYMin slice">
      {cells}
    </svg>
  )
}

/** Cycles through "|"-separated phrases with a typing caret (static with reduced motion). */
export function Typewriter({ text, className }: { text: string; className?: string }) {
  const [state, setState] = useState({ i: 0, n: 0, back: false })
  useEffect(() => {
    const phrases = text.split('|')
    if (phrases.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setState(({ i, n, back }) => {
        const full = phrases[i % phrases.length]
        if (!back && n < full.length) return { i, n: n + 1, back }
        if (!back) return { i, n: n + 6, back: n > full.length + 30 }
        if (n > full.length) return { i, n: full.length, back }
        if (n > 0) return { i, n: n - 2, back }
        return { i: i + 1, n: 0, back: false }
      })
    }, 55)
    return () => window.clearInterval(id)
  }, [text])
  const phrases = text.split('|')
  const full = phrases[state.i % phrases.length] ?? ''
  const shown = state.n === 0 && !state.back && state.i === 0 ? full : full.slice(0, Math.min(state.n, full.length))
  return (
    <span className={className}>
      {shown}
      <span className="cx-anim ml-px inline-block h-[1.1em] w-px translate-y-[0.2em] bg-current [animation:cx-caret_1s_steps(1)_infinite]" />
    </span>
  )
}
