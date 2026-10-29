'use client'

import { useRef } from 'react'
import { Cross, Mono, Reticle, ScoutButton, Terrain, useScrollVar } from '@/registry/blocks/scout-kit'
import { cn } from '@/lib/utils'

export interface ScoutHeroProps {
  headline?: string
  ctaLabel?: string
  animate?: boolean
  className?: string
}

/**
 * A full-bleed drawn terrain with a tracking reticle and a headline pinned to
 * the lower left. The ridgelines drift apart as the hero scrolls away.
 */
export function ScoutHero({ headline = 'Interface blocks\nfor work in the field', ctaLabel = 'Watch the tour', animate = true, className }: ScoutHeroProps) {
  const ref = useRef<HTMLElement>(null)
  useScrollVar(ref, { mode: 'exit' })
  return (
    <section ref={ref} className={cn('relative isolate flex min-h-[620px] flex-col justify-end overflow-hidden px-6 pt-28 pb-10 [--sc-p:0]', className)}>
      <Terrain animate={animate} className="-z-10" />
      <Reticle animate={animate} className="top-[30%] left-[58%]" />
      <Mono className="absolute top-[30%] left-[calc(58%+110px)] hidden text-(--sc-faint) md:block">
        37.40N / 122.03W
        <br />
        ALT 0142
      </Mono>
      <Cross className="top-24 left-6" />
      <Cross className="top-24 left-[calc(100%-24px)]" />
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="max-w-[16ch] text-[clamp(34px,5vw,60px)] leading-[1.04] font-normal tracking-[-0.03em] whitespace-pre-line">{headline}</h1>
        <ScoutButton>{ctaLabel}</ScoutButton>
      </div>
    </section>
  )
}
