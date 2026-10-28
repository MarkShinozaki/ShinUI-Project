'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot, useIsDark, useReducedMotion } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterSceneryProps {
  brand?: string
  signOff?: string
  /** Sun, lit windows and flowers. */
  accent?: string
  /** hills: rolling layers and trees. city: a skyline with windows. pixel: a pixel-art meadow strip. */
  variant?: 'hills' | 'city' | 'pixel'
  /** auto follows the site theme. */
  time?: 'auto' | 'day' | 'night'
  animate?: boolean
  className?: string
}

function rand(i: number) {
  const s = Math.sin(i * 78.233 + 12.9898) * 43758.5453
  return s - Math.floor(s)
}

/** Bottom-bar color that continues the scene's ground: [day, night]. */
const GROUND = {
  hills: ['#5b9a75', '#111a31'],
  city: ['#6f8597', '#0f172c'],
  pixel: ['#4f9a4a', '#14281f'],
} as const

const DAY = {
  '--ft-bg': '#eef4f8',
  '--ft-ink': '#14202b',
  '--ft-soft': 'rgb(20 32 43 / 0.66)',
  '--ft-faint': 'rgb(20 32 43 / 0.45)',
  '--ft-line': 'rgb(20 32 43 / 0.12)',
  background: 'linear-gradient(#eef4f8, #fdf3e7)',
}
const NIGHT = {
  '--ft-bg': '#0c1222',
  '--ft-ink': '#eef1f8',
  '--ft-soft': 'rgb(238 241 248 / 0.66)',
  '--ft-faint': 'rgb(238 241 248 / 0.42)',
  '--ft-line': 'rgb(255 255 255 / 0.1)',
  background: 'linear-gradient(#070b16, #16203c)',
}

function Drift({ on, dur, from, to, children }: { on: boolean; dur: number; from: number; to: number; children: ReactNode }) {
  return (
    <g transform={on ? undefined : `translate(${(from + to) / 2} 0)`}>
      {on && <animateTransform attributeName="transform" type="translate" from={`${from} 0`} to={`${to} 0`} dur={`${dur}s`} repeatCount="indefinite" />}
      {children}
    </g>
  )
}

function Stars({ moving }: { moving: boolean }) {
  return (
    <g fill="#f4f1e4">
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={rand(i + 101) * 1200} cy={rand(i + 202) * 150} r={0.8 + rand(i + 303) * 1.4} opacity={0.4 + rand(i + 404) * 0.6}>
          {moving && rand(i + 505) > 0.6 && <animate attributeName="opacity" values="1;0.2;1" dur={`${2 + rand(i) * 4}s`} repeatCount="indefinite" />}
        </circle>
      ))}
    </g>
  )
}

function Hills({ night, accent, moving }: { night: boolean; accent: string; moving: boolean }) {
  const c = night ? ['#26345a', '#1b2645', '#111a31'] : ['#bcd7c8', '#8cbd9f', '#5b9a75']
  return (
    <>
      {night && <Stars moving={moving} />}
      {night ? <circle cx="930" cy="92" r="34" fill="#f4f1e4" /> : <circle cx="930" cy="110" r="46" fill={accent} opacity="0.9" />}
      {!night && (
        <Drift on={moving} dur={60} from={-200} to={1300}>
          <g fill="#ffffff" opacity="0.9">
            <ellipse cx="0" cy="70" rx="46" ry="14" />
            <ellipse cx="26" cy="60" rx="28" ry="16" />
            <ellipse cx="330" cy="40" rx="36" ry="10" />
            <ellipse cx="350" cy="33" rx="20" ry="11" />
          </g>
        </Drift>
      )}
      {!night && (
        <Drift on={moving} dur={34} from={-60} to={1260}>
          <g fill="none" stroke="#14202b" strokeWidth="2" strokeLinecap="round" opacity="0.55">
            <path d="M0 90q6-6 12 0q6-6 12 0" />
            <path d="M30 76q5-5 10 0q5-5 10 0" />
          </g>
        </Drift>
      )}
      <path d="M0 170C150 120 260 140 380 150S620 100 760 128 1040 120 1200 140V260H0Z" fill={c[0]} />
      <path d="M0 200C120 170 240 168 360 186S600 160 720 176 980 150 1200 186V260H0Z" fill={c[1]} />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 40 + i * 84 + rand(i) * 30
        const y = 186 + Math.sin(i) * 8
        const s = 0.7 + rand(i + 3) * 0.6
        return <path key={i} d={`M${x} ${y - 34 * s}l${12 * s} ${30 * s}h${-24 * s}z`} fill={c[2]} />
      })}
      <path d="M0 230C200 214 340 222 520 230S900 216 1200 228V260H0Z" fill={c[2]} />
    </>
  )
}

function City({ night, accent, moving }: { night: boolean; accent: string; moving: boolean }) {
  const back = night ? '#1a2442' : '#c7d3dd'
  const front = night ? '#0f172c' : '#6f8597'
  const windowOff = night ? '#1d2949' : '#dbe5ee'
  const buildings = Array.from({ length: 22 }, (_, i) => ({ x: i * 56 - 10, w: 40 + rand(i) * 26, h: 70 + rand(i + 9) * 120 }))
  return (
    <>
      {night && <Stars moving={moving} />}
      {night ? <circle cx="160" cy="70" r="26" fill="#f4f1e4" /> : <circle cx="160" cy="90" r="40" fill={accent} opacity="0.85" />}
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={`b${i}`} x={i * 80 + rand(i + 40) * 30} y={260 - (100 + rand(i + 50) * 120)} width={60} height={260} fill={back} />
      ))}
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={260 - b.h} width={b.w} height={b.h} fill={front} />
          {Array.from({ length: Math.floor((b.h - 20) / 16) }, (_, r) =>
            Array.from({ length: Math.floor((b.w - 8) / 12) }, (_, cIdx) => {
              const k = i * 100 + r * 10 + cIdx
              const lit = night && rand(k) > 0.62
              return (
                <rect key={`${r}-${cIdx}`} x={b.x + 6 + cIdx * 12} y={260 - b.h + 10 + r * 16} width={6} height={8} fill={lit ? accent : windowOff} opacity={lit ? 0.9 : 1}>
                  {lit && moving && rand(k + 1) > 0.8 && (
                    <animate attributeName="opacity" values="0.9;0.15;0.9" dur={`${4 + rand(k + 2) * 6}s`} repeatCount="indefinite" />
                  )}
                </rect>
              )
            }),
          )}
        </g>
      ))}
      <Drift on={moving} dur={14} from={-140} to={1340}>
        <rect x="0" y="246" width="120" height="10" rx="3" fill={night ? accent : '#14202b'} opacity="0.85" />
      </Drift>
      <rect x="0" y="256" width="1200" height="4" fill={front} />
    </>
  )
}

function Pixel({ night, accent, moving }: { night: boolean; accent: string; moving: boolean }) {
  const px = 10
  const ground = night ? ['#1d3a2c', '#14281f'] : ['#7cc36a', '#4f9a4a']
  const cols = 1200 / px
  return (
    <g shapeRendering="crispEdges">
      {night
        ? Array.from({ length: 30 }, (_, i) => (
            <rect key={i} x={Math.floor(rand(i) * cols) * px} y={Math.floor(rand(i + 5) * 12) * px} width={px / 2} height={px / 2} fill="#f4f1e4" opacity={0.5 + rand(i + 2) * 0.5}>
              {moving && rand(i + 9) > 0.6 && <animate attributeName="opacity" values="1;0.2;1" dur={`${2 + rand(i) * 3}s`} repeatCount="indefinite" />}
            </rect>
          ))
        : (
          <Drift on={moving} dur={50} from={-120} to={1300}>
            <g fill="#ffffff">
              <rect x="0" y="50" width="80" height="10" />
              <rect x="10" y="40" width="50" height="10" />
              <rect x="20" y="30" width="20" height="10" />
            </g>
          </Drift>
        )}
      {Array.from({ length: cols }, (_, i) => {
        const hgt = 3 + Math.round(Math.sin(i * 0.21) * 1.2 + rand(i) * 1.2)
        return (
          <g key={i}>
            <rect x={i * px} y={260 - hgt * px} width={px} height={hgt * px} fill={ground[1]} />
            <rect x={i * px} y={260 - hgt * px} width={px} height={px} fill={ground[0]} />
            {rand(i + 3) > 0.7 && <rect x={i * px} y={260 - (hgt + 1) * px} width={px} height={px} fill={ground[0]} />}
            {rand(i + 17) > 0.9 && (
              <>
                <rect x={i * px} y={260 - (hgt + 2) * px} width={px} height={px} fill={accent} />
                <rect x={i * px} y={260 - (hgt + 1) * px} width={px} height={px} fill={ground[1]} />
              </>
            )}
          </g>
        )
      })}
      <Drift on={moving} dur={40} from={-40} to={1240}>
        <g transform="translate(0 200)">
          <rect x="0" y="10" width="30" height="20" fill={night ? '#d7d2ff' : '#ffffff'} />
          <rect x="10" y="0" width="20" height="10" fill={night ? '#d7d2ff' : '#ffffff'} />
          <rect x="20" y="10" width="5" height="5" fill="#14202b" />
          <rect x="0" y="30" width="10" height="5" fill="#14202b">
            {moving && <animate attributeName="y" values="30;27;30" dur="0.4s" repeatCount="indefinite" />}
          </rect>
          <rect x="20" y="30" width="10" height="5" fill="#14202b">
            {moving && <animate attributeName="y" values="27;30;27" dur="0.4s" repeatCount="indefinite" />}
          </rect>
        </g>
      </Drift>
    </g>
  )
}

/** A footer that ends on a drawn scene: rolling hills, a skyline, or a pixel meadow, by day or night. */
export function FooterScenery({
  brand = 'lumen',
  signOff = 'Made outdoors, shipped indoors.',
  accent = '#f59e0b',
  variant = 'hills',
  time = 'auto',
  animate = true,
  className,
}: FooterSceneryProps) {
  const rootRef = useRef<HTMLElement>(null)
  const dark = useIsDark(rootRef)
  const reduced = useReducedMotion()
  const night = time === 'night' || (time === 'auto' && dark)
  const moving = animate && !reduced
  const Scene = variant === 'city' ? City : variant === 'pixel' ? Pixel : Hills

  return (
    <FooterRoot ref={rootRef} accent={accent} className={className} style={(night ? NIGHT : DAY) as CSSProperties}>
      <div className="mx-auto max-w-6xl px-6 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.1fr_2fr]">
          <div className="flex flex-col items-start gap-5">
            <Brand brand={brand} />
            <p className="max-w-sm font-display text-[clamp(1.6rem,3cqw,2.3rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">{signOff}</p>
          </div>
          <FooterColumns />
        </div>
      </div>
      <div className="relative mt-6 -mb-px">
        <svg
          viewBox="0 0 1200 260"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden
          className={cn('block h-[clamp(150px,22cqw,260px)] w-full', variant === 'pixel' && '[image-rendering:pixelated]')}
        >
          <Scene night={night} accent={accent} moving={moving} />
        </svg>
      </div>
      <div style={{ background: GROUND[variant][night ? 1 : 0] }}>
        <div className="mx-auto max-w-6xl px-6 py-5 [--ft-ink:#f6f7fb] [--ft-soft:rgb(246_247_251/0.75)] [--ft-faint:rgb(246_247_251/0.7)] [--ft-line:rgb(255_255_255/0.14)] md:px-10">
          <BottomBar brand={brand} />
        </div>
      </div>
    </FooterRoot>
  )
}
