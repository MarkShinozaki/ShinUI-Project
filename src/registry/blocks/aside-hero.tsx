'use client'

import { useRef } from 'react'
import { AppWindow, SplitButton, Sky, useScrollVar } from '@/registry/blocks/aside-kit'
import { cn } from '@/lib/utils'

export interface AsideHeroProps {
  badge?: string
  title?: string
  subtitle?: string
  task?: string
  animate?: boolean
  className?: string
}

const CHATS = ['Plan a team offsite', 'Compare three laptops', 'Summarise unread mail', 'Weekly metrics recap']
const STEPS = ['Opening the billing pages', 'Reading each plan and renewal date', 'Drafting a short list to cancel']

/**
 * Sky card with a short headline and a download pill. Below it an app window
 * sits tilted back and flattens out as the hero scrolls away.
 */
export function AsideHero({
  badge = 'Now in public beta',
  title = 'An assistant that lives',
  subtitle = 'where you already work.',
  task = 'find subscriptions I never use and list them',
  animate = true,
  className,
}: AsideHeroProps) {
  const ref = useRef<HTMLElement>(null)
  useScrollVar(ref, { name: '--as-x', mode: 'exit' })
  return (
    <section ref={ref} className={cn('px-3 pt-3', className)}>
      <div className="relative isolate overflow-hidden rounded-2xl px-6 pt-28 pb-0 text-center [perspective:1400px]">
        <Sky animate={animate} />
        <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-[12px] text-(--as-ink)/80 backdrop-blur">
          {badge} <span aria-hidden>›</span>
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.08] font-medium tracking-[-0.035em]">
          {title}
          <br />
          {subtitle}
        </h1>
        <div className="mt-7">
          <SplitButton />
        </div>
        <div
          className="as-move mx-auto mt-14 max-w-5xl origin-bottom transition-transform duration-100"
          style={{ transform: 'rotateX(calc(max(0, 0.3 - var(--as-x, 0)) * -60deg)) scale(calc(1 - max(0, 0.3 - var(--as-x, 0)) * 0.15))' }}
        >
          <AppWindow title="Chats · Unused subscriptions" className="rounded-b-none border-b-0 text-left">
            <div className="grid h-[380px] grid-cols-[200px_1fr] max-sm:grid-cols-1">
              <aside className="space-y-4 border-r border-(--as-line) bg-white/50 p-3 text-[12.5px] max-sm:hidden">
                <div className="grid grid-cols-3 gap-1.5">
                  {['#e1306c', '#4285f4', '#36c5f0', '#a259ff', '#111', '#5865f2'].map((c) => (
                    <span key={c} className="grid h-8 place-items-center rounded-md bg-black/[0.04]">
                      <span className="size-3 rounded-[4px]" style={{ background: c }} />
                    </span>
                  ))}
                </div>
                <div>
                  <p className="mb-1.5 px-1 text-[11px] text-(--as-dim)">Chats</p>
                  {CHATS.map((c, i) => (
                    <p key={c} className={cn('flex items-center justify-between truncate rounded-md px-2 py-1.5', i === 0 && 'bg-white shadow-sm')}>
                      <span className="truncate">{c}</span>
                      {i === 1 && <span className="size-3 shrink-0 rounded-full border border-(--as-faint) border-t-transparent" style={animate ? { animation: 'as-spin 1s linear infinite' } : undefined} />}
                      {i === 2 && <span className="size-1.5 shrink-0 rounded-full bg-(--as-blue)" />}
                    </p>
                  ))}
                </div>
              </aside>
              <div className="flex flex-col p-5 text-[13px]">
                <p className="ml-auto max-w-[80%] rounded-2xl bg-(--as-soft) px-4 py-2">{task}</p>
                <div className="mt-5 space-y-2.5">
                  <p className="text-[12px] text-(--as-dim)">Working for 1m 12s</p>
                  {STEPS.map((s, i) => (
                    <p key={s} className="flex items-center gap-2" style={animate ? { animation: `as-bob 3s ${i * 0.3}s ease-in-out infinite` } : undefined}>
                      <span className={cn('grid size-4 place-items-center rounded-full text-[9px] text-white', i < 2 ? 'bg-(--as-blue)' : 'border border-(--as-faint)')}>{i < 2 ? '✓' : ''}</span>
                      <span className={i < 2 ? '' : 'text-(--as-dim)'}>{s}</span>
                    </p>
                  ))}
                </div>
                <div className="mt-auto flex items-center gap-2 rounded-xl border border-(--as-line) bg-white px-3 py-2.5 text-(--as-dim)">
                  <span>Ask anything</span>
                  <span className="h-4 w-px bg-(--as-ink)" style={animate ? { animation: 'as-caret 1s steps(1) infinite' } : undefined} />
                  <span className="ml-auto grid size-6 place-items-center rounded-full bg-(--as-ink) text-[11px] text-white">↑</span>
                </div>
              </div>
            </div>
          </AppWindow>
        </div>
      </div>
    </section>
  )
}
