'use client'

import { useEffect, useState } from 'react'
import { DiaHeading, Eyebrow, WindowFrame } from '@/registry/blocks/dia-kit'
import { cn } from '@/lib/utils'

export interface DiaStepsProps {
  title?: string
  /** Auto-advance through the steps; clicking one takes over. */
  animate?: boolean
  /** Seconds per step when auto-advancing. */
  interval?: number
  className?: string
}

const STEPS = [
  {
    title: 'Open the day with a plan',
    body: 'A short morning page lists what changed overnight, which reviews wait on you and the files you touched last, so the first coffee goes to work and not to searching.',
  },
  {
    title: 'Turn scattered notes into one page',
    body: 'Feedback lives in threads, docs and screenshots. Pull it into a single tidy summary you can paste into the pull request or hand to a teammate.',
  },
  {
    title: 'Ask, and land on the right file',
    body: 'Type the question the way you would ask a colleague. The answer points at the exact block, prop and line, with the source one click away.',
  },
]

function Panel({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-[linear-gradient(160deg,var(--di-honey),var(--di-cream))] p-6">
        <Eyebrow className="text-[#5a4a10]/70 dark:text-(--di-faint)">Thursday · Morning page</Eyebrow>
        <p className="mt-3 font-(family-name:--di-serif) text-[34px] leading-none tracking-tight italic">Today, gently.</p>
        <ul className="mt-6 grid gap-2 text-[13px]">
          {['2 reviews waiting on you', 'Footer kit merged overnight', 'Last opened: hero-variants.tsx'].map((x) => (
            <li key={x} className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 dark:bg-black/20">
              <span className="size-1.5 rounded-full bg-(--di-ink)" />
              {x}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  if (step === 1) {
    return (
      <div className="p-6">
        <Eyebrow>Summary · Review round 3</Eyebrow>
        <p className="mt-3 font-(family-name:--di-serif) text-[28px] leading-tight tracking-tight">What we agreed on</p>
        <div className="mt-4 space-y-2 text-[13px] leading-relaxed text-(--di-soft)">
          <p>Keep the serif for headlines only; body stays sans at 15px.</p>
          <p>The glow should drift, never pulse. Reduced motion freezes it.</p>
          <p>Cards lose their shadow on dark, borders carry the shape.</p>
        </div>
        <div className="mt-5 flex gap-2">
          {['3 threads', '2 docs', '5 screenshots'].map((x) => (
            <span key={x} className="rounded-full bg-(--di-chip) px-2.5 py-1 text-[11px] text-(--di-soft)">
              {x}
            </span>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3 p-6 text-[13px]">
      <span className="self-end rounded-2xl rounded-br-md bg-(--di-ink) px-3.5 py-2 text-(--di-paper)">Where is the sticky nav offset set?</span>
      <span className="max-w-[90%] rounded-2xl rounded-bl-md bg-(--di-chip) px-3.5 py-2 leading-relaxed">
        In <code className="font-mono text-[12px]">components-browser.tsx</code>, on the wrapper around the tab list. It matches the header height at each breakpoint.
      </span>
      <span className="flex items-center gap-2 self-start rounded-lg border border-(--di-line) px-3 py-2 font-mono text-[11.5px] text-(--di-soft)">
        <span className="size-1.5 rounded-full bg-(--di-sun)" />
        Open file at line 64
      </span>
    </div>
  )
}

export function DiaSteps({ title = 'Fewer tabs, more flow', animate = true, interval = 6, className }: DiaStepsProps) {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(animate)
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % STEPS.length), interval * 1000)
    return () => window.clearTimeout(id)
  }, [auto, active, interval])
  return (
    <section className={cn('px-6 py-24', className)}>
      <div className="mx-auto max-w-6xl">
        <DiaHeading className="text-center text-[34px] leading-tight sm:text-[42px]">{title}</DiaHeading>
        <div className="mt-14 grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <ol className="flex flex-col">
            {STEPS.map((s, i) => {
              const on = i === active
              return (
                <li key={s.title} className="border-t border-(--di-line) last:border-b">
                  <button
                    type="button"
                    aria-expanded={on}
                    onClick={() => {
                      setAuto(false)
                      setActive(i)
                    }}
                    className="group flex w-full flex-col gap-2 py-5 text-left focus-visible:outline-none"
                  >
                    <span className="flex items-baseline gap-4">
                      <Eyebrow>{String(i + 1).padStart(2, '0')}</Eyebrow>
                      <span className={cn('font-(family-name:--di-serif) text-[22px] tracking-tight transition-colors', on ? 'text-(--di-ink)' : 'text-(--di-faint) group-hover:text-(--di-soft)')}>{s.title}</span>
                    </span>
                    <span className={cn('grid pl-10 transition-[grid-template-rows,opacity] duration-500 ease-out', on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                      <span className="overflow-hidden text-[14.5px] leading-relaxed text-(--di-soft)">{s.body}</span>
                    </span>
                    {on && auto && (
                      <span className="ml-10 h-px overflow-hidden bg-(--di-line)">
                        <span key={active} className="di-anim block h-full origin-left bg-(--di-ink)" style={{ animation: `di-fill ${interval}s linear both` }} />
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
          <WindowFrame tabs={['Morning page', 'Summary', 'Ask']} active={active}>
            <div key={active} className="di-anim min-h-[320px] [animation:di-rise_.5s_ease-out_both]">
              <Panel step={active} />
            </div>
          </WindowFrame>
        </div>
      </div>
    </section>
  )
}
