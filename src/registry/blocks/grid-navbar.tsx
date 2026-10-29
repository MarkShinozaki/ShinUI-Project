'use client'

import { useState } from 'react'
import { GridButton, GridLogo, GridMarker, GridSection, type GridAccent, type GridMarkerKind } from '@/registry/blocks/grid-frame'
import { cn } from '@/lib/utils'

export interface GridNavbarProps {
  /** boxed: every item in its own cell. hairline: one quiet ruled bar. floating: a framed pill inside the rails. */
  variant?: 'boxed' | 'hairline' | 'floating'
  brand?: string
  /** Comma separated link labels. */
  links?: string
  ctaLabel?: string
  showSignIn?: boolean
  /** Small mono status chip next to the brand. */
  badge?: string
  accent?: GridAccent
  marker?: GridMarkerKind
  dashed?: boolean
  edges?: 'both' | 'top' | 'bottom' | 'none'
  className?: string
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
    </svg>
  )
}

/** Divider cell edge with markers where it meets the rules above and below. */
function Edge() {
  return (
    <>
      <GridMarker x="calc(100% - 0.5px)" y="-0.5px" />
      <GridMarker x="calc(100% - 0.5px)" y="calc(100% + 0.5px)" />
    </>
  )
}

/**
 * Grid-style top navigation in three variants, with a mobile menu that
 * unfolds as stacked bordered rows.
 */
export function GridNavbar({
  variant = 'boxed',
  brand = 'shinUI',
  links = 'Blocks, Backgrounds, Components, Docs',
  ctaLabel = 'Get started',
  showSignIn = true,
  badge = 'v0.4',
  accent = 'primary',
  marker = 'plus',
  dashed = false,
  edges = 'both',
  className,
}: GridNavbarProps) {
  const [open, setOpen] = useState(false)
  const items = links
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)
  const line = cn('border-(--gf-line)', dashed && 'border-dashed')

  const brandEl = (
    <a href="#" className="flex items-center gap-2.5 font-display text-[15px] font-semibold tracking-tight">
      <GridLogo />
      {brand}
      {badge && (
        <span className="border border-(--gf-line) px-1.5 py-0.5 font-mono text-[10px] font-normal tracking-wider text-ds-muted uppercase">
          {badge}
        </span>
      )}
    </a>
  )

  const toggle = (
    <button
      type="button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      onClick={() => setOpen((o) => !o)}
      className="grid size-10 place-items-center text-ds-muted transition-colors hover:text-foreground md:hidden"
    >
      <MenuIcon open={open} />
    </button>
  )

  const mobile = open && (
    <div className={cn('border-t md:hidden', line)}>
      {items.map((item) => (
        <a key={item} href="#" className={cn('flex items-center justify-between border-b px-6 py-3.5 font-mono text-xs tracking-wider uppercase', line)}>
          {item}
          <span className="text-ds-muted">-&gt;</span>
        </a>
      ))}
      <div className="flex gap-2 p-4">
        {showSignIn && (
          <GridButton variant="outline" href="#" className="flex-1 justify-center">
            Sign in
          </GridButton>
        )}
        <GridButton href="#" className="flex-1 justify-center">
          {ctaLabel}
        </GridButton>
      </div>
    </div>
  )

  return (
    <GridSection edges={edges} marker={marker} dashed={dashed} accent={accent} className={className}>
      {variant === 'boxed' && (
        <nav className="flex h-14 items-stretch">
          <div className={cn('relative flex items-center border-r px-5', line)}>
            {brandEl}
            <Edge />
          </div>
          {items.map((item) => (
            <a
              key={item}
              href="#"
              className={cn(
                'relative hidden items-center border-r px-5 font-mono text-[11px] tracking-wider text-ds-muted uppercase transition-colors hover:bg-(--gf-tint) hover:text-foreground md:flex',
                line,
              )}
            >
              {item}
              <Edge />
            </a>
          ))}
          <div className="flex-1" />
          {showSignIn && (
            <a
              href="#"
              className={cn(
                'relative hidden items-center border-l px-5 font-mono text-[11px] tracking-wider uppercase transition-colors hover:bg-(--gf-tint) md:flex',
                line,
              )}
            >
              Sign in
              <GridMarker x="-0.5px" y="-0.5px" />
              <GridMarker x="-0.5px" y="calc(100% + 0.5px)" />
            </a>
          )}
          <a
            href="#"
            className={cn(
              'relative hidden items-center gap-2 bg-(--gf-accent) px-5 font-mono text-[11px] tracking-wider text-ds-primary-foreground uppercase transition-opacity hover:opacity-90 md:flex',
              !showSignIn && 'border-l',
              line,
            )}
          >
            {ctaLabel} <span aria-hidden>-&gt;</span>
          </a>
          <div className={cn('flex items-center border-l md:hidden', line)}>{toggle}</div>
        </nav>
      )}

      {variant === 'hairline' && (
        <nav className="flex h-14 items-center gap-8 px-5 sm:px-6">
          {brandEl}
          <div className="hidden items-center gap-6 md:flex">
            {items.map((item, i) => (
              <a key={item} href="#" className="group flex items-baseline gap-1.5 text-sm text-ds-muted transition-colors hover:text-foreground">
                <span className="font-mono text-[10px] text-(--gf-cross) transition-colors group-hover:text-(--gf-accent)">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item}
              </a>
            ))}
          </div>
          <div className="ml-auto hidden items-center gap-4 md:flex">
            {showSignIn && (
              <a href="#" className="text-sm text-ds-muted transition-colors hover:text-foreground">
                Sign in
              </a>
            )}
            <GridButton variant="outline" href="#" className="h-8 px-3">
              {ctaLabel}
            </GridButton>
          </div>
          <div className="ml-auto md:hidden">{toggle}</div>
        </nav>
      )}

      {variant === 'floating' && (
        <div className="px-3 py-3 sm:px-4">
          <nav className="relative flex h-12 items-center gap-6 rounded-full border border-(--gf-line) bg-background/80 pr-1.5 pl-4 shadow-[0_1px_0_var(--gf-line),0_8px_24px_-12px_color-mix(in_oklab,var(--color-foreground)_25%,transparent)] backdrop-blur">
            {brandEl}
            <div className="mx-auto hidden items-center gap-1 md:flex">
              {items.map((item) => (
                <a key={item} href="#" className="rounded-full px-3 py-1.5 text-sm text-ds-muted transition-colors hover:bg-(--gf-tint) hover:text-foreground">
                  {item}
                </a>
              ))}
            </div>
            <div className="ml-auto hidden items-center gap-1.5 md:ml-0 md:flex">
              {showSignIn && (
                <a href="#" className="rounded-full px-3 py-1.5 text-sm text-ds-muted transition-colors hover:text-foreground">
                  Sign in
                </a>
              )}
              <a
                href="#"
                className="rounded-full bg-(--gf-accent) px-4 py-2 font-mono text-[11px] tracking-wider text-ds-primary-foreground uppercase transition-opacity hover:opacity-90"
              >
                {ctaLabel}
              </a>
            </div>
            <div className="ml-auto md:hidden">{toggle}</div>
          </nav>
        </div>
      )}

      {mobile}
    </GridSection>
  )
}
