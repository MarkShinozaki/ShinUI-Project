'use client'

import { Lines, Mosaic, PhoneMock, RomaButton, RomaHeading, RomaRoot, TaskRow, type Task } from '@/registry/blocks/roma-kit'
import { cn } from '@/lib/utils'

export interface RomaHeroProps {
  /** mosaic: black hero over breathing tiles. orange: loud orange band with a phone. window: light hero over a desktop app window. */
  variant?: 'mosaic' | 'orange' | 'window'
  badge?: string
  /** Use a new line (\n) to control the break. */
  title?: string
  description?: string
  primaryCta?: string
  secondaryCta?: string
  animate?: boolean
  className?: string
}

const ROMA_TASKS: Task[] = [
  { title: 'Pick a hero for the launch page', due: 'Today', hot: true },
  { title: 'Swap the accent to brand orange', due: 'Today' },
  { title: 'Check the footer on a phone', due: 'Tue' },
  { title: 'Paste the pricing block', due: 'Oct 24' },
  { title: 'Ship it', due: 'Fri' },
]

function AppWindow({ animate }: { animate: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--rm-line) bg-(--rm-card) shadow-[0_40px_80px_-40px_rgb(0_0_0/0.35)]">
      <div className="flex items-center gap-2 border-b border-(--rm-line) px-4 py-3">
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-4 rounded-md bg-(--rm-orange)/12 px-2 py-0.5 text-[11px] text-(--rm-orange)">Blocks</span>
        <span className="rounded-md px-2 py-0.5 text-[11px] text-(--rm-faint)">Weekly review</span>
      </div>
      <div className="grid md:grid-cols-[150px_1fr_220px]">
        <aside className="hidden border-r border-(--rm-line) p-3 text-[12px] text-(--rm-soft) md:block">
          {['Inbox', 'Today', 'Blocks', 'Shipped'].map((x, i) => (
            <p key={x} className={cn('rounded-md px-2 py-1.5', i === 2 && 'bg-(--rm-chip) text-(--rm-ink)')}>
              {x}
            </p>
          ))}
          <p className="mt-4 px-2 text-[10px] text-(--rm-faint) uppercase">Projects</p>
          {['Landing', 'Docs', 'Portfolio'].map((x) => (
            <p key={x} className="px-2 py-1.5">
              # {x}
            </p>
          ))}
        </aside>
        <ul className="flex flex-col gap-1.5 p-4">
          {ROMA_TASKS.map((t, i) => (
            <TaskRow key={t.title} task={{ ...t, done: i === 1 }} delay={animate ? i * 110 : 0} />
          ))}
        </ul>
        <div className="hidden flex-col gap-3 border-l border-(--rm-line) p-4 text-[12px] md:flex">
          <p className="font-semibold">Assistant</p>
          <p className="rounded-xl bg-(--rm-chip) p-2.5 text-(--rm-soft)">Found 3 heroes that match your brand. Want me to drop the best one in?</p>
          <p className="ml-6 rounded-xl bg-(--rm-orange) p-2.5 text-white">Yes, the split one.</p>
        </div>
      </div>
    </div>
  )
}

/** Roma hero in three layouts. */
export function RomaHero({
  variant = 'mosaic',
  badge = 'Free and open source',
  title = 'Your next page,\nalready half built.',
  description = 'Original blocks you can drop into any React project, so the boring parts are done before you start.',
  primaryCta = 'Browse blocks',
  secondaryCta = 'Install the CLI',
  animate = true,
  className,
}: RomaHeroProps) {
  if (variant === 'orange') {
    return (
      <RomaRoot className={cn('overflow-hidden bg-(--rm-orange) text-black', className)}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-16 md:grid-cols-[1.1fr_1fr] md:px-10 md:pt-20">
          <div className="flex flex-col items-start gap-6 pb-10 md:pb-24">
            <RomaHeading as="h1" className="text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.98]">
              <Lines text={title} />
            </RomaHeading>
            <p className="max-w-md text-[18px] leading-relaxed text-black/70">{description}</p>
            <div className="flex flex-wrap gap-2">
              {primaryCta && (
                <RomaButton variant="black" icon="laptop" className="bg-black text-white">
                  {primaryCta}
                </RomaButton>
              )}
              {secondaryCta && <RomaButton variant="white" icon="phone">{secondaryCta}</RomaButton>}
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <PhoneMock tasks={ROMA_TASKS} animate={animate} className="translate-y-10 rounded-b-none border-b-0" />
          </div>
        </div>
      </RomaRoot>
    )
  }

  if (variant === 'window') {
    return (
      <RomaRoot className={cn('overflow-hidden', className)}>
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid gap-6 md:grid-cols-2 md:items-end">
            <RomaHeading as="h1" className="text-[clamp(2.4rem,5.5vw,4rem)] leading-[1]">
              <Lines text={title} />
            </RomaHeading>
            <div className="flex flex-col gap-5 md:items-start">
              <p className="max-w-md text-[17px] leading-relaxed text-(--rm-soft)">{description}</p>
              <div className="flex flex-wrap gap-2">
                {primaryCta && <RomaButton variant="black">{primaryCta}</RomaButton>}
                {secondaryCta && <RomaButton variant="ghost" icon="arrow">{secondaryCta}</RomaButton>}
              </div>
            </div>
          </div>
          <div className="mt-14">
            <AppWindow animate={animate} />
          </div>
        </div>
      </RomaRoot>
    )
  }

  return (
    <RomaRoot className={cn('relative overflow-hidden bg-black text-white', className)}>
      <Mosaic animate={animate} className="absolute inset-x-0 top-0 opacity-90" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,black_90%)]" />
      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-24 md:px-10 md:pt-40 md:pb-32">
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white/75">
            <span className="size-3.5 rounded-[4px] bg-(--rm-orange)" />
            {badge}
          </span>
        )}
        <RomaHeading as="h1" className="mt-6 text-[clamp(2.8rem,7.5vw,5.7rem)] leading-[0.95]">
          <Lines text={title} />
        </RomaHeading>
        <p className="mt-6 max-w-lg text-[19px] leading-relaxed text-white/70">{description}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          {primaryCta && <RomaButton icon="laptop">{primaryCta}</RomaButton>}
          {secondaryCta && <RomaButton icon="arrow">{secondaryCta}</RomaButton>}
        </div>
      </div>
    </RomaRoot>
  )
}
