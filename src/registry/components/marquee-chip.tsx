'use client'

import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export interface MarqueeChipProps extends ComponentProps<'span'> {
  /** Label inside the chip. */
  label?: string
  /** Small prefix glyph / index. */
  mark?: string
  /** Visual weight. */
  tone?: 'ink' | 'signal' | 'quiet'
}

const tones = {
  ink: 'border-foreground/20 bg-foreground text-background',
  signal: 'border-ds-primary/40 bg-ds-primary/15 text-foreground',
  quiet: 'border-border bg-ds-surface text-ds-muted',
} as const

/** Compact labeled chip with a monospaced mark — good for tags, indexes, and rails. */
export function MarqueeChip({
  className,
  label = 'Original',
  mark = '01',
  tone = 'signal',
  ...props
}: MarqueeChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm',
        tones[tone],
        className,
      )}
      {...props}
    >
      <span className="font-mono text-[10px] tracking-wider opacity-70">{mark}</span>
      <span className="font-medium">{label}</span>
    </span>
  )
}
