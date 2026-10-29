'use client'

import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { cn } from '@/lib/utils'

/** Aside palette. Every colour lives in an --as-* var so a theme can override it. */
const VARS = {
  '--as-bg': '#ffffff',
  '--as-soft': '#f7f7f8',
  '--as-ink': '#0b0c0e',
  '--as-dim': '#6b6f76',
  '--as-faint': '#b4b7bc',
  '--as-line': '#ececee',
  '--as-blue': '#1f6bff',
  '--as-sky-1': '#7fd8ff',
  '--as-sky-2': '#c6ecff',
  '--as-sky-3': '#eef9ff',
} as CSSProperties

const KEYFRAMES = `
@keyframes as-drift { from { transform: translateX(-4%) } to { transform: translateX(4%) } }
@keyframes as-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
@keyframes as-caret { 50% { opacity: 0 } }
@keyframes as-spin { to { transform: rotate(360deg) } }
@media (prefers-reduced-motion: reduce) {
  .as-anim, .as-anim * { animation: none !important; transition: none !important }
  .as-move { transform: none !important }
}`

export function AsideRoot({ className, style, children, ...rest }: ComponentProps<'div'>) {
  return (
    <div className={cn('as-anim bg-(--as-bg) font-sans text-(--as-ink) antialiased', className)} style={{ ...VARS, ...style }} {...rest}>
      <style>{KEYFRAMES}</style>
      {children}
    </div>
  )
}

/** Original mark: a ring crossed by a soft wave. */
export function AsideMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('size-6', className)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 14.5c2.2-3 4.3-3 6.5 0s4.3 3 6.5 0" />
    </svg>
  )
}

/** Sky gradient with drifting cloud puffs, drawn with gradients only. */
export function Sky({ className, animate = true }: { className?: string; animate?: boolean }) {
  const puffs = [
    { l: '-6%', t: '12%', w: 46, o: 0.9 },
    { l: '62%', t: '4%', w: 52, o: 0.8 },
    { l: '30%', t: '52%', w: 70, o: 0.7 },
    { l: '-10%', t: '70%', w: 50, o: 0.85 },
    { l: '70%', t: '62%', w: 48, o: 0.9 },
  ]
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className)} style={{ background: 'linear-gradient(180deg, var(--as-sky-1), var(--as-sky-2) 55%, var(--as-sky-3))' }}>
      {puffs.map((p, i) => (
        <span
          key={i}
          className="absolute aspect-[2.4/1] rounded-[50%] blur-2xl"
          style={{
            left: p.l,
            top: p.t,
            width: `${p.w}%`,
            opacity: p.o,
            background: 'radial-gradient(closest-side, #fff, rgba(255,255,255,0.6) 60%, transparent)',
            animation: animate ? `as-drift ${18 + i * 4}s ${-i * 3}s ease-in-out infinite alternate` : undefined,
          }}
        />
      ))}
    </div>
  )
}

/** Blue text link with a chevron, used as a section eyebrow. */
export function Eyebrow({ className, children, ...rest }: ComponentProps<'a'>) {
  return (
    <a href="#" className={cn('inline-flex items-center gap-1 text-[14px] font-medium text-(--as-blue) hover:underline', className)} {...rest}>
      {children}
      <span aria-hidden>›</span>
    </a>
  )
}

/** Black pill with a divided chevron, like a download button with options. */
export function SplitButton({ children = 'Download', size = 'md', className }: { children?: ReactNode; size?: 'sm' | 'md'; className?: string }) {
  return (
    <span className={cn('inline-flex items-stretch overflow-hidden rounded-[10px] bg-(--as-ink) text-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.5)]', size === 'sm' ? 'h-8 text-[13px]' : 'h-10 text-[14px]', className)}>
      <button type="button" className="flex items-center gap-1.5 px-3.5 font-medium hover:bg-white/10">
        <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 2v8M4.5 7 8 10.5 11.5 7M3 13.5h10" /></svg>
        {children}
      </button>
      <span className="my-2 w-px bg-white/25" />
      <button type="button" aria-label="More options" className="px-2.5 hover:bg-white/10">
        <svg viewBox="0 0 12 12" aria-hidden className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 4.5 6 7.5 9 4.5" /></svg>
      </button>
    </span>
  )
}

/** A desktop app frame with traffic lights and an address bar. */
export function AppWindow({ title = 'New tab', className, children }: { title?: string; className?: string; children?: ReactNode }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-black/10 bg-white/85 shadow-[0_30px_80px_-30px_rgba(10,40,80,0.45)] backdrop-blur', className)}>
      <div className="flex items-center gap-3 border-b border-(--as-line) px-4 py-2.5">
        <span className="flex gap-1.5">
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
          ))}
        </span>
        <span className="ml-2 flex gap-2 text-(--as-faint)">‹ ›</span>
        <span className="truncate text-[12px] text-(--as-dim)">{title}</span>
      </div>
      {children}
    </div>
  )
}

/** Page column with hairline rails on both sides. */
export function Rails({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto max-w-6xl border-x border-(--as-line)', className)}>{children}</div>
}

function scrollParent(el: HTMLElement) {
  let sp: HTMLElement | null = el.parentElement
  while (sp && !/(auto|scroll)/.test(getComputedStyle(sp).overflowY)) sp = sp.parentElement
  return sp
}

/** Calls `fn` with the scroll offset and the element's position relative to its scroller, once per frame. */
function useScrollFrame<T extends HTMLElement>(ref: RefObject<T | null>, fn: (s: { y: number; top: number; vh: number; rect: DOMRect }) => void) {
  const cb = useRef(fn)
  useEffect(() => {
    cb.current = fn
  })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const sp = scrollParent(el)
    const target: HTMLElement | Window = sp ?? window
    let raf = 0
    const update = () => {
      raf = 0
      cb.current({ y: sp ? sp.scrollTop : window.scrollY, top: sp ? sp.getBoundingClientRect().top : 0, vh: sp ? sp.clientHeight : window.innerHeight, rect: el.getBoundingClientRect() })
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
  }, [ref])
}

/**
 * Writes 0–1 progress to a CSS var. 'cross': element enters the bottom → leaves the top.
 * 'exit': element top at the scroller top → fully scrolled out.
 * 'enter': element enters the bottom → its top reaches `end` of the viewport height.
 */
export function useScrollVar<T extends HTMLElement>(ref: RefObject<T | null>, { name = '--as-p', mode = 'cross', end = 0.35 }: { name?: string; mode?: 'cross' | 'enter' | 'exit'; end?: number } = {}) {
  useScrollFrame(ref, ({ top, vh, rect }) => {
    const rel = rect.top - top
    const p = mode === 'cross' ? (vh - rel) / (vh + rect.height) : mode === 'exit' ? -rel / rect.height : (vh - rel) / (vh * (1 - end))
    ref.current?.style.setProperty(name, Math.min(1, Math.max(0, p)).toFixed(4))
  })
}

/** Hidden while scrolling down past `offset`, shown again on any scroll up. */
export function useHideOnScroll<T extends HTMLElement>(ref: RefObject<T | null>, offset = 80) {
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)
  useScrollFrame(ref, ({ y }) => {
    const d = y - last.current
    if (Math.abs(d) > 4) setHidden(d > 0 && y > offset)
    last.current = y
  })
  return hidden
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
