'use client'

import { useState } from 'react'
import { DiaButton, DiaMark } from '@/registry/blocks/dia-kit'
import { cn } from '@/lib/utils'

export interface DiaNavbarProps {
  /** pill: a centred floating capsule. bar: a full-width hairline bar. */
  variant?: 'pill' | 'bar'
  brand?: string
  /** Comma-separated link labels. */
  links?: string
  ctaLabel?: string
  className?: string
}

export function DiaNavbar({ variant = 'pill', brand = 'shinUI', links = 'Blocks, Kits, Changelog', ctaLabel = 'Get started', className }: DiaNavbarProps) {
  const [open, setOpen] = useState(false)
  const items = links.split(',').map((l) => l.trim()).filter(Boolean)
  if (variant === 'bar') {
    return (
      <header className={cn('border-b border-(--di-line) bg-(--di-paper)/85 backdrop-blur', className)}>
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
          <a href="#" className="flex items-center gap-2 text-[15px] font-medium">
            <DiaMark />
            {brand}
          </a>
          <nav aria-label="Main" className="hidden flex-1 gap-5 text-[14px] text-(--di-soft) md:flex">
            {items.map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-(--di-ink)">
                {l}
              </a>
            ))}
          </nav>
          <DiaButton className="ml-auto h-9 px-4 text-[13px]">{ctaLabel}</DiaButton>
        </div>
      </header>
    )
  }
  return (
    <header className={cn('flex justify-center px-4 pt-4', className)}>
      <div className="relative flex items-center gap-1 rounded-full border border-(--di-line) bg-(--di-card)/80 p-1 shadow-[0_8px_30px_-16px_rgb(60_40_0/0.4)] backdrop-blur-md">
        <a href="#" aria-label={brand} className="grid size-8 place-items-center rounded-full bg-(--di-ink) text-(--di-paper)">
          <DiaMark className="size-4" />
        </a>
        <nav aria-label="Main" className="hidden items-center sm:flex">
          {items.map((l) => (
            <a key={l} href="#" className="rounded-full px-3 py-1.5 text-[13px] text-(--di-soft) transition-colors hover:bg-(--di-chip) hover:text-(--di-ink)">
              {l}
            </a>
          ))}
        </nav>
        <button
          type="button"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full px-3 py-1.5 text-[13px] text-(--di-soft) sm:hidden"
        >
          Menu
        </button>
        {open && (
          <nav aria-label="Mobile" className="absolute inset-x-0 top-full mt-2 flex flex-col rounded-2xl border border-(--di-line) bg-(--di-card) p-2 shadow-lg sm:hidden">
            {items.map((l) => (
              <a key={l} href="#" className="rounded-xl px-3 py-2 text-[14px] hover:bg-(--di-chip)">
                {l}
              </a>
            ))}
          </nav>
        )}
        <a href="#" className="rounded-full bg-(--di-chip) px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-(--di-honey)">
          {ctaLabel}
        </a>
      </div>
    </header>
  )
}
