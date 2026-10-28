'use client'

import { useRef } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot, rasterizeText, useCanvasLoop, useIsDark, usePointer } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterAsciiProps {
  brand?: string
  tagline?: string
  /** Highlight color for the shimmer and the cursor lens. */
  accent?: string
  /** wordmark: the brand set in characters. horizon: a sun setting into a character sea. */
  variant?: 'wordmark' | 'horizon'
  /** Glyph size in px (smaller = denser). */
  density?: number
  animate?: boolean
  className?: string
}

const RAMP = ' .,:;-=+*#%@'
const SCRAMBLE = '01/\\<>{}[]+*#%&$?'

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

/** A footer whose sign-off is drawn in monospace characters that shimmer and scramble under the cursor. */
export function FooterAscii({
  brand = 'lumen',
  tagline = 'Quiet tools for loud ideas.',
  accent = '#f97316',
  variant = 'wordmark',
  density = 11,
  animate = true,
  className,
}: FooterAsciiProps) {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dark = useIsDark(rootRef)
  const pointer = usePointer(canvasRef)
  const cache = useRef<{ key: string; sample: (x: number, y: number) => number } | null>(null)

  useCanvasLoop(
    canvasRef,
    ({ ctx, w, h, t }) => {
      const size = Math.max(6, density)
      const cw = size * 0.62
      const chh = size * 1.05
      const cols = Math.ceil(w / cw)
      const rows = Math.ceil(h / chh)
      const key = `${brand}|${w}|${h}`
      if (variant === 'wordmark' && cache.current?.key !== key) {
        cache.current = { key, sample: rasterizeText(brand, w, h, { fill: 0.96 }) }
      }
      const ink = dark ? '242,242,240' : '20,20,20'
      ctx.clearRect(0, 0, w, h)
      ctx.font = `500 ${size}px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace`
      ctx.textBaseline = 'top'
      const p = pointer.current
      const lens = Math.max(60, size * 9)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * cw + cw / 2
          const py = y * chh + chh / 2
          let v: number
          if (variant === 'horizon') {
            const horizon = h * 0.58
            const sx = (px - w / 2) / (h * 0.42)
            const sy = (py - horizon) / (h * 0.42)
            const d = Math.hypot(sx, sy * 1.1)
            if (py < horizon) {
              v = d < 1 ? 0.95 - d * 0.35 : Math.max(0, 0.22 - (d - 1) * 0.25)
              if (d < 1 && Math.sin(sy * 30) > 0.65 && sy > -0.6) v *= 0.15
            } else {
              const depth = (py - horizon) / (h - horizon)
              const wave = Math.sin(px * 0.035 / (0.4 + depth) + t * 1.6 + depth * 9) * 0.5 + 0.5
              const glint = Math.abs(sx) < 0.9 - depth * 0.3 ? 0.5 : 0
              v = (0.12 + wave * 0.28 + glint * wave) * (0.5 + depth * 0.6)
            }
          } else {
            v = cache.current?.sample(px, py) ?? 0
            if (v < 0.05 && hash(x, y) > 0.985) v = 0.12
          }
          const wave = Math.sin(x * 0.11 + y * 0.35 - t * 2.4)
          const twinkle = hash(x, y + Math.floor(t * 6 + hash(y, x) * 6))
          let hot = v > 0.2 && wave > 0.93
          let char = RAMP[Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1)))]
          if (v > 0.2 && twinkle > 0.93) char = RAMP[Math.max(1, RAMP.indexOf(char) - 2)]
          let alpha = Math.min(1, 0.18 + v * 0.95)
          if (p) {
            const d = Math.hypot(px - p.x, py - p.y)
            if (d < lens) {
              const f = 1 - d / lens
              if (v > 0.05 || f > 0.55) {
                char = SCRAMBLE[Math.floor(hash(x + Math.floor(t * 14), y) * SCRAMBLE.length)]
                hot = f > 0.35
                alpha = Math.min(1, alpha + f)
              }
            }
          }
          if (char === ' ') continue
          ctx.fillStyle = hot ? accent : `rgba(${ink},${alpha})`
          ctx.fillText(char, x * cw, y * chh)
        }
      }
    },
    { animate, fps: 30 },
  )

  return (
    <FooterRoot ref={rootRef} accent={accent} className={cn('font-mono', className)}>
      <div className="mx-auto max-w-6xl px-6 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-start gap-4">
            <Brand brand={brand} />
            <p className="max-w-xs text-[13px] leading-relaxed text-(--ft-soft)">{tagline}</p>
            <p className="inline-flex items-center gap-2 rounded-full border border-(--ft-line) px-3 py-1 text-[11px] tracking-wide text-(--ft-soft) uppercase">
              <span className="size-1.5 rounded-full bg-(--ft-accent)" /> v2.4 · shipped weekly
            </p>
          </div>
          <FooterColumns headingClassName="text-[11px] tracking-[0.14em] uppercase text-(--ft-faint)" linkClassName="text-[13px]" />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="mt-10 block h-[clamp(150px,24cqw,300px)] w-full cursor-crosshair touch-none"
      />
      <div className="mx-auto max-w-6xl border-t border-(--ft-line) px-6 py-6 md:px-10">
        <BottomBar brand={brand}>Rendered in {RAMP.trim().length} characters.</BottomBar>
      </div>
    </FooterRoot>
  )
}
