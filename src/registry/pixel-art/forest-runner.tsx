'use client'

import { useCallback } from 'react'
import { PixelCanvas, bands, drawSprite, frameAt, hash, rect, sprite, wrap, type Frame, type PixelCanvasProps } from '@/registry/pixel-art/pixel-2d'

/* -------------------------------------------------------------------------------------------------
 * Forest Runner: a flat 2D side-scroller loop. A little runner jogs through a forest on a
 * four-frame run cycle and hops over rocks and logs, while sky, mountains, pines, trees and
 * ground scroll at different rates for parallax. Fireflies come out at night.
 * -----------------------------------------------------------------------------------------------*/

const TIMES = {
  day: { sky: ['#7cc4f0', '#93d0f2', '#aadbf4', '#c4e7f5'], sun: '#fff3b0', far: '#8fb8c9', mid: '#5f9a7a', near: '#3f7a52', trunk: '#6b4a32', grass: '#7bc35a', dirt: '#9a6b43', dirtDark: '#7d5434', stars: false },
  sunset: { sky: ['#4a3b6e', '#8a4f78', '#d06a6a', '#f09a66', '#f7c27a'], sun: '#ffe08a', far: '#7a5a7a', mid: '#5a4a5e', near: '#3a3346', trunk: '#3a2a2e', grass: '#6a7a4a', dirt: '#6e4a3a', dirtDark: '#553828', stars: false },
  night: { sky: ['#0b1028', '#111a3a', '#18244a', '#203058'], sun: '#e8ecff', far: '#26345a', mid: '#1c2a44', near: '#142034', trunk: '#1a1820', grass: '#2f5a44', dirt: '#3a3040', dirtDark: '#2a2230', stars: true },
} as const

export type ForestRunnerTimeOfDay = keyof typeof TIMES

export interface ForestRunnerProps extends PixelCanvasProps {
  timeOfDay?: ForestRunnerTimeOfDay
  /** Runner shirt color. */
  shirtColor?: string
  /** Rocks and logs to hop over. */
  obstacles?: boolean
}

// 10x14 runner facing right. h hair, s skin, k eye, c shirt, r far arm, p near leg, q far leg, f shoe.
const HEAD = ['...hhhh...', '..hhhhss..', '..hhsssk..', '..hsssss..', '...ssss...']
const RUN = [
  [...HEAD, '...cccc...', '..rccccs..', '.r.cccc.s.', '...cccc...', '...pppq...', '..pp..qq..', '.pp....q..', '.f.....qf.', '..........'],
  [...HEAD, '...cccc...', '...ccccs..', '...rcccs..', '...cccc...', '...ppqq...', '....pq....', '....pq....', '....fq....', '.....f....'],
  [...HEAD, '...cccc...', '..sccccr..', '.s.cccc.r.', '...cccc...', '...qqqp...', '..qq..pp..', '.qq....p..', '.f.....pf.', '..........'],
  [...HEAD, '...cccc...', '...ccccr..', '...scccr..', '...cccc...', '...qqpp...', '....qp....', '....qp....', '....fp....', '.....f....'],
]
const JUMP = [...HEAD, '..scccc.s.', '...cccc...', '...cccc...', '...cccc...', '..pppqq...', '.pp...qq..', '.f.....f..', '..........', '..........']
const ROCK = ['..kkkk..', '.kgggok.', 'kggoooqk', 'kgooooqk', 'kkkkkkkk']
const LOG = ['.kkkkkkkkkk.', 'kwwwwwwwwwyk', 'kwvwwwvwwyyk', 'kkkkkkkkkkkk']

const RUNNER_X = 0.32
const GAP = 70 // px between obstacles on average

function ridge(x: number, seed: number, amp: number) {
  return Math.sin(x * 0.035 + seed) * amp + Math.sin(x * 0.083 + seed * 2.3) * amp * 0.45 + Math.sin(x * 0.17 + seed * 4.1) * amp * 0.15
}

function drawScene({ ctx, w, h, t }: Frame, timeOfDay: ForestRunnerTimeOfDay, shirt: string, obstacles: boolean) {
  const c = TIMES[timeOfDay] ?? TIMES.day
  const ground = h - Math.max(14, Math.round(h * 0.2))
  const scroll = t * 42

  bands(ctx, c.sky, 0, ground, w)
  if (c.stars) for (let i = 0; i < 70; i++) {
    const x = Math.floor(hash(i, 11) * w)
    const y = Math.floor(hash(i, 12) * ground * 0.6)
    if (hash(i, Math.floor(t * 2 + i)) > 0.15) rect(ctx, x, y, 1, 1, '#dfe6ff')
  }
  // Sun or moon.
  const sx = Math.round(w * 0.74)
  const sy = Math.round(ground * (timeOfDay === 'sunset' ? 0.55 : 0.25))
  ctx.fillStyle = c.sun
  ctx.beginPath()
  ctx.arc(sx, sy, 9, 0, Math.PI * 2)
  ctx.fill()
  if (timeOfDay === 'night') {
    ctx.fillStyle = c.sky[1]
    ctx.beginPath()
    ctx.arc(sx + 4, sy - 3, 8, 0, Math.PI * 2)
    ctx.fill()
  }

  // Far mountains (slowest), then a row of pines, then big near trees.
  const farOff = scroll * 0.1
  for (let x = 0; x < w; x++) {
    const top = Math.round(ground - 34 - ridge(x + farOff, 1.7, 12))
    rect(ctx, x, top, 1, ground - top, c.far)
  }
  const midOff = scroll * 0.35
  for (let x = 0; x < w; x++) {
    const top = Math.round(ground - 16 - ridge(x + midOff, 4.2, 4))
    rect(ctx, x, top, 1, ground - top, c.mid)
  }
  const pineStep = 13
  for (let i = Math.floor(midOff / pineStep) - 1; i * pineStep - midOff < w + pineStep; i++) {
    const x = Math.round(i * pineStep - midOff + hash(i, 5) * 6)
    const size = 10 + Math.floor(hash(i, 6) * 10)
    const base = ground - 14
    for (let row = 0; row < size; row++) {
      const half = Math.floor(((row % 5) + row / 2) / 1.6) + 1
      rect(ctx, x - half, base - size + row, half * 2 + 1, 1, c.mid)
    }
  }
  const nearOff = scroll * 0.65
  const treeStep = 46
  for (let i = Math.floor(nearOff / treeStep) - 1; i * treeStep - nearOff < w + treeStep; i++) {
    const x = Math.round(i * treeStep - nearOff + hash(i, 8) * 18)
    const tall = 26 + Math.floor(hash(i, 9) * 16)
    rect(ctx, x, ground - tall, 4, tall, c.trunk)
    for (let b = 0; b < 3; b++) {
      ctx.fillStyle = c.near
      ctx.beginPath()
      ctx.arc(x + 2 + (b - 1) * 6, ground - tall - 2 + (b === 1 ? -5 : 0), 8, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Ground: grass lip with tufts, dirt tiles below.
  rect(ctx, 0, ground, w, h - ground, c.dirt)
  rect(ctx, 0, ground, w, 3, c.grass)
  for (let x = 0; x < w; x++) {
    const wx = Math.floor(x + scroll)
    if (hash(wx, 1) > 0.8) rect(ctx, x, ground - 1, 1, 1, c.grass)
    if (wrap(wx, 16) === 0) rect(ctx, x, ground + 3, 1, h - ground, c.dirtDark)
    if (hash(wx, 2) > 0.93) rect(ctx, x, ground + 6 + Math.floor(hash(wx, 3) * (h - ground - 8)), 2, 1, c.dirtDark)
  }

  // Obstacles at fixed world positions; the runner jumps based on distance, so no state.
  const rx = Math.round(w * RUNNER_X)
  let lift = 0
  if (obstacles) {
    const first = Math.floor((scroll - w) / GAP) - 1
    for (let i = first; i < first + Math.ceil((w * 2) / GAP) + 2; i++) {
      if (hash(i, 21) < 0.35) continue
      const worldX = i * GAP + hash(i, 22) * 30
      const x = worldX - scroll + rx
      const isLog = hash(i, 23) > 0.5
      const s = isLog
        ? sprite(LOG, { k: '#2a2230', w: '#a0703f', v: '#7d5434', y: '#d9b07a' })
        : sprite(ROCK, { k: '#2a2230', g: '#b8b4ac', o: '#97938c', q: '#7a766f' })
      if (x > -s.w && x < w) drawSprite(ctx, s, x, ground - s.h + 1)
      // Jump arc: start 14px before the obstacle, land after it.
      const d = rx + 5 - x
      const span = s.w + 26
      const k = (d + 14) / span
      if (k > 0 && k < 1) lift = Math.max(lift, Math.sin(k * Math.PI) * 15)
    }
  }

  const colors = { h: '#3a2a26', s: '#f2c29b', k: '#2a2230', c: shirt, r: '#d9a77f', p: '#3a4a7a', q: '#2a365c', f: '#f4f1ea' }
  const rows = lift > 0.5 ? JUMP : RUN[frameAt(t * 10, RUN.length)]
  const runner = sprite(rows, colors)
  const bob = lift > 0.5 ? 0 : Math.floor(t * 10) % 2
  // Shadow on the ground that shrinks while airborne.
  const shadow = Math.max(2, 6 - Math.round(lift / 4))
  rect(ctx, rx + 5 - shadow / 2, ground, shadow, 1, '#00000033')
  drawSprite(ctx, runner, rx, ground - runner.h + 1 - lift - bob)

  // Fireflies at night, birds by day.
  if (c.stars) {
    for (let i = 0; i < 14; i++) {
      const x = wrap(hash(i, 31) * w - scroll * 0.5 + Math.sin(t + i) * 6, w)
      const y = ground - 6 - hash(i, 32) * 30 + Math.sin(t * 1.3 + i * 2) * 3
      if (Math.sin(t * 2 + i * 1.7) > 0.2) rect(ctx, x, y, 1, 1, '#e4ff7a')
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const x = wrap(w - t * (12 + i * 4) - i * 60, w + 40) - 20
      const y = 12 + i * 7 + Math.round(Math.sin(t * 2 + i) * 2)
      const up = Math.floor(t * 6 + i) % 2
      const col = timeOfDay === 'sunset' ? '#3a2a3a' : '#2f3a4a'
      rect(ctx, x, y, 1, 1, col)
      rect(ctx, x - 2, y - up, 2, 1, col)
      rect(ctx, x + 1, y - up, 2, 1, col)
    }
  }
}

/** Flat 2D pixel-art side-scroller with parallax forest layers. Put any content inside it as children. */
export function ForestRunner({ timeOfDay = 'day', shirtColor = '#e5483d', obstacles = true, children, ...props }: ForestRunnerProps) {
  const draw = useCallback((f: Frame) => drawScene(f, timeOfDay, shirtColor, obstacles), [timeOfDay, shirtColor, obstacles])
  return (
    <PixelCanvas {...props} draw={draw} label="Pixel-art runner jogging through a scrolling forest" background={TIMES[timeOfDay]?.sky[0]}>
      {children}
    </PixelCanvas>
  )
}
