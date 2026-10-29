'use client'

import { useCallback } from 'react'
import { PixelCanvas, bands, drawSprite, hash, rect, sprite, wrap, type Frame, type PixelCanvasProps } from '@/registry/pixel-art/pixel-2d'

/* -------------------------------------------------------------------------------------------------
 * Reef Bubbles: a flat 2D pixel-art underwater scene. Fish swim past with a two-frame tail
 * flick, kelp sways in stepped segments, light rays drift across the water, a clam lets out
 * bubbles that wobble up to the surface, and a crab shuffles along the sand.
 * -----------------------------------------------------------------------------------------------*/

const PALETTES = {
  tropical: { water: ['#3ec6e0', '#2fb0d4', '#2398c4', '#1a80b0', '#146a98'], sand: '#f0d89a', sandDark: '#d8bc7a', kelp: '#3aa860', coral: ['#ff7a8a', '#ffa64a', '#c86ae0'], fish: ['#ffb02e', '#ff6a5a', '#5ad0ff', '#ffe25a'], ray: '#ffffff' },
  deep: { water: ['#1a3a6a', '#14305a', '#10264a', '#0b1c3a', '#08142c'], sand: '#5a5a7a', sandDark: '#46466a', kelp: '#2a6a5a', coral: ['#7a5ae0', '#4ac0c0', '#e05a9a'], fish: ['#7ae0ff', '#c0a0ff', '#5affc0', '#ffffff'], ray: '#7aa0ff' },
  lagoon: { water: ['#7ee0c8', '#5ccdb6', '#44b8a4', '#32a090', '#24887c'], sand: '#f6e6b8', sandDark: '#e0cc94', kelp: '#4a9a3a', coral: ['#ff9a7a', '#f0e06a', '#ff6aa0'], fish: ['#ff8a3a', '#3a8aff', '#ffd23a', '#ff5a8a'], ray: '#ffffff' },
} as const

export type ReefPalette = keyof typeof PALETTES

export interface ReefBubblesProps extends PixelCanvasProps {
  palette?: ReefPalette
  fishCount?: number
  bubbles?: boolean
}

// 11x7 fish facing right, two tail frames. b body, s stripe, w belly, k eye.
const FISH = [
  ['....bbb....', 'b..bbbbbb..', 'bb.bsbbbkb.', 'bbbbsbbbbbb', 'bb.bswwwww.', 'b..bbwwww..', '....bbb....'],
  ['....bbb....', '...bbbbbb..', '.b.bsbbbkb.', '.bbbsbbbbbb', '.b.bswwwww.', '...bbwwww..', '....bbb....'],
]
// 9x5 crab, two leg frames.
const CRAB = [
  ['c.......c', 'cc.k.k.cc', '.ccccccc.', '.ccccccc.', 'c.c...c.c'],
  ['c.......c', 'cc.k.k.cc', '.ccccccc.', '.ccccccc.', '.c.c.c.c.'],
]
const CLAM = [['..sssss..', '.sllslls.', 'sllslllss', 'ssssssss.'], ['..sssss..', '.sllslls.', 'pwpwpwpw.', 'ssssssss.']]

function drawScene({ ctx, w, h, t }: Frame, paletteName: ReefPalette, fishCount: number, showBubbles: boolean) {
  const p = PALETTES[paletteName] ?? PALETTES.tropical
  const floor = h - Math.max(10, Math.round(h * 0.16))
  bands(ctx, p.water, 0, floor + 4, w)

  // Light rays: slanted dithered stripes drifting sideways.
  ctx.fillStyle = p.ray
  ctx.globalAlpha = 0.12
  for (let r = 0; r < 5; r++) {
    const base = wrap(r * (w / 4) + t * 4, w + 40) - 20
    for (let y = 0; y < floor; y += 1) {
      const x = Math.round(base + y * 0.35)
      for (let dx = 0; dx < 6; dx++) if ((dx + y) % 2 === 0) ctx.fillRect(x + dx, y, 1, 1)
    }
  }
  ctx.globalAlpha = 1
  // Surface shimmer.
  for (let x = 0; x < w; x++) if (Math.sin(x * 0.5 + t * 3) > 0.7) rect(ctx, x, 0, 1, 1, '#ffffff88')

  // Sand with bumps and pebbles.
  for (let x = 0; x < w; x++) {
    const top = floor + Math.round(Math.sin(x * 0.08) * 2 + Math.sin(x * 0.21) * 1)
    rect(ctx, x, top, 1, h - top, p.sand)
    if (hash(x, 1) > 0.9) rect(ctx, x, top + 2 + Math.floor(hash(x, 2) * (h - top - 3)), 1, 1, p.sandDark)
  }

  // Kelp: stacked 2px segments, each bending a little more toward the tip.
  for (let k = 0; k < Math.max(4, Math.floor(w / 28)); k++) {
    const x0 = Math.round(hash(k, 3) * w)
    const tall = Math.round(floor * (0.3 + hash(k, 4) * 0.45))
    for (let s = 0; s < tall; s += 2) {
      const bend = Math.round(Math.sin(t * 1.4 + k + s * 0.08) * (s / tall) * 4)
      rect(ctx, x0 + bend, floor - s, 2, 2, p.kelp)
      if (s % 8 === 4) rect(ctx, x0 + bend + (k % 2 ? 2 : -2), floor - s, 2, 1, p.kelp)
    }
  }
  // Coral clumps.
  for (let c = 0; c < Math.max(3, Math.floor(w / 45)); c++) {
    const x0 = Math.round(hash(c, 5) * w)
    const color = p.coral[c % p.coral.length]
    for (let b = 0; b < 4; b++) {
      const bh = 4 + Math.floor(hash(c, b + 6) * 8)
      rect(ctx, x0 + b * 2, floor - bh, 1, bh, color)
      rect(ctx, x0 + b * 2 - 1, floor - bh, 3, 1, color)
    }
  }

  // Clam that opens to puff bubbles.
  const clamX = Math.round(w * 0.7)
  const open = wrap(t, 4) < 1.2
  drawSprite(ctx, sprite(CLAM[open ? 1 : 0], { s: '#b88ab8', l: '#e0b8e0', p: '#fff4e0', w: '#ffffff' }), clamX, floor - 3)
  if (showBubbles) {
    for (let i = 0; i < 14; i++) {
      const life = 3 + hash(i, 10) * 2
      const k = wrap(t + (i / 14) * life, life) / life
      const fromClam = i % 2 === 0
      const x0 = fromClam ? clamX + 4 : hash(i, 11) * w
      const x = x0 + Math.round(Math.sin(k * 14 + i) * 2)
      const y = (fromClam ? floor - 3 : floor) - k * (floor + 2)
      const big = hash(i, 12) > 0.6
      ctx.fillStyle = '#ffffffcc'
      if (big) {
        ctx.fillRect(Math.round(x), Math.round(y) - 1, 2, 1)
        ctx.fillRect(Math.round(x) - 1, Math.round(y), 1, 2)
        ctx.fillRect(Math.round(x) + 2, Math.round(y), 1, 2)
        ctx.fillRect(Math.round(x), Math.round(y) + 2, 2, 1)
      } else ctx.fillRect(Math.round(x), Math.round(y), 1, 1)
    }
  }

  // Fish: each on its own lane, speed and direction, with a 2-frame tail flick.
  const count = Math.max(1, Math.min(12, Math.round(fishCount)))
  for (let i = 0; i < count; i++) {
    const dir = hash(i, 13) > 0.4 ? 1 : -1
    const v = 10 + hash(i, 14) * 14
    const lane = 6 + hash(i, 15) * (floor - 20)
    const x = dir > 0 ? wrap(hash(i, 16) * w + t * v, w + 30) - 15 : w + 15 - wrap(hash(i, 16) * w + t * v, w + 30)
    const y = lane + Math.round(Math.sin(t * 1.5 + i) * 2)
    const color = p.fish[i % p.fish.length]
    const s = sprite(FISH[Math.floor(t * 6 + i) % 2], { b: color, s: '#ffffff', w: '#ffffffaa', k: '#1a1a2a' })
    drawSprite(ctx, s, x, y, dir < 0)
  }

  // Crab shuffling side to side.
  const crabX = Math.round(w * 0.25 + Math.sin(t * 0.5) * w * 0.12)
  drawSprite(ctx, sprite(CRAB[Math.floor(t * 6) % 2], { c: '#e0503a', k: '#1a1a2a' }), crabX, floor - 4)
}

/** Flat 2D pixel-art underwater reef with fish and bubbles. Put any content inside it as children. */
export function ReefBubbles({ palette = 'tropical', fishCount = 6, bubbles = true, children, ...props }: ReefBubblesProps) {
  const draw = useCallback((f: Frame) => drawScene(f, palette, fishCount, bubbles), [palette, fishCount, bubbles])
  return (
    <PixelCanvas {...props} draw={draw} label="Pixel-art underwater reef with swimming fish and rising bubbles" background={PALETTES[palette]?.water[2]}>
      {children}
    </PixelCanvas>
  )
}
