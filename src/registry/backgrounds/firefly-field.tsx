'use client'

import { useEffect, useRef, type ComponentProps, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export interface FireflyFieldProps extends ComponentProps<'div'> {
  /** Number of fireflies. */
  count?: number
  /** Glow color (any CSS color). */
  color?: string
  /** Night sky color behind them. */
  sky?: string
  /** Fireflies drift toward the cursor and swirl around it. */
  interactive?: boolean
  animate?: boolean
}

type Fly = { x: number; y: number; vx: number; vy: number; ph: number; sp: number }

/** A dusky field of blinking fireflies that wander, then gather and circle wherever the pointer rests. */
export function FireflyField({ count = 60, color = '#fde68a', sky = '#0b1020', interactive = true, animate = true, className, style, children, ...props }: FireflyFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const still = !animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    let w = 0, h = 0, raf = 0, t = 0
    let flies: Fly[] = []
    const ptr = { x: 0, y: 0, on: false }
    const size = () => {
      w = c.clientWidth; h = c.clientHeight
      c.width = w * dpr; c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!flies.length) flies = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, ph: Math.random() * 6.28, sp: 0.5 + Math.random() }))
      if (still) draw()
    }
    const glow = getComputedStyle(c).getPropertyValue('--ff-glow').trim() || color
    function draw() {
      t += 0.016
      ctx!.clearRect(0, 0, w, h)
      ctx!.globalCompositeOperation = 'lighter'
      for (const f of flies) {
        if (!still) {
          const a = Math.sin(t * 0.6 + f.ph * 3) * 2
          f.vx += Math.cos(a + f.ph) * 0.04; f.vy += Math.sin(a + f.ph) * 0.04
          if (interactive && ptr.on) {
            const dx = ptr.x - f.x, dy = ptr.y - f.y, d = Math.hypot(dx, dy) || 1
            const k = d > 60 ? 0.06 : -0.02
            f.vx += (dx / d) * k + (-dy / d) * 0.05; f.vy += (dy / d) * k + (dx / d) * 0.05
          }
          f.vx *= 0.96; f.vy *= 0.96
          f.x += f.vx * f.sp; f.y += f.vy * f.sp
          if (f.x < -10) f.x = w + 10; if (f.x > w + 10) f.x = -10
          if (f.y < -10) f.y = h + 10; if (f.y > h + 10) f.y = -10
        }
        const blink = still ? 0.8 : Math.max(0, Math.sin(t * 2 * f.sp + f.ph)) ** 2
        const g = ctx!.createRadialGradient(f.x, f.y, 0, f.x, f.y, 14)
        g.addColorStop(0, glow); g.addColorStop(1, 'transparent')
        ctx!.globalAlpha = 0.15 + blink * 0.85
        ctx!.fillStyle = g
        ctx!.fillRect(f.x - 14, f.y - 14, 28, 28)
      }
      ctx!.globalAlpha = 1; ctx!.globalCompositeOperation = 'source-over'
      if (!still) raf = requestAnimationFrame(draw)
    }
    const ro = new ResizeObserver(size); ro.observe(c); size()
    if (!still) raf = requestAnimationFrame(draw)
    const host = c.parentElement!
    const move = (e: PointerEvent) => { const r = c.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.on = true }
    const leave = () => { ptr.on = false }
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave) }
  }, [count, color, interactive, animate])

  return (
    <div
      className={cn('relative isolate overflow-hidden', className)}
      style={{ '--ff-glow': color, '--ff-sky': sky, background: 'radial-gradient(120% 80% at 50% 110%, color-mix(in oklab, var(--ff-sky), #3b2a5a 45%), var(--ff-sky))', ...style } as CSSProperties}
      {...props}
    >
      <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full" />
      {children}
    </div>
  )
}
