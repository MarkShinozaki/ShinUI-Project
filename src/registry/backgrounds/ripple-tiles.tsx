'use client'

import { useEffect, useRef, type ComponentProps, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export interface RippleTilesProps extends ComponentProps<'div'> {
  /** Tile pitch in px. */
  cellSize?: number
  /** Tile color at rest and at the crest of a wave (hex). */
  base?: string
  crest?: string
  /** Click (or tap) to drop a pebble; the pointer leaves a soft wake. */
  interactive?: boolean
  /** Drop a random pebble every few seconds. */
  animate?: boolean
}

type Drop = { x: number; y: number; t: number }

/** A pond of rounded tiles. Each click drops a pebble whose rings lift, grow and tint the tiles as they pass. */
export function RippleTiles({ cellSize = 26, base = '#e7e5ff', crest = '#6d5dfc', interactive = true, animate = true, className, style, children, ...props }: RippleTilesProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const still = !animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const cs = getComputedStyle(c)
    const A = cs.getPropertyValue('--rt-base').trim() || base
    const B = cs.getPropertyValue('--rt-crest').trim() || crest
    let w = 0, h = 0, raf = 0, now = 0, last = 0
    const drops: Drop[] = []
    const ptr = { x: -999, y: -999 }
    const size = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (still) frame() }
    const rgb = (hex: string) => { const m = hex.replace('#', ''); const f = m.length === 3 ? [...m].map((ch) => ch + ch).join('') : m; return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) || 0) }
    const a = rgb(A), b = rgb(B)
    const mix = (k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(' ')})`
    function frame() {
      now += 16
      if (!still && animate && now - last > 2600) { last = now; drops.push({ x: Math.random() * w, y: Math.random() * h, t: now }) }
      while (drops.length && now - drops[0].t > 4000) drops.shift()
      ctx!.clearRect(0, 0, w, h)
      for (let y = cellSize / 2; y < h + cellSize; y += cellSize) {
        for (let x = cellSize / 2; x < w + cellSize; x += cellSize) {
          let k = 0
          for (const d of drops) {
            const age = (now - d.t) / 1000, r = age * 260, dist = Math.hypot(x - d.x, y - d.y)
            k += Math.max(0, 1 - Math.abs(dist - r) / 40) * Math.max(0, 1 - age / 4)
          }
          const pd = Math.hypot(x - ptr.x, y - ptr.y)
          k += Math.max(0, 1 - pd / 90) * 0.6
          k = Math.min(1, k)
          const s = cellSize * (0.42 + k * 0.4)
          ctx!.fillStyle = k > 0.02 ? mix(k) : A
          ctx!.beginPath(); ctx!.roundRect(x - s / 2, y - s / 2 - k * 3, s, s, s * 0.3); ctx!.fill()
        }
      }
      if (!still) raf = requestAnimationFrame(frame)
    }
    const ro = new ResizeObserver(size); ro.observe(c); size()
    if (!still) raf = requestAnimationFrame(frame)
    const host = c.parentElement!
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    const move = (e: PointerEvent) => { if (interactive) Object.assign(ptr, pos(e)) }
    const leave = () => { ptr.x = ptr.y = -999 }
    const down = (e: PointerEvent) => { if (interactive && !still) drops.push({ ...pos(e), t: now }) }
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave); host.addEventListener('pointerdown', down)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); host.removeEventListener('pointerdown', down) }
  }, [cellSize, base, crest, interactive, animate])

  return (
    <div className={cn('relative isolate overflow-hidden', className)} style={{ '--rt-base': base, '--rt-crest': crest, background: `color-mix(in oklab, var(--rt-base), white 55%)`, ...style } as CSSProperties} {...props}>
      <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full" />
      {children}
    </div>
  )
}
