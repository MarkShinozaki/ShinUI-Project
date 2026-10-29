'use client'

import { useCallback } from 'react'
import { PixelCanvas, bands, hash, rect, wrap, type Frame, type PixelCanvasProps } from '@/registry/pixel-art/pixel-2d'

/* -------------------------------------------------------------------------------------------------
 * City Dusk: a flat 2D pixel-art skyline. Windows blink on and off in their own rhythm, a red
 * beacon pulses on the tallest roof, a plane drifts by, and every so often a commuter train
 * rattles across an elevated track with its window strip lit, reflected in the river below.
 * -----------------------------------------------------------------------------------------------*/

const TIMES = {
  dusk: { sky: ['#2c2a5a', '#4a3a72', '#7a4a7a', '#b0607a', '#e08a6e', '#f4b47a'], sun: '#ffd27a', far: '#5a4a78', near: '#2a2444', lit: 0.45, water: '#3a3260' },
  night: { sky: ['#070b1e', '#0b1128', '#101834', '#152040', '#1a284c'], sun: '#e8ecff', far: '#1c2440', near: '#0d1226', lit: 0.6, water: '#0b1228' },
  dawn: { sky: ['#6a8ac8', '#8aa2d2', '#b8b0d0', '#e8bcc0', '#f8d2b0'], sun: '#fff0c0', far: '#8a90b4', near: '#4a4e70', lit: 0.18, water: '#7a84b0' },
} as const

export type CityDuskTimeOfDay = keyof typeof TIMES

export interface CityDuskProps extends PixelCanvasProps {
  timeOfDay?: CityDuskTimeOfDay
  /** Seconds between trains. */
  trainInterval?: number
  /** Lit window color. */
  windowColor?: string
}

function drawScene({ ctx, w, h, t }: Frame, timeOfDay: CityDuskTimeOfDay, interval: number, windowColor: string) {
  const c = TIMES[timeOfDay] ?? TIMES.dusk
  const water = Math.round(h * 0.78)
  const street = water - 2
  bands(ctx, c.sky, 0, water, w)

  if (timeOfDay === 'night')
    for (let i = 0; i < 60; i++) if (hash(i, Math.floor(t + i)) > 0.2) rect(ctx, hash(i, 1) * w, hash(i, 2) * water * 0.5, 1, 1, '#c8d0f0')

  // Low sun (or moon) sitting behind the towers.
  ctx.fillStyle = c.sun
  ctx.beginPath()
  ctx.arc(Math.round(w * 0.3), Math.round(water * (timeOfDay === 'night' ? 0.2 : 0.62)), 12, 0, Math.PI * 2)
  ctx.fill()

  // Plane with a blinking light, crossing slowly.
  const px = wrap(t * 9, w + 60) - 30
  const py = Math.round(water * 0.14)
  rect(ctx, px, py, 5, 1, c.near)
  rect(ctx, px + 2, py - 1, 1, 1, c.near)
  if (Math.floor(t * 2) % 2) rect(ctx, px + 5, py, 1, 1, '#ff5a5a')

  // Far skyline: flat silhouettes.
  for (let x = 0, i = 0; x < w; i++) {
    const bw = 6 + Math.floor(hash(i, 3) * 10)
    const bh = Math.round(water * (0.25 + hash(i, 4) * 0.25))
    rect(ctx, x, street - bh, bw, bh, c.far)
    x += bw
  }

  // Near towers with window grids. Each window has its own on/off beat.
  let tallest = { x: 0, top: street, w: 0 }
  for (let x = -2, i = 100; x < w; i++) {
    const bw = 12 + Math.floor(hash(i, 5) * 14)
    const bh = Math.round(water * (0.3 + hash(i, 6) * 0.38))
    const top = street - bh
    if (top < tallest.top) tallest = { x, top, w: bw }
    rect(ctx, x, top, bw, bh, c.near)
    if (hash(i, 7) > 0.5) rect(ctx, x + 2, top - 2, bw - 4, 2, c.near) // roof step
    for (let wy = top + 3, row = 0; wy < street - 3; wy += 4, row++) {
      for (let wx = x + 2, col = 0; wx < x + bw - 2; wx += 3, col++) {
        const id = i * 997 + row * 31 + col
        const period = 3 + hash(id, 8) * 9
        const on = hash(id, Math.floor((t + hash(id, 9) * period) / period)) < c.lit
        rect(ctx, wx, wy, 1, 2, on ? windowColor : '#00000030')
      }
    }
    x += bw + 1 + Math.floor(hash(i, 10) * 3)
  }
  // Beacon on the tallest roof.
  const bx = tallest.x + Math.floor(tallest.w / 2)
  rect(ctx, bx, tallest.top - 8, 1, 8, c.near)
  if (wrap(t, 1.4) < 0.5) {
    rect(ctx, bx, tallest.top - 9, 1, 1, '#ff4a4a')
    ctx.globalAlpha = 0.35
    rect(ctx, bx - 1, tallest.top - 10, 3, 3, '#ff4a4a')
    ctx.globalAlpha = 1
  }

  // Elevated rail: deck and pillars.
  const deck = Math.round(street - water * 0.16)
  rect(ctx, 0, deck, w, 2, '#1a1a26')
  rect(ctx, 0, deck + 2, w, 1, '#2a2a3a')
  for (let x = 6; x < w; x += 24) rect(ctx, x, deck + 3, 2, street - deck - 3, '#1a1a26')

  // Train: one pass per interval, left to right.
  const every = Math.max(4, interval)
  const cars = 4
  const carW = 22
  const length = cars * (carW + 1)
  const k = wrap(t, every) / 3.2 // seconds to cross
  if (k < 1) {
    const tx = Math.round(-length + k * (w + length))
    for (let car = 0; car < cars; car++) {
      const x = tx + car * (carW + 1)
      rect(ctx, x, deck - 7, carW, 7, '#c9ccd6')
      rect(ctx, x, deck - 2, carW, 1, '#e5483d')
      rect(ctx, x + 1, deck - 6, carW - 2, 3, '#2a2a3a')
      for (let wx = x + 2; wx < x + carW - 2; wx += 4) rect(ctx, wx, deck - 6, 3, 2, '#fff1b0')
      if (car === cars - 1) {
        rect(ctx, x + carW, deck - 6, 2, 6, '#c9ccd6')
        rect(ctx, x + carW + 1, deck - 3, 1, 1, '#fff8d8')
      }
    }
  }

  // Street with lamps, river with broken reflections.
  rect(ctx, 0, street, w, 2, '#14141e')
  for (let x = 10; x < w; x += 30) {
    rect(ctx, x, street - 6, 1, 6, '#2a2a3a')
    rect(ctx, x - 1, street - 7, 3, 1, timeOfDay === 'dawn' ? '#8a8aa0' : '#ffd88a')
  }
  rect(ctx, 0, water, w, h - water, c.water)
  for (let y = water + 1; y < h; y += 2) {
    const shift = Math.round(Math.sin(t * 2 + y * 0.7) * 2)
    for (let x = 0; x < w; x += 3) {
      if (hash(x + shift * 5, y) > 0.93) rect(ctx, x + shift, y, 2, 1, hash(x, y + 1) > 0.5 ? windowColor : c.sun)
    }
  }
}

/** Flat 2D pixel-art city skyline with blinking windows and a passing train. Put any content inside it as children. */
export function CityDusk({ timeOfDay = 'dusk', trainInterval = 9, windowColor = '#ffd27a', children, ...props }: CityDuskProps) {
  const draw = useCallback((f: Frame) => drawScene(f, timeOfDay, trainInterval, windowColor), [timeOfDay, trainInterval, windowColor])
  return (
    <PixelCanvas {...props} draw={draw} label="Pixel-art city skyline at dusk with a passing train" background={TIMES[timeOfDay]?.sky[0]}>
      {children}
    </PixelCanvas>
  )
}
