'use client'

import { Button } from '@/registry/components/button'
import { HorizonBeam } from '@/registry/backgrounds/horizon-beam'
import { cn } from '@/lib/utils'

export interface SplitHeroProps {
  kicker?: string
  title?: string
  description?: string
  primaryCta?: string
  secondaryCta?: string
  showSecondary?: boolean
  metaLabel?: string
  metaValue?: string
  className?: string
}

/**
 * Editorial split hero: oversized type on the left, meta + CTAs on the right,
 * over a horizon beam — distinct from the centered Aurora hero.
 */
export function SplitHero({
  kicker = 'shinUI · studio drop',
  title = 'Build the part nobody else has.',
  description = 'Original blocks and backgrounds, tuned in the gallery, then shipped as registry installs or an npm package.',
  primaryCta = 'Start a block',
  secondaryCta = 'Browse backgrounds',
  showSecondary = true,
  metaLabel = 'Format',
  metaValue = 'Registry + npm',
  className,
}: SplitHeroProps) {
  return (
    <HorizonBeam color="var(--ds-highlight)" altitude={62} thickness="thin" className={cn('px-6 py-24', className)}>
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_0.8fr] md:items-end md:gap-16">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-ds-muted uppercase">{kicker}</p>
          <h1 className="mt-5 max-w-xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            {title}
          </h1>
        </div>
        <div className="flex flex-col gap-8 md:pb-1">
          <p className="max-w-sm text-base text-pretty text-ds-muted sm:text-lg">{description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">{primaryCta}</Button>
            {showSecondary && (
              <Button size="lg" variant="secondary">
                {secondaryCta}
              </Button>
            )}
          </div>
          <div className="border-t border-border pt-4">
            <p className="font-mono text-[10px] tracking-wider text-ds-muted uppercase">{metaLabel}</p>
            <p className="mt-1 text-sm font-medium">{metaValue}</p>
          </div>
        </div>
      </div>
    </HorizonBeam>
  )
}
