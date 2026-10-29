import { NousAgent } from '@/registry/blocks/nous-agent'
import { NousFeed } from '@/registry/blocks/nous-feed'
import { NousFooter } from '@/registry/blocks/nous-footer'
import { NousHero } from '@/registry/blocks/nous-hero'
import { NousRoot } from '@/registry/blocks/nous-kit'
import { NousNavbar } from '@/registry/blocks/nous-navbar'
import { NousPillars } from '@/registry/blocks/nous-pillars'
import { cn } from '@/lib/utils'

export interface NousLandingProps {
  brand?: string
  animate?: boolean
  className?: string
}

/**
 * A full Nous page. The navbar stays pinned at the top of whatever scrolls,
 * and the blue footer waits underneath: the page slides up off it at the end.
 */
export function NousLanding({ brand = 'shinUI', animate = true, className }: NousLandingProps) {
  return (
    <NousRoot className={cn('relative', className)}>
      <div className="relative z-10 bg-(--nr-paper) pb-10 shadow-[0_24px_40px_-30px_rgb(0_0_0/0.5)]">
        <div className="sticky top-0 z-30">
          <NousNavbar brand={brand} />
        </div>
        <NousHero animate={animate} />
        <NousPillars animate={animate} />
        <NousAgent />
        <NousFeed animate={animate} />
      </div>
      <NousFooter brand={brand} animate={animate} />
    </NousRoot>
  )
}
