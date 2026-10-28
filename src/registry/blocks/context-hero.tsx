'use client'

import { useState } from 'react'
import { Accent, Arrow, Blueprint, ContextRoot, DoubleCard, Pill, PixelStream, Typewriter } from '@/registry/blocks/context-kit'
import { cn } from '@/lib/utils'

export interface ContextHeroProps {
  /** console: centered headline over a blue command console. split: copy left, code card right. metric: a big success number beside a live log. */
  variant?: 'console' | 'split' | 'metric'
  /** Small line above the headline. */
  kicker?: string
  /** Wrap a phrase in *asterisks* to color it blue. */
  title?: string
  description?: string
  primaryCta?: string
  secondaryCta?: string
  /** Console tabs, comma separated. */
  tabs?: string
  /** Placeholder phrases the console types, separated by "|". */
  prompts?: string
  /** Pixel dot streams down both page edges. */
  streams?: boolean
  animate?: boolean
  className?: string
}

function Streams({ animate }: { animate: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-24 opacity-80 sm:w-40">
        <PixelStream side="left" animate={animate} className="h-full" />
      </div>
      <div className="absolute inset-y-0 right-0 w-24 opacity-80 sm:w-40">
        <PixelStream side="right" animate={animate} rows={70} className="h-full" />
      </div>
    </div>
  )
}

function Console({ tabs, prompts, animate }: { tabs: string[]; prompts: string; animate: boolean }) {
  const [tab, setTab] = useState(0)
  return (
    <div className="rounded-[18px] bg-(--cx-blue) p-2.5 shadow-[0_20px_60px_-20px_var(--cx-blue)] sm:p-3.5">
      <div className="rounded-xl bg-(--cx-paper) p-2.5">
        <div className="flex gap-1 overflow-x-auto pb-2.5 text-[12px]">
          {tabs.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(i)}
              className={cn(
                'shrink-0 cursor-pointer rounded-md px-2.5 py-1 transition-colors',
                i === tab ? 'bg-(--cx-tint) text-(--cx-ink) shadow-[0_0_0_1px_var(--cx-line)]' : 'text-(--cx-faint) hover:text-(--cx-ink)',
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-(--cx-line) px-3 py-2.5">
          <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-(--cx-faint)" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5L14 14" />
          </svg>
          <span className="min-w-0 flex-1 truncate text-left font-mono text-[13px] text-(--cx-faint)">
            {animate ? <Typewriter key={tab} text={prompts} /> : prompts.split('|')[0]}
          </span>
          <a href="#" aria-label="Run" className="grid h-8 w-10 shrink-0 place-items-center rounded-md bg-(--cx-blue) text-(--cx-blue-ink) transition-opacity hover:opacity-90">
            <Arrow />
          </a>
        </div>
      </div>
    </div>
  )
}

const CODE = [
  ['import', ' { install } ', 'from', " 'shinui'"],
  ['', '', '', ''],
  ['const', ' hero ', '=', ' await install({'],
  ['', "  block: 'context-hero',", '', ''],
  ['', "  variant: 'console',", '', ''],
  ['', '  theme: { accent: ', "'#3b73ed'", ' },'],
  ['', '})', '', ''],
]

function CodeCard() {
  return (
    <DoubleCard innerClassName="p-0 overflow-hidden bg-(--cx-night) border-transparent">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        {['#f87171', '#fbbf24', '#4ade80'].map((c) => (
          <span key={c} className="size-2.5 rounded-full" style={{ background: c }} />
        ))}
        <div className="ml-3 flex gap-1 text-[11px] text-white/50">
          {['TypeScript', 'CLI', 'MCP'].map((t, i) => (
            <span key={t} className={cn('rounded px-2 py-0.5', i === 0 && 'bg-white/10 text-white')}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6 text-white/80">
        {CODE.map((row, i) => (
          <div key={i} className="cx-anim [animation:cx-rise_.4s_ease-out_both]" style={{ animationDelay: `${i * 70}ms` }}>
            <span className="text-[#8ab4ff]">{row[0]}</span>
            {row[1]}
            <span className="text-[#8ab4ff]">{row[2]}</span>
            <span className="text-[#a7f3d0]">{row[3]}</span>
            {row.every((c) => !c) && ' '}
          </div>
        ))}
      </pre>
      <div className="border-t border-white/10 px-5 py-2.5 font-mono text-[11px] text-white/40">→ wrote src/blocks/context-hero.tsx</div>
    </DoubleCard>
  )
}

const LOG: [string, string, string][] = [
  ['01', 'Resolved block and tokens', '12ms'],
  ['02', 'Matched your Tailwind theme', 'auto'],
  ['03', 'Swapped icons for local ones', '3 icons'],
  ['04', 'Checked dark mode contrast', 'AA'],
  ['05', 'Wrote one file to your repo', '1 file'],
]

function Metric() {
  return (
    <div className="grid gap-3 md:grid-cols-[1fr_1.3fr]">
      <DoubleCard innerClassName="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-[clamp(3rem,7vw,4.5rem)] leading-none font-light tracking-[-0.04em] text-(--cx-blue)">99.2%</p>
        <p className="mt-3 text-[13px] text-(--cx-soft)">Installs that worked on the first try.</p>
      </DoubleCard>
      <DoubleCard innerClassName="p-0">
        <Blueprint className="m-2 border-dashed p-3">
          <div className="flex items-center justify-between rounded-md border border-(--cx-line) bg-(--cx-paper) px-3 py-2 text-[12px]">
            <span className="font-mono text-(--cx-soft)">install context-hero</span>
            <span className="rounded bg-(--cx-tint) px-1.5 py-0.5 font-mono text-[10px] text-(--cx-blue)">200 OK</span>
          </div>
          <ul className="mt-2 rounded-md border border-(--cx-line) bg-(--cx-paper) px-3 py-1 text-[12px]">
            {LOG.map(([n, label, meta], i) => (
              <li key={n} className="cx-anim flex items-center gap-3 border-b border-(--cx-line) py-2 last:border-0 [animation:cx-rise_.4s_ease-out_both]" style={{ animationDelay: `${i * 160}ms` }}>
                <span className="font-mono text-[10px] text-(--cx-faint)">{n}</span>
                <span className="size-1.5 rounded-full bg-(--cx-blue)" />
                <span className="flex-1">{label}</span>
                <span className="font-mono text-[10px] text-(--cx-faint)">{meta}</span>
              </li>
            ))}
          </ul>
        </Blueprint>
      </DoubleCard>
    </div>
  )
}

/** Context hero in three layouts. */
export function ContextHero({
  variant = 'console',
  kicker = 'Free and open · 120+ blocks',
  title = 'Give your *pages* a head start',
  description = 'Search, preview and install original blocks for React and Tailwind, from one prompt.',
  primaryCta = 'Start for free',
  secondaryCta = 'Connect your editor',
  tabs = 'Search blocks, Preview, Install, Theme, Tokens',
  prompts = 'pricing table with a yearly toggle|footer with a giant wordmark|hero with a live code card|navbar that floats on scroll',
  streams = true,
  animate = true,
  className,
}: ContextHeroProps) {
  const tabList = tabs
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  const heading = 'text-[clamp(2.3rem,5.4vw,3.6rem)] leading-[1.06] font-light tracking-[-0.035em] text-balance'
  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      {primaryCta && <Pill className="h-10 px-5">{primaryCta}</Pill>}
      {secondaryCta && (
        <Pill variant="blue" className="h-10 px-5">
          {secondaryCta} <Arrow />
        </Pill>
      )}
    </div>
  )

  if (variant === 'split' || variant === 'metric') {
    return (
      <ContextRoot className={cn('relative overflow-hidden', className)}>
        {streams && <Streams animate={animate} />}
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:px-10 lg:grid-cols-[1fr_1.1fr] lg:py-28">
          <div className="flex flex-col items-start gap-6">
            {kicker && <p className="text-[12.5px] text-(--cx-soft)">{kicker}</p>}
            <h1 className={heading}>
              <Accent text={title} />
            </h1>
            <p className="max-w-md text-[17px] leading-relaxed text-(--cx-soft)">{description}</p>
            {actions}
          </div>
          {variant === 'split' ? <CodeCard /> : <Metric />}
        </div>
      </ContextRoot>
    )
  }

  return (
    <ContextRoot className={cn('relative overflow-hidden', className)}>
      {streams && <Streams animate={animate} />}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-24 pb-20 text-center md:pt-32">
        {kicker && (
          <a href="#" className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] text-(--cx-soft) transition-colors hover:text-(--cx-ink)">
            {kicker} <Arrow className="opacity-60" />
          </a>
        )}
        <h1 className={heading}>
          <Accent text={title} />
        </h1>
        <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-(--cx-soft)">{description}</p>
        <div className="mt-8">{actions}</div>
        <div className="mt-14 w-full max-w-2xl">
          <Console tabs={tabList} prompts={prompts} animate={animate} />
        </div>
      </div>
    </ContextRoot>
  )
}
