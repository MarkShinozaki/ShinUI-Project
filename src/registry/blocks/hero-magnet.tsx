'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export interface HeroMagnetProps {
  kicker?: string
  title?: string
  description?: string
  primaryCta?: string
  secondaryCta?: string
  /** Push radius in px. */
  radius?: number
  /** push: letters shove away from the cursor. pull: they lean in toward it. */
  mode?: 'push' | 'pull'
  accent?: string
  className?: string
}

/** A big bold headline whose letters scatter (or lean in) around the cursor and spring back, with confetti-colored tilts. */
export function HeroMagnet({
  kicker = 'Fresh out of the oven',
  title = 'Make it move.',
  description = 'Playful interface pieces that react to every nudge, built to drop straight into your next launch.',
  primaryCta = 'Get started',
  secondaryCta = 'See examples',
  radius = 140,
  mode = 'push',
  accent = '#ff5c39',
  className,
}: HeroMagnetProps) {
  const root = useRef<HTMLElement>(null)
  const letters = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const el = root.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ptr = { x: -9999, y: -9999 }
    const cur = letters.current.map(() => ({ x: 0, y: 0, r: 0 }))
    let raf = 0
    const tick = () => {
      letters.current.forEach((l, i) => {
        if (!l) return
        const b = l.getBoundingClientRect()
        const cx = b.left + b.width / 2 - cur[i].x, cy = b.top + b.height / 2 - cur[i].y
        const dx = cx - ptr.x, dy = cy - ptr.y, d = Math.hypot(dx, dy) || 1
        const f = Math.max(0, 1 - d / radius) * (mode === 'push' ? 1 : -0.5)
        const tx = (dx / d) * f * 46, ty = (dy / d) * f * 46, tr = (dx / d) * f * 24
        cur[i].x += (tx - cur[i].x) * 0.15; cur[i].y += (ty - cur[i].y) * 0.15; cur[i].r += (tr - cur[i].r) * 0.15
        l.style.transform = `translate(${cur[i].x.toFixed(2)}px, ${cur[i].y.toFixed(2)}px) rotate(${cur[i].r.toFixed(2)}deg)`
      })
      raf = requestAnimationFrame(tick)
    }
    const move = (e: PointerEvent) => { ptr.x = e.clientX; ptr.y = e.clientY }
    const leave = () => { ptr.x = ptr.y = -9999 }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [radius, mode, title])

  const colors = ['var(--hm-ink)', 'var(--hm-accent)', '#3b82f6', '#22c55e', '#eab308']
  const words = title.split(' ')
  let n = 0

  return (
    <section
      ref={root}
      className={cn('relative isolate flex min-h-[560px] flex-col items-center justify-center overflow-hidden bg-(--hm-bg) px-6 py-24 text-center text-(--hm-ink) [--hm-bg:#fffaf3] [--hm-ink:#16130f] dark:[--hm-bg:#120f0c] dark:[--hm-ink:#fbf6ee]', className)}
      style={{ '--hm-accent': accent } as CSSProperties}
    >
      <div aria-hidden className="absolute inset-0 -z-10 opacity-60 [background:radial-gradient(circle_at_center,color-mix(in_oklab,var(--hm-ink)_14%,transparent)_1.2px,transparent_1.6px)_0_0/22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_50%,#000,transparent)]" />
      <span className="rounded-full border-2 border-(--hm-ink) bg-(--hm-bg) px-3 py-1 text-[12px] font-semibold shadow-[3px_3px_0_var(--hm-ink)]">{kicker}</span>
      <h1 aria-label={title} className="mt-8 max-w-5xl cursor-default text-[clamp(3.2rem,11vw,9rem)] leading-[0.95] font-black tracking-[-0.05em] select-none">
        {words.map((w, wi) => (
          <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
            {[...w].map((ch) => {
              const i = n++
              return (
                <span key={i} ref={(el) => { letters.current[i] = el }} className="inline-block will-change-transform" style={{ color: i % 4 === 1 ? colors[(i >> 2) % colors.length] : undefined }}>
                  {ch}
                </span>
              )
            })}
            {wi < words.length - 1 && <span className="inline-block w-[0.28em]" />}
          </span>
        ))}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-(--hm-ink)/70">{description}</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <a href="#" className="rounded-full border-2 border-(--hm-ink) bg-(--hm-accent) px-6 py-3 font-semibold text-white shadow-[4px_4px_0_var(--hm-ink)] transition-[translate,box-shadow] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--hm-ink)] active:translate-y-0.5 active:shadow-[1px_1px_0_var(--hm-ink)]">{primaryCta}</a>
        <a href="#" className="rounded-full border-2 border-(--hm-ink) px-6 py-3 font-semibold transition-colors hover:bg-(--hm-ink) hover:text-(--hm-bg)">{secondaryCta}</a>
      </div>
      <p className="mt-10 text-[12px] text-(--hm-ink)/45">Wave your cursor over the headline</p>
    </section>
  )
}
