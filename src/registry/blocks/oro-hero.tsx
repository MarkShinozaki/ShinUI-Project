'use client'

import { useEffect, useState } from 'react'
import { CountUp, DataPanel, GrowthChart, OroButton, OroHeading, OroRoot, SunGlow } from '@/registry/blocks/oro-kit'
import { cn } from '@/lib/utils'

export interface OroHeroProps {
  /** glow: headline left, sun glow and a live leaderboard right. centered: headline over the glow with a tab strip. counter: sand panel with a big count and a growth chart. */
  variant?: 'glow' | 'centered' | 'counter'
  /** Use a line break (\n) to control where the headline wraps. */
  title?: string
  description?: string
  primaryCta?: string
  secondaryCta?: string
  /** Big number in the counter variant. */
  count?: number
  countLabel?: string
  animate?: boolean
  className?: string
}

const ROWS = [
  ['Round 12 · Bento grid', 'Scored · 9.4'],
  ['#1 Folio landing', '96.1% · kept'],
  ['#2 Context hero', '94.8% · kept'],
  ['#3 Grid footer', '93.2% · kept'],
  ['#4 Roma steps', '91.0% · kept'],
]

/** Leaderboard rows that re-rank every few seconds. */
function Leaderboard({ animate }: { animate: boolean }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setTick((t) => t + 1), 2600)
    return () => window.clearInterval(id)
  }, [animate])
  const order = [1, 2, 3, 4].sort((a, b) => Math.sin(a * 3.1 + tick) - Math.sin(b * 3.1 + tick))
  return (
    <DataPanel stats={[['2,814', 'Blocks run'], ['640', 'Reviewers'], ['0', 'Regressions']]} className="w-full max-w-sm">
      <div className="border-b border-white/10 px-4 py-3 text-[11px]">
        <p className="text-white/55 uppercase">Block bench · round 13</p>
        <p className="mt-1 flex items-center gap-2 text-[#f1c039]">
          <span className="oro-anim size-1.5 rounded-full bg-[#f1c039] [animation:oro-blink_1.2s_ease-in-out_infinite]" />
          Evaluating now
        </p>
      </div>
      <ul className="px-4 py-2 text-[11.5px]">
        <li className="flex justify-between py-1.5 text-white/55 uppercase">
          <span>{ROWS[0][0]}</span>
          <span>{ROWS[0][1]}</span>
        </li>
        {order.map((i, rank) => (
          <li key={ROWS[i][0]} className="oro-anim flex justify-between border-t border-white/10 py-2 [animation:oro-rise_.4s_ease-out]">
            <span className="font-semibold">
              #{rank + 1} {ROWS[i][0].slice(3)}
            </span>
            <span className="text-white/60">{ROWS[i][1]}</span>
          </li>
        ))}
      </ul>
      <a href="#" className="block border-t border-white/10 px-4 py-3 text-center text-[11.5px] transition-colors hover:bg-white/5">
        View the full board →
      </a>
    </DataPanel>
  )
}

const TABS = [
  ['01', 'Landing', 'Heroes + navs'],
  ['02', 'Content', 'Features + stats'],
  ['03', 'Commerce', 'Pricing + checkout'],
  ['04', 'Footers', 'Coming soon'],
]

function TabStrip() {
  const [active, setActive] = useState(0)
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-(--oro-line) bg-(--oro-card)/80 p-1.5 shadow-[0_20px_40px_-30px_rgb(10_56_21/0.5)] backdrop-blur md:grid-cols-4">
      {TABS.map(([n, t, s], i) => (
        <button
          key={n}
          type="button"
          onClick={() => setActive(i)}
          className={cn('cursor-pointer rounded-xl px-4 py-3 text-left transition-colors duration-200', i === active ? 'bg-(--oro-sky)' : 'hover:bg-(--oro-ink)/5')}
        >
          <span className="block font-mono text-[10px] text-(--oro-faint)">{n}</span>
          <span className="mt-1 block font-display text-[15px] font-bold">{t}</span>
          <span className="block text-[11.5px] text-(--oro-soft)">{s}</span>
        </button>
      ))}
    </div>
  )
}

const GROWTH = [2, 3, 3, 4, 6, 7, 9, 12, 14, 18, 22, 25, 31, 36, 40, 47, 55, 61, 66, 74, 80, 88, 94, 100]

/** ORO hero in three layouts. */
export function OroHero({
  variant = 'glow',
  title = 'Blocks tested\non real pages.',
  description = 'We build and score layouts in live projects, so the ones that reach the library have already earned their place.',
  primaryCta = 'Request a sample',
  secondaryCta = 'Read the method',
  count = 4729412,
  countLabel = 'Page views served by shinUI blocks.',
  animate = true,
  className,
}: OroHeroProps) {
  const lines = title.split('\n')
  const heading = (size: string) => (
    <OroHeading as="h1" className={cn(size, 'leading-[0.98]')}>
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </OroHeading>
  )
  const actions = (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      {primaryCta && <OroButton>{primaryCta}</OroButton>}
      {secondaryCta && <OroButton variant="outline">{secondaryCta}</OroButton>}
    </div>
  )

  if (variant === 'counter') {
    return (
      <OroRoot className={cn('relative overflow-hidden bg-(--oro-sand)', className)}>
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <div className="grid gap-8 md:grid-cols-2 md:items-start">
            {heading('text-[clamp(2.4rem,5vw,3.6rem)]')}
            <p className="max-w-md text-[18px] leading-relaxed text-(--oro-soft) md:justify-self-end">{description}</p>
          </div>
          <p className="mt-16 font-display text-[clamp(3.4rem,10vw,7rem)] leading-none font-extrabold tracking-[-0.03em]">
            <CountUp value={count} />
          </p>
          <p className="mt-3 font-display text-[18px] font-bold">{countLabel}</p>
          <p className="text-[13px] text-(--oro-faint)">Counted since the first block shipped. Updated weekly.</p>
          <GrowthChart points={GROWTH} animate={animate} start="Week 1" end="This week" className="mt-12" />
        </div>
      </OroRoot>
    )
  }

  if (variant === 'centered') {
    return (
      <OroRoot className={cn('relative overflow-hidden', className)}>
        <SunGlow animate={animate} className="top-[-30%] left-1/2 size-[46rem] -translate-x-1/2 opacity-70" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 pb-16 text-center md:pt-32">
          {heading('text-[clamp(2.8rem,8vw,5.5rem)]')}
          <p className="mt-6 max-w-lg text-[19px] leading-relaxed text-(--oro-soft)">{description}</p>
          <div className="mt-9">{actions}</div>
          <div className="mt-16 w-full">
            <TabStrip />
          </div>
        </div>
      </OroRoot>
    )
  }

  return (
    <OroRoot className={cn('relative overflow-hidden', className)}>
      <SunGlow animate={animate} className="top-[-10%] right-[-12%] size-[44rem] opacity-90 max-md:top-[30%] max-md:right-[-50%]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.15fr_1fr] md:px-8 md:py-24">
        <div className="flex flex-col items-start gap-7">
          {heading('text-[clamp(2.8rem,7vw,5.4rem)]')}
          <p className="max-w-md text-[19px] leading-relaxed text-(--oro-soft)">{description}</p>
          {actions}
        </div>
        <div className="flex justify-center md:justify-end">
          <Leaderboard animate={animate} />
        </div>
      </div>
    </OroRoot>
  )
}
