'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/*
 * Pixel 2D kit: flat, sprite-style pixel art on a tiny <canvas>.
 *
 *  - <PixelCanvas>   sizes a low-res canvas to fill its box (one art pixel = `pixelSize` CSS px),
 *                    upscales it with nearest-neighbour, centers it, and runs a requestAnimationFrame
 *                    loop that only repaints `fps` times a second for a frame-by-frame feel.
 *  - sprite()        turns a string grid into a cached offscreen sprite (one char = one pixel).
 *  - drawSprite()    blits a sprite at whole pixels, optionally mirrored.
 *  - bands()         a banded sky/water gradient with a checker dither between bands.
 *  - hash() / rect() small helpers for deterministic sprinkles and filled boxes.
 *
 * Scenes are pure functions of time: draw(frame) paints everything from `frame.t`, so pausing,
 * scrubbing speed and reduced motion need no extra state. Reduced motion shows one still frame.
 */

export interface Frame {
  ctx: CanvasRenderingContext2D
  /** Canvas size in art pixels. */
  w: number
  h: number
  /** Scene time in seconds (speed-scaled, frozen while paused). */
  t: number
}

export type DrawFn = (frame: Frame) => void

export interface PixelCanvasProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** CSS pixels per art pixel. Bigger = chunkier pixels. */
  pixelSize?: number
  /** Animation speed multiplier. */
  speed?: number
  /** Freeze on the current frame. */
  paused?: boolean
  /** Repaints per second. Low values give a steppy, hand-animated look. */
  fps?: number
  /** Overlay content (rendered above the art). */
  children?: ReactNode
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** Still frame used when motion is reduced: a moment where every scene looks busy. */
const STILL_TIME = 3.2

export function PixelCanvas({
  draw,
  label,
  pixelSize = 4,
  speed = 1,
  paused = false,
  fps = 12,
  background = '#000',
  className,
  style,
  children,
  ...props
}: PixelCanvasProps & {
  draw: DrawFn
  /** Accessible description of the scene. */
  label: string
  /** Fill behind the canvas (shows while it loads). */
  background?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  // Latest values for the loop, so changing a prop never restarts it.
  const live = useRef({ draw, speed, paused, fps, reduced, pixelSize })
  const dirty = useRef(true)
  // After every render: hand the loop the new props and repaint once (covers paused/reduced motion).
  useLayoutEffect(() => {
    live.current = { draw, speed, paused, fps, reduced, pixelSize }
    dirty.current = true
  })

  useEffect(() => {
    const el = box.current
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!el || !cv || !ctx) return

    let visible = true
    let thumbnail = false
    let size = { w: 0, h: 0 }
    const fit = (cssW: number, cssH: number) => {
      const px = Math.max(1, Math.round(live.current.pixelSize))
      const w = Math.max(16, Math.ceil(cssW / px))
      const h = Math.max(16, Math.ceil(cssH / px))
      if (w !== cv.width || h !== cv.height) {
        cv.width = w
        cv.height = h
      }
      // Whole-pixel upscale, centered; the box clips the (at most one art pixel of) overflow.
      cv.style.width = `${w * px}px`
      cv.style.height = `${h * px}px`
      size = { w, h }
      dirty.current = true
    }
    // ResizeObserver reports layout size, so a CSS-scaled gallery thumbnail still fills its card.
    const resize = new ResizeObserver(([entry]) => {
      thumbnail = entry.target.closest('[inert]') !== null
      fit(entry.contentRect.width, entry.contentRect.height)
    })
    resize.observe(el)
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    seen.observe(el)

    let raf = 0
    let last = performance.now()
    let sinceRepaint = Infinity
    let t = 0
    let lastPx = live.current.pixelSize
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const s = live.current
      if (s.pixelSize !== lastPx) {
        lastPx = s.pixelSize
        fit(el.clientWidth, el.clientHeight)
      }
      const moving = !s.paused && !s.reduced && visible && !document.hidden
      if (moving) t += dt * s.speed
      sinceRepaint += dt
      const rate = Math.max(1, Math.min(60, thumbnail ? Math.min(s.fps, 8) : s.fps))
      if (size.w === 0) return
      // Off-screen scenes still paint when something changed (first frame, resize, props), then idle.
      if (!dirty.current && !(moving && sinceRepaint >= 1 / rate)) return
      sinceRepaint = 0
      dirty.current = false
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, size.w, size.h)
      s.draw({ ctx, w: size.w, h: size.h, t: s.reduced ? STILL_TIME : t })
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      resize.disconnect()
      seen.disconnect()
    }
  }, [])

  return (
    <div
      className={cn('relative isolate overflow-hidden', className)}
      style={{ background, ...style }}
      {...props}
    >
      <div ref={box} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <canvas
          ref={canvas}
          role="img"
          aria-label={label}
          className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------- sprites */

export interface Sprite {
  w: number
  h: number
  image: HTMLCanvasElement
}

const spriteCache = new Map<string, Sprite>()

/**
 * Build a sprite from rows of characters. Each char is looked up in `colors`; anything else
 * (use '.') is transparent. Cached, so it is fine to call every frame.
 */
export function sprite(rows: readonly string[], colors: Record<string, string>): Sprite {
  const key = `${rows.join('/')}|${JSON.stringify(colors)}`
  const hit = spriteCache.get(key)
  if (hit) return hit
  const w = Math.max(...rows.map((r) => r.length))
  const h = rows.length
  const image = document.createElement('canvas')
  image.width = w
  image.height = h
  const ctx = image.getContext('2d')!
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = colors[row[x]]
      if (!color) continue
      ctx.fillStyle = color
      ctx.fillRect(x, y, 1, 1)
    }
  })
  const made = { w, h, image }
  spriteCache.set(key, made)
  return made
}

/** Draw a sprite with its top-left at (x, y), snapped to whole pixels. */
export function drawSprite(ctx: CanvasRenderingContext2D, s: Sprite, x: number, y: number, flip = false) {
  const px = Math.round(x)
  const py = Math.round(y)
  if (!flip) {
    ctx.drawImage(s.image, px, py)
    return
  }
  ctx.save()
  ctx.translate(px + s.w, py)
  ctx.scale(-1, 1)
  ctx.drawImage(s.image, 0, 0)
  ctx.restore()
}

/* ---------------------------------------------------------------- helpers */

/** Filled box at whole pixels. */
export function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

/** Deterministic 0..1 noise for an integer (or a few), for star fields and window lights. */
export function hash(a: number, b = 0) {
  let n = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)
  n = Math.imul(n ^ (n >>> 13), 1274126177)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}

/**
 * Horizontal color bands from `top` to `top + height`, with a two-row checker dither where
 * neighbouring bands meet: the classic pixel-art gradient.
 */
export function bands(ctx: CanvasRenderingContext2D, colors: readonly string[], top: number, height: number, w: number) {
  const n = colors.length
  const step = height / n
  for (let i = 0; i < n; i++) {
    const y0 = Math.round(top + i * step)
    const y1 = Math.round(top + (i + 1) * step)
    rect(ctx, 0, y0, w, y1 - y0, colors[i])
    if (i === 0) continue
    ctx.fillStyle = colors[i - 1]
    for (let x = 0; x < w; x += 2) {
      ctx.fillRect(x, y0, 1, 1)
      ctx.fillRect(x + 1, y0 + 1, 1, 1)
    }
  }
}

/** Positive modulo, handy for wrapping scrolling layers. */
export const wrap = (value: number, size: number) => ((value % size) + size) % size
