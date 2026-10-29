'use client'

import { useRef } from 'react'
import { Card, HexButton, HexMark, Mono, Serif, useInView, useScrollVar } from '@/registry/blocks/hex-kit'
import { cn } from '@/lib/utils'

export interface HexAgentProps {
  heading?: string
  question?: string
  ctaLabel?: string
  animate?: boolean
  className?: string
}

const ROWS: [string, number, number, number][] = [
  ['Starter', 48, 30, 22],
  ['Team', 56, 26, 18],
  ['Studio', 41, 35, 24],
  ['Business', 62, 22, 16],
  ['Enterprise', 52, 31, 17],
]

const FLOATERS = [
  { x: '6%', y: '18%', s: 120, k: '?' },
  { x: '88%', y: '10%', s: -90, k: '◇' },
  { x: '78%', y: '82%', s: 160, k: '∑' },
  { x: '14%', y: '88%', s: -140, k: '#' },
]

/**
 * Text column stays pinned on wide screens while a notebook card answers a
 * question; the bars grow in when the chart is first seen, and small glyphs
 * drift at different speeds as the section crosses the screen.
 */
export function HexAgent({
  heading = 'Ask in words, get a chart you can trust',
  question = 'Which plans grew fastest this quarter, split by region?',
  ctaLabel = 'See how answers work',
  animate = true,
  className,
}: HexAgentProps) {
  const ref = useRef<HTMLElement>(null)
  useScrollVar(ref, { name: '--hx-drift' })
  const [chartRef, seen] = useInView<HTMLDivElement>(0.35)
  const grow = seen || !animate
  return (
    <section ref={ref} className={cn('relative isolate overflow-clip px-6 py-24', className)}>
      {FLOATERS.map((f) => (
        <span
          key={f.k}
          aria-hidden
          className="hx-move absolute grid size-10 place-items-center rounded-full border border-(--hx-line) bg-(--hx-paper) font-mono text-sm text-(--hx-faint)"
          style={{ left: f.x, top: f.y, transform: `translateY(calc((var(--hx-drift, 0.5) - 0.5) * ${f.s}px))` }}
        >
          {f.k}
        </span>
      ))}
      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="self-start md:sticky md:top-24">
          <Mono className="text-(--hx-accent)">Ask</Mono>
          <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
            {heading.split(' ').slice(0, -2).join(' ')} <Serif>{heading.split(' ').slice(-2).join(' ')}</Serif>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-(--hx-dim)">
            Every answer shows the query, the model it used and how sure it is, so the next person can pick it up.
          </p>
          <HexButton className="mt-7">{ctaLabel}</HexButton>
          <blockquote className="mt-10 max-w-sm border-l-2 border-(--hx-accent) pl-4 text-[14px] leading-relaxed text-(--hx-dim)">
            “We stopped arguing about whose number was right.”
            <footer className="mt-2 font-mono text-[11px] text-(--hx-faint)">Ops lead, a logistics team</footer>
          </blockquote>
        </div>
        <div className="flex flex-col gap-6">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-(--hx-line) px-4 py-2.5 text-[12px]">
            <HexMark className="size-4" />
            <span className="truncate font-medium">Quarterly plan review</span>
            <span className="ml-auto flex gap-1">
              {['Ask', 'Notebook', 'App'].map((t, i) => (
                <span key={t} className={cn('rounded px-2 py-0.5', i === 0 ? 'bg-(--hx-violet)/10 text-(--hx-violet)' : 'text-(--hx-faint)')}>{t}</span>
              ))}
            </span>
          </div>
          <div className="space-y-4 p-5 text-[13.5px] leading-relaxed">
            <p className="ml-auto max-w-[85%] rounded-md bg-(--hx-violet)/8 px-3 py-2 text-(--hx-violet)">{question}</p>
            <p className="font-mono text-[11px] text-(--hx-faint)">› Worked for 9s · used model “plans_v3”</p>
            <p className="text-(--hx-dim)">Business plans grew the most, mostly in the west. Here is the mix by region for each plan:</p>
            <div ref={chartRef} className="rounded border border-(--hx-line) p-4">
              <div className="mb-3 flex items-center gap-4 font-mono text-[10px] text-(--hx-faint)">
                {['West', 'Central', 'East'].map((r, i) => (
                  <span key={r} className="flex items-center gap-1.5">
                    <span className="size-2 rounded-sm" style={{ background: `var(--hx-violet${i ? `-${i + 1}` : ''})` }} />
                    {r}
                  </span>
                ))}
              </div>
              <div className="space-y-2.5">
                {ROWS.map(([name, a, b, c], i) => (
                  <div key={name} className="grid grid-cols-[72px_1fr] items-center gap-3 text-[11.5px] text-(--hx-dim)">
                    <span className="truncate">{name}</span>
                    <span className="flex h-4 overflow-hidden rounded-[2px]">
                      {[a, b, c].map((w, j) => (
                        <span
                          key={j}
                          className="h-full transition-[width] duration-700 ease-out"
                          style={{ width: grow ? `${w}%` : '0%', transitionDelay: `${i * 80 + j * 60}ms`, background: `var(--hx-violet${j ? `-${j + 1}` : ''})` }}
                        />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-(--hx-line) px-4 py-2.5">
            <Mono className="text-(--hx-faint)">Query</Mono>
            <Mono className="text-(--hx-mint)">Checked</Mono>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-(--hx-dim)">
            <span className="text-(--hx-violet)">select</span> plan, region, <span className="text-(--hx-violet)">sum</span>(seats) <span className="text-(--hx-violet)">as</span> seats{'\n'}
            <span className="text-(--hx-violet)">from</span> plans_v3{'\n'}
            <span className="text-(--hx-violet)">where</span> quarter = <span className="text-(--hx-accent)">&apos;this&apos;</span>{'\n'}
            <span className="text-(--hx-violet)">group by</span> 1, 2
          </pre>
        </Card>
        <Card className="flex items-center gap-4 p-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-(--hx-accent-soft) font-mono text-sm text-(--hx-accent)">#</span>
          <div className="min-w-0 text-[13.5px]">
            <p className="font-medium">Shared to #ops-weekly</p>
            <p className="truncate text-(--hx-dim)">Refreshes every Monday at 9:00 and flags any plan that drops.</p>
          </div>
        </Card>
        </div>
      </div>
    </section>
  )
}
