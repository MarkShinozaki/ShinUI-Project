'use client'

import { FolioCards } from '@/registry/blocks/folio-cards'
import { FolioFeatures } from '@/registry/blocks/folio-features'
import { FolioFooter } from '@/registry/blocks/folio-footer'
import { FolioHero } from '@/registry/blocks/folio-hero'
import { FolioRoot } from '@/registry/blocks/folio-kit'
import { FolioMetrics } from '@/registry/blocks/folio-metrics'
import { FolioNavbar } from '@/registry/blocks/folio-navbar'
import { cn } from '@/lib/utils'

export interface FolioLandingProps {
  /**
   * docs: sticky sidebar with an "on this page" scrollspy and a narrow reading column.
   * classic: top bar, split hero, wide sections.
   * manifesto: index bar, statement hero, list-style sections.
   */
  preset?: 'docs' | 'classic' | 'manifesto'
  brand?: string
  animate?: boolean
  className?: string
}

const SECTIONS = ['Overview', 'Principles', 'In use', 'Install', 'Notes']
const id = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/** A full page stacked from the Folio blocks, in three presets. */
export function FolioLanding({ preset = 'docs', brand = 'shinUI', animate = true, className }: FolioLandingProps) {
  if (preset === 'docs') {
    return (
      <FolioRoot className={cn('flex min-h-full flex-col md:grid md:grid-cols-[17rem_minmax(0,1fr)]', className)}>
        <div className="border-(--fo-line) md:border-r">
          <FolioNavbar variant="sidebar" brand={brand} sections={SECTIONS.join(', ')} className="md:sticky md:top-0 md:h-auto md:border-r-0" />
        </div>
        <main className="min-w-0">
          <div id={id('Overview')}>
            <FolioHero variant="editorial" animate={animate} />
          </div>
          <div id={id('Principles')}>
            <FolioFeatures variant="list" animate={animate} />
            <FolioFeatures variant="pipeline" eyebrow="How it composes" title="One brief becomes a handful of blocks." lede="" className="-mt-6" />
          </div>
          <div id={id('In use')}>
            <FolioMetrics variant="bento" />
          </div>
          <div id={id('Install')}>
            <FolioCards variant="numbered" animate={animate} />
          </div>
          <div id={id('Notes')}>
            <FolioCards variant="index" eyebrow="Notes" title="Writing from the studio." lede="" linkLabel="Read the journal" />
          </div>
          <div className="mx-auto max-w-[44rem] px-6">
            <FolioFooter variant="cta" brand={brand} animate={animate} className="[&_footer]:px-0" />
          </div>
        </main>
      </FolioRoot>
    )
  }

  if (preset === 'manifesto') {
    return (
      <FolioRoot className={cn('min-h-full', className)}>
        <FolioNavbar variant="index" brand={brand} />
        <FolioHero
          variant="statement"
          announcement="Manifesto"
          title="Most component kits look the same. *Yours* shouldn’t. We make blocks that start *original* and stay *editable*."
          animate={animate}
        />
        <FolioFeatures variant="table" width="wide" eyebrow="The difference" title="Snippets versus a system." />
        <FolioMetrics variant="row" width="wide" />
        <FolioCards variant="index" width="wide" eyebrow="Notes" title="Writing from the studio." lede="" linkLabel="" />
        <FolioFooter variant="minimal" brand={brand} />
      </FolioRoot>
    )
  }

  return (
    <FolioRoot className={cn('min-h-full', className)}>
      <FolioNavbar variant="topbar" brand={brand} />
      <FolioHero variant="split" animate={animate} />
      <FolioFeatures variant="list" width="wide" animate={animate} />
      <FolioMetrics variant="bento" width="wide" />
      <FolioCards variant="numbered" width="wide" animate={animate} />
      <FolioFooter variant="cta" brand={brand} animate={animate} />
    </FolioRoot>
  )
}
