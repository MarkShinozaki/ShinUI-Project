'use client'

import { useState } from 'react'
import { OroButton, OroMark, OroRoot } from '@/registry/blocks/oro-kit'
import { cn } from '@/lib/utils'

export interface OroNavbarProps {
  /** simple: logo left, links right. centered: links in the middle with a CTA. glass: a floating frosted pill. */
  variant?: 'simple' | 'centered' | 'glass'
  brand?: string
  /** Comma separated links. End with "▾" for a dropdown chevron. */
  links?: string
  ctaLabel?: string
  className?: string
}

const list = (v: string) =>
  v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

function Item({ label }: { label: string }) {
  return (
    <a href="#" className="flex items-center gap-1 rounded-full px-3 py-1.5 font-display text-[14.5px] font-medium transition-colors duration-200 hover:bg-(--oro-ink)/6">
      {label.replace('▾', '').trim()}
      {label.endsWith('▾') && (
        <svg viewBox="0 0 10 10" className="size-2.5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <path d="M2.5 4l2.5 2.5L7.5 4" />
        </svg>
      )}
    </a>
  )
}

function Brand({ brand }: { brand: string }) {
  return (
    <a href="#" className="flex items-center gap-2 font-display text-[22px] font-semibold tracking-[-0.03em]">
      <OroMark />
      {brand}
    </a>
  )
}

/** ORO navigation in three variants with a round menu button on mobile. */
export function OroNavbar({ variant = 'simple', brand = 'shinui', links = 'Journal, Library ▾, Research ▾', ctaLabel = 'Request a demo', className }: OroNavbarProps) {
  const [open, setOpen] = useState(false)
  const items = list(links)
  const burger = (
    <button
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="grid size-10 cursor-pointer place-items-center rounded-full border border-(--oro-ink)/40 md:hidden"
    >
      <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
        {open ? <path d="M4 4l8 8M12 4l-8 8" /> : <path d="M3 5h10M3 8h10M3 11h10" />}
      </svg>
    </button>
  )
  const sheet = open && (
    <div className="oro-anim flex flex-col gap-1 bg-(--oro-paper) px-5 pb-5 [animation:oro-rise_.2s_ease-out] md:hidden">
      {items.map((l) => (
        <a key={l} href="#" className="border-b border-(--oro-line) py-3 font-display text-[18px] font-semibold">
          {l.replace('▾', '').trim()}
        </a>
      ))}
      {ctaLabel && <OroButton className="mt-4">{ctaLabel}</OroButton>}
    </div>
  )

  if (variant === 'glass') {
    return (
      <OroRoot className={cn('bg-transparent px-4 pt-4', className)}>
        <nav className="mx-auto max-w-5xl rounded-[28px] border border-(--oro-line) bg-(--oro-paper)/70 shadow-[0_10px_40px_-20px_rgb(10_56_21/0.35)] backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between pr-3 pl-6">
            <Brand brand={brand} />
            <div className="hidden items-center gap-1 md:flex">
              {items.map((l) => (
                <Item key={l} label={l} />
              ))}
              {ctaLabel && <OroButton className="ml-3 h-10 px-5 text-[14px]">{ctaLabel}</OroButton>}
            </div>
            {burger}
          </div>
          {sheet}
        </nav>
      </OroRoot>
    )
  }

  return (
    <OroRoot className={cn('bg-transparent', className)}>
      <nav className="relative mx-auto max-w-6xl">
        <div className="flex h-20 items-center justify-between gap-6 px-6 md:px-8">
          <Brand brand={brand} />
          <div className={cn('hidden items-center gap-1 md:flex', variant === 'centered' && 'absolute left-1/2 -translate-x-1/2')}>
            {items.map((l) => (
              <Item key={l} label={l} />
            ))}
          </div>
          {variant === 'centered' && ctaLabel && <OroButton className="hidden h-10 px-5 text-[14px] md:inline-flex">{ctaLabel}</OroButton>}
          {burger}
        </div>
        {sheet}
      </nav>
    </OroRoot>
  )
}
