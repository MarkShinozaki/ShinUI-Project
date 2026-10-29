'use client'

import { useState } from 'react'
import { GridBand, Mono } from '@/registry/blocks/scout-kit'
import { cn } from '@/lib/utils'

const MODELS = {
  D01: { name: 'Dashboard', note: 'Live tiles, sparklines and alert rails' },
  M01: { name: 'Map', note: 'Layers, waypoints and a range ring' },
  C01: { name: 'Console', note: 'A command line with typed replies' },
} as const
type Key = keyof typeof MODELS

function Panel({ k }: { k: Key }) {
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5 } as const
  return (
    <svg viewBox="0 0 320 180" aria-hidden className="w-full max-w-xl text-(--sc-fg)">
      <rect x="1" y="1" width="318" height="178" {...stroke} opacity="0.4" />
      {k === 'D01' && (
        <>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={16 + i * 100} y="16" width="88" height="56" {...stroke} opacity="0.7" />
          ))}
          <path d="M16 150 L60 120 L100 132 L150 96 L200 110 L250 70 L304 84" {...stroke} className="text-(--sc-accent)" stroke="currentColor" />
        </>
      )}
      {k === 'M01' && (
        <>
          <path d="M10 130 C60 90 90 150 150 110 S250 60 310 90" {...stroke} opacity="0.5" />
          <path d="M10 160 C80 120 120 170 190 140 S280 110 310 130" {...stroke} opacity="0.3" />
          <circle cx="170" cy="86" r="44" {...stroke} className="text-(--sc-accent)" stroke="currentColor" strokeDasharray="4 4" />
          <circle cx="170" cy="86" r="3" fill="currentColor" className="text-(--sc-accent)" />
          <path d="M60 60 L120 74 L170 86" {...stroke} strokeDasharray="2 5" />
        </>
      )}
      {k === 'C01' && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="20" y={22 + i * 30} width={[180, 240, 120, 200][i]} height="8" fill="currentColor" opacity={i % 2 ? 0.25 : 0.55} />
          ))}
          <rect x="20" y="150" width="10" height="14" fill="currentColor" className="text-(--sc-accent)" />
        </>
      )}
    </svg>
  )
}

export interface ScoutProductProps {
  eyebrow?: string
  name?: string
  lede?: string
  className?: string
}

/** A product reveal: a huge name, tabbed variants and a line-art panel per variant. */
export function ScoutProduct({ eyebrow = 'Introducing', name = 'Field Kit', lede = 'A set of rugged blocks for products that live outside the office.', className }: ScoutProductProps) {
  const [k, setK] = useState<Key>('D01')
  const keys = Object.keys(MODELS) as Key[]
  return (
    <GridBand className={cn('flex flex-col items-center gap-6 px-6 py-20 text-center', className)}>
      <Mono className="text-(--sc-dim)">{eyebrow}</Mono>
      <h2 className="text-[clamp(56px,11vw,140px)] leading-[0.9] font-semibold tracking-[-0.05em] uppercase">{name}</h2>
      <p className="max-w-[40ch] text-[14px] text-(--sc-dim)">{lede}</p>
      <div role="tablist" aria-label="Variants" className="flex gap-1">
        {keys.map((key) => (
          <button key={key} role="tab" aria-selected={k === key} onClick={() => setK(key)} className={cn('border px-3 py-1.5 transition-colors', k === key ? 'border-(--sc-fg) text-(--sc-fg)' : 'border-(--sc-line) text-(--sc-faint) hover:text-(--sc-fg)')}>
            <Mono>{key}</Mono>
          </button>
        ))}
      </div>
      <Mono className="text-(--sc-accent)">
        {MODELS[k].name} · {MODELS[k].note}
      </Mono>
      <div role="tabpanel" className="flex w-full justify-center">
        <Panel k={k} />
      </div>
    </GridBand>
  )
}
