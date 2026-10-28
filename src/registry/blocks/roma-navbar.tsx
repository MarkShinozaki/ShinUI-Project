'use client'

import { useState } from 'react'
import { RomaButton, RomaMark, RomaRoot } from '@/registry/blocks/roma-kit'
import { cn } from '@/lib/utils'

export interface RomaNavbarProps {
  /** dark: black bar for a black hero. light: white bar. orange: sits on the orange hero. floating: a centered rounded pill. */
  variant?: 'dark' | 'light' | 'orange' | 'floating'
  brand?: string
  links?: string
  ctaLabel?: string
  className?: string
}

/** Roma navigation in three variants; the CTA stays visible on mobile next to the menu. */
export function RomaNavbar({ variant = 'dark', brand = 'shinUI', links = 'News, Changelog, Blocks, Connections', ctaLabel = 'Sign in', className }: RomaNavbarProps) {
  const [open, setOpen] = useState(false)
  const items = links
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const dark = variant === 'dark'
  const orange = variant === 'orange'

  const brandEl = (
    <a href="#" className="flex items-center gap-2 font-display text-[19px] font-medium tracking-[-0.03em]">
      <RomaMark />
      {brand}
    </a>
  )
  const linkEls = items.map((l) => (
    <a key={l} href="#" className={cn('text-[13.5px] font-medium transition-colors duration-200', dark ? 'text-white/70 hover:text-white' : orange ? 'text-black/70 hover:text-black' : 'text-(--rm-soft) hover:text-(--rm-ink)')}>
      {l}
    </a>
  ))
  const burger = (
    <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)} className="grid size-9 cursor-pointer place-items-center md:hidden">
      <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        {open ? <path d="M4 4l8 8M12 4l-8 8" /> : <path d="M2.5 6h11M2.5 10h11" />}
      </svg>
    </button>
  )
  const sheet = open && (
    <div className={cn('rm-anim flex flex-col px-5 pb-4 [animation:rm-rise_.2s_ease-out] md:hidden', dark ? 'bg-black' : orange ? 'bg-(--rm-orange)' : 'bg-(--rm-card)')}>
      {items.map((l) => (
        <a key={l} href="#" className={cn('border-b py-3 font-display text-[20px] font-medium tracking-[-0.02em]', dark ? 'border-white/10' : orange ? 'border-black/15' : 'border-(--rm-line)')}>
          {l}
        </a>
      ))}
    </div>
  )
  const cta = <RomaButton variant={dark ? 'white' : 'black'} className={cn('h-8 px-4 text-[13px]', orange && 'bg-black text-white')}>{ctaLabel}</RomaButton>

  if (variant === 'floating') {
    return (
      <RomaRoot className={cn('bg-transparent px-4 pt-4', className)}>
        <nav className="mx-auto max-w-3xl overflow-hidden rounded-full border border-(--rm-line) bg-(--rm-card)/85 shadow-[0_10px_30px_-15px_rgb(0_0_0/0.3)] backdrop-blur-xl max-md:rounded-3xl">
          <div className="flex h-14 items-center justify-between gap-6 pr-2.5 pl-5">
            {brandEl}
            <div className="hidden items-center gap-6 md:flex">{linkEls}</div>
            <div className="flex items-center gap-1">
              {cta}
              {burger}
            </div>
          </div>
          {sheet}
        </nav>
      </RomaRoot>
    )
  }

  return (
    <RomaRoot className={cn(dark ? 'bg-black text-white' : orange ? 'bg-(--rm-orange) text-black' : 'border-b border-(--rm-line) bg-(--rm-card)', className)}>
      <nav className="mx-auto max-w-6xl">
        <div className="flex h-16 items-center justify-between gap-6 px-6 md:px-10">
          {brandEl}
          <div className="flex items-center gap-7">
            <div className="hidden items-center gap-7 md:flex">{linkEls}</div>
            <div className="flex items-center gap-1">
              {cta}
              {burger}
            </div>
          </div>
        </div>
        {sheet}
      </nav>
    </RomaRoot>
  )
}
