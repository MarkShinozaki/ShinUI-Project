'use client'

import { useRef, useState } from 'react'
import { AsideMark, SplitButton, useHideOnScroll } from '@/registry/blocks/aside-kit'
import { cn } from '@/lib/utils'

export interface AsideNavbarProps {
  brand?: string
  links?: string
  ctaLabel?: string
  className?: string
}

/** A light bar that slides away while you scroll down and comes back the moment you scroll up. */
export function AsideNavbar({ brand = 'shinUI', links = 'Features, Use cases, Guides, Pricing', ctaLabel = 'Download', className }: AsideNavbarProps) {
  const ref = useRef<HTMLElement>(null)
  const hidden = useHideOnScroll(ref)
  const [open, setOpen] = useState(false)
  const items = links.split(',').map((s) => s.trim()).filter(Boolean)
  return (
    <nav
      ref={ref}
      className={cn(
        'as-move relative flex h-14 w-full items-center justify-between gap-6 border-b border-(--as-line) bg-white/80 px-5 backdrop-blur-md transition-[opacity,transform] duration-300',
        hidden && !open ? 'pointer-events-none -translate-y-full opacity-0' : 'translate-y-0 opacity-100',
        className
      )}
    >
      <a href="#" className="flex items-center gap-2 text-[17px] font-semibold tracking-tight">
        <AsideMark />
        {brand}
      </a>
      <div className="hidden items-center gap-7 md:flex">
        {items.map((l) => (
          <a key={l} href="#" className="text-[13.5px] text-(--as-ink)/80 transition-colors hover:text-(--as-ink)">{l}</a>
        ))}
      </div>
      <span className="hidden md:block">
        <SplitButton size="sm">{ctaLabel}</SplitButton>
      </span>
      <button type="button" aria-expanded={open} aria-label="Menu" onClick={() => setOpen((o) => !o)} className="grid size-9 place-items-center rounded-lg border border-(--as-line) md:hidden">
        <span className="block h-px w-4 bg-current shadow-[0_5px_0_currentColor,0_-5px_0_currentColor]" />
      </button>
      {open && (
        <div className="absolute inset-x-3 top-full mt-2 flex flex-col gap-1 rounded-xl border border-(--as-line) bg-white p-2 shadow-lg md:hidden">
          {items.map((l) => (
            <a key={l} href="#" className="rounded-lg px-3 py-2 text-sm hover:bg-(--as-soft)">{l}</a>
          ))}
        </div>
      )}
    </nav>
  )
}
