'use client'

import { useEffect, useRef } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot, rasterizeText, useCanvasLoop, useIsDark, usePointer } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterDotsProps {
  brand?: string
  tagline?: string
  accent?: string
  /** repel: dots flee the cursor. attract: they gather to it. spotlight: a lit circle follows it. */
  mode?: 'repel' | 'attract' | 'spotlight'
  /** Grid gap in px (smaller = more dots). */
  density?: number
  /** Cursor radius in px. */
  intensity?: number
  /** Idle breathing wave when the cursor is away. */
  animate?: boolean
  className?: string
}

/** A dot field behind the whole footer: the brand is spelled in bigger dots, and the field reacts to the cursor and to clicks. */
export function FooterDots({
  brand = 'lumen',
  tagline = 'Infrastructure that stays out of your way.',
  accent = '#6366f1',
  mode = 'repel',
  density = 14,
  intensity = 130,
  animate = true,
  className,
}: FooterDotsProps) {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bandRef = useRef<HTMLDivElement>(null)
  const dark = useIsDark(rootRef)
  const pointer = usePointer(rootRef)
  const ripples = useRef<{ x: number; y: number; t: number }[]>([])
  const clock = useRef(0)
  const cache = useRef<{ key: string; sample: (x: number, y: number) => number } | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const down = () => {
      const p = pointer.current
      if (p) ripples.current = [...ripples.current.slice(-4), { x: p.x, y: p.y, t: clock.current }]
    }
    el.addEventListener('pointerdown', down)
    return () => el.removeEventListener('pointerdown', down)
  }, [pointer])

  const running = useCanvasLoop(
    canvasRef,
    ({ ctx, w, h, t }) => {
      clock.current = t
      const gap = Math.max(6, Math.min(density, w / 45))
      const band = bandRef.current
      const top = band?.offsetTop ?? h * 0.55
      const bandH = band?.offsetHeight ?? h * 0.35
      const key = `${brand}|${w}|${h}|${top}|${bandH}`
      if (cache.current?.key !== key) cache.current = { key, sample: rasterizeText(brand, w, bandH, { fill: 0.94 }) }
      const { sample } = cache.current
      const ink = dark ? '242,242,240' : '20,20,20'
      const R = Math.max(30, intensity)
      const p = pointer.current
      ctx.clearRect(0, 0, w, h)
      ripples.current = ripples.current.filter((r) => t - r.t < 2.2)
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const cov = y > top && y < top + bandH ? sample(x, y - top) : 0
          let r = gap * (0.09 + cov * 0.3)
          let a = 0.16 + cov * 0.7
          let dx = 0
          let dy = 0
          let lit = 0
          if (animate) {
            const breathe = Math.sin(x * 0.012 + y * 0.018 - t * 1.3) * 0.5 + 0.5
            r *= 0.85 + breathe * 0.3
          }
          if (p) {
            const ddx = x - p.x
            const ddy = y - p.y
            const d = Math.hypot(ddx, ddy) || 1
            if (d < R) {
              const f = (1 - d / R) ** 2
              lit = f
              if (mode === 'repel') {
                dx = (ddx / d) * f * R * 0.35
                dy = (ddy / d) * f * R * 0.35
              } else if (mode === 'attract') {
                dx = (-ddx / d) * f * Math.min(d, R * 0.3)
                dy = (-ddy / d) * f * Math.min(d, R * 0.3)
              }
              r *= 1 + f * (mode === 'spotlight' ? 1.6 : 0.9)
              a = Math.min(1, a + f * 0.8)
            } else if (mode === 'spotlight') {
              a *= 0.55
            }
          }
          for (const rp of ripples.current) {
            const age = t - rp.t
            const ring = age * 420
            const d = Math.hypot(x - rp.x, y - rp.y)
            const k = Math.max(0, 1 - Math.abs(d - ring) / 26) * (1 - age / 2.2)
            if (k > 0) {
              r *= 1 + k * 1.2
              lit = Math.max(lit, k)
              dx += ((x - rp.x) / (d || 1)) * k * 6
              dy += ((y - rp.y) / (d || 1)) * k * 6
            }
          }
          ctx.beginPath()
          ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2)
          ctx.fillStyle = lit > 0.25 ? accent : `rgba(${ink},${a})`
          ctx.globalAlpha = lit > 0.25 ? Math.min(1, 0.4 + lit) : 1
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }
    },
    { animate: true, fps: 60 },
  )

  return (
    <FooterRoot ref={rootRef} accent={accent} className={cn('touch-pan-y', className)}>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 block size-full" />
      <div className="relative mx-auto max-w-6xl px-6 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-start gap-4">
            <Brand brand={brand} />
            <p className="max-w-xs text-[14px] leading-relaxed text-(--ft-soft)">{tagline}</p>
            <p className="text-[12px] text-(--ft-faint)">{running ? 'Move your cursor below. Click to ripple.' : 'Hover the field below.'}</p>
          </div>
          <FooterColumns className="rounded-2xl bg-(--ft-bg)/70 p-1 backdrop-blur-[2px]" />
        </div>
      </div>
      <div ref={bandRef} aria-hidden className="my-4 h-[clamp(120px,24cqw,300px)]" />
      <div className="relative mx-auto max-w-6xl px-6 pb-6 md:px-10">
        <BottomBar brand={brand} className="border-t border-(--ft-line) pt-5" />
      </div>
    </FooterRoot>
  )
}
