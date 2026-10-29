'use client'

import { useState } from 'react'
import { OroHeading, OroRoot } from '@/registry/blocks/oro-kit'
import { cn } from '@/lib/utils'

export interface OroTracksProps {
  /** flow: a brief, a glowing scorer and a result card joined by dashed paths. tabs: numbered tracks that swap a detail card. */
  variant?: 'flow' | 'tabs'
  title?: string
  description?: string
  animate?: boolean
  className?: string
}

const TRACKS = [
  { n: '01', name: 'Landing', tag: 'Heroes + navs', steps: ['Brief: launch page for a note app', 'Scorer tries 3 heroes on real traffic', 'Kept: editorial hero, +18% sign-ups'] },
  { n: '02', name: 'Content', tag: 'Features + stats', steps: ['Brief: explain four features fast', 'Scorer compares bento vs list', 'Kept: list, read 2x further'] },
  { n: '03', name: 'Commerce', tag: 'Pricing + checkout', steps: ['Brief: three plans, one highlighted', 'Scorer swaps toggle and order', 'Kept: yearly toggle on the left'] },
  { n: '04', name: 'Footers', tag: 'Coming soon', steps: ['Brief: big footer with a CTA', 'Scorer queued', 'Results next round'] },
]

function Flow({ animate }: { animate: boolean }) {
  return (
    <div className="relative mt-12 overflow-hidden rounded-3xl border border-(--oro-line) bg-(--oro-card) p-6 md:p-10">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-xl bg-(--oro-sky) p-4 text-[13px]">
          <p className="font-mono text-[10px] text-(--oro-faint) uppercase">Brief</p>
          <p className="mt-1 font-medium">Pricing page, three plans, under one screen.</p>
          <ul className="mt-3 space-y-1.5 text-(--oro-soft)">
            <li>· Budget: one block</li>
            <li>· Must work on phones</li>
            <li>· Dark mode included</li>
          </ul>
        </div>
        <div className="relative flex flex-col items-center gap-2">
          <svg viewBox="0 0 160 20" className="absolute top-1/2 left-1/2 hidden w-[140%] -translate-x-1/2 -translate-y-1/2 md:block" fill="none" aria-hidden>
            <path d="M0 10H160" stroke="var(--oro-faint)" strokeDasharray="4 5" />
          </svg>
          <span
            className={cn('relative grid size-20 place-items-center rounded-full font-display text-[13px] font-bold text-white', animate && 'oro-anim [animation:oro-pulse_2.8s_ease-in-out_infinite]')}
            style={{ background: 'radial-gradient(circle at 35% 35%, var(--oro-gold), var(--oro-orange) 70%)', boxShadow: '0 0 40px var(--oro-amber)' }}
          >
            Scorer
          </span>
          <span className="font-mono text-[10px] text-(--oro-faint) uppercase">3 runs · 12 min</span>
        </div>
        <div className="rounded-xl border border-(--oro-line) p-4 text-[13px]">
          <p className="font-mono text-[10px] text-(--oro-faint) uppercase">Result</p>
          <p className="mt-1 font-display text-[17px] font-bold">Grid steps · pricing</p>
          <p className="mt-1 text-(--oro-soft)">Kept on 9 of 10 test pages.</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-(--oro-line)">
            <div className={cn('h-full w-[90%] rounded-full bg-(--oro-orange)', animate && 'oro-anim origin-left [animation:oro-rise_1s_ease-out_both]')} />
          </div>
        </div>
      </div>
      <p className="mt-8 text-center text-[13px] text-(--oro-faint)">
        <span className="font-medium text-(--oro-ink)">The kept block</span> beat two others on the same brief and the same budget.
      </p>
    </div>
  )
}

function Tabs() {
  const [active, setActive] = useState(0)
  const t = TRACKS[active]
  return (
    <div className="mt-12">
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-(--oro-line) bg-(--oro-card) p-1.5 md:grid-cols-4">
        {TRACKS.map((x, i) => (
          <button
            key={x.n}
            type="button"
            onClick={() => setActive(i)}
            className={cn('cursor-pointer rounded-xl px-4 py-3 text-left transition-colors duration-200', i === active ? 'bg-(--oro-sky)' : 'hover:bg-(--oro-ink)/5')}
          >
            <span className="block font-mono text-[10px] text-(--oro-faint)">{x.n}</span>
            <span className="mt-1 block font-display text-[15px] font-bold">{x.name}</span>
            <span className="block text-[11.5px] text-(--oro-soft)">{x.tag}</span>
          </button>
        ))}
      </div>
      <ol key={active} className="oro-anim mt-3 grid gap-3 [animation:oro-rise_.3s_ease-out] md:grid-cols-3">
        {t.steps.map((s, i) => (
          <li key={s} className="rounded-2xl border border-(--oro-line) bg-(--oro-card) p-5">
            <span className="font-mono text-[10px] text-(--oro-orange)">Step {i + 1}</span>
            <p className="mt-2 font-display text-[16px] leading-snug font-bold">{s}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** ORO "how it works" section in two variants. */
export function OroTracks({
  variant = 'flow',
  title = 'Every block earns its spot.',
  description = 'Each candidate goes through the same brief, the same budget and the same scorer. Only the winner ships.',
  animate = true,
  className,
}: OroTracksProps) {
  return (
    <OroRoot className={cn('w-full', className)}>
      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 md:items-end">
          <OroHeading className="text-[clamp(2rem,4.4vw,3rem)] leading-[1.02]">{title}</OroHeading>
          <p className="max-w-md text-[17px] leading-relaxed text-(--oro-soft) md:justify-self-end">{description}</p>
        </div>
        {variant === 'flow' ? <Flow animate={animate} /> : <Tabs />}
      </section>
    </OroRoot>
  )
}
