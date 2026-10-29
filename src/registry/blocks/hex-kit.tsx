'use client'

import { useEffect, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from 'react'
import { cn } from '@/lib/utils'

/** Hex palette. Every colour lives in a --hx-* var so a theme can override it. */
const VARS = {
  '--hx-bg': '#f4f1ec',
  '--hx-paper': '#fbfaf7',
  '--hx-ink': '#1d1a2b',
  '--hx-dim': '#5d5869',
  '--hx-faint': '#9a95a3',
  '--hx-line': '#e2ddd5',
  '--hx-grid': 'rgba(29,26,43,0.045)',
  '--hx-accent': '#d9727b',
  '--hx-accent-soft': '#f7e3e3',
  '--hx-violet': '#6e62c9',
  '--hx-violet-2': '#9a90e0',
  '--hx-violet-3': '#c9c3f0',
  '--hx-mint': '#4fb38a',
} as React.CSSProperties

const KEYFRAMES = `
@keyframes hx-spin { to { transform: rotate(360deg) } }
@keyframes hx-twinkle { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
@keyframes hx-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
@media (prefers-reduced-motion: reduce) {
  .hx-anim, .hx-anim * { animation: none !important; transition: none !important }
  .hx-move { transform: none !important }
}`

export function HexRoot({ className, style, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('hx-anim bg-(--hx-bg) font-sans text-(--hx-ink) antialiased', className)}
      style={{ ...VARS, ...style }}
      {...rest}
    >
      <style>{KEYFRAMES}</style>
      {children}
    </div>
  )
}

/** Faint square grid, like graph paper. */
export function GridPaper({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage: 'linear-gradient(var(--hx-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hx-grid) 1px, transparent 1px)',
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  )
}

export function Mono({ className, ...rest }: ComponentProps<'span'>) {
  return <span className={cn('font-mono text-[11px] tracking-[0.14em] uppercase', className)} {...rest} />
}

/** Italic serif accent used inside headlines. */
export function Serif({ className, ...rest }: ComponentProps<'span'>) {
  return <span className={cn('font-serif font-normal italic tracking-[-0.02em]', className)} {...rest} />
}

/** Original mark: three stacked offset bars inside a rounded hexagon. */
export function HexMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('size-7', className)}>
      <path d="M16 2.5 28 9.25v13.5L16 29.5 4 22.75V9.25z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M10 12.5h9M12.5 16h9M10 19.5h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/** Small corner ticks around a box. */
export function Brackets({ className }: { className?: string }) {
  const c = 'absolute size-1.5 border-(--hx-accent)'
  return (
    <span aria-hidden className={cn('pointer-events-none absolute -inset-1', className)}>
      <span className={cn(c, 'top-0 left-0 border-t border-l')} />
      <span className={cn(c, 'top-0 right-0 border-t border-r')} />
      <span className={cn(c, 'bottom-0 left-0 border-b border-l')} />
      <span className={cn(c, 'right-0 bottom-0 border-r border-b')} />
    </span>
  )
}

export function HexButton({ variant = 'primary', className, children, ...rest }: ComponentProps<'button'> & { variant?: 'primary' | 'ghost' }) {
  return (
    <button
      type="button"
      className={cn(
        'group relative inline-flex h-10 items-center rounded-[3px] border px-4 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-(--hx-violet)',
        variant === 'primary'
          ? 'border-(--hx-accent) bg-(--hx-accent-soft) text-(--hx-ink) hover:bg-[#f2d2d3]'
          : 'border-(--hx-line) bg-(--hx-paper) text-(--hx-ink) hover:border-(--hx-faint)',
        className
      )}
      {...rest}
    >
      {variant === 'primary' && <Brackets className="opacity-60 transition-opacity group-hover:opacity-100" />}
      {children}
    </button>
  )
}

/** Inline rounded chip with a tinted icon well. */
export function Chip({ icon, tint = 'var(--hx-violet)', children }: { icon: ReactNode; tint?: string; children: ReactNode }) {
  return (
    <span className="mx-1 inline-flex translate-y-[-2px] items-center gap-1.5 rounded-full border border-(--hx-line) bg-(--hx-paper) py-0.5 pr-3 pl-1 align-middle text-[0.8em] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <span className="grid size-[1.4em] place-items-center rounded-full" style={{ background: `color-mix(in oklab, ${tint} 16%, transparent)`, color: tint }}>
        {icon}
      </span>
      {children}
    </span>
  )
}

/** Paper card with a soft edge. */
export function Card({ className, ...rest }: ComponentProps<'div'>) {
  return <div className={cn('rounded-md border border-(--hx-line) bg-(--hx-paper) shadow-[0_1px_2px_rgba(29,26,43,0.05),0_12px_30px_-18px_rgba(29,26,43,0.25)]', className)} {...rest} />
}

function scrollParent(el: HTMLElement) {
  let sp: HTMLElement | null = el.parentElement
  while (sp && !/(auto|scroll)/.test(getComputedStyle(sp).overflowY)) sp = sp.parentElement
  return sp
}

/**
 * Writes scroll progress (0–1) to a CSS var on the element.
 * 'cross' runs from the element entering the bottom of the scroller to leaving the top;
 * 'through' runs while a tall element scrolls past a pinned child.
 * Works inside any scrolling ancestor, falling back to the window.
 */
export function useScrollVar<T extends HTMLElement>(ref: RefObject<T | null>, { name = '--hx-p', mode = 'cross' }: { name?: string; mode?: 'cross' | 'through' } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const sp = scrollParent(el)
    const target: HTMLElement | Window = sp ?? window
    let raf = 0
    const update = () => {
      raf = 0
      const top = sp ? sp.getBoundingClientRect().top : 0
      const vh = sp ? sp.clientHeight : window.innerHeight
      const r = el.getBoundingClientRect()
      const rel = r.top - top
      const p = mode === 'cross' ? (vh - rel) / (vh + r.height) : r.height > vh ? -rel / (r.height - vh) : 0
      el.style.setProperty(name, Math.min(1, Math.max(0, p)).toFixed(4))
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    queue()
    target.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(raf)
      target.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [ref, name, mode])
}

/** True once the scroller (or window) has moved past `threshold` px. */
export function useScrolled<T extends HTMLElement>(ref: RefObject<T | null>, threshold = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const sp = scrollParent(el)
    const target: HTMLElement | Window = sp ?? window
    let raf = 0
    const update = () => {
      raf = 0
      setScrolled((sp ? sp.scrollTop : window.scrollY) > threshold)
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    queue()
    target.addEventListener('scroll', queue, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      target.removeEventListener('scroll', queue)
    }
  }, [ref, threshold])
  return scrolled
}

/** True once the element has come into view (stays true). */
export function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])
  return [ref, seen] as const
}
