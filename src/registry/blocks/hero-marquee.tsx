'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface HeroMarqueeProps {
  kicker?: string
  title?: string
  description?: string
  primaryCta?: string
  /** Words repeated along the two crossing tapes. */
  tapeA?: string[]
  tapeB?: string[]
  /** Base speed in px per frame. Scrolling and hovering speed the tapes up. */
  speed?: number
  animate?: boolean
  className?: string
}

/** Two tilted tapes of words criss-cross behind the headline; they rush faster as you scroll and slow down when you hover them. */
export function HeroMarquee({
  kicker = 'Now shipping',
  title = 'Loud launches, made easy.',
  description = 'Bold sections for product drops, events and announcements. Scroll and the tapes pick up speed.',
  primaryCta = 'Grab a ticket',
  tapeA = ['Launch week', 'New drop', 'Live now', 'Free to try'],
  tapeB = ['Build', 'Ship', 'Repeat', 'Celebrate'],
  speed = 1,
  animate = true,
  className,
}: HeroMarqueeProps) {
  const root = useRef<HTMLElement>(null)
  const tapes = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = root.current
    if (!el || !animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0, boost = 0, lastY = 0, hover = false
    const off = [0, 0]
    const els = tapes.current.slice()
    let sp: HTMLElement | Window = window
    for (let p = el.parentElement; p; p = p.parentElement) {
      const o = getComputedStyle(p).overflowY
      if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight) { sp = p; break }
    }
    const y = () => (sp instanceof Window ? sp.scrollY : sp.scrollTop)
    lastY = y()
    const onScroll = () => { const v = y(); boost = Math.min(40, boost + Math.abs(v - lastY) * 0.4); lastY = v }
    const tick = () => {
      boost *= 0.92
      const v = (speed + boost) * (hover ? 0.25 : 1)
      els.forEach((t, i) => {
        if (!t) return
        const half = t.scrollWidth / 2
        off[i] = (off[i] + v) % half
        t.style.transform = `translateX(${i ? off[i] - half : -off[i]}px)`
      })
      raf = requestAnimationFrame(tick)
    }
    const enter = () => { hover = true }, leave = () => { hover = false }
    sp.addEventListener('scroll', onScroll, { passive: true })
    els.forEach((t) => { t?.parentElement?.addEventListener('pointerenter', enter); t?.parentElement?.addEventListener('pointerleave', leave) })
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); sp.removeEventListener('scroll', onScroll); els.forEach((t) => { t?.parentElement?.removeEventListener('pointerenter', enter); t?.parentElement?.removeEventListener('pointerleave', leave) }) }
  }, [animate, speed])

  const tape = (items: string[], i: number) => (
    <div
      aria-hidden
      className={cn('absolute left-[-10%] w-[120%] overflow-hidden border-y-[3px] border-(--hq-ink) py-3', i ? 'top-[62%] rotate-[5deg] bg-(--hq-b) text-(--hq-ink)' : 'top-[22%] -rotate-[6deg] bg-(--hq-a) text-white')}
    >
      <div ref={(el) => { tapes.current[i] = el }} className="flex w-max will-change-transform">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {Array.from({ length: 4 }, () => items).flat().map((t, j) => (
              <span key={j} className="flex items-center gap-6 px-6 text-[clamp(1.1rem,2.4vw,1.8rem)] font-black tracking-tight uppercase">
                {t} <span className="text-[0.8em]">✱</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section
      ref={root}
      className={cn('relative isolate flex min-h-[600px] flex-col items-center justify-center overflow-hidden bg-(--hq-bg) px-6 py-28 text-center text-(--hq-ink) [--hq-a:#ff3d6e] [--hq-b:#c6ff3d] [--hq-bg:#f4f1ea] [--hq-ink:#111] dark:[--hq-bg:#121212] dark:[--hq-ink:#f4f1ea]', className)}
    >
      <div className="absolute inset-0 -z-10">{tape(tapeA, 0)}{tape(tapeB, 1)}</div>
      <div className="relative max-w-3xl rounded-[28px] border-[3px] border-(--hq-ink) bg-(--hq-bg) px-8 py-10 shadow-[8px_8px_0_var(--hq-ink)] md:px-14">
        <span className="inline-flex items-center gap-2 rounded-full bg-(--hq-ink) px-3 py-1 text-[12px] font-bold tracking-wide text-(--hq-bg) uppercase">
          <span className="size-1.5 rounded-full bg-(--hq-b)" /> {kicker}
        </span>
        <h1 className="mt-5 text-[clamp(2.4rem,6.5vw,5rem)] leading-[0.95] font-black tracking-[-0.045em]">{title}</h1>
        <p className="mx-auto mt-5 max-w-lg text-(--hq-ink)/70">{description}</p>
        <a href="#" className="mt-8 inline-flex rounded-full border-[3px] border-(--hq-ink) bg-(--hq-a) px-7 py-3 font-bold text-white shadow-[4px_4px_0_var(--hq-ink)] transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--hq-ink)]">{primaryCta} →</a>
      </div>
    </section>
  )
}
