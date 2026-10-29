'use client'

import { useState } from 'react'
import { Eyebrow, NousMark } from '@/registry/blocks/nous-kit'
import { cn } from '@/lib/utils'

export interface NousNavbarProps {
  brand?: string
  /** Comma-separated; split evenly either side of the mark. */
  links?: string
  className?: string
}

/** Links split either side of a centred monogram over a hairline rule. */
export function NousNavbar({ brand = 'shinUI', links = 'Blocks, Kits, Lab, Changelog', className }: NousNavbarProps) {
  const [open, setOpen] = useState(false)
  const items = links.split(',').map((s) => s.trim()).filter(Boolean)
  const half = Math.ceil(items.length / 2)
  const link = (l: string) => (
    <a key={l} href="#" className="font-mono text-[10.5px] tracking-[0.18em] text-(--nr-blue) uppercase underline-offset-4 hover:underline">
      {l}
    </a>
  )
  return (
    <header className={cn('border-b border-(--nr-line) bg-(--nr-paper)/90 backdrop-blur-sm', className)}>
      <nav aria-label="Main" className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6">
        <div className="hidden justify-around md:flex">{items.slice(0, half).map(link)}</div>
        <button type="button" className="justify-self-start font-mono text-[10.5px] tracking-[0.18em] text-(--nr-blue) uppercase md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
        <a href="#" aria-label={brand} className="px-6">
          <NousMark />
        </a>
        <div className="hidden justify-around md:flex">{items.slice(half).map(link)}</div>
      </nav>
      {open && (
        <div className="flex flex-col gap-3 border-t border-(--nr-line) px-6 py-4 md:hidden">
          {items.map(link)}
          <Eyebrow className="opacity-60">{brand}</Eyebrow>
        </div>
      )}
    </header>
  )
}
