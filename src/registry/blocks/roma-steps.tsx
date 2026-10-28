'use client'

import { PhoneMock, RomaHeading, RomaRoot, type Task } from '@/registry/blocks/roma-kit'
import { cn } from '@/lib/utils'

export interface RomaStepsProps {
  /** orange: full-bleed orange band with numbered steps and a phone. manifesto: one big paragraph, first sentence loud, the rest muted. */
  variant?: 'orange' | 'manifesto'
  title?: string
  /** For manifesto: the first sentence is emphasised. */
  body?: string
  animate?: boolean
  className?: string
}

const STEPS = [
  ['Describe it', 'Type what the page needs in plain words, or pick a family to start from.'],
  ['Tweak it', 'Every block has variants and live props. Change copy, color and layout in place.'],
  ['Ship it', 'Copy the file or pull it with the CLI. It is your code from that point on.'],
]

const TASKS: Task[] = [
  { title: 'Hero: split, orange accent', due: 'Now', hot: true },
  { title: 'Steps section, 3 items', due: 'Now' },
  { title: 'Footer with a slogan', due: 'Next' },
  { title: 'Dark mode pass', due: 'Next' },
]

/** Roma content band: how it works, or a manifesto paragraph. */
export function RomaSteps({
  variant = 'orange',
  title = 'From idea to page\nin three moves.',
  body = 'Pages should not take a week. Most of a landing page is the same ten sections arranged with taste, and that part should be instant. So we drew the sections once, carefully, and left the interesting decisions to you.',
  animate = true,
  className,
}: RomaStepsProps) {
  if (variant === 'manifesto') {
    const cut = body.search(/[.!?](\s|$)/)
    const first = cut === -1 ? body : body.slice(0, cut + 1)
    const rest = cut === -1 ? '' : body.slice(cut + 1)
    return (
      <RomaRoot className={cn('bg-(--rm-card)', className)}>
        <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
          <p className="font-display text-[clamp(1.6rem,3.6vw,2.7rem)] leading-[1.18] font-medium tracking-[-0.03em] text-(--rm-stone)">
            <span className="text-(--rm-ink)">{first}</span>
            {rest}
          </p>
        </div>
      </RomaRoot>
    )
  }

  return (
    <RomaRoot className={cn('overflow-hidden bg-(--rm-orange) text-black', className)}>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-20 md:grid-cols-2 md:px-10 md:pt-24">
        <div className="pb-16 md:pb-24">
          <RomaHeading className="text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1]">
            {title.split('\n').map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </RomaHeading>
          <ol className="mt-12 flex flex-col">
            {STEPS.map(([h, d], i) => (
              <li key={h} className="grid grid-cols-[3rem_1fr] gap-2 border-t border-black/15 py-5">
                <span className="font-mono text-[13px] text-black/55">0{i + 1}</span>
                <div>
                  <h3 className="text-[19px] font-semibold tracking-[-0.01em]">{h}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-black/65">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex items-end justify-center">
          <PhoneMock tasks={TASKS} title="Build" animate={animate} className="rounded-b-none border-b-0" />
        </div>
      </div>
    </RomaRoot>
  )
}
