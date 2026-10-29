'use client'

import { useState } from 'react'
import { DiaHeading } from '@/registry/blocks/dia-kit'
import { cn } from '@/lib/utils'

export interface DiaControlsProps {
  title?: string
  body?: string
  linkLabel?: string
  animate?: boolean
  className?: string
}

const SETTINGS: [string, boolean][] = [
  ['Remember my layout', true],
  ['Share usage stats', false],
  ['Local history only', true],
  ['Load remote fonts', false],
  ['Block third-party scripts', true],
  ['Sync across devices', true],
  ['Suggest next steps', false],
  ['Keep drafts offline', true],
]

/** A row of switches that drifts sideways. The switches really toggle. */
function Row({ items, reverse, animate, on, toggle }: { items: string[]; reverse?: boolean; animate: boolean; on: Record<string, boolean>; toggle: (k: string) => void }) {
  return (
    <div className="group/row flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div
        className={cn('flex shrink-0 gap-3 pr-3 group-hover/row:[animation-play-state:paused]', animate && 'di-anim')}
        style={{ animation: animate ? `di-marquee ${reverse ? 46 : 38}s linear infinite${reverse ? ' reverse' : ''}` : undefined }}
      >
        {[0, 1].map((copy) =>
          items.map((k) => (
            <button
              key={`${copy}-${k}`}
              type="button"
              role="switch"
              aria-checked={on[k]}
              tabIndex={copy ? -1 : 0}
              aria-hidden={copy ? true : undefined}
              onClick={() => toggle(k)}
              className="flex shrink-0 items-center gap-3 rounded-full border border-(--di-line) bg-(--di-card) py-1.5 pr-1.5 pl-4 text-[13px] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-(--di-sun) focus-visible:outline-none"
            >
              {k}
              <span className={cn('flex h-5 w-9 items-center rounded-full p-0.5 transition-colors duration-300', on[k] ? 'bg-(--di-ink)' : 'bg-(--di-chip)')}>
                <span className={cn('size-4 rounded-full bg-(--di-card) shadow transition-transform duration-300', on[k] && 'translate-x-4')} />
              </span>
            </button>
          )),
        )}
      </div>
    </div>
  )
}

export function DiaControls({
  title = 'Your settings,\nyour call',
  body = 'Choose what is remembered and what is never kept. Nothing you build here is sold, and nothing leaves your machine unless you sync it.',
  linkLabel = 'Read how data is handled',
  animate = true,
  className,
}: DiaControlsProps) {
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(SETTINGS))
  const toggle = (k: string) => setOn((s) => ({ ...s, [k]: !s[k] }))
  const names = SETTINGS.map(([k]) => k)
  const [first, second] = title.split('\n')
  return (
    <section className={cn('overflow-hidden py-24', className)}>
      <DiaHeading className="px-6 text-center text-[34px] leading-tight sm:text-[42px]">{first}</DiaHeading>
      <div className="mt-8 flex flex-col gap-3">
        <Row items={names.slice(0, 4)} animate={animate} on={on} toggle={toggle} />
        <Row items={names.slice(4)} reverse animate={animate} on={on} toggle={toggle} />
      </div>
      {second && <DiaHeading className="mt-8 px-6 text-center text-[34px] leading-tight sm:text-[42px]">{second}</DiaHeading>}
      <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-5 px-6 text-center">
        <p className="text-[15px] leading-relaxed text-(--di-soft)">{body}</p>
        <a href="#" className="group inline-flex items-center gap-2 rounded-full border border-(--di-line) px-4 py-2 text-[13px] transition-colors hover:bg-(--di-chip)">
          {linkLabel}
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </section>
  )
}
