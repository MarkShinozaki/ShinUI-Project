'use client'

import { useState } from 'react'
import { ContextMark, ContextRoot, Joint, Pill } from '@/registry/blocks/context-kit'
import { cn } from '@/lib/utils'

export interface ContextNavbarProps {
  /** bar: announcement strip over a full-width bar. pill: a floating rounded bar. rail: boxed cells between page rails. */
  variant?: 'bar' | 'pill' | 'rail'
  brand?: string
  /** Comma separated links. End a label with "▾" to show a dropdown chevron. */
  links?: string
  /** Strip above the bar (bar variant). Empty hides it. */
  announcement?: string
  secondaryCta?: string
  ctaLabel?: string
  className?: string
}

const list = (v: string) =>
  v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

function Chevron() {
  return (
    <svg viewBox="0 0 10 10" className="size-2.5 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
      <path d="M2.5 4l2.5 2.5L7.5 4" />
    </svg>
  )
}

function Links({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('flex items-center gap-6 text-[13px] text-(--cx-soft)', className)}>
      {items.map((l) => (
        <li key={l}>
          <a href="#" className="flex items-center gap-1 transition-colors duration-200 hover:text-(--cx-ink)">
            {l.replace('▾', '').trim()}
            {l.endsWith('▾') && <Chevron />}
          </a>
        </li>
      ))}
    </ul>
  )
}

function Brand({ brand }: { brand: string }) {
  return (
    <a href="#" className="flex items-center gap-2 text-[16px] font-medium tracking-[-0.02em]">
      <ContextMark />
      {brand}
    </a>
  )
}

function Burger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={onClick} className="grid size-9 cursor-pointer place-items-center md:hidden">
      <svg viewBox="0 0 18 18" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        {open ? <path d="M4 4l10 10M14 4L4 14" /> : <path d="M3 7h12M3 11h12" />}
      </svg>
    </button>
  )
}

function Sheet({ items, secondaryCta, ctaLabel }: { items: string[]; secondaryCta: string; ctaLabel: string }) {
  return (
    <div className="cx-anim border-t border-(--cx-line) px-5 pt-2 pb-5 [animation:cx-rise_.2s_ease-out] md:hidden">
      {items.map((l) => (
        <a key={l} href="#" className="flex items-center justify-between border-b border-(--cx-line) py-3 text-[15px]">
          {l.replace('▾', '').trim()}
          {l.endsWith('▾') && <Chevron />}
        </a>
      ))}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {secondaryCta && <Pill variant="outline">{secondaryCta}</Pill>}
        <Pill>{ctaLabel}</Pill>
      </div>
    </div>
  )
}

/** Context navigation in three variants, each with a mobile sheet. */
export function ContextNavbar({
  variant = 'bar',
  brand = 'shinUI',
  links = 'Library ▾, Use cases ▾, Showcase ▾, Pricing, Docs',
  announcement = '40 new blocks this month. Free, forever.',
  secondaryCta = 'Book a tour',
  ctaLabel = 'Start for free',
  className,
}: ContextNavbarProps) {
  const [open, setOpen] = useState(false)
  const items = list(links)
  const actions = (
    <div className="hidden items-center gap-2 md:flex">
      {secondaryCta && <Pill variant="outline">{secondaryCta}</Pill>}
      <Pill>{ctaLabel}</Pill>
    </div>
  )

  if (variant === 'pill') {
    return (
      <ContextRoot className={cn('px-4 pt-4', className)}>
        <nav className="mx-auto max-w-5xl rounded-2xl border border-(--cx-line) bg-(--cx-paper)/85 shadow-[0_8px_30px_-12px_rgb(3_7_18/0.18)] backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-6 pr-2 pl-5">
            <Brand brand={brand} />
            <Links items={items} className="hidden md:flex" />
            {actions}
            <Burger open={open} onClick={() => setOpen(!open)} />
          </div>
          {open && <Sheet items={items} secondaryCta={secondaryCta} ctaLabel={ctaLabel} />}
        </nav>
      </ContextRoot>
    )
  }

  if (variant === 'rail') {
    return (
      <ContextRoot className={cn('border-b border-(--cx-rail)', className)}>
        <nav className="relative mx-auto max-w-6xl border-x border-(--cx-rail)">
          <Joint className="top-full left-0" />
          <Joint className="top-full left-full" />
          <div className="flex h-14 items-stretch">
            <div className="flex items-center border-r border-(--cx-rail) px-5">
              <Brand brand={brand} />
            </div>
            <ul className="hidden flex-1 items-stretch md:flex">
              {items.map((l) => (
                <li key={l} className="flex border-r border-(--cx-rail)">
                  <a href="#" className="flex items-center gap-1 px-5 text-[13px] text-(--cx-soft) transition-colors hover:bg-(--cx-tint) hover:text-(--cx-ink)">
                    {l.replace('▾', '').trim()}
                    {l.endsWith('▾') && <Chevron />}
                  </a>
                </li>
              ))}
            </ul>
            <div className="ml-auto flex items-center gap-2 px-3">
              <span className="hidden md:block">
                <Pill>{ctaLabel}</Pill>
              </span>
              <Burger open={open} onClick={() => setOpen(!open)} />
            </div>
          </div>
          {open && <Sheet items={items} secondaryCta={secondaryCta} ctaLabel={ctaLabel} />}
        </nav>
      </ContextRoot>
    )
  }

  return (
    <ContextRoot className={className}>
      {announcement && (
        <a href="#" className="block bg-(--cx-tint) px-4 py-2 text-center text-[12px] text-(--cx-soft) transition-colors hover:text-(--cx-ink)">
          {announcement}
        </a>
      )}
      <nav className="border-b border-(--cx-line)">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">
          <Brand brand={brand} />
          <Links items={items} className="hidden md:flex" />
          {actions}
          <Burger open={open} onClick={() => setOpen(!open)} />
        </div>
        {open && <Sheet items={items} secondaryCta={secondaryCta} ctaLabel={ctaLabel} />}
      </nav>
    </ContextRoot>
  )
}
