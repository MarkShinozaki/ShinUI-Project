'use client'

import { useCallback } from 'react'
import { PixelCanvas, bands, drawSprite, hash, rect, sprite, wrap, type Frame, type PixelCanvasProps } from '@/registry/pixel-art/pixel-2d'

/* -------------------------------------------------------------------------------------------------
 * Campfire Night: a flat 2D pixel-art campsite. A fire flickers through hand-drawn flame frames,
 * throws sparks and a breathing glow on the ground, stars twinkle over a pine ridge and the odd
 * shooting star streaks past. A tent and a log bench sit in the firelight.
 * -----------------------------------------------------------------------------------------------*/

const FIRES = {
  campfire: { 1: '#b8322a', 2: '#ee7a2a', 3: '#ffc23d', 4: '#fff2b0', glow: '#ff9a3c' },
  driftwood: { 1: '#2a5ab8', 2: '#3a9ad8', 3: '#6ee0d0', 4: '#e6fff6', glow: '#5ad0e0' },
  ember: { 1: '#7a1e3a', 2: '#c23a4a', 3: '#f2785a', 4: '#ffd0a0', glow: '#e0506a' },
} as const

export type CampfireFire = keyof typeof FIRES

export interface CampfireNightProps extends PixelCanvasProps {
  /** Flame colors: classic orange, blue-green driftwood or deep ember. */
  fire?: CampfireFire
  shootingStars?: boolean
  showTent?: boolean
}

// Four flame frames, 11x15. 1 deep, 2 mid, 3 bright, 4 core.
const FLAME = [
  ['.....1.....', '.....1.....', '....11.....', '....121..1.', '...1121..1.', '...12221.1.', '..1222211..', '..12232221.', '.112233221.', '.122333221.', '.1223433221', '12233443321', '12234443321', '12234443321', '.123444321.'],
  ['...........', '......1....', '.1....11...', '.1...121...', '..1..1221..', '..1.12221..', '...112321..', '..1223321..', '..12233221.', '.122333321.', '.1223443221', '12234433221', '12234443321', '12334443321', '.123444321.'],
  ['....1......', '....1......', '....11.....', '...121.....', '...1221..1.', '..12221..1.', '..122321.1.', '.1223321...', '.12233221..', '.122343221.', '.1233443221', '12234443321', '12234443321', '12234443321', '.123444321.'],
  ['...........', '.......1...', '......11...', '.....121...', '.1...1221..', '.1..12221..', '..1122321..', '..12233221.', '.122333221.', '.1223433221', '.1223443321', '12234443321', '12334443321', '12234443321', '.123444321.'],
]
const LOGS = ['.kk.......kk.', 'kwwkk...kkwwk', '.kwwwkkkwwwk.', '..kkwwwwwkk..', '.kwwwkkkwwwk.', 'kyykk...kkyyk', '.kk.......kk.']
const STONE = ['.ss.', 'sggs', 'sggs', '.ss.']

function drawScene({ ctx, w, h, t }: Frame, fire: CampfireFire, shootingStars: boolean, showTent: boolean) {
  const f = FIRES[fire] ?? FIRES.campfire
  const horizon = Math.round(h * 0.62)
  bands(ctx, ['#070a1c', '#0b1026', '#0f1630', '#141c3a', '#1a2444'], 0, horizon, w)

  // Stars: fixed field, each twinkling on its own beat.
  for (let i = 0; i < Math.round((w * horizon) / 90); i++) {
    const x = Math.floor(hash(i, 1) * w)
    const y = Math.floor(hash(i, 2) * horizon * 0.85)
    const tw = Math.sin(t * (1 + hash(i, 3) * 3) + i)
    if (tw < -0.6) continue
    const big = hash(i, 4) > 0.93
    rect(ctx, x, y, 1, 1, tw > 0.6 ? '#ffffff' : '#9aa8d8')
    if (big && tw > 0.3) {
      rect(ctx, x - 1, y, 1, 1, '#6a78b0')
      rect(ctx, x + 1, y, 1, 1, '#6a78b0')
      rect(ctx, x, y - 1, 1, 1, '#6a78b0')
      rect(ctx, x, y + 1, 1, 1, '#6a78b0')
    }
  }
  // Moon.
  ctx.fillStyle = '#f2ecd0'
  ctx.beginPath()
  ctx.arc(Math.round(w * 0.82), Math.round(horizon * 0.22), 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#d9d2b4'
  rect(ctx, Math.round(w * 0.82) - 3, Math.round(horizon * 0.22) - 2, 2, 2, '#d9d2b4')
  rect(ctx, Math.round(w * 0.82) + 2, Math.round(horizon * 0.22) + 2, 2, 1, '#d9d2b4')

  // A shooting star every ~7s, on a different path each time.
  if (shootingStars) {
    const n = Math.floor(t / 7)
    const k = wrap(t, 7) / 0.9
    if (k < 1) {
      const x0 = hash(n, 5) * w * 0.7
      const y0 = 4 + hash(n, 6) * horizon * 0.3
      for (let s = 0; s < 8; s++) {
        const p = k - s * 0.025
        if (p < 0) continue
        ctx.globalAlpha = 1 - s / 8
        rect(ctx, x0 + p * 60, y0 + p * 22, 1, 1, '#ffffff')
      }
      ctx.globalAlpha = 1
    }
  }

  // Pine ridge silhouette on the horizon.
  for (let x = 0; x < w; x++) {
    const tree = wrap(x + Math.floor(hash(Math.floor(x / 7), 9) * 3), 7)
    const tall = 4 + Math.floor(hash(Math.floor(x / 7), 8) * 10)
    const top = horizon - Math.max(0, tall - Math.abs(tree - 3) * 3) - 3
    rect(ctx, x, top, 1, horizon - top + 1, '#060812')
  }

  // Ground.
  rect(ctx, 0, horizon, w, h - horizon, '#1a1a22')
  for (let i = 0; i < w / 3; i++) rect(ctx, hash(i, 13) * w, horizon + 2 + hash(i, 14) * (h - horizon), 1, 1, '#24242e')

  const fx = Math.round(w / 2)
  const fy = Math.round(horizon + (h - horizon) * 0.55)
  // Glow that breathes with the fire: stacked dithered ellipses.
  const pulse = 1 + Math.sin(t * 9) * 0.05 + Math.sin(t * 23) * 0.03
  for (let ring = 4; ring >= 1; ring--) {
    ctx.globalAlpha = 0.08 + (4 - ring) * 0.035
    ctx.fillStyle = f.glow
    ctx.beginPath()
    ctx.ellipse(fx, fy, ring * 15 * pulse, ring * 5 * pulse, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Tent on the left, lit on the side facing the fire.
  if (showTent) {
    const tx = fx - Math.min(70, Math.round(w * 0.3))
    const ty = fy + 2
    for (let row = 0; row < 22; row++) {
      const half = Math.round(row * 0.95)
      rect(ctx, tx - half, ty - 22 + row, half, 1, '#3d4f6e')
      rect(ctx, tx, ty - 22 + row, half + 1, 1, '#6a7aa0')
    }
    for (let row = 6; row < 22; row++) rect(ctx, tx - Math.round((row - 6) * 0.35), ty - 22 + row, Math.round((row - 6) * 0.7) + 1, 1, '#1a2236')
    rect(ctx, tx - 22, ty, 45, 1, '#0e0e14')
  }
  // Log bench on the right.
  const bx = fx + Math.min(34, Math.round(w * 0.16))
  rect(ctx, bx, fy - 3, 26, 5, '#5a3a26')
  rect(ctx, bx, fy - 3, 26, 1, '#8a5a36')
  rect(ctx, bx + 25, fy - 3, 2, 5, '#c08a54')

  // Stones, logs and the flame (picked from the frame strip).
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    drawSprite(ctx, sprite(STONE, { s: '#3a3a46', g: '#5a5a66' }), fx - 2 + Math.cos(a) * 9, fy - 1 + Math.sin(a) * 3)
  }
  drawSprite(ctx, sprite(LOGS, { k: '#2a1a16', w: '#6e4426', y: '#c08a54' }), fx - 6, fy - 5)
  const flame = sprite(FLAME[Math.floor(t * 10) % FLAME.length], f)
  drawSprite(ctx, flame, fx - 5, fy - 16, Math.floor(t * 2.5) % 2 === 1)

  // Sparks rise, drift and wink out.
  for (let i = 0; i < 12; i++) {
    const life = 1.6 + hash(i, 15)
    const k = wrap(t + hash(i, 16) * life, life) / life
    const x = fx + (hash(i, 17) - 0.5) * 8 + Math.sin(k * 6 + i) * 4
    const y = fy - 12 - k * 40
    if (k > 0.85) continue
    rect(ctx, x, y, 1, 1, k < 0.4 ? f[4] : k < 0.65 ? f[3] : f[2])
  }
}

/** Flat 2D pixel-art campfire under the stars. Put any content inside it as children. */
export function CampfireNight({ fire = 'campfire', shootingStars = true, showTent = true, children, ...props }: CampfireNightProps) {
  const draw = useCallback((fr: Frame) => drawScene(fr, fire, shootingStars, showTent), [fire, shootingStars, showTent])
  return (
    <PixelCanvas {...props} draw={draw} label="Pixel-art campfire flickering under a starry sky" background="#070a1c">
      {children}
    </PixelCanvas>
  )
}
