'use client'

import { useState } from 'react'
import { AsideMark, Eyebrow, Rails, useInView } from '@/registry/blocks/aside-kit'
import { cn } from '@/lib/utils'

export interface AsideBenchmarksProps {
  brand?: string
  heading?: string
  className?: string
}

const SETS: Record<string, [string, number][]> = {
  'Web tasks': [['You', 96.4], ['Agent A', 91.2], ['Agent B', 86.5], ['Agent C', 78.9], ['Agent D', 64.0]],
  'Long forms': [['You', 93.1], ['Agent B', 88.0], ['Agent A', 83.7], ['Agent D', 71.2], ['Agent C', 66.5]],
  'Multi-site': [['You', 89.8], ['Agent C', 80.4], ['Agent A', 77.9], ['Agent B', 70.1], ['Agent D', 58.6]],
}

/** A ranked bar list with segmented tabs; bars grow in when first seen and re-flow when the tab changes. */
export function AsideBenchmarks({ brand = 'shinUI', heading = 'Finishes more of what you ask.', className }: AsideBenchmarksProps) {
  const keys = Object.keys(SETS)
  const [tab, setTab] = useState(keys[0])
  const [ref, seen] = useInView<HTMLDivElement>(0.3)
  const rows = SETS[tab]
  return (
    <section className={className}>
      <Rails className="px-6 py-24 md:px-24">
        <h2 className="text-[clamp(1.7rem,3vw,2.2rem)] font-medium tracking-[-0.03em]">{heading}</h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-(--as-dim)">
          Scored on three public test sets of real browsing tasks. Illustrative numbers. <Eyebrow className="text-[15px]">Method</Eyebrow>
        </p>
        <div ref={ref} className="mt-12 divide-y divide-(--as-line) border-y border-(--as-line)">
          {rows.map(([n, v], i) => {
            const me = n === 'You'
            const w = seen ? ((v - 50) / 50) * 100 : 0
            return (
              <div key={n} className="grid grid-cols-[120px_1fr_56px] items-center gap-4 py-3 text-[13.5px]">
                <span className="flex items-center gap-2 truncate font-medium">
                  {me ? <AsideMark className="size-4" /> : <span className="size-4 rounded-full border border-(--as-faint)" />}
                  {me ? brand : n}
                </span>
                <span className="h-4 rounded-[3px] bg-transparent">
                  <span
                    className={cn('block h-full rounded-[3px] transition-[width] duration-700 ease-out', me ? 'bg-(--as-blue)' : 'bg-(--as-line)')}
                    style={{ width: `${w}%`, transitionDelay: `${i * 70}ms` }}
                  />
                </span>
                <span className="text-right tabular-nums text-(--as-dim)">{v.toFixed(1)}%</span>
              </div>
            )
          })}
        </div>
        <div role="tablist" className="mx-auto mt-8 flex w-fit gap-1 rounded-lg bg-(--as-soft) p-1">
          {keys.map((k) => (
            <button key={k} role="tab" type="button" aria-selected={tab === k} onClick={() => setTab(k)} className={cn('rounded-md px-3 py-1.5 text-[12.5px] transition-colors', tab === k ? 'bg-white shadow-sm' : 'text-(--as-dim) hover:text-(--as-ink)')}>
              {k}
            </button>
          ))}
        </div>
      </Rails>
    </section>
  )
}
