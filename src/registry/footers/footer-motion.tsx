'use client'

import { useRef } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot, useCanvasLoop, useIsDark, useReducedMotion } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterMotionProps {
  brand?: string
  tagline?: string
  accent?: string
  /** waves: layered swells along the bottom. particles: a slow constellation. marquee: a scrolling headline band. */
  variant?: 'waves' | 'particles' | 'marquee'
  animate?: boolean
  /** Wave height, particle count or marquee size, 0.2 to 2. */
  intensity?: number
  /** Playback speed multiplier. */
  speed?: number
  className?: string
}

function rand(i: number) {
  const s = Math.sin(i * 91.345) * 47453.5453
  return s - Math.floor(s)
}

/** An always-moving footer: rolling waves, drifting particles, or a marquee band. */
export function FooterMotion({
  brand = 'lumen',
  tagline = 'Calm software, shipped on a steady tide.',
  accent = '#0ea5e9',
  variant = 'waves',
  animate = true,
  intensity = 1,
  speed = 1,
  className,
}: FooterMotionProps) {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dark = useIsDark(rootRef)
  const reduced = useReducedMotion()

  useCanvasLoop(
    canvasRef,
    ({ ctx, w, h, t }) => {
      ctx.clearRect(0, 0, w, h)
      const time = t * speed
      if (variant === 'waves') {
        const layers = 5
        for (let i = 0; i < layers; i++) {
          const k = i / (layers - 1)
          const band = Math.min(h * 0.5, 230)
          const base = h - band + k * band * 0.42
          const amp = (10 + 18 * (1 - k)) * intensity
          ctx.beginPath()
          ctx.moveTo(0, h)
          for (let x = 0; x <= w + 8; x += 8) {
            const y =
              base +
              Math.sin(x * (0.006 + k * 0.003) + time * (0.6 + k * 0.5) + i * 1.7) * amp +
              Math.sin(x * 0.017 - time * (0.9 + k * 0.3) + i) * amp * 0.35
            ctx.lineTo(x, y)
          }
          ctx.lineTo(w, h)
          ctx.closePath()
          ctx.fillStyle = accent
          ctx.globalAlpha = 0.1 + k * (dark ? 0.16 : 0.14)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      } else if (variant === 'particles') {
        const n = Math.round(70 * intensity * Math.min(1.6, w / 900))
        const pts: [number, number][] = []
        for (let i = 0; i < n; i++) {
          const x = (rand(i) * w + time * (8 + rand(i + 7) * 22)) % (w + 40) - 20
          const y = h - (((rand(i + 3) * h + time * (6 + rand(i + 11) * 18)) % (h + 40)) - 20)
          pts.push([x, y + Math.sin(time + i) * 6])
        }
        ctx.lineWidth = 1
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1])
            if (d < 110) {
              ctx.strokeStyle = accent
              ctx.globalAlpha = (1 - d / 110) * 0.35
              ctx.beginPath()
              ctx.moveTo(pts[i][0], pts[i][1])
              ctx.lineTo(pts[j][0], pts[j][1])
              ctx.stroke()
            }
          }
        }
        for (let i = 0; i < n; i++) {
          ctx.globalAlpha = 0.5 + rand(i + 5) * 0.5
          ctx.fillStyle = accent
          ctx.beginPath()
          ctx.arc(pts[i][0], pts[i][1], 1.2 + rand(i + 9) * 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }
    },
    { animate: animate && variant !== 'marquee', fps: 60 },
  )

  const phrase = `${brand} — ${tagline.replace(/\.$/, '')} — `
  const moving = animate && !reduced

  return (
    <FooterRoot ref={rootRef} accent={accent} className={className}>
      {variant === 'marquee' && (
        <div aria-hidden className="overflow-hidden border-y border-(--ft-line) bg-(--ft-accent) py-5 text-white dark:text-black">
          <div
            className="ft-anim flex w-max font-display font-semibold whitespace-nowrap tracking-[-0.03em]"
            style={{
              fontSize: `clamp(2.5rem, ${6 * intensity}cqw, ${5 * intensity}rem)`,
              animation: moving ? `ft-marquee ${28 / speed}s linear infinite` : 'none',
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="pr-10">
                {phrase}
              </span>
            ))}
          </div>
        </div>
      )}
      {variant !== 'marquee' && <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 block size-full" />}
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-start gap-4">
            <Brand brand={brand} />
            <p className="max-w-xs text-[14px] leading-relaxed text-(--ft-soft)">{tagline}</p>
          </div>
          <FooterColumns />
        </div>
      </div>
      <div className={cn('mx-auto max-w-6xl px-6 pb-6 md:px-10', variant === 'waves' ? 'pt-[clamp(90px,14cqw,190px)]' : 'pt-10')}>
        <BottomBar brand={brand} className={cn(variant !== 'waves' && 'border-t border-(--ft-line) pt-5', variant === 'waves' && '[&_*]:text-(--ft-ink)')} />
      </div>
    </FooterRoot>
  )
}
