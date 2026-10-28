'use client'

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * ORO Kit: shared pieces behind the shinUI "ORO" blocks.
 *
 * A warm research-lab look: chalk-white paper and sand panels, deep forest
 * green ink, extra-bold tight headlines over light body copy, a big blurred
 * sun glow (yellow to orange) drifting behind the hero, dark green data
 * panels in mono, numbered tabs, count-up numbers and a hand-drawn-feeling
 * line chart. Wrap blocks in <OroRoot> for the palette.
 */

const VARS = [
  '[--oro-paper:#fcfcfa] [--oro-sand:#f3f0e2] [--oro-ink:#0a3815] [--oro-soft:rgb(10_56_21/0.72)] [--oro-faint:rgb(10_56_21/0.48)] [--oro-line:rgb(10_56_21/0.12)]',
  '[--oro-panel:#0a3815] [--oro-panel-ink:#f3f1e6] [--oro-btn:#0a3815] [--oro-btn-ink:#fcfcfa] [--oro-amber:#f6a21a] [--oro-orange:#f2711c] [--oro-gold:#f1c039] [--oro-sky:#d6ebfb] [--oro-card:#ffffff]',
  'dark:[--oro-paper:#0b1a0f] dark:[--oro-sand:#102417] dark:[--oro-ink:#f3f1e6] dark:[--oro-soft:rgb(243_241_230/0.72)] dark:[--oro-faint:rgb(243_241_230/0.46)] dark:[--oro-line:rgb(243_241_230/0.12)]',
  'dark:[--oro-panel:#14301c] dark:[--oro-btn:#f6a21a] dark:[--oro-btn-ink:#0a3815] dark:[--oro-sky:#1d3a4f] dark:[--oro-card:#12261a]',
].join(' ')

const KEYFRAMES = `
@keyframes oro-drift{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-4%,3%) scale(1.06)}}
@keyframes oro-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.15);opacity:.85}}
@keyframes oro-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes oro-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes oro-blink{50%{opacity:.3}}
@media (prefers-reduced-motion:reduce){.oro-anim{animation:none!important}}
`

export function OroRoot({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(VARS, 'bg-(--oro-paper) font-sans font-light text-(--oro-ink) antialiased', className)} {...props}>
      <style>{KEYFRAMES}</style>
      {children}
    </div>
  )
}

/** Extra-bold, tight display type. */
export function OroHeading({ as: Tag = 'h2', className, children }: { as?: 'h1' | 'h2' | 'h3'; className?: string; children: ReactNode }) {
  return <Tag className={cn('font-display font-extrabold tracking-[-0.025em] text-balance', className)}>{children}</Tag>
}

/** Big blurred sun: gold core, orange ring, amber haze. */
export function SunGlow({ animate = true, className }: { animate?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute', className)}>
      <div
        className={cn('size-full rounded-full blur-3xl', animate && 'oro-anim [animation:oro-drift_14s_ease-in-out_infinite]')}
        style={{
          background:
            'radial-gradient(circle at 45% 50%, var(--oro-gold) 0%, var(--oro-amber) 30%, var(--oro-orange) 48%, color-mix(in oklab, var(--oro-orange) 30%, transparent) 62%, transparent 72%)',
        }}
      />
    </div>
  )
}

export function OroButton({ variant = 'solid', className, children, ...props }: ComponentProps<'a'> & { variant?: 'solid' | 'outline' | 'light' }) {
  return (
    <a
      href="#"
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-full px-6 font-display text-[15px] font-medium transition-[background-color,color,transform,box-shadow] duration-200 hover:-translate-y-px active:translate-y-0',
        variant === 'solid' && 'bg-(--oro-btn) text-(--oro-btn-ink) hover:shadow-[0_8px_20px_-8px_var(--oro-btn)]',
        variant === 'outline' && 'border border-(--oro-ink) text-(--oro-ink) hover:bg-(--oro-ink)/5',
        variant === 'light' && 'bg-(--oro-panel-ink) text-[#0a3815] hover:bg-white',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

/** Original mark: three dots growing into a pill. */
export function OroMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 34 14" className={cn('h-3.5 w-[34px]', className)} fill="currentColor" aria-hidden>
      <circle cx="3" cy="7" r="3" />
      <circle cx="11" cy="7" r="4.5" />
      <rect x="17" y="1" width="17" height="12" rx="6" />
    </svg>
  )
}

/** Counts up to `value` when scrolled into view. Shows the final number for reduced motion. */
export function CountUp({ value, className, duration = 1600 }: { value: number; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        setShown(Math.round(value * (1 - Math.pow(1 - t, 3))))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {shown.toLocaleString('en-US')}
    </span>
  )
}

/** A rising line with a soft gold fill under it. Draws itself in. */
export function GrowthChart({ points, animate = true, className, start = 'Jan', end = 'Now' }: { points: number[]; animate?: boolean; className?: string; start?: string; end?: string }) {
  const w = 600
  const h = 200
  const max = Math.max(...points)
  const xy = points.map((p, i) => [(i / (points.length - 1)) * w, h - (p / max) * (h - 12)] as const)
  const line = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return (
    <figure className={className}>
      <svg viewBox={`0 0 ${w} ${h + 2}`} className="w-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="oro-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--oro-gold)" stopOpacity="0.45" />
            <stop offset="1" stopColor="var(--oro-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="var(--oro-line)" />
        ))}
        <path d={`${line} L${w} ${h} L0 ${h} Z`} fill="url(#oro-fill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--oro-ink)"
          strokeWidth={2}
          pathLength={1}
          strokeDasharray={1}
          className={cn(animate && 'oro-anim [animation:oro-draw_2.4s_ease-out_both]')}
        />
        <circle cx={xy[xy.length - 1][0]} cy={xy[xy.length - 1][1]} r={4} fill="var(--oro-orange)" />
      </svg>
      <figcaption className="mt-2 flex justify-between font-mono text-[10px] text-(--oro-faint) uppercase">
        <span>{start}</span>
        <span>{end}</span>
      </figcaption>
    </figure>
  )
}

/** Dark green data panel with a mono header row of stats. */
export function DataPanel({ stats, children, className }: { stats: [string, string][]; children?: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl bg-(--oro-panel) font-mono text-(--oro-panel-ink) shadow-[0_30px_60px_-30px_rgb(10_56_21/0.6)]', className)}>
      <div className="grid border-b border-white/10" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0,1fr))` }}>
        {stats.map(([v, l]) => (
          <div key={l} className="px-3 py-3 text-center">
            <p className="text-[18px] font-semibold">{v}</p>
            <p className="text-[9px] tracking-wider text-white/55 uppercase">{l}</p>
          </div>
        ))}
      </div>
      {children}
    </div>
  )
}
