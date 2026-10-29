'use client'

import { Card, Chip, GridPaper, HexButton, Mono, Serif } from '@/registry/blocks/hex-kit'
import { cn } from '@/lib/utils'

export interface HexHeroProps {
  title?: string
  accent?: string
  primaryLabel?: string
  secondaryLabel?: string
  animate?: boolean
  className?: string
}

const LOGOS = ['Northwind', 'Lumen&Co', 'Parcel', 'Orbitly', 'Fernway', 'Quarry', 'Tidepool', 'Halcyon', 'Brightline', 'Mosaic', 'Kettle', 'Vantage']

const I = {
  chart: <svg viewBox="0 0 12 12" className="size-[0.7em]"><path d="M2 10V6M6 10V2M10 10V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  chat: <svg viewBox="0 0 12 12" className="size-[0.7em]"><path d="M2 3h8v5H5l-3 2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>,
  link: <svg viewBox="0 0 12 12" className="size-[0.7em]"><circle cx="3" cy="6" r="1.6" fill="currentColor" /><circle cx="9" cy="3" r="1.6" fill="currentColor" /><circle cx="9" cy="9" r="1.6" fill="currentColor" /><path d="M3 6l6-3M3 6l6 3" stroke="currentColor" strokeWidth="1" /></svg>,
}

function Sparkle({ animate }: { animate: boolean }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className="absolute -top-6 -right-8 size-10 text-(--hx-accent)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <line key={a} x1="20" y1="6" x2="20" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${a} 20 20)`}
          style={animate ? { animation: `hx-twinkle 2.4s ${i * 0.15}s ease-in-out infinite` } : undefined} />
      ))}
    </svg>
  )
}

/** Big two-voice headline (sans plus italic serif), a sentence of inline chips, two buttons and a logo wall. */
export function HexHero({
  title = 'The workspace for data',
  accent = 'that people actually read',
  primaryLabel = 'Start for free',
  secondaryLabel = 'Book a walkthrough',
  animate = true,
  className,
}: HexHeroProps) {
  return (
    <section className={cn('relative isolate overflow-hidden px-6 pt-28 pb-16 md:pt-36', className)}>
      <GridPaper />
      <div className="relative mx-auto max-w-4xl text-center" style={animate ? { animation: 'hx-rise .8s ease-out both' } : undefined}>
        <h1 className="text-[clamp(2.6rem,7vw,5.2rem)] leading-[0.98] font-semibold tracking-[-0.045em]">
          <span className="relative inline-block">
            {title}
            <Sparkle animate={animate} />
          </span>
          <br />
          <Serif className="text-[1.04em]">{accent}</Serif>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-[clamp(1rem,1.8vw,1.3rem)] leading-[2] text-(--hx-dim)">
          Bring
          <Chip icon={I.chart}>Dashboards</Chip>
          <Chip icon={I.chat} tint="var(--hx-accent)">Questions</Chip>
          and
          <Chip icon={I.link} tint="var(--hx-mint)">Shared models</Chip>
          into one calm place.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <HexButton>{primaryLabel}</HexButton>
          <HexButton variant="ghost">{secondaryLabel}</HexButton>
        </div>
      </div>
      <div className="relative mx-auto mt-16 max-w-5xl">
        <div className="mb-5 flex items-center justify-center gap-3 text-(--hx-faint)">
          <span className="h-px w-10 bg-current" />
          <Mono>Used by curious teams</Mono>
          <span className="h-px w-10 bg-current" />
        </div>
        <Card className="grid grid-cols-3 gap-px overflow-hidden bg-(--hx-line) md:grid-cols-6">
          {LOGOS.map((l, i) => (
            <span key={l} className="grid h-14 place-items-center bg-(--hx-paper) text-[15px] font-semibold tracking-tight text-(--hx-dim)">
              <span className={cn(i % 3 === 1 && 'font-serif italic', i % 4 === 2 && 'font-mono text-[12px] uppercase')}>{l}</span>
            </span>
          ))}
        </Card>
      </div>
    </section>
  )
}
