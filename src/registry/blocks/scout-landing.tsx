import { ScoutFeatures } from '@/registry/blocks/scout-features'
import { ScoutFooter } from '@/registry/blocks/scout-footer'
import { ScoutHero } from '@/registry/blocks/scout-hero'
import { ScoutRoot } from '@/registry/blocks/scout-kit'
import { ScoutNavbar } from '@/registry/blocks/scout-navbar'
import { ScoutPinned } from '@/registry/blocks/scout-pinned'
import { ScoutProduct } from '@/registry/blocks/scout-product'
import { cn } from '@/lib/utils'

export interface ScoutLandingProps {
  brand?: string
  animate?: boolean
  className?: string
}

/**
 * A full Scout page. The header stays pinned over the hero and the whole
 * scroll; the terrain parallaxes away; the pinned section holds its scene
 * while the steps scroll past.
 */
export function ScoutLanding({ brand = 'shinUI', animate = true, className }: ScoutLandingProps) {
  return (
    <ScoutRoot className={cn('relative', className)}>
      <div className="sticky top-0 z-30 h-0">
        <ScoutNavbar brand={brand} />
      </div>
      <ScoutHero animate={animate} />
      <ScoutPinned animate={animate} />
      <ScoutProduct />
      <ScoutFeatures />
      <ScoutFooter brand={brand} />
    </ScoutRoot>
  )
}
