import { HexAgent } from '@/registry/blocks/hex-agent'
import { HexFaq } from '@/registry/blocks/hex-faq'
import { HexFooter } from '@/registry/blocks/hex-footer'
import { HexHero } from '@/registry/blocks/hex-hero'
import { HexIntegrations } from '@/registry/blocks/hex-integrations'
import { HexRoot } from '@/registry/blocks/hex-kit'
import { HexNavbar } from '@/registry/blocks/hex-navbar'
import { HexOrbit } from '@/registry/blocks/hex-orbit'
import { cn } from '@/lib/utils'

export interface HexLandingProps {
  brand?: string
  animate?: boolean
  className?: string
}

/**
 * A full Hex page on graph paper. The header stays pinned and tightens into a
 * floating panel once you scroll; the ask section pins its text while the
 * notebook scrolls; the context ring turns with the scroll.
 */
export function HexLanding({ brand = 'shinUI', animate = true, className }: HexLandingProps) {
  return (
    <HexRoot className={cn('relative', className)}>
      <div className="sticky top-0 z-30 h-0">
        <HexNavbar brand={brand} />
      </div>
      <HexHero animate={animate} />
      <HexAgent animate={animate} />
      <HexOrbit />
      <HexIntegrations />
      <HexFaq />
      <HexFooter brand={brand} />
    </HexRoot>
  )
}
