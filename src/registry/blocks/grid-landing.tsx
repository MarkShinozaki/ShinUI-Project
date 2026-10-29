'use client'

import { GridFeatures } from '@/registry/blocks/grid-features'
import type { GridAccent, GridMarkerKind } from '@/registry/blocks/grid-frame'
import { GridFooter } from '@/registry/blocks/grid-footer'
import { GridHero } from '@/registry/blocks/grid-hero'
import { GridNavbar } from '@/registry/blocks/grid-navbar'
import { GridSteps } from '@/registry/blocks/grid-steps'
import { GridStrip } from '@/registry/blocks/grid-strip'
import { cn } from '@/lib/utils'

type Preset = 'blueprint' | 'signal' | 'ledger'

export interface GridLandingProps {
  /**
   * blueprint: boxed nav, split hero with terminal, bento grid, plus markers.
   * signal: floating nav, centered hero, filled cells, square markers, dashed rails.
   * ledger: hairline nav, stats hero, numbered list, pricing, giant wordmark.
   */
  preset?: Preset
  /** Override the preset accent. */
  accent?: 'preset' | GridAccent
  brand?: string
  /** Show the steps/pricing section. */
  showSteps?: boolean
  className?: string
}

interface Look {
  accent: GridAccent
  marker: GridMarkerKind
  dashed: boolean
  pattern: 'dots' | 'lines' | 'grid' | 'none'
  nav: 'boxed' | 'hairline' | 'floating'
  hero: 'centered' | 'split' | 'stats'
  strip: 'stats' | 'marquee'
  features: 'bento' | 'columns' | 'list'
  steps: 'cards' | 'rail' | 'pricing'
  footer: 'columns' | 'compact' | 'wordmark'
  filled: boolean
}

const LOOKS: Record<Preset, Look> = {
  blueprint: {
    accent: 'primary', marker: 'plus', dashed: false, pattern: 'dots',
    nav: 'boxed', hero: 'split', strip: 'marquee', features: 'bento', steps: 'cards', footer: 'columns', filled: false,
  },
  signal: {
    accent: 'highlight', marker: 'square', dashed: true, pattern: 'none',
    nav: 'floating', hero: 'centered', strip: 'stats', features: 'columns', steps: 'rail', footer: 'columns', filled: true,
  },
  ledger: {
    accent: 'accent', marker: 'plus', dashed: true, pattern: 'lines',
    nav: 'hairline', hero: 'stats', strip: 'marquee', features: 'list', steps: 'pricing', footer: 'wordmark', filled: false,
  },
}

/** A full page stacked from the grid blocks, in three original presets. */
export function GridLanding({ preset = 'blueprint', accent = 'preset', brand = 'shinUI', showSteps = true, className }: GridLandingProps) {
  const look = LOOKS[preset]
  const shared = {
    accent: accent === 'preset' ? look.accent : accent,
    marker: look.marker,
    dashed: look.dashed,
  }
  return (
    <div className={cn('relative bg-background', className)}>
      <GridNavbar {...shared} variant={look.nav} brand={brand} edges="both" className="sticky top-0 z-30 bg-background/85 backdrop-blur" />
      <GridHero {...shared} variant={look.hero} pattern={look.pattern === 'lines' ? 'grid' : 'dots'} edges="bottom" />
      <GridStrip {...shared} variant={look.strip} edges="bottom" />
      <GridFeatures {...shared} variant={look.features} filledCell={look.filled} pattern={look.pattern} scan={preset === 'blueprint'} edges="bottom" />
      {showSteps && <GridSteps {...shared} variant={look.steps} edges="bottom" />}
      <GridFooter {...shared} variant={look.footer} brand={brand} showCta={preset !== 'ledger'} edges="bottom" />
    </div>
  )
}
