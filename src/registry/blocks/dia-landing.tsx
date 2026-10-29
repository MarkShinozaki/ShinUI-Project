'use client'

import { DiaBento } from '@/registry/blocks/dia-bento'
import { DiaControls } from '@/registry/blocks/dia-controls'
import { DiaFooter } from '@/registry/blocks/dia-footer'
import { DiaHero } from '@/registry/blocks/dia-hero'
import { DiaRoot } from '@/registry/blocks/dia-kit'
import { DiaNavbar } from '@/registry/blocks/dia-navbar'
import { DiaSteps } from '@/registry/blocks/dia-steps'
import { cn } from '@/lib/utils'

export interface DiaLandingProps {
  brand?: string
  animate?: boolean
  className?: string
}

/**
 * A full Dia page assembled from the family's blocks. The pill navbar stays
 * pinned at the top and the arch dock (from DiaFooter) stays pinned at the
 * bottom for the whole scroll, then settles under the closing headline.
 */
export function DiaLanding({ brand = 'shinUI', animate = true, className }: DiaLandingProps) {
  return (
    <DiaRoot className={cn('relative', className)}>
      {/* Pinned to the top of whatever scrolls; h-0 so it takes no space. */}
      <div className="sticky top-0 z-30 h-0">
        <DiaNavbar variant="pill" brand={brand} />
      </div>
      {/* The hero's button lives in the sticky dock below instead. */}
      <DiaHero variant="sunrise" brand={brand} primaryCta="" animate={animate} className="pt-24 pb-10" />
      <DiaSteps animate={animate} />
      <DiaBento />
      <DiaControls animate={animate} />
      <DiaFooter variant="cta" brand={brand} animate={animate} />
    </DiaRoot>
  )
}
