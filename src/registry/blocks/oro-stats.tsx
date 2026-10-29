'use client'

import { CountUp, GrowthChart, OroHeading, OroRoot } from '@/registry/blocks/oro-kit'
import { cn } from '@/lib/utils'

export interface OroStatsProps {
  /** chart: sand band with a big count and a growth line. cards: three count-up cards with mini bars. */
  variant?: 'chart' | 'cards'
  title?: string
  description?: string
  count?: number
  countLabel?: string
  animate?: boolean
  className?: string
}

const GROWTH = [1, 2, 2, 3, 5, 6, 8, 11, 13, 17, 20, 24, 29, 35, 41, 46, 53, 60, 64, 72, 79, 86, 93, 100]

/** ORO stats section in two variants. */
export function OroStats({
  variant = 'chart',
  title = 'Every round leaves a record.',
  description = 'Scores, briefs and the losing candidates are all published, so you can see why a block made the cut.',
  count = 128604,
  countLabel = 'Scored comparisons.',
  animate = true,
  className,
}: OroStatsProps) {
  if (variant === 'cards') {
    return (
      <OroRoot className={cn('w-full', className)}>
        <section className="mx-auto max-w-6xl px-6 py-20 md:px-8">
          <OroHeading className="max-w-xl text-[clamp(2rem,4.4vw,3rem)] leading-[1.02]">{title}</OroHeading>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {[
              [count, countLabel, [3, 5, 4, 7, 8, 10]],
              [312, 'Blocks kept so far.', [2, 3, 5, 5, 6, 8]],
              [41, 'Rounds published.', [1, 2, 3, 4, 5, 6]],
            ].map(([n, label, bars]) => (
              <div key={String(label)} className="rounded-3xl bg-(--oro-sand) p-6">
                <p className="font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-none font-extrabold tracking-[-0.03em]">
                  <CountUp value={n as number} />
                </p>
                <p className="mt-2 font-display text-[15px] font-bold">{label as string}</p>
                <div className="mt-6 flex h-14 items-end gap-1.5">
                  {(bars as number[]).map((b, i, a) => (
                    <span key={i} className={cn('flex-1 rounded-t-md', i === a.length - 1 ? 'bg-(--oro-orange)' : 'bg-(--oro-ink)/15')} style={{ height: `${(b / Math.max(...a)) * 100}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </OroRoot>
    )
  }

  return (
    <OroRoot className={cn('w-full bg-(--oro-sand)', className)}>
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <OroHeading className="text-[clamp(2rem,4.4vw,3rem)] leading-[1.02]">{title}</OroHeading>
          <p className="max-w-md text-[17px] leading-relaxed text-(--oro-soft) md:justify-self-end">{description}</p>
        </div>
        <p className="mt-14 font-display text-[clamp(3rem,9vw,6rem)] leading-none font-extrabold tracking-[-0.03em]">
          <CountUp value={count} />
        </p>
        <p className="mt-2 font-display text-[17px] font-bold">{countLabel}</p>
        <GrowthChart points={GROWTH} animate={animate} start="Round 1" end="Round 41" className="mt-10" />
      </section>
    </OroRoot>
  )
}
