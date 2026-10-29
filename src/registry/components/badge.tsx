'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default: 'border-ds-primary/25 bg-ds-primary/12 text-ds-primary',
  secondary: 'border-border bg-ds-surface text-foreground',
  outline: 'border-border bg-transparent text-foreground',
  success: 'border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  warning: 'border-amber-500/25 bg-amber-500/12 text-amber-700 dark:text-amber-400',
  danger: 'border-rose-500/25 bg-rose-500/12 text-rose-700 dark:text-rose-400',
} as const

const sizes = {
  sm: 'h-5 gap-1 px-2 text-[11px]',
  md: 'h-6 gap-1.5 px-2.5 text-xs',
} as const

export interface BadgeProps extends ComponentProps<'span'> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  /** Show a status dot before the label. */
  dot?: boolean
  /** Pulse the dot (needs `dot`). */
  pulse?: boolean
}

export function Badge({ className, variant = 'default', size = 'md', dot = false, pulse = false, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit shrink-0 items-center rounded-full border font-medium whitespace-nowrap',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex size-1.5">
          {pulse && <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60 motion-reduce:animate-none" />}
          <span className="relative size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  )
}
