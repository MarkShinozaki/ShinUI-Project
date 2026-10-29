'use client'

import { useEffect, useState } from 'react'
import { DiaButton, DiaHeading, Lines, Sunrise, WindowFrame } from '@/registry/blocks/dia-kit'
import { cn } from '@/lib/utils'

export interface DiaHeroProps {
  /** sunrise: gold glow, giant serif wordmark and a window. plain: paper background, headline and window. */
  variant?: 'sunrise' | 'plain'
  brand?: string
  title?: string
  primaryCta?: string
  note?: string
  /** What the assistant in the window types out. */
  prompt?: string
  animate?: boolean
  className?: string
}

const AGENDA = [
  { time: '09:30', label: 'Review hero variants', tag: 'Blocks' },
  { time: '11:00', label: 'Pair on the pricing table', tag: 'Call' },
  { time: '14:15', label: 'Ship the footer kit', tag: 'Release' },
]

function useTyped(text: string, on: boolean) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!on) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(() => setN(text.length), 0)
      return () => window.clearTimeout(t)
    }
    const id = window.setInterval(() => setN((v) => (v >= text.length + 40 ? 0 : v + 1)), 55)
    return () => window.clearInterval(id)
  }, [text, on])
  return on ? text.slice(0, Math.min(n, text.length)) : text
}

function HeroWindow({ prompt, animate }: { prompt: string; animate: boolean }) {
  const typed = useTyped(prompt, animate)
  return (
    <WindowFrame tabs={['Today', 'Hero variants', 'Pricing notes']} className="mt-8 w-full max-w-3xl text-left">
      <div className="grid min-h-[300px] grid-cols-1 sm:grid-cols-[180px_1fr]">
        <aside className="hidden flex-col gap-1 border-r border-(--di-line) bg-(--di-paper)/60 p-3 text-[12px] sm:flex">
          {['Morning plan', 'Inbox digest', 'Pinned specs', 'Drafts'].map((x, i) => (
            <span key={x} className={cn('rounded-lg px-2.5 py-1.5', i === 0 ? 'bg-(--di-honey)/60 font-medium' : 'text-(--di-soft)')}>
              {x}
            </span>
          ))}
        </aside>
        <div className="flex flex-col gap-4 p-5">
          <div>
            <p className="font-(family-name:--di-serif) text-[22px] tracking-tight">Good morning, Aiko.</p>
            <p className="text-[12px] text-(--di-soft)">Three things on deck before lunch.</p>
          </div>
          <ul className="flex flex-col gap-1.5">
            {AGENDA.map((a, i) => (
              <li
                key={a.time}
                className={cn('flex items-center gap-3 rounded-xl border border-(--di-line) px-3 py-2 text-[12.5px]', animate && 'di-anim [animation:di-rise_.6s_ease-out_both]')}
                style={{ animationDelay: `${200 + i * 140}ms` }}
              >
                <span className="font-mono text-[11px] text-(--di-faint)">{a.time}</span>
                <span className="flex-1 truncate">{a.label}</span>
                <span className="rounded-full bg-(--di-chip) px-2 py-0.5 text-[10.5px] text-(--di-soft)">{a.tag}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-2 rounded-xl bg-(--di-chip) px-3 py-2.5 text-[12.5px]">
            <span className="size-2 rounded-full bg-(--di-sun)" />
            <span className="min-w-0 flex-1 truncate">
              {typed}
              <span className="di-anim ml-px inline-block h-3.5 w-px translate-y-0.5 bg-(--di-ink) [animation:di-caret_1s_steps(1)_infinite]" />
            </span>
          </div>
        </div>
      </div>
    </WindowFrame>
  )
}

export function DiaHero({
  variant = 'sunrise',
  brand = 'shinUI',
  title = 'Less tab juggling.\nMore good pages.',
  primaryCta = 'Start building',
  note = 'Free, open source, copy-paste React',
  prompt = 'Summarise yesterday’s review and open the hero file…',
  animate = true,
  className,
}: DiaHeroProps) {
  const sun = variant === 'sunrise'
  return (
    <section className={cn('relative isolate overflow-hidden px-6 pt-16 pb-20', className)}>
      {sun && <Sunrise animate={animate} className="-z-10" />}
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <DiaHeading as="h1" className={cn('text-[34px] leading-[1.08] sm:text-[44px]', sun && 'text-[#2a2208] dark:text-(--di-ink)')}>
          <Lines text={title} />
        </DiaHeading>
        {sun && (
          <p aria-hidden className="mt-2 font-(family-name:--di-serif) text-[clamp(88px,18vw,220px)] leading-[0.9] tracking-[-0.06em] text-white/90 italic mix-blend-soft-light dark:text-white/30">
            {brand}
          </p>
        )}
        <HeroWindow prompt={prompt} animate={animate} />
        <div className="mt-10 flex flex-col items-center gap-2">
          <DiaButton>{primaryCta}</DiaButton>
          <span className="text-[12px] text-(--di-faint)">{note}</span>
        </div>
      </div>
    </section>
  )
}
