'use client'

import { useState } from 'react'
import { Eyebrow, Halftone, NousButton, NousDisplay, NousMark } from '@/registry/blocks/nous-kit'
import { cn } from '@/lib/utils'

const CARDS = [
  ['Terminal', 'Add from the CLI', 'Install any block'],
  ['Registry', 'Every block, searchable', 'Open the registry'],
  ['Kits', 'Palettes you can share', 'Explore kits'],
] as const

export interface NousAgentProps {
  eyebrow?: string
  heading?: string
  lede?: string
  command?: string
  className?: string
}

/** A product spotlight: stretched heading, a copyable install line and three cards. */
export function NousAgent({
  eyebrow = 'The shinUI CLI',
  heading = 'Ship it today',
  lede = 'Pull a block straight into your project, already wired to your tokens, then keep editing it like your own code.',
  command = 'npx shinui add nous-hero',
  className,
}: NousAgentProps) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
    } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <section className={cn('px-6 py-24 text-center', className)}>
      <NousMark className="mx-auto h-10" />
      <Eyebrow className="mt-6 block">{eyebrow}</Eyebrow>
      <NousDisplay className="text-[clamp(52px,10vw,132px)]">{heading}</NousDisplay>
      <p className="mx-auto mt-6 max-w-[52ch] text-[14px] leading-relaxed text-(--nr-soft)">{lede}</p>
      <div className="mx-auto mt-8 flex max-w-md items-center border border-(--nr-blue) bg-(--nr-card) text-left">
        <code className="flex-1 truncate px-4 font-mono text-[12.5px] text-(--nr-blue)">
          <span aria-hidden className="mr-2 opacity-50">$</span>
          {command}
        </code>
        <button type="button" onClick={copy} className="h-10 border-l border-(--nr-blue) px-4 font-mono text-[10.5px] tracking-[0.14em] text-(--nr-blue) uppercase hover:bg-(--nr-blue) hover:text-(--nr-on-blue)">
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="mx-auto mt-14 grid max-w-6xl gap-4 text-left md:grid-cols-3">
        {CARDS.map(([tag, title, cta], i) => (
          <article key={tag} className="group relative flex min-h-56 flex-col justify-end gap-2 overflow-hidden bg-(--nr-blue) p-6 text-(--nr-on-blue)">
            <Halftone shape={(['fade', 'glow', 'ridge'] as const)[i]} animate={false} dot={1} className="opacity-40 [--nr-blue:var(--nr-on-blue)] transition-opacity group-hover:opacity-70" />
            <span className="relative font-mono text-[10px] tracking-[0.16em] uppercase opacity-75">{tag}</span>
            <h3 className="relative text-[24px] leading-tight font-light">{title}</h3>
            <NousButton variant="paper" className="relative mt-2 w-fit">
              {cta}
            </NousButton>
          </article>
        ))}
      </div>
    </section>
  )
}
