import { AsideBenchmarks } from '@/registry/blocks/aside-benchmarks'
import { AsideCapabilities } from '@/registry/blocks/aside-capabilities'
import { AsideCta } from '@/registry/blocks/aside-cta'
import { AsideFooter } from '@/registry/blocks/aside-footer'
import { AsideHero } from '@/registry/blocks/aside-hero'
import { AsideIntro } from '@/registry/blocks/aside-intro'
import { AsideRoot } from '@/registry/blocks/aside-kit'
import { AsideNavbar } from '@/registry/blocks/aside-navbar'
import { AsidePrivacy } from '@/registry/blocks/aside-privacy'
import { cn } from '@/lib/utils'

export interface AsideLandingProps {
  brand?: string
  animate?: boolean
  className?: string
}

/**
 * A full Aside page. The header hides while you scroll down and returns on
 * scroll up; the hero window flattens as you leave it; the intro reads itself
 * in word by word; benchmark bars grow when seen.
 */
export function AsideLanding({ brand = 'shinUI', animate = true, className }: AsideLandingProps) {
  return (
    <AsideRoot className={cn('relative', className)}>
      <div className="sticky top-0 z-30 h-0">
        <AsideNavbar brand={brand} />
      </div>
      <AsideHero animate={animate} />
      <AsideIntro />
      <AsideCapabilities animate={animate} />
      <AsideBenchmarks brand={brand} />
      <AsidePrivacy />
      <AsideCta animate={animate} />
      <AsideFooter brand={brand} />
    </AsideRoot>
  )
}
