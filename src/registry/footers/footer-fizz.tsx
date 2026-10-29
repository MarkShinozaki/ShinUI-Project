'use client'

import { useEffect, useRef } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot, useReducedMotion } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterFizzProps {
  brand?: string
  tagline?: string
  accent?: string
  /** Bubbles on screen at once. */
  count?: number
  animate?: boolean
  className?: string
}

const KEYFRAMES = `
@keyframes fz-wave{to{background-position-x:200px}}
`

type Bubble = { x: number; y: number; r: number; vy: number; ph: number; pop: number }

/** A soda footer: bubbles rise behind the links, scatter from the cursor and pop in bursts where you click. */
export function FooterFizz({
  brand = 'lumen',
  tagline = 'Refreshingly simple tools.',
  accent = '#f43f5e',
  count = 70,
  animate = true,
  className,
}: FooterFizzProps) {
  const reduced = useReducedMotion()
  const canvas = useRef<HTMLCanvasElement>(null)
  const live = animate && !reduced

  useEffect(() => {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    let w = 0, h = 0, raf = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const ptr = { x: -999, y: -999 }
    const make = (y?: number): Bubble => ({ x: Math.random() * w, y: y ?? Math.random() * h, r: 2 + Math.random() * 9, vy: 0.3 + Math.random() * 0.9, ph: Math.random() * 6, pop: 0 })
    let bubbles: Bubble[] = []
    const size = () => {
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!bubbles.length) bubbles = Array.from({ length: count }, () => make())
    }
    const ro = new ResizeObserver(size); ro.observe(c); size()
    const color = getComputedStyle(c).getPropertyValue('--fz-accent').trim() || accent
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const b of bubbles) {
        if (live) {
          b.ph += 0.03; b.y -= b.vy; b.x += Math.sin(b.ph) * 0.4
          const dx = b.x - ptr.x, dy = b.y - ptr.y, d = Math.hypot(dx, dy)
          if (d < 90 && d > 0) { b.x += (dx / d) * (90 - d) * 0.06; b.y += (dy / d) * (90 - d) * 0.06 }
          if (b.pop) b.pop += 0.08
          if (b.y < -20 || b.pop > 1) Object.assign(b, make(h + 20))
        }
        ctx.globalAlpha = b.pop ? 1 - b.pop : 0.55
        ctx.strokeStyle = color; ctx.lineWidth = 1.2
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r * (1 + b.pop * 1.5), 0, Math.PI * 2); ctx.stroke()
        ctx.globalAlpha *= 0.6
        ctx.beginPath(); ctx.arc(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.22, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
      }
      ctx.globalAlpha = 1
      if (live) raf = requestAnimationFrame(draw)
    }
    draw()
    const host = c.parentElement!
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top }
    const leave = () => { ptr.x = ptr.y = -999 }
    const down = (e: PointerEvent) => {
      move(e)
      for (const b of bubbles) if (Math.hypot(b.x - ptr.x, b.y - ptr.y) < 120) b.pop = b.pop || 0.01
      for (let i = 0; i < 10; i++) bubbles.push({ ...make(ptr.y), x: ptr.x + (Math.random() - 0.5) * 40, vy: 1 + Math.random() * 2 })
      if (bubbles.length > count * 2) bubbles.splice(0, bubbles.length - count * 2)
    }
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave); host.addEventListener('pointerdown', down)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); host.removeEventListener('pointerdown', down) }
  }, [count, live, accent])

  return (
    <FooterRoot accent={accent} className={cn('[--fz-accent:var(--ft-accent)]', className)}>
      <style>{KEYFRAMES}</style>
      <div className="relative">
        <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
        <div className="relative mx-auto max-w-6xl px-6 pt-16 md:px-10">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <div className="flex flex-col items-start gap-3">
              <Brand brand={brand} />
              <p className="max-w-xs text-sm text-(--ft-soft)">{tagline}</p>
              <p className="text-[12px] text-(--ft-faint)">Click anywhere for a fizz.</p>
            </div>
            <FooterColumns arrows />
          </div>
          <div
            aria-hidden
            className={cn('mt-12 select-none text-center font-display text-[clamp(4rem,22cqw,16rem)] leading-[0.8] font-black tracking-[-0.06em] text-transparent bg-clip-text', live && 'ft-anim animate-[fz-wave_4s_linear_infinite]')}
            style={{ backgroundImage: 'linear-gradient(transparent 0 38%, var(--fz-accent) 38%), radial-gradient(14px 10px at 50% 38%, var(--fz-accent) 98%, transparent)', backgroundSize: '100% 100%, 50px 100%', backgroundRepeat: 'no-repeat, repeat-x', WebkitTextStroke: '1.5px var(--fz-accent)' }}
          >
            {brand}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <BottomBar brand={brand} className="border-t border-(--ft-line) py-6" />
      </div>
    </FooterRoot>
  )
}
