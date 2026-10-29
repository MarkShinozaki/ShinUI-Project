'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export interface HeroParallaxProps {
  title?: string
  /** Words that take turns at the end of the headline. */
  words?: string[]
  description?: string
  primaryCta?: string
  secondaryCta?: string
  /** How far shapes travel with the pointer. */
  depth?: number
  animate?: boolean
  className?: string
}

const KEYFRAMES = `
@keyframes hp-float{0%,100%{translate:0 0}50%{translate:0 -14px}}
@keyframes hp-in{from{opacity:0;transform:translateY(60%) rotate(4deg)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion: reduce){.hp-anim{animation:none!important}.hp-move{transform:none!important}}
`

const SHAPES = [
  { k: 'circle', x: 8, y: 18, s: 84, c: '#ffd23f', z: 1.4, r: 0 },
  { k: 'square', x: 82, y: 14, s: 70, c: '#5b8cff', z: 0.8, r: 18 },
  { k: 'tri', x: 14, y: 72, s: 90, c: '#ff6b9a', z: 1, r: -12 },
  { k: 'pill', x: 78, y: 70, s: 110, c: '#3ddc97', z: 1.6, r: -24 },
  { k: 'ring', x: 46, y: 8, s: 46, c: '#a879ff', z: 0.5, r: 0 },
  { k: 'star', x: 90, y: 44, s: 54, c: '#ff8f3f', z: 1.2, r: 10 },
  { k: 'circle', x: 3, y: 46, s: 34, c: '#5b8cff', z: 0.6, r: 0 },
  { k: 'square', x: 56, y: 84, s: 40, c: '#ffd23f', z: 0.9, r: 32 },
] as const

function Shape({ k, c }: { k: string; c: string }) {
  if (k === 'circle') return <span className="block size-full rounded-full" style={{ background: c }} />
  if (k === 'square') return <span className="block size-full rounded-[22%]" style={{ background: c }} />
  if (k === 'pill') return <span className="block h-1/2 w-full rounded-full" style={{ background: c }} />
  if (k === 'ring') return <span className="block size-full rounded-full border-[10px]" style={{ borderColor: c }} />
  const d = k === 'tri' ? 'M50 6 96 90H4z' : 'M50 4l13 30 33 3-25 22 8 33-29-17-29 17 8-33L4 37l33-3z'
  return <svg viewBox="0 0 100 100" className="block size-full"><path d={d} fill={c} strokeLinejoin="round" stroke={c} strokeWidth="8" /></svg>
}

/** A candy-colored hero: floating shapes drift at different depths with the pointer and scroll, and the last word keeps changing. */
export function HeroParallax({
  title = 'Interfaces that feel',
  words = ['playful', 'bouncy', 'alive', 'yours'],
  description = 'Drop-in sections with personality. Move your cursor, scroll a little, and watch everything react.',
  primaryCta = 'Start building',
  secondaryCta = 'Browse blocks',
  depth = 30,
  animate = true,
  className,
}: HeroParallaxProps) {
  const root = useRef<HTMLElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    if (!animate || words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setW((v) => (v + 1) % words.length), 2200)
    return () => clearInterval(id)
  }, [animate, words.length])

  useEffect(() => {
    const el = root.current
    if (!el) return
    let sp: HTMLElement | Window = window
    for (let p = el.parentElement; p; p = p.parentElement) {
      const o = getComputedStyle(p).overflowY
      if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight) { sp = p; break }
    }
    const onScroll = () => { const r = el.getBoundingClientRect(); el.style.setProperty('--hp-s', String(Math.max(0, -r.top))) }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--hp-x', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
      el.style.setProperty('--hp-y', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
    }
    sp.addEventListener('scroll', onScroll, { passive: true }); el.addEventListener('pointermove', onMove)
    return () => { sp.removeEventListener('scroll', onScroll); el.removeEventListener('pointermove', onMove) }
  }, [])

  const word = words[w % Math.max(1, words.length)] ?? ''

  return (
    <section
      ref={root}
      className={cn('relative isolate flex min-h-[600px] flex-col items-center justify-center overflow-hidden bg-(--hp-bg) px-6 py-28 text-center text-(--hp-ink) [--hp-bg:#fdf8ff] [--hp-ink:#1b1530] dark:[--hp-bg:#130f22] dark:[--hp-ink:#f6f1ff]', className)}
      style={{ '--hp-d': depth } as CSSProperties}
    >
      <style>{KEYFRAMES}</style>
      {SHAPES.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="hp-move absolute -z-10 transition-transform duration-300 ease-out"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, transform: `translate(calc(var(--hp-x,0) * var(--hp-d) * ${s.z * -2}px), calc(var(--hp-y,0) * var(--hp-d) * ${s.z * -2}px + var(--hp-s,0) * ${s.z * -0.35}px)) rotate(calc(${s.r}deg + var(--hp-s,0) * ${s.z * 0.2}deg))` }}
        >
          <span className={cn('block size-full', animate && 'hp-anim')} style={{ animation: animate ? `hp-float ${4 + i * 0.6}s ${-i}s ease-in-out infinite` : undefined }}>
            <Shape k={s.k} c={s.c} />
          </span>
        </span>
      ))}
      <h1 className="max-w-4xl text-[clamp(2.8rem,8vw,6.4rem)] leading-[1] font-extrabold tracking-[-0.045em]">
        {title}{' '}
        <span className="relative inline-grid overflow-hidden align-bottom">
          <span key={word} className={cn('inline-block bg-[linear-gradient(90deg,#ff6b9a,#a879ff,#5b8cff)] bg-clip-text pb-[0.08em] text-transparent', animate && 'hp-anim animate-[hp-in_.5s_cubic-bezier(.2,1.4,.4,1)]')}>
            {word}
          </span>
        </span>
      </h1>
      <p className="mt-6 max-w-xl text-lg text-(--hp-ink)/65">{description}</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <a href="#" className="rounded-2xl bg-(--hp-ink) px-6 py-3 font-semibold text-(--hp-bg) transition-transform hover:scale-105 hover:-rotate-2">{primaryCta}</a>
        <a href="#" className="rounded-2xl bg-(--hp-ink)/[0.07] px-6 py-3 font-semibold transition-transform hover:scale-105 hover:rotate-2">{secondaryCta}</a>
      </div>
    </section>
  )
}
