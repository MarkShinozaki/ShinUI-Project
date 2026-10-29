'use client'

import { ContextFeatures } from '@/registry/blocks/context-features'
import { ContextFooter } from '@/registry/blocks/context-footer'
import { ContextHero } from '@/registry/blocks/context-hero'
import { ContextRoot } from '@/registry/blocks/context-kit'
import { ContextNavbar } from '@/registry/blocks/context-navbar'
import { ContextStories } from '@/registry/blocks/context-stories'
import { cn } from '@/lib/utils'

export interface ContextLandingProps {
  /** console: bar nav, console hero, grid + tabs, stories, dark footer. split: pill nav, code hero, bento, logos, trust. compact: rail nav, metric hero, tabs, minimal footer. */
  preset?: 'console' | 'split' | 'compact'
  brand?: string
  animate?: boolean
  className?: string
}

/** A full page stacked from the Context blocks, in three presets. */
export function ContextLanding({ preset = 'console', brand = 'shinUI', animate = true, className }: ContextLandingProps) {
  if (preset === 'split') {
    return (
      <ContextRoot className={cn('min-h-full', className)}>
        <ContextNavbar variant="pill" brand={brand} />
        <ContextHero variant="split" animate={animate} />
        <ContextStories variant="logos" animate={animate} />
        <ContextFeatures variant="bento" title="Small files, *big pages*." />
        <ContextStories variant="trust" />
        <ContextFooter variant="light" brand={brand} />
      </ContextRoot>
    )
  }
  if (preset === 'compact') {
    return (
      <ContextRoot className={cn('min-h-full', className)}>
        <ContextNavbar variant="rail" brand={brand} />
        <ContextHero variant="metric" title="Installs that *just work*" streams={false} animate={animate} />
        <ContextFeatures variant="tabs" title="Four moves, *one file*." />
        <ContextFooter variant="minimal" brand={brand} />
      </ContextRoot>
    )
  }
  return (
    <ContextRoot className={cn('min-h-full', className)}>
      <ContextNavbar variant="bar" brand={brand} />
      <ContextHero variant="console" animate={animate} />
      <ContextStories variant="logos" animate={animate} />
      <ContextFeatures variant="grid" />
      <ContextFeatures variant="tabs" title="From prompt to page in *four moves*." description="Every block works the same way, so once you have installed one you know them all." />
      <ContextStories variant="carousel" animate={animate} />
      <ContextFooter variant="night" brand={brand} />
    </ContextRoot>
  )
}
