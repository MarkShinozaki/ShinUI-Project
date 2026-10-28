'use client'

import { type CSSProperties } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot, useReducedMotion } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterGradientProps {
  brand?: string
  tagline?: string
  /** Lead color of the gradient. */
  accent?: string
  /** aurora: accent + teal + violet. sunset: accent + coral + gold. mono: shades of the accent. */
  palette?: 'aurora' | 'sunset' | 'mono'
  animate?: boolean
  /** Glow strength, 0 to 1. */
  intensity?: number
  /** Film grain over the glow. */
  grain?: boolean
  className?: string
}

const PALETTES = {
  aurora: ['#2dd4bf', '#a855f7', '#3b82f6'],
  sunset: ['#fb7185', '#fbbf24', '#f97316'],
  mono: ['color-mix(in oklab, var(--ft-accent) 55%, white)', 'color-mix(in oklab, var(--ft-accent) 70%, black)', 'var(--ft-accent)'],
} as const

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const KEYFRAMES = `
@keyframes ft-blob-a{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(18%,-12%) scale(1.15)}}
@keyframes ft-blob-b{0%,100%{transform:translate(0,0) scale(1.1)}50%{transform:translate(-20%,10%) scale(.9)}}
@keyframes ft-blob-c{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(10%,14%) rotate(40deg)}}
@keyframes ft-pan{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
`

/** A soft aurora glow rising from the bottom, with a giant wordmark clipped to the same gradient. */
export function FooterGradient({
  brand = 'lumen',
  tagline = 'Light work for heavy problems.',
  accent = '#8b5cf6',
  palette = 'aurora',
  animate = true,
  intensity = 0.8,
  grain = true,
  className,
}: FooterGradientProps) {
  const reduced = useReducedMotion()
  const moving = animate && !reduced
  const [a, b, c] = PALETTES[palette]
  const glow = Math.max(0, Math.min(1, intensity))
  const anim = (name: string, s: number) => (moving ? `${name} ${s}s ease-in-out infinite` : 'none')
  const blob = 'absolute rounded-full blur-[80px] mix-blend-normal dark:mix-blend-screen'

  return (
    <FooterRoot accent={accent} className={cn('bg-(--ft-bg)', className)}>
      <style>{KEYFRAMES}</style>
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden" style={{ opacity: 0.35 + glow * 0.65 }}>
        <div className={cn(blob, 'ft-anim -bottom-1/3 left-[-10%] h-[80%] w-[55%]')} style={{ background: 'var(--ft-accent)', animation: anim('ft-blob-a', 16) }} />
        <div className={cn(blob, 'ft-anim -bottom-1/4 left-[30%] h-[70%] w-[45%]')} style={{ background: a, animation: anim('ft-blob-b', 19) }} />
        <div className={cn(blob, 'ft-anim -bottom-1/3 right-[-10%] h-[85%] w-[50%]')} style={{ background: b, animation: anim('ft-blob-c', 23) }} />
        <div className={cn(blob, 'ft-anim bottom-[10%] left-[55%] h-[35%] w-[25%] opacity-70')} style={{ background: c, animation: anim('ft-blob-a', 13) }} />
        <div className="absolute inset-x-0 top-0 h-2/3 bg-linear-to-b from-(--ft-bg) via-(--ft-bg)/80 to-transparent" />
      </div>
      {grain && <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16] mix-blend-overlay" style={{ backgroundImage: NOISE }} />}
      <div className="mx-auto max-w-6xl px-6 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-start gap-4">
            <Brand brand={brand} />
            <p className="max-w-xs text-[14px] leading-relaxed text-(--ft-soft)">{tagline}</p>
            <a
              href="#"
              className="mt-2 inline-flex h-9 items-center rounded-full bg-(--ft-ink) px-4 text-[13px] font-medium text-(--ft-bg) transition-opacity hover:opacity-85"
            >
              Start building →
            </a>
          </div>
          <FooterColumns arrows />
        </div>
      </div>
      <p
        aria-hidden
        className="ft-anim mt-10 px-4 text-center font-display leading-[0.8] font-bold tracking-[-0.06em] text-transparent select-none"
        style={
          {
            fontSize: `clamp(3rem, ${Math.min(26, 100 / Math.max(3, brand.length * 0.62))}cqw, 22rem)`,
            backgroundImage: `linear-gradient(100deg, var(--ft-accent), ${a}, ${b}, ${c}, var(--ft-accent))`,
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            animation: anim('ft-pan', 14),
            filter: `drop-shadow(0 0 ${24 * glow}px color-mix(in oklab, var(--ft-accent) 45%, transparent))`,
          } as CSSProperties
        }
      >
        {brand}
      </p>
      <div className="mx-auto max-w-6xl px-6 pt-6 pb-6 md:px-10">
        <BottomBar brand={brand} className="border-t border-(--ft-line) pt-5 [&_a]:text-(--ft-ink) [&_p]:text-(--ft-soft)" />
      </div>
    </FooterRoot>
  )
}
