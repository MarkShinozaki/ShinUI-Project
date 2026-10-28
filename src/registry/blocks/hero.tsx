'use client'

import { Aurora } from '@/registry/backgrounds/aurora'
import { Button } from '@/registry/components/button'
import { cn } from '@/lib/utils'

export interface HeroProps {
  eyebrow?: string
  title?: string
  description?: string
  primaryCta?: string
  secondaryCta?: string
  showSecondary?: boolean
  /** Animated shimmer across the headline. */
  shimmer?: boolean
  align?: 'center' | 'left'
  background?: 'vivid' | 'subtle'
  className?: string
}

export function Hero({
  eyebrow = 'New · shinUI components',
  title = 'Design faster, ship something beautiful',
  description = 'Backgrounds, components and blocks you can drop into any React + Tailwind project. Free, open and built to be remixed.',
  primaryCta = 'Get started',
  secondaryCta = 'Browse components',
  showSecondary = true,
  shimmer = true,
  align = 'center',
  background = 'vivid',
  className,
}: HeroProps) {
  const centered = align === 'center'

  return (
    <Aurora intensity={background} className={cn('px-6 py-24', className)}>
      <div className={cn('mx-auto flex max-w-5xl flex-col', centered ? 'items-center text-center' : 'items-start text-left')}>
        {eyebrow && (
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-ds-surface/90 px-3 py-1 text-xs text-ds-muted">
            <span className="size-1.5 rounded-full bg-ds-accent shadow-[0_0_8px_var(--ds-accent)]" />
            {eyebrow}
          </span>
        )}
        <h1
          className={cn(
            'max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl',
            shimmer &&
              'animate-ds-shimmer bg-[linear-gradient(110deg,var(--color-foreground)_35%,var(--ds-accent)_50%,var(--color-foreground)_65%)] bg-size-[200%_100%] bg-clip-text text-transparent motion-reduce:animate-none',
          )}
        >
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base text-pretty text-ds-muted sm:text-lg">{description}</p>
        <div className={cn('mt-10 flex flex-wrap items-center gap-3', centered && 'justify-center')}>
          <Button size="lg">{primaryCta}</Button>
          {showSecondary && (
            <Button size="lg" variant="secondary">
              {secondaryCta}
            </Button>
          )}
        </div>
      </div>
    </Aurora>
  )
}
