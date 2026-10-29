'use client'

import { useState } from 'react'
import { HexButton, Serif } from '@/registry/blocks/hex-kit'
import { cn } from '@/lib/utils'

export interface HexFaqProps {
  heading?: string
  className?: string
}

const QA: [string, string][] = [
  ['What is this for?', 'Exploring data, answering questions in plain words and turning the good answers into apps other people can use.'],
  ['Do I need to write SQL?', 'No. You can ask in words, and the query is always there to read or edit if you want it.'],
  ['Where does my data go?', 'Nowhere new. Queries run in your own warehouse, with the permissions you already set.'],
  ['Can I try it with my team?', 'Yes. The free plan covers small teams, and inviting people takes an email address.'],
]

/** A short call to action followed by a single-open accordion. */
export function HexFaq({ heading = 'Questions', className }: HexFaqProps) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className={cn('px-6 py-24', className)}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-md border border-(--hx-line) bg-(--hx-paper) px-6 py-10 text-center">
        <h3 className="text-2xl font-semibold tracking-[-0.03em]">
          Getting going <Serif>takes minutes</Serif>
        </h3>
        <p className="max-w-md text-[14px] text-(--hx-dim)">Connect a source, ask a question, share what you find.</p>
        <HexButton>Start for free</HexButton>
      </div>
      <h2 className="mt-20 text-center text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-[-0.035em]">{heading}</h2>
      <div className="mx-auto mt-8 max-w-2xl divide-y divide-(--hx-line) border-y border-(--hx-line)">
        {QA.map(([q, a], i) => {
          const on = open === i
          return (
            <div key={q}>
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-medium">
                {q}
                <span className={cn('grid size-6 shrink-0 place-items-center rounded-full border border-(--hx-line) text-(--hx-dim) transition-transform duration-300', on && 'rotate-45')}>+</span>
              </button>
              <div className={cn('grid transition-[grid-template-rows] duration-300', on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <p className="min-h-0 overflow-hidden pr-10 text-[14px] leading-relaxed text-(--hx-dim)">
                  <span className="block pb-4">{a}</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
