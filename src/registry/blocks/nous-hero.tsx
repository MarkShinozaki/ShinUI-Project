'use client'

import { useRef, type PointerEvent } from 'react'
import { CommandBar, Eyebrow, Halftone, NousButton, NousDisplay } from '@/registry/blocks/nous-kit'
import { cn } from '@/lib/utils'

export interface NousHeroProps {
  eyebrow?: string
  wordmark?: string
  lede?: string
  primaryCta?: string
  secondaryCta?: string
  /** One question per line, cycled in the command bar. */
  questions?: string
  animate?: boolean
  className?: string
}

/**
 * Command bar, a giant stretched wordmark and two square buttons. A halftone
 * patch follows the pointer across the hero.
 */
export function NousHero({
  eyebrow = 'Open source • MIT licence',
  wordmark = 'Open Blocks',
  lede = 'An open library of interface blocks, built in public and free to copy into anything you make.',
  primaryCta = 'Read the manifesto',
  secondaryCta = 'Browse blocks',
  questions = 'Which block fits a pricing page?\nShow me a footer that stays put\nMake the hero feel calmer',
  animate = true,
  className,
}: NousHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const move = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--nr-mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--nr-my', `${e.clientY - r.top}px`)
  }
  return (
    <section ref={ref} onPointerMove={move} className={cn('relative isolate overflow-hidden px-6 pt-10 pb-20 text-center [--nr-mx:70%] [--nr-my:30%]', className)}>
      <Halftone
        shape="glow"
        animate={false}
        className="-z-10 opacity-70"
        style={{ maskImage: 'radial-gradient(180px 180px at var(--nr-mx) var(--nr-my), #000, transparent 70%)', WebkitMaskImage: 'radial-gradient(180px 180px at var(--nr-mx) var(--nr-my), #000, transparent 70%)', maskSize: 'auto', WebkitMaskSize: 'auto' }}
      />
      <CommandBar questions={questions.split('\n').filter(Boolean)} animate={animate} className="mx-auto" />
      <div className="mt-16 flex flex-col items-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <NousDisplay as="h1" className="mt-2 text-[clamp(56px,11vw,150px)]">
          {wordmark}
        </NousDisplay>
        <p className="mt-8 max-w-[46ch] text-[14px] leading-relaxed text-(--nr-ink)">{lede}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <NousButton variant="outline">{primaryCta}</NousButton>
          <NousButton>{secondaryCta}</NousButton>
        </div>
      </div>
    </section>
  )
}
