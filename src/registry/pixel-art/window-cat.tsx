'use client'

import { useCallback } from 'react'
import { PixelCanvas, bands, drawSprite, hash, rect, sprite, wrap, type Frame, type PixelCanvasProps } from '@/registry/pixel-art/pixel-2d'

/* -------------------------------------------------------------------------------------------------
 * Window Cat: a flat 2D pixel-art room. A cat naps in a loaf on the windowsill, breathing slowly,
 * twitching an ear now and then and puffing little z's, while rain streaks the glass outside.
 * Drawn on a low-res <canvas> with frame-by-frame sprites (see ./pixel-2d.tsx).
 * -----------------------------------------------------------------------------------------------*/

const SKIES = {
  day: { sky: ['#9fb4c4', '#aebfcc', '#bccad4'], city: '#8597a6', cityFar: '#97a8b5', rain: '#e6eef4', wall: '#e3c9a4', wallShade: '#d4b48b', lamp: false },
  dusk: { sky: ['#4f4a73', '#7a5e86', '#b07a8a', '#d89b8a'], city: '#3d3a5c', cityFar: '#575174', rain: '#d9cbe6', wall: '#caa58a', wallShade: '#b38d74', lamp: true },
  night: { sky: ['#121a33', '#18234a', '#1f2c57'], city: '#0b1124', cityFar: '#141d3a', rain: '#7d8fb8', wall: '#5b4a5e', wallShade: '#4b3d50', lamp: true },
} as const

const CATS = {
  ginger: { b: '#e8954a', d: '#c46f2c', w: '#fbe3c4' },
  tuxedo: { b: '#2d2c33', d: '#1f1e24', w: '#f2f0ea' },
  grey: { b: '#9aa1ab', d: '#767d88', w: '#e6e8ec' },
} as const

const RAIN = { drizzle: 40, steady: 90, storm: 170 } as const

export type WindowCatTimeOfDay = keyof typeof SKIES
export type WindowCatColor = keyof typeof CATS
export type WindowCatRain = keyof typeof RAIN

export interface WindowCatProps extends PixelCanvasProps {
  timeOfDay?: WindowCatTimeOfDay
  catColor?: WindowCatColor
  rain?: WindowCatRain
}

// Sleeping loaf, head on the left. k outline, b fur, d stripes/shade, w muzzle, p pink.
const BODY = [
  '.kbbbpbbbbbbbbbbbbbbbbk.',
  '..kwwwwbbbbbbbbbbbbbbddk',
  '..kwwwkbbbbbbbbbbbbbdddk',
  '...kkkdddddddddddbbbdddk',
  '....kkkkkkkkkkkkkkkkkkk.',
]
const CAT_FRAMES = {
  exhale: [
    '.k...k..................',
    'kpk.kpk.................',
    'kbbkbbk...kkkkkkkkk.....',
    'kbbbbbbkkkbbdbbdbbbkk...',
    'kbbbbbbbbbbbdbbdbbbbbk..',
    'kbkkbkkbbbbbbbbbbbbbbbk.',
    ...BODY,
  ],
  inhale: [
    '.k...k..................',
    'kpk.kpk...kkkkkkkk......',
    'kbbkbbk.kkbbdbbdbbkk....',
    'kbbbbbbkbbbbdbbdbbbbkk..',
    'kbbbbbbbbbbbdbbdbbbbbbk.',
    'kbkkbkkbbbbbbbbbbbbbbbk.',
    ...BODY,
  ],
  twitch: [
    '.....k..................',
    'kk..kpk...kkkkkkkk......',
    'kbbkbbk.kkbbdbbdbbkk....',
    'kbbbbbbkbbbbdbbdbbbbkk..',
    'kbbbbbbbbbbbdbbdbbbbbbk.',
    'kbkkbkkbbbbbbbbbbbbbbbk.',
    ...BODY,
  ],
}
const Z = ['kkk', '.k.', 'kkk']
const PLANT = ['..g.g..', '.ggggg.', 'gg.g.gg', '..ggg..', '.ttttt.', '.ttttt.', '..ttt..']
const MUG = ['.s.s.', '.....', 'mmmm.', 'mmmmm', 'mmmm.', '.mm..']

function drawScene({ ctx, w, h, t }: Frame, timeOfDay: WindowCatTimeOfDay, catColor: WindowCatColor, rain: WindowCatRain) {
  const sky = SKIES[timeOfDay] ?? SKIES.day
  const cat = CATS[catColor] ?? CATS.ginger
  const storm = rain === 'storm'

  // Room wall with a soft vertical stripe pattern.
  rect(ctx, 0, 0, w, h, sky.wall)
  for (let x = 0; x < w; x += 8) rect(ctx, x, 0, 1, h, sky.wallShade)

  // Window, centered and sized to the frame.
  const ww = Math.min(Math.round(w * 0.6), 116)
  const wh = Math.min(Math.round(h * 0.56), 70)
  const wx = Math.round((w - ww) / 2)
  const wy = Math.max(6, Math.round(h * 0.42 - wh / 2))
  const flash = storm && wrap(t, 9) < 0.18
  ctx.save()
  ctx.beginPath()
  ctx.rect(wx, wy, ww, wh)
  ctx.clip()
  bands(ctx, flash ? ['#e8ecff', '#d6dcf5', '#c5cdea'] : sky.sky, wy, wh, w)
  // Two layers of city rooftops, with a few warm windows after dark.
  for (let layer = 0; layer < 2; layer++) {
    let x = wx - 4
    let i = layer * 50
    while (x < wx + ww) {
      const bw = 8 + Math.floor(hash(i, 3) * 12)
      const bh = (layer ? 12 : 20) + Math.floor(hash(i, 7) * (layer ? 14 : 18))
      const top = wy + wh - bh
      rect(ctx, x, top, bw, bh, layer ? sky.city : sky.cityFar)
      if (layer && sky.lamp) {
        for (let yy = top + 3; yy < wy + wh - 2; yy += 4)
          for (let xx = x + 2; xx < x + bw - 2; xx += 3) if (hash(xx, yy) > 0.72) rect(ctx, xx, yy, 1, 2, '#f2c46b')
      }
      x += bw + 1
      i++
    }
  }
  // Rain streaks falling at a slant.
  const drops = Math.round((RAIN[rain] ?? RAIN.steady) * (ww / 116))
  ctx.fillStyle = sky.rain
  for (let i = 0; i < drops; i++) {
    const fall = 70 + hash(i, 1) * 40
    const y = wy + wrap(hash(i, 2) * wh + t * fall, wh + 6) - 6
    const x = wx + wrap(hash(i, 3) * ww - (y - wy) * 0.25, ww)
    ctx.fillRect(Math.round(x), Math.round(y), 1, storm ? 4 : 3)
  }
  // Drops sliding down the glass.
  for (let i = 0; i < 7; i++) {
    const x = wx + 4 + Math.floor(hash(i, 9) * (ww - 8))
    const y = wy + wrap(hash(i, 4) * wh + t * (6 + hash(i, 5) * 6), wh)
    rect(ctx, x, y, 1, 2, '#ffffffaa')
  }
  ctx.restore()

  // Frame and mullions.
  const frame = '#f4efe6'
  const frameShade = '#cfc6b8'
  rect(ctx, wx - 3, wy - 3, ww + 6, 3, frame)
  rect(ctx, wx - 3, wy, 3, wh, frame)
  rect(ctx, wx + ww, wy, 3, wh, frameShade)
  rect(ctx, wx + Math.round(ww / 2) - 1, wy, 2, wh, frame)
  rect(ctx, wx, wy + Math.round(wh / 2) - 1, ww, 2, frame)

  // Sill.
  const sillY = wy + wh
  rect(ctx, wx - 8, sillY, ww + 16, 4, '#efe6d6')
  rect(ctx, wx - 8, sillY + 4, ww + 16, 2, '#c9b9a2')
  rect(ctx, wx - 6, sillY + 6, ww + 12, 1, '#00000022')

  // Cat: breathe in and out, with an ear twitch every few seconds.
  const breath = Math.floor(t * 1.2) % 2 === 0 ? 'inhale' : 'exhale'
  const twitch = wrap(t, 6.5) > 6.1 && wrap(t * 10, 2) < 1
  const rows = twitch ? CAT_FRAMES.twitch : CAT_FRAMES[breath]
  const catSprite = sprite(rows, { k: '#2a2230', b: cat.b, d: cat.d, w: cat.w, p: '#f2a3a8' })
  const cx = wx + Math.round(ww * 0.52)
  const cy = sillY - catSprite.h
  drawSprite(ctx, catSprite, cx, cy)

  // Z's drift up and fade away, one after another.
  for (let i = 0; i < 3; i++) {
    const k = wrap(t * 0.35 + i / 3, 1)
    if (k < 0.08) continue
    ctx.globalAlpha = 1 - k
    drawSprite(ctx, sprite(Z, { k: '#ffffff' }), cx - 2 + Math.round(Math.sin(k * 6 + i) * 2), cy - 3 - Math.round(k * 22))
  }
  ctx.globalAlpha = 1

  // Plant and a steaming mug on the sill.
  drawSprite(ctx, sprite(PLANT, { g: '#5c9a54', t: '#c26a45' }), wx + 4, sillY - PLANT.length)
  const steam = Math.floor(t * 4) % 2
  drawSprite(ctx, sprite(steam ? MUG : MUG.map((r, i) => (i === 0 ? 's.s..' : r)), { m: '#6f8fd1', s: '#ffffffbb' }), wx + 15, sillY - MUG.length)

  // Lamp glow in the room after dark.
  if (sky.lamp) {
    ctx.fillStyle = '#ffd99a22'
    for (let r = 26; r > 0; r -= 6) {
      ctx.beginPath()
      ctx.arc(Math.round(wx + ww * 0.52 + 12), sillY - 4, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Floor line below the sill.
  rect(ctx, 0, h - 6, w, 6, sky.wallShade)
  rect(ctx, 0, h - 6, w, 1, '#00000022')
}

/** Flat 2D pixel-art cat napping on a rainy windowsill. Put any content inside it as children. */
export function WindowCat({ timeOfDay = 'dusk', catColor = 'ginger', rain = 'steady', children, ...props }: WindowCatProps) {
  const draw = useCallback((f: Frame) => drawScene(f, timeOfDay, catColor, rain), [timeOfDay, catColor, rain])
  return (
    <PixelCanvas {...props} draw={draw} label="Pixel-art cat napping on a windowsill while it rains" background={SKIES[timeOfDay]?.wall}>
      {children}
    </PixelCanvas>
  )
}
