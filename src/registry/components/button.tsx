'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  primary:
    'bg-ds-primary text-ds-primary-foreground shadow-[0_0_0_1px_rgb(255_255_255/0.12)_inset,0_8px_24px_-8px_var(--ds-primary)] hover:bg-ds-primary-hover',
  secondary: 'border border-border bg-ds-surface text-foreground hover:bg-ds-surface-hover',
  ghost: 'text-foreground hover:bg-ds-surface',
} as const

const sizes = {
  sm: 'h-8 gap-1.5 rounded-sm px-3 text-xs',
  md: 'h-10 gap-2 rounded-md px-4 text-sm',
  lg: 'h-12 gap-2.5 rounded-lg px-6 text-base',
} as const

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function Button({ className, variant = 'primary', size = 'md', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center font-medium whitespace-nowrap transition-all duration-150 select-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
        'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
