'use client'

import { useRef } from 'react'
import { Accent, Arrow, ContextRoot, DoubleCard, Pill, RailSection } from '@/registry/blocks/context-kit'
import { cn } from '@/lib/utils'

export interface ContextStoriesProps {
  /** carousel: blue story cards with pixel icons. logos: a scrolling strip of made-up wordmarks. trust: three cards with pixel badges. */
  variant?: 'carousel' | 'logos' | 'trust'
  title?: string
  description?: string
  ctaLabel?: string
  rails?: boolean
  animate?: boolean
  className?: string
}

/** A 7x7 pixel icon from a seed, mirrored so it reads as a symbol. */
function PixelIcon({ seed, className }: { seed: number; className?: string }) {
  const cells = []
  for (let y = 0; y < 7; y++)
    for (let x = 0; x < 4; x++) {
      const s = Math.sin(seed * 12.9 + x * 78.2 + y * 37.7) * 43758.5
      if (s - Math.floor(s) > 0.45) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={0.86} height={0.86} />)
        if (x < 3) cells.push(<rect key={`m${x}-${y}`} x={6 - x} y={y} width={0.86} height={0.86} />)
      }
    }
  return (
    <svg viewBox="0 0 7 7" className={cn('size-14', className)} fill="currentColor" aria-hidden>
      {cells}
    </svg>
  )
}

const STORIES = [
  ['Oct 14', 'Northwind', 'Rebuilt a marketing site from six blocks in a weekend, then themed it with one accent change.'],
  ['Sep 30', 'Paperlane', 'Swapped a hand-rolled navbar for a library one and dropped two hundred lines of CSS.'],
  ['Sep 12', 'Tidepool', 'Shipped dark mode across every page by moving to shared tokens.'],
  ['Aug 27', 'Kiln & Co', 'Prototyped three landing pages in an afternoon to test which one converted.'],
  ['Aug 03', 'Lumen Labs', 'Used the registry from their editor to pull blocks straight into a new repo.'],
]

const WORDMARKS = ['northwind', 'PAPERLANE', 'tidepool', 'Kiln&Co', 'lumen/labs', 'ORCHARD', 'driftwood', 'Atlas.', 'quarry']

function Carousel({ animate }: { animate: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 280, behavior: animate ? 'smooth' : 'auto' })
  return (
    <>
      <div ref={ref} className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
        {STORIES.map(([date, name, body], i) => (
          <article key={name} className="group flex w-64 shrink-0 snap-start flex-col rounded-xl bg-(--cx-blue) p-5 text-white">
            <div className="grid h-24 place-items-center rounded-lg" style={{ backgroundImage: 'radial-gradient(rgb(255 255 255/0.22) 1px, transparent 1.2px)', backgroundSize: '7px 7px' }}>
              <PixelIcon seed={i + 3} className="text-white transition-transform duration-500 group-hover:scale-110" />
            </div>
            <p className="mt-5 text-[11px] text-white/70">{date}</p>
            <h3 className="mt-1 text-[18px] font-light">{name}</h3>
            <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-white/80">{body}</p>
            <a href="#" className="mt-5 inline-flex w-fit items-center gap-1 rounded-full border border-white/40 px-3 py-1 text-[12px] transition-colors hover:bg-white/10">
              Read their story <Arrow />
            </a>
          </article>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {[-1, 1].map((d) => (
          <button key={d} type="button" aria-label={d < 0 ? 'Previous' : 'Next'} onClick={() => scroll(d)} className="grid size-8 cursor-pointer place-items-center rounded-full border border-(--cx-line) transition-colors hover:border-(--cx-blue) hover:text-(--cx-blue)">
            <Arrow className={cn(d < 0 && 'rotate-180')} />
          </button>
        ))}
      </div>
    </>
  )
}

/** Context social proof section in three variants. */
export function ContextStories({
  variant = 'carousel',
  title = 'How teams *shipped faster* with shinUI',
  description = 'From weekend projects to product launches, built from the same blocks you can install today.',
  ctaLabel = 'See all stories',
  rails = true,
  animate = true,
  className,
}: ContextStoriesProps) {
  const head = (
    <div className="flex flex-col items-center text-center">
      <h2 className="max-w-xl text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.1] font-light tracking-[-0.03em] text-balance">
        <Accent text={title} />
      </h2>
      {description && <p className="mt-4 max-w-md text-[15px] leading-relaxed text-(--cx-soft)">{description}</p>}
      {ctaLabel && (
        <Pill variant="blue" className="mt-6">
          {ctaLabel}
        </Pill>
      )}
    </div>
  )

  let body
  if (variant === 'logos') {
    body = (
      <div className="flex flex-col items-stretch gap-6 px-6 py-10 md:flex-row md:items-center md:px-10">
        <p className="shrink-0 text-[13px] leading-snug text-(--cx-soft) md:w-48">
          Building pages for <span className="text-(--cx-blue)">teams of every size.</span>
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className={cn('flex w-max', animate && 'cx-anim [animation:cx-marquee_36s_linear_infinite]')}>
            {[...WORDMARKS, ...WORDMARKS].map((w, i) => (
              <span key={i} className="flex h-14 w-40 shrink-0 items-center justify-center border-l border-(--cx-line) text-[19px] font-semibold tracking-[-0.03em] text-(--cx-ink)/55">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  } else if (variant === 'trust') {
    body = (
      <div className="px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(1.8rem,3.6vw,2.4rem)] font-light tracking-[-0.03em]">
            <Accent text="Built to be *trusted*." />
          </h2>
          <Pill variant="blue">Read the policy</Pill>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            ['MIT licensed', 'Use any block in personal or commercial work. Credit is welcome, never required.', 'View license'],
            ['Accessible by default', 'Landmarks, focus rings, labels and contrast are checked on every block.', 'See the checklist'],
            ['No tracking', 'Blocks never phone home. What you install is exactly what you read.', 'How it works'],
          ].map(([t, b, cta], i) => (
            <DoubleCard key={t} innerClassName="flex flex-col gap-3">
              <PixelIcon seed={i + 11} className="size-10 text-(--cx-blue)" />
              <h3 className="mt-2 text-[15px] font-medium">{t}</h3>
              <p className="text-[13px] leading-relaxed text-(--cx-soft)">{b}</p>
              <Pill variant="blue" className="mt-auto h-8 w-fit text-[12px]">
                {cta}
              </Pill>
            </DoubleCard>
          ))}
        </div>
      </div>
    )
  } else {
    body = (
      <div className="px-6 py-16 md:px-10 md:py-20">
        {head}
        <Carousel animate={animate} />
      </div>
    )
  }

  return <ContextRoot className={cn('w-full', className)}>{rails ? <RailSection>{body}</RailSection> : <div className="mx-auto max-w-6xl">{body}</div>}</ContextRoot>
}
