'use client'

import { useRef } from 'react'
import { Eyebrow, Halftone, NousDisplay, type HalftoneShape } from '@/registry/blocks/nous-kit'
import { cn } from '@/lib/utils'

const POSTS: { date: string; body: string; shape: HalftoneShape }[] = [
  { date: 'Oct 28', body: 'Footers can now stay with you: a sticky reveal that fades up as the page ends.', shape: 'glow' },
  { date: 'Oct 21', body: 'New kit: two colours, tall type and halftone fields with no image files at all.', shape: 'rings' },
  { date: 'Oct 14', body: 'Every marquee now pauses on hover and focus, so moving controls stay clickable.', shape: 'wave' },
  { date: 'Oct 07', body: 'Copy commands land in your clipboard with one click, from any block page.', shape: 'ridge' },
  { date: 'Sep 30', body: 'Reduced motion is respected across every animated block in the library.', shape: 'fade' },
]

export interface NousFeedProps {
  heading?: string
  animate?: boolean
  className?: string
}

/** A horizontal, snapping rail of update cards with arrow buttons. */
export function NousFeed({ heading = 'Changelog', animate = true, className }: NousFeedProps) {
  const rail = useRef<HTMLDivElement>(null)
  const nudge = (d: number) => rail.current?.scrollBy({ left: d * 300, behavior: 'smooth' })
  const arrow = 'grid size-9 place-items-center border border-(--nr-blue) text-(--nr-blue) hover:bg-(--nr-blue) hover:text-(--nr-on-blue)'
  return (
    <section className={cn('py-20', className)}>
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-4 px-6">
        <NousDisplay align="left" stretch={1.5} className="text-[clamp(40px,6vw,72px)]">
          {heading}
        </NousDisplay>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous" className={arrow} onClick={() => nudge(-1)}>←</button>
          <button type="button" aria-label="Next" className={arrow} onClick={() => nudge(1)}>→</button>
        </div>
      </div>
      <div ref={rail} className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] motion-reduce:scroll-auto">
        {POSTS.map((p) => (
          <article key={p.date} className="flex w-72 shrink-0 snap-start flex-col gap-3">
            <div className="relative aspect-[4/3] overflow-hidden bg-(--nr-card)">
              <Halftone shape={p.shape} animate={animate} />
            </div>
            <Eyebrow>@shinui</Eyebrow>
            <p className="text-[13.5px] leading-relaxed">{p.body}</p>
            <Eyebrow className="opacity-60">{p.date}</Eyebrow>
          </article>
        ))}
      </div>
    </section>
  )
}
