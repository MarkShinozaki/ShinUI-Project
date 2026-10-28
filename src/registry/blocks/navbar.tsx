'use client'

import { useState, type ComponentProps } from 'react'
import { Button } from '@/registry/components/button'
import { cn } from '@/lib/utils'

const variants = {
  // Avoid backdrop-blur here — it can black-screen Edge/Windows GPU compositors
  // when many previews mount on the gallery page.
  glass: 'border-b border-border bg-background/95',
  solid: 'border-b border-border bg-ds-surface',
  minimal: 'bg-transparent',
} as const

export interface NavbarProps extends ComponentProps<'header'> {
  brand?: string
  /** Link labels, as an array or a comma-separated string. */
  links?: string[] | string
  ctaLabel?: string
  showSignIn?: boolean
  variant?: keyof typeof variants
}

/** Responsive top navigation with a mobile menu below the md breakpoint. */
export function Navbar({
  className,
  brand = 'shinUI',
  links = ['Product', 'Components', 'Pricing', 'Docs'],
  ctaLabel = 'Get started',
  showSignIn = true,
  variant = 'glass',
  ...props
}: NavbarProps) {
  const [open, setOpen] = useState(false)
  const items = typeof links === 'string' ? links.split(',').map((l) => l.trim()).filter(Boolean) : links

  return (
    <header className={cn('relative z-20 w-full', variants[variant], className)} {...props}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="size-6 rounded-md bg-[linear-gradient(135deg,var(--ds-primary),var(--ds-accent))] shadow-[0_0_16px_-2px_var(--ds-primary)]" />
          {brand}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {items.map((label) => (
            <li key={label}>
              <a href="#" className="rounded-md px-3 py-2 text-sm text-ds-muted transition-colors hover:text-foreground">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {showSignIn && (
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          )}
          <Button size="sm">{ctaLabel}</Button>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative grid size-9 cursor-pointer place-items-center rounded-md border border-border md:hidden"
        >
          <span className={cn('absolute h-px w-4 bg-current transition-transform', open ? 'rotate-45' : '-translate-y-1')} />
          <span className={cn('absolute h-px w-4 bg-current transition-transform', open ? '-rotate-45' : 'translate-y-1')} />
        </button>
      </nav>

      {open && (
        <div className="border-t border-border px-6 pt-2 pb-4 md:hidden">
          <ul className="flex flex-col">
            {items.map((label) => (
              <li key={label}>
                <a href="#" className="block rounded-md py-2.5 text-sm text-ds-muted hover:text-foreground">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            {showSignIn && (
              <Button variant="secondary" className="w-full">
                Sign in
              </Button>
            )}
            <Button className="w-full">{ctaLabel}</Button>
          </div>
        </div>
      )}
    </header>
  )
}
