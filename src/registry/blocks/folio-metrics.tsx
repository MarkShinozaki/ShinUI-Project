'use client'

import type { ReactNode } from 'react'
import { ArrowUpRight, FolioLabel, FolioRoot, PixelBars, SparkGlyph } from '@/registry/blocks/folio-kit'
import { cn } from '@/lib/utils'

export interface FolioMetricsProps {
  /** bento: mixed stat cards with pixel charts. row: three big numbers and a pull quote. */
  variant?: 'bento' | 'row'
  eyebrow?: string
  /** Wrap words in *asterisks* to ink them; the rest stays muted. */
  title?: string
  quote?: string
  quoteSource?: string
  width?: 'narrow' | 'wide'
  className?: string
}

function Inked({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((p, i) =>
        p.startsWith('*') ? (
          <span key={i} className="text-(--fo-ink)">
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function Card({ title, sub, children, className }: { title: string; sub: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('border border-(--fo-line) bg-(--fo-paper) p-5 transition-colors duration-200 hover:border-(--fo-line-strong)', className)}>
      <h3 className="text-[14px] font-medium">{title}</h3>
      <FolioLabel className="mt-1 text-[9.5px]">{sub}</FolioLabel>
      {children}
    </div>
  )
}

function Big({ value, unit }: { value: string; unit?: string }) {
  return (
    <p className="mt-5 text-[40px] leading-none tracking-[-0.04em]">
      {value}
      {unit && <span className="ml-0.5 align-baseline text-[16px] text-(--fo-soft)">{unit}</span>}
    </p>
  )
}

/** Deterministic 0..1 noise so the chart is stable between renders. */
const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
const usage = Array.from({ length: 22 }, (_, i) => 0.25 + 0.75 * hash(i, 3))
const ranks = [0.22, 0.36, 0.46, 0.58, 0.63, 1, 0.5, 0.3]

function Quote({ quote, source }: { quote: string; source: string }) {
  return (
    <blockquote className="border-l-2 border-(--fo-blue) py-1 pl-5">
      <p className="text-[16px] leading-relaxed">
        <Inked text={quote} />
      </p>
      <footer className="mt-2 flex items-center gap-1 text-[12px] text-(--fo-faint)">
        {source}
        <ArrowUpRight />
      </footer>
    </blockquote>
  )
}

/** Folio stats section: bento cards or a row of numbers. */
export function FolioMetrics({
  variant = 'bento',
  eyebrow = 'In use',
  title = 'The point is pages people *enjoy* using, not pages that just *pass* a checklist.',
  quote = '“Swapped our whole marketing page in an afternoon and it finally *looks like us*.”',
  quoteSource = 'Indie maker, on a weekend build',
  width = 'narrow',
  className,
}: FolioMetricsProps) {
  const wrap = cn('mx-auto px-6 py-12 md:py-14', width === 'narrow' ? 'max-w-[44rem]' : 'max-w-6xl md:px-10')
  const head = (
    <div className="border-t border-(--fo-line) pt-10">
      <FolioLabel className="mb-4">{eyebrow}</FolioLabel>
      <h2 className="max-w-xl text-[clamp(1.4rem,2.8vw,1.9rem)] leading-snug font-normal tracking-[-0.02em] text-balance text-(--fo-faint)">
        <Inked text={title} />
      </h2>
    </div>
  )

  if (variant === 'row') {
    return (
      <FolioRoot className={cn('w-full', className)}>
        <section className={wrap}>
          {head}
          <dl className="mt-10 grid grid-cols-1 gap-px border border-(--fo-line) bg-(--fo-line) sm:grid-cols-3">
            {[
              ['Install time', 'per block, median', '38', 's'],
              ['Bundle added', 'typical block, gzip', '4.1', 'kb'],
              ['License', 'every item', 'MIT', ''],
            ].map(([t, s, v, u]) => (
              <div key={t} className="bg-(--fo-paper) p-5">
                <dt className="text-[14px] font-medium">{t}</dt>
                <FolioLabel className="mt-1 text-[9.5px]">{s}</FolioLabel>
                <dd>
                  <Big value={v} unit={u} />
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <Quote quote={quote} source={quoteSource} />
          </div>
        </section>
      </FolioRoot>
    )
  }

  return (
    <FolioRoot className={cn('w-full', className)}>
      <section className={wrap}>
        {head}
        <div className={cn('mt-10 grid gap-3', 'sm:grid-cols-[1fr_1.3fr]')}>
          <div className="flex flex-col gap-3">
            <Card title="First paint" sub="Per block, on a mid-range phone">
              <table className="mt-4 w-full text-left text-[12px]">
                <thead>
                  <tr>
                    <th />
                    <th className="pb-1 font-normal">
                      <FolioLabel className="text-[9px]">Cold</FolioLabel>
                    </th>
                    <th className="pb-1 font-normal">
                      <FolioLabel className="text-[9px]">Warm</FolioLabel>
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {[
                    ['Hero', '142', '61'],
                    ['Footer', '38', '17'],
                  ].map(([k, a, b]) => (
                    <tr key={k}>
                      <th className="py-1.5 text-[10px] font-normal tracking-[0.1em] uppercase">{k}</th>
                      {[a, b].map((n) => (
                        <td key={n} className="py-1.5 font-sans text-[22px] tracking-[-0.03em]">
                          {n}
                          <span className="ml-0.5 text-[11px] text-(--fo-faint) italic">ms</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card title="Installs" sub="Per month, all items">
              <Big value="12k" unit="+" />
              <PixelBars values={usage} rows={5} highlight={-1} className="mt-5" />
            </Card>
          </div>
          <Card title="Kept after a month" sub="Blocks still in use, sampled projects" className="flex flex-col">
            <Big value="#1" />
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-(--fo-soft)">
              Folio blocks were the set people <span className="bg-(--fo-tint-strong) text-(--fo-ink)">changed least</span> after installing.
            </p>
            <div className="relative mt-auto flex h-40 items-end gap-2 pt-8">
              <div aria-hidden className="absolute inset-x-0 top-8 bottom-0 bg-[linear-gradient(var(--fo-line)_1px,transparent_1px)] bg-[size:100%_33.3%]" />
              {ranks.map((v, i) => (
                <div
                  key={i}
                  className={cn('relative flex-1 transition-[height] duration-500', i === 5 ? 'bg-(--fo-blue) text-(--fo-on-blue)' : 'bg-(--fo-well) ring-1 ring-(--fo-line)')}
                  style={{ height: `${v * 100}%` }}
                >
                  {i === 5 && <SparkGlyph className="absolute top-2 left-1/2 -translate-x-1/2" />}
                </div>
              ))}
            </div>
            <a href="#" className="mt-5 flex items-center gap-1 text-[12.5px] font-medium hover:text-(--fo-blue)">
              How we measured <ArrowUpRight />
            </a>
          </Card>
        </div>
        <div className="mt-10">
          <Quote quote={quote} source={quoteSource} />
        </div>
      </section>
    </FolioRoot>
  )
}
