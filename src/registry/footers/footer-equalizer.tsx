'use client'

import { useState, type PointerEvent } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot, useReducedMotion } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterEqualizerProps {
  brand?: string
  tagline?: string
  accent?: string
  /** Number of bars. */
  bars?: number
  /** Track name in the "now playing" pill. */
  track?: string
  animate?: boolean
  className?: string
}

const KEYFRAMES = `
@keyframes eq-bounce{0%,100%{scale:1 .25}30%{scale:1 .9}55%{scale:1 .45}80%{scale:1 .7}}
`

/** A wall of equalizer bars dancing to a silent track. Bars near the cursor jump higher; click to pause the beat. */
export function FooterEqualizer({
  brand = 'lumen',
  tagline = 'Ship to the rhythm.',
  accent = '#8b5cf6',
  bars = 48,
  track = 'Late night deploy (extended mix)',
  animate = true,
  className,
}: FooterEqualizerProps) {
  const reduced = useReducedMotion()
  const [x, setX] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const live = animate && !reduced && !paused
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setX(((e.clientX - r.left) / r.width) * bars)
  }

  return (
    <FooterRoot accent={accent} className={cn('[--eq-a:var(--ft-accent)] [--eq-b:#22d3ee]', className)}>
      <style>{KEYFRAMES}</style>
      <div className="mx-auto max-w-6xl px-6 pt-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-start gap-4">
            <Brand brand={brand} />
            <p className="max-w-xs text-sm text-(--ft-soft)">{tagline}</p>
            <button type="button" onClick={() => setPaused((p) => !p)} className="inline-flex items-center gap-2 rounded-full border border-(--ft-line) py-1 pr-3 pl-1 text-[12px] text-(--ft-soft) hover:text-(--ft-ink)">
              <span className="grid size-6 place-items-center rounded-full bg-(--eq-a) text-[10px] text-white">{paused ? '▶' : '❚❚'}</span>
              <span className="max-w-[200px] truncate">{track}</span>
            </button>
          </div>
          <FooterColumns arrows />
        </div>
        <div
          aria-hidden
          onPointerMove={onMove}
          onPointerLeave={() => setX(null)}
          onClick={() => setPaused((p) => !p)}
          className="mt-12 flex h-[clamp(140px,22cqw,240px)] cursor-pointer items-end gap-[3px]"
        >
          {Array.from({ length: bars }, (_, i) => {
            const near = x === null ? 0 : Math.max(0, 1 - Math.abs(i + 0.5 - x) / 5)
            const t = i / (bars - 1)
            return (
              <span key={i} className="relative h-full flex-1 origin-bottom transition-transform duration-150" style={{ transform: `scaleY(${0.55 + near * 0.45})` }}>
                <span
                  className={cn('absolute inset-0 origin-bottom rounded-t-full', live && 'ft-anim animate-[eq-bounce_var(--d)_ease-in-out_infinite]')}
                  style={{
                    background: `linear-gradient(to top, color-mix(in oklab, var(--eq-a) ${100 - t * 100}%, var(--eq-b)), transparent 140%)`,
                    scale: live ? undefined : `1 ${0.3 + 0.5 * Math.abs(Math.sin(i * 0.7))}`,
                    ['--d' as string]: `${0.7 + ((i * 37) % 9) / 10}s`,
                    animationDelay: `${-((i * 53) % 17) / 10}s`,
                  }}
                />
              </span>
            )
          })}
        </div>
        <BottomBar brand={brand} className="border-t border-(--ft-line) py-6" />
      </div>
    </FooterRoot>
  )
}
