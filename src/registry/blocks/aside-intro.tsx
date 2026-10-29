'use client'

import { useRef } from 'react'
import { Eyebrow, Rails, useScrollVar } from '@/registry/blocks/aside-kit'

export interface AsideIntroProps {
  eyebrow?: string
  paragraphs?: string[]
  className?: string
}

const DEFAULT = [
  'Most assistants stop at the hard part. They hand the task back the moment it needs a login, a form or a second step.',
  'This one keeps going. It uses the sites you are already signed in to and finishes the job, from replies and bookings to the tools only your team uses.',
]

/**
 * Two-column statement whose words darken one by one as the section scrolls
 * up the screen, so the paragraph reads itself in.
 */
export function AsideIntro({ eyebrow = 'Why we built it', paragraphs = DEFAULT, className }: AsideIntroProps) {
  const ref = useRef<HTMLElement>(null)
  useScrollVar(ref, { name: '--as-read', mode: 'enter', end: 0.25 })
  const words = paragraphs.map((t) => t.split(' '))
  const total = words.reduce((n, w) => n + w.length, 0)
  let k = 0
  return (
    <section ref={ref} className={className}>
      <Rails className="grid gap-8 px-6 py-24 md:grid-cols-[1fr_1.6fr] md:px-24">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <div className="space-y-6 text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.55]">
          {words.map((ws, pi) => (
            <p key={pi}>
              {ws.map((w, wi) => {
                const at = k++ / total
                return (
                  <span
                    key={wi}
                    className="transition-colors duration-200"
                    style={{ color: `color-mix(in oklab, var(--as-ink) calc(clamp(0, (var(--as-read, 0) * 1.15 - ${at.toFixed(3)}) * 14, 1) * 100%), var(--as-faint))` }}
                  >
                    {w}{' '}
                  </span>
                )
              })}
            </p>
          ))}
        </div>
      </Rails>
    </section>
  )
}
