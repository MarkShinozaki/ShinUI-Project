'use client'

import { useEffect, useRef, type ComponentProps, type ReactNode, type RefObject } from 'react'
import { cn } from '@/lib/utils'

/**
 * Scout Kit: shared pieces behind the shinUI "Scout" blocks.
 *
 * A field-ops look: near-black ground, pale lichen text, one signal-green
 * accent, mono labels, hairline grid lines with + marks where they cross, and
 * a drawn terrain scene with a HUD reticle instead of photography. Wrap
 * blocks in <ScoutRoot>.
 */

const VARS = [
  '[--sc-bg:#0a0b0d] [--sc-panel:#121418] [--sc-fg:#e6eae1] [--sc-dim:rgb(230_234_225/0.58)] [--sc-faint:rgb(230_234_225/0.34)]',
  '[--sc-line:rgb(230_234_225/0.12)] [--sc-accent:#3fe0a0] [--sc-accent-ink:#06150f]',
  '[--sc-ridge-1:#1d2a22] [--sc-ridge-2:#16201a] [--sc-ridge-3:#101712] [--sc-sky:#24302a]',
].join(' ')

const KEYFRAMES = `
@keyframes sc-pulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
@keyframes sc-blink{50%{opacity:0}}
@keyframes sc-scan{from{transform:translateY(-100%)}to{transform:translateY(100%)}}
@media (prefers-reduced-motion:reduce){.sc-anim{animation:none!important;transition:none!important}.sc-move{transform:none!important}}
`

export function ScoutRoot({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(VARS, 'bg-(--sc-bg) font-sans text-(--sc-fg) antialiased selection:bg-(--sc-accent) selection:text-(--sc-accent-ink)', className)} {...props}>
      <style>{KEYFRAMES}</style>
      {children}
    </div>
  )
}

export function Mono({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn('font-mono text-[10.5px] tracking-[0.14em] uppercase', className)}>{children}</span>
}

/** Original mark: a bracketed square with an upward chevron. */
export function ScoutMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('size-6', className)}>
      <path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 15 12 9.5l4.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export function ScoutButton({ variant = 'outline', className, children, ...props }: ComponentProps<'a'> & { variant?: 'outline' | 'accent' }) {
  return (
    <a
      href="#"
      className={cn(
        'group inline-flex h-9 items-stretch font-mono text-[10.5px] tracking-[0.14em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--sc-accent)',
        className,
      )}
      {...props}
    >
      <span className={cn('flex items-center border px-4 transition-colors', variant === 'accent' ? 'border-(--sc-accent) bg-(--sc-accent) text-(--sc-accent-ink)' : 'border-(--sc-line) bg-(--sc-bg)/60 group-hover:border-(--sc-fg)')}>{children}</span>
      <span className="grid w-9 place-items-center bg-(--sc-accent) text-(--sc-accent-ink) transition-[width] group-hover:w-11" aria-hidden>
        ↗
      </span>
    </a>
  )
}

/** A small + where grid lines cross. Position it with className. */
export function Cross({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 text-(--sc-faint)', className)}>
      <span className="absolute inset-x-0 top-1/2 h-px bg-current" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-current" />
    </span>
  )
}

/** A hairline-bordered band with + marks at its four corners. */
export function GridBand({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('relative border-y border-(--sc-line)', className)}>
      <Cross className="top-0 left-6" />
      <Cross className="top-0 left-[calc(100%-24px)]" />
      <Cross className="top-full left-6" />
      <Cross className="top-full left-[calc(100%-24px)]" />
      {children}
    </div>
  )
}

function ridge(seed: number, base: number, amp: number) {
  let d = `M0 600 L0 ${base}`
  for (let x = 0; x <= 1200; x += 20) {
    const y = base - amp * (Math.sin(x / (90 + seed * 13) + seed) * 0.55 + Math.sin(x / (37 + seed * 5) + seed * 2) * 0.3 + Math.sin(x / 11 + seed) * 0.08)
    d += ` L${x} ${y.toFixed(1)}`
  }
  return d + ' L1200 600 Z'
}
const RIDGES = [ridge(1, 300, 70), ridge(2, 380, 90), ridge(3, 470, 80)]

/**
 * A drawn terrain scene: hazy sky, three ridgelines, scanlines and a slow
 * scan bar. `parallax` (0 to 1, usually a scroll value) shifts the layers.
 */
export function Terrain({ parallaxVar = '--sc-p', animate = true, className }: { parallaxVar?: string; animate?: boolean; className?: string }) {
  const layer = (i: number) => ({ transform: `translateY(calc(var(${parallaxVar}, 0) * ${(i + 1) * -40}px))` })
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 60% at 70% 20%, var(--sc-sky), var(--sc-bg) 70%)' }} />
      <svg viewBox="0 0 1200 600" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {RIDGES.map((d, i) => (
          <path key={i} d={d} className="sc-move" style={{ ...layer(i), fill: `var(--sc-ridge-${i + 1})` }} />
        ))}
      </svg>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgb(0 0 0/0.5) 0 1px, transparent 1px 3px)' }} />
      {animate && <div className="sc-anim absolute inset-x-0 h-1/3 [animation:sc-scan_7s_linear_infinite]" style={{ background: 'linear-gradient(180deg, transparent, rgb(63 224 160/0.06), transparent)' }} />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, var(--sc-bg))' }} />
    </div>
  )
}

/** A HUD reticle with a label, gently pulsing. */
export function Reticle({ label = 'TRK 04', animate = true, className }: { label?: string; animate?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute size-24 text-(--sc-accent)', className)}>
      <div className={cn('absolute inset-0', animate && 'sc-anim [animation:sc-pulse_2.6s_ease-in-out_infinite]')}>
        <ScoutMark className="size-full opacity-80 [&_path:last-child]:hidden" />
      </div>
      <span className="absolute top-1/2 left-1/2 size-1.5 -translate-1/2 rounded-full bg-current" />
      <Mono className="absolute -bottom-5 left-0 text-[9px] text-(--sc-accent)">{label}</Mono>
    </div>
  )
}

/**
 * Writes a 0 to 1 scroll value into a CSS variable on the element, measured
 * against the nearest scrolling ancestor (a preview frame) or the window.
 * mode "through": 0 when the element's top reaches the top, 1 when its bottom
 * reaches the bottom (for pinned sections). mode "exit": 0 at rest, 1 when
 * it has scrolled fully out the top (for parallax). `onChange` gets the value.
 */
export function useScrollVar<T extends HTMLElement>(ref: RefObject<T | null>, { name = '--sc-p', mode = 'through', onChange }: { name?: string; mode?: 'through' | 'exit'; onChange?: (p: number) => void } = {}) {
  const cb = useRef(onChange)
  useEffect(() => {
    cb.current = onChange
  })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let sp: HTMLElement | null = el.parentElement
    while (sp && !/(auto|scroll)/.test(getComputedStyle(sp).overflowY)) sp = sp.parentElement
    const target: HTMLElement | Window = sp ?? window
    let raf = 0
    const update = () => {
      raf = 0
      const top = sp ? sp.getBoundingClientRect().top : 0
      const vh = sp ? sp.clientHeight : window.innerHeight
      const r = el.getBoundingClientRect()
      const span = mode === 'exit' ? r.height : r.height - vh
      const p = span > 0 ? Math.min(1, Math.max(0, (top - r.top) / span)) : 0
      el.style.setProperty(name, p.toFixed(4))
      cb.current?.(p)
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    target.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(raf)
      target.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [ref, name, mode])
}
