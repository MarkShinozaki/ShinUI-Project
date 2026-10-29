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

/** A full Dia page assembled from the family's blocks. */
export function DiaLanding({ brand = 'shinUI', animate = true, className }: DiaLandingProps) {
  return (
    <DiaRoot className={cn('relative', className)}>
      <DiaNavbar variant="pill" brand={brand} className="absolute inset-x-0 top-0 z-10" />
      <DiaHero variant="sunrise" brand={brand} animate={animate} className="pt-24" />
      <DiaSteps animate={animate} />
      <DiaBento />
      <DiaControls animate={animate} />
      <DiaFooter variant="cta" brand={brand} animate={animate} />
    </DiaRoot>
  )
}
