'use client'

import { useRef, useState } from 'react'
import { Brackets, HexMark, useScrolled } from '@/registry/blocks/hex-kit'
import { cn } from '@/lib/utils'

export interface HexNavbarProps {
  brand?: string
  links?: string
  announcement?: string
  ctaLabel?: string
  className?: string
}

/**
 * Full-width bar with an announcement strip. Once the page scrolls, the strip
 * folds away and the bar tightens into a floating panel with corner ticks.
 */
export function HexNavbar({
  brand = 'shinUI',
  links = 'Product, Solutions, Teams, Docs, Pricing',
  announcement = 'Version 4 is here: shared notebooks, live apps and a new query engine',
  ctaLabel = 'Start free',
  className,
}: HexNavbarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const scrolled = useScrolled(ref)
  const [open, setOpen] = useState(false)
  const items = links.split(',').map((s) => s.trim()).filter(Boolean)
  const mid = Math.ceil(items.length / 2)
  const link = (l: string) => (
    <a key={l} href="#" className="rounded px-2 py-1 text-[13px] text-(--hx-dim) transition-colors hover:text-(--hx-ink)">
      {l}
    </a>
  )
  return (
    <div ref={ref} className={cn('w-full', className)}>
      <div
        className={cn(
          'grid overflow-hidden border-b border-(--hx-line) bg-(--hx-ink) text-center font-mono text-[10.5px] tracking-[0.08em] text-(--hx-bg) transition-[grid-template-rows,opacity] duration-300',
          scrolled ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
        )}
      >
        <a href="#" className="min-h-0 truncate px-4 hover:underline">
          <span className="inline-block py-1.5">{announcement} ↗</span>
        </a>
      </div>
      <div className={cn('transition-[padding] duration-300', scrolled ? 'px-3 pt-3 md:px-6' : 'px-0 pt-0')}>
        <header
          className={cn(
            'relative mx-auto flex h-14 items-center justify-between gap-4 border-(--hx-line) bg-(--hx-bg)/90 px-5 backdrop-blur transition-[max-width,border-radius,box-shadow] duration-300',
            scrolled ? 'max-w-4xl rounded-md border shadow-[0_8px_30px_-16px_rgba(29,26,43,0.35)]' : 'max-w-none border-b'
          )}
        >
          {scrolled && <Brackets className="-inset-1.5 opacity-50" />}
          <nav className="hidden flex-1 items-center gap-1 md:flex">{items.slice(0, mid).map(link)}</nav>
          <a href="#" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <HexMark className="size-6" />
            {brand}
          </a>
          <div className="hidden flex-1 items-center justify-end gap-1 md:flex">
            {items.slice(mid).map(link)}
            <a href="#" className="relative ml-2 rounded-[3px] border border-(--hx-accent) bg-(--hx-accent-soft) px-3 py-1.5 text-[13px]">
              {ctaLabel}
            </a>
          </div>
          <button type="button" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)} className="grid size-9 place-items-center rounded border border-(--hx-line) md:hidden">
            <span className="block h-px w-4 bg-current shadow-[0_5px_0_currentColor,0_-5px_0_currentColor]" />
          </button>
          {open && (
            <div className="absolute inset-x-2 top-full mt-2 flex flex-col rounded-md border border-(--hx-line) bg-(--hx-paper) p-2 md:hidden">
              {items.map(link)}
            </div>
          )}
        </header>
      </div>
    </div>
  )
}
