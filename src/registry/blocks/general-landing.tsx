'use client'

import { Hero } from '@/registry/blocks/hero'
import { Navbar } from '@/registry/blocks/navbar'
import { SplitHero } from '@/registry/blocks/split-hero'
import { FooterGradient } from '@/registry/footers/footer-gradient'
import { cn } from '@/lib/utils'

export interface GeneralLandingProps {
  brand?: string
  /** Navbar surface. */
  nav?: 'glass' | 'solid' | 'minimal'
  /** Aurora strength behind the opening hero. */
  background?: 'vivid' | 'subtle'
  /** Show the split hero as a second, left-aligned section. */
  showSplit?: boolean
  className?: string
}

/** A full page stacked from the general blocks: navbar, hero, split hero and a gradient footer. */
export function GeneralLanding({ brand = 'shinUI', nav = 'glass', background = 'vivid', showSplit = true, className }: GeneralLandingProps) {
  return (
    <div className={cn('flex min-h-full w-full flex-col bg-background text-foreground', className)}>
      <Navbar brand={brand} variant={nav} />
      <main className="flex flex-1 flex-col">
        <Hero background={background} />
        {showSplit && <SplitHero className="border-t border-border" />}
      </main>
      <FooterGradient brand={brand} tagline="Backgrounds, components and blocks for people who ship." accent="#8b5cf6" palette="aurora" />
    </div>
  )
}
