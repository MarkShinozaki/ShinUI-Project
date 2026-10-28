'use client'

import { Bubble, RomaHeading, RomaRoot } from '@/registry/blocks/roma-kit'
import { cn } from '@/lib/utils'

export interface RomaCardsProps {
  /** integrations: soft cards with icon chips. chat: cards that each show a short conversation. */
  variant?: 'integrations' | 'chat'
  title?: string
  description?: string
  className?: string
}

const INTEGRATIONS: [string, string, string][] = [
  ['Figma', 'Paste a frame, get the matching block.', '#a259ff'],
  ['GitHub', 'Open a pull request with the new section.', '#151515'],
  ['Notion', 'Turn a page outline into a layout.', '#7a7a7a'],
  ['Linear', 'Link blocks to the issue that asked for them.', '#5e6ad2'],
  ['Slack', 'Share a live preview in a thread.', '#e01e5a'],
  ['Vercel', 'Preview every variant on a real URL.', '#000000'],
]

const CHATS: { title: string; lines: [string, string, string, boolean?][] }[] = [
  {
    title: 'Rewrite the copy',
    lines: [
      ['Aiko', '10:02', 'The hero sounds stiff. Make it friendlier?'],
      ['shinUI', '10:02', 'Tried three tones. The second keeps your keywords.', true],
    ],
  },
  {
    title: 'Match the brand',
    lines: [
      ['Leo', '14:18', 'Use our orange and the rounder buttons.'],
      ['shinUI', '14:18', 'Done. Contrast still passes in both themes.', true],
    ],
  },
  {
    title: 'Fix it on mobile',
    lines: [
      ['Mina', '17:40', 'The pricing table overflows on a phone.'],
      ['shinUI', '17:41', 'Stacked the plans and pinned the CTA.', true],
    ],
  },
]

/** Roma card grids. */
export function RomaCards({
  variant = 'integrations',
  title = 'Works with what you use.',
  description = 'Blocks are plain React files, so they fit wherever your work already happens.',
  className,
}: RomaCardsProps) {
  return (
    <RomaRoot className={cn(className)}>
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
        <div className="max-w-xl">
          <RomaHeading className="text-[clamp(2rem,4vw,3.1rem)] leading-[1.03]">{title}</RomaHeading>
          <p className="mt-4 text-[17px] leading-relaxed text-(--rm-soft)">{description}</p>
        </div>
        {variant === 'chat' ? (
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {CHATS.map((c) => (
              <article key={c.title} className="flex flex-col gap-5 rounded-3xl bg-(--rm-card) p-6 shadow-[0_1px_0_var(--rm-line),0_20px_40px_-30px_rgb(0_0_0/0.25)] transition-transform duration-300 hover:-translate-y-1">
                <h3 className="text-[16px] font-semibold">{c.title}</h3>
                {c.lines.map(([who, time, text, op]) => (
                  <Bubble key={time + who} who={who} time={time} operator={op}>
                    {text}
                  </Bubble>
                ))}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INTEGRATIONS.map(([name, text, color]) => (
              <article key={name} className="group flex items-start gap-4 rounded-3xl bg-(--rm-card) p-6 shadow-[0_1px_0_var(--rm-line),0_20px_40px_-30px_rgb(0_0_0/0.25)] transition-transform duration-300 hover:-translate-y-1">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl text-[15px] font-bold text-white" style={{ background: color }}>
                  {name[0]}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold">{name}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-(--rm-soft)">{text}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </RomaRoot>
  )
}
