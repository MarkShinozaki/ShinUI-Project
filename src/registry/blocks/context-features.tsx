'use client'

import { useState, type ReactNode } from 'react'
import { Accent, Arrow, Blueprint, Chip, ContextRoot, DashedBox, DoubleCard, Pill, RailSection } from '@/registry/blocks/context-kit'
import { cn } from '@/lib/utils'

export interface ContextFeaturesProps {
  /** grid: 2x2 double cards with blueprint art. bento: a big stat, a live log and three small cards. tabs: a capability list driving a code panel. */
  variant?: 'grid' | 'bento' | 'tabs'
  /** Wrap a phrase in *asterisks* to color it blue. */
  title?: string
  description?: string
  /** Rails with plus joints around the section. */
  rails?: boolean
  className?: string
}

const CARDS: { title: string; body: string; chips: string[]; art: ReactNode }[] = [
  {
    title: 'Search',
    body: 'Find blocks by what they do, not what they are called. Results come back ranked with a live preview.',
    chips: ['By intent', 'By layout', 'By mood'],
    art: (
      <div className="flex flex-col gap-2 p-4">
        {['"hero with a code card"', '"footer, giant wordmark"', '"pricing, three tiers"'].map((q) => (
          <DashedBox key={q} label="query">
            {q}
          </DashedBox>
        ))}
      </div>
    ),
  },
  {
    title: 'Preview',
    body: 'See every block at phone, tablet and desktop widths, in light and dark, before you copy a line.',
    chips: ['375 / 768 / full', 'Light + dark'],
    art: (
      <div className="flex items-end justify-center gap-3 p-5">
        {[
          ['h-20 w-10', '375'],
          ['h-24 w-20', '768'],
          ['h-28 w-32', 'full'],
        ].map(([size, label]) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <div className={cn('rounded-sm border border-dashed border-(--cx-blue)/60 bg-(--cx-paper)/85', size)} />
            <span className="font-mono text-[9px] text-(--cx-faint)">{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Install',
    body: 'One command writes one file. No wrapper package, no runtime, nothing to keep in sync.',
    chips: ['shadcn registry', 'npm', 'Copy + paste'],
    art: (
      <div className="p-4 font-mono text-[11px] leading-5 text-(--cx-blue)">
        <DashedBox>
          {'{'}
          <br />
          {'  "name": "context-hero",'}
          <br />
          {'  "files": 1,'}
          <br />
          {'  "deps": []'}
          <br />
          {'}'}
        </DashedBox>
      </div>
    ),
  },
  {
    title: 'Theme',
    body: 'Blocks read your tokens, so swapping one accent color updates every page that uses them.',
    chips: ['CSS variables', 'Tailwind v4'],
    art: (
      <div className="flex items-center justify-center gap-4 p-6">
        <DashedBox label="before">
          <span className="block size-8 rounded bg-(--cx-ink)/80" />
        </DashedBox>
        <span className="text-(--cx-blue)">→</span>
        <DashedBox label="after">
          <span className="block size-8 rounded bg-(--cx-blue)" />
        </DashedBox>
      </div>
    ),
  },
]

const TABS = [
  { title: 'Install a block', body: 'Pull any block into your repo as one file.', code: "npx shadcn add shinui/context-hero\n\n✓ wrote src/blocks/context-hero.tsx\n✓ added tokens.css" },
  { title: 'Swap the theme', body: 'Point the tokens at your brand colors.', code: ':root {\n  --cx-blue: #0f9d76;\n  --cx-frame: #cdeee2;\n}' },
  { title: 'Pick a variant', body: 'Every block ships two or three layouts.', code: "<ContextHero\n  variant=\"split\"\n  title=\"Ship it *today*\"\n/>" },
  { title: 'Ask your editor', body: 'Search the library from any MCP client.', code: '> find a footer with a big wordmark\n\n1. context-footer (dark)\n2. folio-footer (cta)\n3. grid-footer (wordmark)' },
]

function Tabs() {
  const [active, setActive] = useState(0)
  return (
    <DoubleCard className="mt-10" innerClassName="grid gap-3 p-3 md:grid-cols-[0.9fr_1.3fr]">
      <ul className="flex flex-col gap-1">
        {TABS.map((t, i) => (
          <li key={t.title}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className={cn('flex w-full cursor-pointer gap-3 rounded-lg p-3 text-left transition-colors duration-200', i === active ? 'bg-(--cx-tint)' : 'hover:bg-(--cx-tint)/60')}
            >
              <span className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded text-[10px] text-white', i === active ? 'bg-(--cx-blue)' : 'bg-(--cx-blue)/40')}>{i + 1}</span>
              <span>
                <span className="block text-[14px] font-medium">{t.title}</span>
                <span className="block text-[12.5px] text-(--cx-soft)">{t.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="flex min-h-64 flex-col overflow-hidden rounded-lg bg-(--cx-night)">
        <div className="flex gap-1 border-b border-white/10 px-3 py-2.5 text-[11px] text-white/45">
          {['TypeScript', 'CSS', 'CLI'].map((x, i) => (
            <span key={x} className={cn('rounded px-2 py-0.5', i === 0 && 'bg-white/10 text-white')}>
              {x}
            </span>
          ))}
        </div>
        <pre key={active} className="cx-anim flex-1 overflow-x-auto p-5 font-mono text-[12.5px] leading-6 whitespace-pre text-white/80 [animation:cx-rise_.25s_ease-out]">
          {TABS[active].code}
        </pre>
      </div>
    </DoubleCard>
  )
}

function Bento() {
  return (
    <div className="mt-10 grid gap-3 md:grid-cols-3">
      <DoubleCard className="md:col-span-1" innerClassName="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-6xl font-light tracking-[-0.04em] text-(--cx-blue)">0kb</p>
        <p className="mt-3 text-[13px] text-(--cx-soft)">Runtime added. Blocks are plain files.</p>
      </DoubleCard>
      <DoubleCard className="md:col-span-2" innerClassName="p-2">
        <Blueprint className="h-full min-h-48 border-dashed p-3">
          <div className="grid h-full grid-cols-3 gap-2">
            {['Navbar', 'Hero', 'Features', 'Stats', 'Stories', 'Footer'].map((b, i) => (
              <div key={b} className="flex items-end rounded-md border border-(--cx-line) bg-(--cx-paper) p-2.5 text-[12px]">
                <span className="font-mono text-[10px] text-(--cx-faint)">0{i + 1}</span>
                <span className="ml-2">{b}</span>
              </div>
            ))}
          </div>
        </Blueprint>
      </DoubleCard>
      {[
        ['Responsive, always', 'Every block is checked at phone, tablet and desktop widths before it ships.'],
        ['Dark mode included', 'Light and dark palettes come from the same tokens. No second stylesheet.'],
        ['Motion that behaves', 'Animations stop for people who ask their OS for reduced motion.'],
      ].map(([t, b]) => (
        <DoubleCard key={t}>
          <h3 className="text-[15px] font-medium">{t}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-(--cx-soft)">{b}</p>
        </DoubleCard>
      ))}
    </div>
  )
}

/** Context feature section in three variants. */
export function ContextFeatures({
  variant = 'grid',
  title = 'Everything your page needs, *in one library*.',
  description = 'Search, preview, install and theme original blocks without leaving your editor.',
  rails = true,
  className,
}: ContextFeaturesProps) {
  const body = (
    <div className="px-6 py-16 md:px-10 md:py-20">
      <h2 className="max-w-xl text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.1] font-light tracking-[-0.03em] text-balance">
        <Accent text={title} />
      </h2>
      <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-(--cx-soft)">{description}</p>

      {variant === 'grid' && (
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {CARDS.map((c) => (
            <DoubleCard key={c.title} innerClassName="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[22px] font-light tracking-[-0.02em]">{c.title}</h3>
                <Pill variant="blue" className="h-7 px-3 text-[12px]">
                  Explore <Arrow />
                </Pill>
              </div>
              <p className="-mt-2 text-[13.5px] leading-relaxed text-(--cx-soft)">{c.body}</p>
              <div className="flex flex-wrap gap-1.5">
                {c.chips.map((x) => (
                  <Chip key={x}>{x}</Chip>
                ))}
              </div>
              <Blueprint className="mt-auto min-h-40">{c.art}</Blueprint>
            </DoubleCard>
          ))}
        </div>
      )}
      {variant === 'bento' && <Bento />}
      {variant === 'tabs' && <Tabs />}
    </div>
  )

  return <ContextRoot className={cn('w-full', className)}>{rails ? <RailSection>{body}</RailSection> : <div className="mx-auto max-w-6xl">{body}</div>}</ContextRoot>
}
