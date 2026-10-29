'use client'

import { useState } from 'react'
import { Mono, ScoutMark } from '@/registry/blocks/scout-kit'
import { cn } from '@/lib/utils'

export interface ScoutNavbarProps {
  brand?: string
  /** Leave empty to hide the announcement strip. */
  announcement?: string
  links?: string
  ctaLabel?: string
  className?: string
}

/** A dismissible announcement strip over a dark bar with mono links. */
export function ScoutNavbar({ brand = 'shinUI', announcement = 'Field Kit is out: twelve new blocks for maps, consoles and dashboards', links = 'Blocks, Kits, Changelog', ctaLabel = 'Contact', className }: ScoutNavbarProps) {
  const [shown, setShown] = useState(true)
  const [open, setOpen] = useState(false)
  const items = links.split(',').map((s) => s.trim()).filter(Boolean)
  return (
    <header className={cn('bg-(--sc-bg)/85 backdrop-blur-md', className)}>
      {announcement && shown && (
        <div className="relative flex h-8 items-center justify-center border-b border-(--sc-line) px-10 text-center text-[11.5px] text-(--sc-dim)">
          <a href="#" className="truncate hover:text-(--sc-fg)">{announcement}</a>
          <button type="button" aria-label="Dismiss announcement" onClick={() => setShown(false)} className="absolute right-3 text-(--sc-faint) hover:text-(--sc-fg)">
            ×
          </button>
        </div>
      )}
      <nav aria-label="Main" className="flex h-14 items-center gap-6 border-b border-(--sc-line) px-6">
        <a href="#" className="flex items-center gap-2 text-[15px] font-medium tracking-tight">
          <ScoutMark className="size-5" />
          {brand}
        </a>
        <div className="ml-auto hidden items-center gap-6 md:flex">
          {items.map((l) => (
            <a key={l} href="#" className="text-(--sc-dim) transition-colors hover:text-(--sc-fg)">
              <Mono>{l}</Mono>
            </a>
          ))}
        </div>
        <a href="#" className="ml-auto border border-(--sc-line) px-3 py-1.5 transition-colors hover:border-(--sc-accent) hover:text-(--sc-accent) md:ml-4">
          <Mono>{ctaLabel}</Mono>
        </a>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="md:hidden">
          <Mono>{open ? 'Close' : 'Menu'}</Mono>
        </button>
      </nav>
      {open && (
        <div className="flex flex-col gap-3 border-b border-(--sc-line) px-6 py-4 md:hidden">
          {items.map((l) => (
            <a key={l} href="#">
              <Mono>{l}</Mono>
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
