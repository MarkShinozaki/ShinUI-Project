'use client'

import { useRef } from 'react'
import { HexButton, Mono, useScrollVar } from '@/registry/blocks/hex-kit'
import { cn } from '@/lib/utils'

export interface HexOrbitProps {
  heading?: string
  center?: string
  steps?: string
  ctaLabel?: string
  className?: string
}

const ICONS = [
  <path key="a" d="M6 8h14v9H11l-5 4z" />,
  <path key="b" d="M13 5 22 10 13 15 4 10zM4 14l9 5 9-5" />,
  <path key="c" d="M8 13l3 3 6-7M13 4a9 9 0 1 0 0.01 0" />,
]

/**
 * A ring of three stations that turns as the section scrolls by; the
 * stations counter-rotate so their labels stay upright.
 */
export function HexOrbit({
  heading = 'Every answer makes the next one better',
  center = 'Shared memory',
  steps = 'Ask and build, Refine the model, Catch the gaps',
  ctaLabel = 'How the memory works',
  className,
}: HexOrbitProps) {
  const ref = useRef<HTMLElement>(null)
  useScrollVar(ref, { name: '--hx-turn' })
  const labels = steps.split(',').map((s) => s.trim()).slice(0, 3)
  const rot = 'calc((var(--hx-turn, 0.5) - 0.5) * 220deg)'
  return (
    <section ref={ref} className={cn('relative px-6 py-24', className)}>
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-[420px]">
          <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 size-full text-(--hx-line)">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 1.6" />
          </svg>
          <div
            className="absolute inset-[16%] grid place-items-center rounded-full border border-(--hx-line) bg-(--hx-paper) text-center text-lg font-semibold tracking-tight shadow-[inset_0_0_40px_rgba(29,26,43,0.05)]"
            style={{ backgroundImage: 'radial-gradient(var(--hx-line) 0.8px, transparent 0.8px)', backgroundSize: '9px 9px' }}
          >
            <span className="rounded bg-(--hx-paper) px-2">{center}</span>
          </div>
          <div className="hx-move absolute inset-0" style={{ transform: `rotate(${rot})` }}>
            {labels.map((l, i) => {
              const a = (i / labels.length) * Math.PI * 2 - Math.PI / 2
              return (
                <div
                  key={l}
                  className="absolute size-[28%] -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${50 + Math.cos(a) * 40}%`, top: `${50 + Math.sin(a) * 40}%` }}
                >
                  <div className="hx-move grid size-full place-items-center rounded-full border border-(--hx-line) bg-(--hx-paper) shadow-[0_10px_24px_-14px_rgba(29,26,43,0.4)]" style={{ transform: `rotate(calc(-1 * ${rot}))` }}>
                    <svg viewBox="0 0 26 26" className="size-7 text-(--hx-ink)" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
                      {ICONS[i]}
                    </svg>
                    <Mono className="absolute bottom-[16%] text-[8px] text-(--hx-dim)">{l}</Mono>
                    <span className="absolute top-[18%] right-[18%] size-2 rounded-full bg-(--hx-mint)" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <Mono className="text-(--hx-accent)">Context</Mono>
          <h2 className="mt-3 max-w-md text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.05] font-semibold tracking-[-0.035em]">{heading}</h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-(--hx-dim)">
            Definitions, notes and fixes from each question are kept, so the workspace learns how your team talks about its data.
          </p>
          <HexButton className="mt-7">{ctaLabel}</HexButton>
        </div>
      </div>
    </section>
  )
}
