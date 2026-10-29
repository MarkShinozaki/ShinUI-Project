'use client'

import { OroFooter } from '@/registry/blocks/oro-footer'
import { OroHero } from '@/registry/blocks/oro-hero'
import { OroRoot } from '@/registry/blocks/oro-kit'
import { OroNavbar } from '@/registry/blocks/oro-navbar'
import { OroStats } from '@/registry/blocks/oro-stats'
import { OroTracks } from '@/registry/blocks/oro-tracks'
import { cn } from '@/lib/utils'

export interface OroLandingProps {
  /** research: glow hero with a leaderboard, flow, chart, CTA footer. launch: centered hero with tabs, track tabs, stat cards, columns footer. numbers: counter-first with a slim footer. */
  preset?: 'research' | 'launch' | 'numbers'
  brand?: string
  animate?: boolean
  className?: string
}

/** A full page stacked from the ORO blocks, in three presets. */
export function OroLanding({ preset = 'research', brand = 'shinui', animate = true, className }: OroLandingProps) {
  if (preset === 'launch') {
    return (
      <OroRoot className={cn('relative min-h-full', className)}>
        <div className="absolute inset-x-0 top-0 z-10">
          <OroNavbar variant="glass" brand={brand} />
        </div>
        <OroHero variant="centered" animate={animate} className="pt-16" />
        <OroTracks variant="flow" animate={animate} />
        <OroStats variant="cards" />
        <OroFooter variant="columns" brand={brand} />
      </OroRoot>
    )
  }
  if (preset === 'numbers') {
    return (
      <OroRoot className={cn('min-h-full', className)}>
        <div className="bg-(--oro-sand)">
          <OroNavbar variant="centered" brand={brand} />
        </div>
        <OroHero variant="counter" animate={animate} />
        <OroTracks variant="tabs" />
        <OroFooter variant="simple" brand={brand} />
      </OroRoot>
    )
  }
  return (
    <OroRoot className={cn('relative min-h-full overflow-hidden', className)}>
      <div className="absolute inset-x-0 top-0 z-10">
        <OroNavbar variant="simple" brand={brand} />
      </div>
      <OroHero variant="glow" animate={animate} className="pt-16" />
      <OroTracks variant="flow" animate={animate} />
      <OroStats variant="chart" animate={animate} />
      <OroFooter variant="cta" brand={brand} />
    </OroRoot>
  )
}
