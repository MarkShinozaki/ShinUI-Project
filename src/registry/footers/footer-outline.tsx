'use client'

import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot, useReducedMotion } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterOutlineProps {
  brand?: string
  accent?: string
  /** letters: each letter fills as you pass over it. wipe: the fill follows your cursor across the word. */
  variant?: 'letters' | 'wipe'
  /** Outline width in px. */
  stroke?: number
  /** Idle sweep that fills the word now and then. */
  animate?: boolean
  /** Status pill ("All systems normal") and region line. */
  showStatus?: boolean
  className?: string
}

const KEYFRAMES = `
@keyframes ft-sweep{0%,60%{clip-path:inset(0 100% 0 0)}75%{clip-path:inset(0 0 0 0)}90%,100%{clip-path:inset(0 0 0 100%)}}
`

/** A giant outlined wordmark that fills on hover, over hairline columns with a live status pill. */
export function FooterOutline({
  brand = 'lumen',
  accent = '#ef4444',
  variant = 'letters',
  stroke = 1.5,
  animate = true,
  showStatus = true,
  className,
}: FooterOutlineProps) {
  const reduced = useReducedMotion()
  const wordRef = useRef<HTMLDivElement>(null)
  const [wipe, setWipe] = useState<number | null>(null)
  const size = `clamp(3rem, ${Math.min(24, 96 / Math.max(3, brand.length * 0.6))}cqw, 20rem)`
  const outline: CSSProperties = { WebkitTextStroke: `${stroke}px var(--ft-ink)`, color: 'transparent' }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = wordRef.current
    if (!el || variant !== 'wipe') return
    const r = el.getBoundingClientRect()
    setWipe(Math.max(0, Math.min(1, (e.clientX - r.left) / (r.width || 1))))
  }

  return (
    <FooterRoot accent={accent} className={className}>
      <style>{KEYFRAMES}</style>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid gap-10 border-b border-(--ft-line) py-14 md:grid-cols-[1fr_2fr] md:py-16">
          <div className="flex flex-col items-start gap-4">
            <Brand brand={brand} />
            {showStatus && (
              <a href="#" className="inline-flex items-center gap-2 rounded-full border border-(--ft-line) px-3 py-1 text-[12px] text-(--ft-soft) hover:text-(--ft-ink)">
                <span className="relative grid size-2 place-items-center">
                  <span className={cn('absolute inset-0 rounded-full bg-emerald-500', !reduced && 'ft-anim animate-[ft-pulse_2s_ease-out_infinite]')} />
                  <span className="relative size-2 rounded-full bg-emerald-500" />
                </span>
                All systems normal
              </a>
            )}
            {showStatus && <p className="text-[12px] text-(--ft-faint)">Edge regions: iad · fra · nrt · gru</p>}
          </div>
          <FooterColumns arrows />
        </div>
      </div>
      <div
        ref={wordRef}
        onPointerMove={onMove}
        onPointerLeave={() => setWipe(null)}
        aria-hidden
        className="group/word relative mx-auto w-fit max-w-full cursor-default px-4 pt-6 font-display leading-[0.82] font-bold tracking-[-0.05em] whitespace-nowrap select-none"
        style={{ fontSize: size }}
      >
        {variant === 'letters' ? (
          <span className="flex">
            {[...brand].map((ch, i) => (
              <span
                key={i}
                className="transition-[color,transform] duration-300 hover:-translate-y-[0.04em] hover:text-(--ft-accent)!"
                style={{ ...outline, transitionDelay: '0ms' }}
              >
                {ch === ' ' ? '\u00a0' : ch}
              </span>
            ))}
          </span>
        ) : (
          <>
            <span className="block" style={outline}>
              {brand}
            </span>
            <span
              className="absolute inset-0 block px-4 pt-6 text-(--ft-accent) transition-[clip-path] duration-150"
              style={{ clipPath: `inset(0 ${wipe === null ? 100 : (1 - wipe) * 100}% 0 0)` }}
            >
              {brand}
            </span>
          </>
        )}
        {animate && !reduced && (
          <span
            className="ft-anim pointer-events-none absolute inset-0 block px-4 pt-6 text-(--ft-accent) opacity-25 transition-opacity group-hover/word:opacity-0"
            style={{ animation: 'ft-sweep 9s ease-in-out infinite' }}
          >
            {brand}
          </span>
        )}
      </div>
      <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
        <BottomBar brand={brand} className="border-t border-(--ft-line) pt-5" />
      </div>
    </FooterRoot>
  )
}
