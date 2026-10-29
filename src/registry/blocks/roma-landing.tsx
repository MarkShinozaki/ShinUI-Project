'use client'

import { RomaCards } from '@/registry/blocks/roma-cards'
import { RomaFooter } from '@/registry/blocks/roma-footer'
import { RomaHero } from '@/registry/blocks/roma-hero'
import { RomaRoot } from '@/registry/blocks/roma-kit'
import { RomaNavbar } from '@/registry/blocks/roma-navbar'
import { RomaSteps } from '@/registry/blocks/roma-steps'
import { cn } from '@/lib/utils'

export interface RomaLandingProps {
  /** app: mosaic hero, orange steps, window, cards, statement footer. agent: orange hero, manifesto, chat cards. minimal: light window hero, integrations, simple footer. */
  preset?: 'app' | 'agent' | 'minimal'
  brand?: string
  animate?: boolean
  className?: string
}

/** A full Roma page assembled from the family's blocks. */
export function RomaLanding({ preset = 'app', brand = 'shinUI', animate = true, className }: RomaLandingProps) {
  if (preset === 'agent') {
    return (
      <RomaRoot className={cn(className)}>
        <RomaNavbar variant="orange" brand={brand} />
        <RomaHero variant="orange" title={'Say what you need.\nGet the page.'} primaryCta="Start a page" secondaryCta="Get the app" animate={animate} />
        <RomaSteps variant="manifesto" />
        <RomaCards variant="chat" title="Ask, then keep going." description="Short requests in, finished sections out. Every change stays in your codebase." />
        <RomaFooter variant="statement" brand={brand} slogan="Ask it. Shape it. Own it." />
      </RomaRoot>
    )
  }
  if (preset === 'minimal') {
    return (
      <RomaRoot className={cn(className)}>
        <RomaNavbar variant="floating" brand={brand} className="sticky top-0 z-10" />
        <RomaHero variant="window" animate={animate} />
        <RomaCards variant="integrations" />
        <RomaFooter variant="columns" brand={brand} slogan="Original React blocks for people who would rather ship than fiddle." />
      </RomaRoot>
    )
  }
  return (
    <RomaRoot className={cn(className)}>
      <RomaNavbar variant="dark" brand={brand} />
      <RomaHero variant="mosaic" animate={animate} />
      <RomaSteps variant="orange" animate={animate} />
      <RomaHero variant="window" title={'Everything in one place,\nnothing in the way.'} description="Families, variants and live props in a single window, with an assistant that knows your brand." primaryCta="" secondaryCta="" animate={animate} />
      <RomaSteps variant="manifesto" />
      <RomaCards variant="integrations" />
      <RomaFooter variant="statement" brand={brand} />
    </RomaRoot>
  )
}
