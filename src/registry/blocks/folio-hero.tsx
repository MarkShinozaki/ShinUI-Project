'use client'

import type { ReactNode } from 'react'
import { DitherField, FolioAnnouncement, FolioButton, FolioCommand, FolioFigure, FolioLabel, FolioRoot } from '@/registry/blocks/folio-kit'
import { cn } from '@/lib/utils'

/** Split a comma list prop into trimmed items. */
const list = (value: string | undefined) =>
  (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export interface FolioHeroProps {
  /** editorial: narrow column over a dithered panel. split: copy left, live diagram right. statement: a big muted sentence with inked emphasis, plus stats. */
  variant?: 'editorial' | 'split' | 'statement'
  announcement?: string
  announcementLink?: string
  /** Wrap words in *asterisks* to ink them in the statement variant. */
  title?: string
  description?: string
  primaryCta?: string
  secondaryCta?: string
  /** Hatched copy-to-clipboard command under the buttons. Empty hides it. */
  command?: string
  /** Comma separated "works with" items. Empty hides the row. */
  worksWith?: string
  /** Dithered art: drifting field, a sphere or horizon waves. */
  art?: 'field' | 'orb' | 'wave'
  animate?: boolean
  className?: string
}

/** "a *b* c" → muted text with inked emphasis. */
function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith('*') ? (
          <span key={i} className="text-(--fo-ink)">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

const plain = (s: string) => s.replace(/\*/g, '')

function Actions({ primaryCta, secondaryCta, command }: Pick<FolioHeroProps, 'primaryCta' | 'secondaryCta' | 'command'>) {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2 sm:max-w-none">
      <div className="flex flex-col gap-2 sm:flex-row">
        {primaryCta && <FolioButton size="lg">{primaryCta}</FolioButton>}
        {secondaryCta && (
          <FolioButton variant="secondary" size="lg" className="justify-center">
            {secondaryCta}
          </FolioButton>
        )}
      </div>
      {command && <FolioCommand command={command} className="sm:max-w-[23rem]" />}
    </div>
  )
}

function WorksWith({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <FolioLabel>Works with</FolioLabel>
      {items.map((item) => (
        <span key={item} className="border border-(--fo-line) px-2 py-0.5 font-mono text-[11px] text-(--fo-soft)">
          {item}
        </span>
      ))}
    </div>
  )
}

/** A boxed icon centered on (x, y) in the 400x275 diagram space, label underneath. */
function Node({ x, y, label, active, children }: { x: number; y: number; label: string; active?: boolean; children?: ReactNode }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(x / 400) * 100}%`, top: `${(y / 275) * 100}%` }}>
      <div
        className={cn(
          'grid size-9 place-items-center border sm:size-11',
          active ? 'border-(--fo-blue) bg-(--fo-blue) text-(--fo-on-blue)' : 'border-(--fo-line-strong) bg-(--fo-well) text-(--fo-soft)',
        )}
      >
        {children}
      </div>
      <span
        className={cn(
          'absolute top-full left-1/2 mt-1.5 -translate-x-1/2 font-mono text-[8.5px] tracking-[0.12em] whitespace-nowrap uppercase sm:text-[9.5px]',
          active ? 'text-(--fo-blue)' : 'text-(--fo-faint)',
        )}
      >
        {label}
      </span>
    </div>
  )
}

const ICONS = {
  doc: <path d="M5 3h6l3 3v9H5zM8 9h4M8 12h3" />,
  grid: <path d="M3.5 3.5h5v5h-5zM11.5 3.5h5v5h-5zM3.5 11.5h5v5h-5zM11.5 11.5h5v5h-5z" />,
  link: <path d="M8.5 11.5l3-3M7 9.5L5.5 11a2.5 2.5 0 003.5 3.5l1.5-1.5M13 10.5l1.5-1.5A2.5 2.5 0 0011 5.5L9.5 7" />,
  stack: <path d="M4 6l6-3 6 3-6 3zM4 10l6 3 6-3M4 14l6 3 6-3" />,
  out: <path d="M4 4h12v12H4zM7 8h6M7 11h4" />,
}

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
      {ICONS[name]}
    </svg>
  )
}

/** Inputs feed a highlighted core, which writes to a registry and your app. Dashed links crawl. */
function Diagram({ animate }: { animate: boolean }) {
  const dash = cn('stroke-(--fo-line-strong) [stroke-dasharray:3_5]', animate && 'fo-anim [animation:fo-dash_1.2s_linear_infinite]')
  const pct = (x: number, y: number) => ({ left: `${(x / 400) * 100}%`, top: `${(y / 275) * 100}%` })
  return (
    <FolioFigure caption="Figure 1. Tokens, blocks and links flow into the kit, get composed, and land in the registry and your app as plain files.">
      <div className="relative aspect-[400/275] w-full">
        <svg viewBox="0 0 400 275" className="absolute inset-0 size-full" fill="none" aria-hidden>
          <path className={dash} vectorEffect="non-scaling-stroke" d="M92 70H125V205H92M92 137H155" />
          <path className={dash} vectorEffect="non-scaling-stroke" d="M245 137H290M290 95V190M290 95H308M290 190H308" />
        </svg>
        <span className="absolute -translate-x-1/2 font-mono text-[9px] tracking-[0.14em] text-(--fo-faint) uppercase" style={pct(70, 22)}>
          Sources
        </span>
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 border border-dashed border-(--fo-line-strong) bg-(--fo-paper)"
          style={{ ...pct(200, 137), width: '23%', height: '36%' }}
        >
          <span className="absolute -top-2 left-2 bg-(--fo-paper) px-1 font-mono text-[9px] tracking-[0.14em] uppercase">Kit</span>
        </div>
        <Node x={70} y={70} label="Tokens">
          <Icon name="doc" />
        </Node>
        <Node x={70} y={137} label="Blocks">
          <Icon name="grid" />
        </Node>
        <Node x={70} y={205} label="Links">
          <Icon name="link" />
        </Node>
        <Node x={200} y={130} label="Compose" active>
          <Icon name="stack" />
        </Node>
        <Node x={330} y={95} label="Registry">
          <Icon name="stack" />
        </Node>
        <Node x={330} y={190} label="Your app">
          <Icon name="out" />
        </Node>
      </div>
    </FolioFigure>
  )
}

/** Folio hero in three layouts. */
export function FolioHero({
  variant = 'editorial',
  announcement = 'New in the library',
  announcementLink = 'Read the note',
  title = 'shinUI is a free, growing kit of design tools for people who *ship* their own *interfaces*.',
  description = 'Backgrounds, components and blocks as plain React files. Copy them, install them, or pull them from the registry.',
  primaryCta = 'Start building',
  secondaryCta = 'Browse the library',
  command = 'npx shadcn add shinui/folio-hero',
  worksWith = 'React 19, Tailwind v4, Vite, Next.js',
  art = 'field',
  animate = true,
  className,
}: FolioHeroProps) {
  const head = 'text-[clamp(2rem,5vw,3.1rem)] leading-[1.08] font-normal tracking-[-0.03em] text-balance'

  if (variant === 'split') {
    return (
      <FolioRoot className={cn('w-full', className)}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1fr_1.05fr] md:px-10 md:py-24">
          <div className="flex flex-col items-start gap-7">
            {announcement && <FolioAnnouncement label={announcement} link={announcementLink} />}
            <h1 className={head}>{plain(title)}</h1>
            <p className="max-w-lg text-[16px] leading-relaxed text-(--fo-soft)">{description}</p>
            <Actions primaryCta={primaryCta} secondaryCta={secondaryCta} command={command} />
            <WorksWith items={list(worksWith)} />
          </div>
          <Diagram animate={animate} />
        </div>
      </FolioRoot>
    )
  }

  if (variant === 'statement') {
    return (
      <FolioRoot className={cn('w-full', className)}>
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <FolioLabel>{announcement}</FolioLabel>
          <div className="mt-5 grid items-end gap-10 md:grid-cols-[1.4fr_1fr]">
            <h1 className="text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.1] font-normal tracking-[-0.03em] text-balance text-(--fo-faint)">
              <Emphasis text={title} />
            </h1>
            <div className="relative aspect-square w-full max-w-72 justify-self-center md:justify-self-end">
              <DitherField shape="orb" cell={4} animate={animate} />
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-6 border-t border-(--fo-line) pt-8 md:flex-row md:items-start md:justify-between">
            <p className="max-w-md text-[15px] leading-relaxed text-(--fo-soft)">{description}</p>
            <Actions primaryCta={primaryCta} secondaryCta={secondaryCta} />
          </div>
          <dl className="mt-10 grid grid-cols-1 border border-(--fo-line) sm:grid-cols-3">
            {[
              ['Blocks', '40', '+'],
              ['Install', '1', 'cmd'],
              ['Price', '$0', ''],
            ].map(([label, value, unit], i) => (
              <div key={label} className={cn('p-5', i > 0 && 'border-t border-(--fo-line) sm:border-t-0 sm:border-l')}>
                <FolioLabel>
                  <dt>{label}</dt>
                </FolioLabel>
                <dd className="mt-3 text-[34px] leading-none tracking-[-0.03em]">
                  {value}
                  <span className="ml-0.5 text-[15px] text-(--fo-soft)">{unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </FolioRoot>
    )
  }

  return (
    <FolioRoot className={cn('w-full', className)}>
      <div className="mx-auto flex max-w-[44rem] flex-col items-start gap-7 px-6 py-16 md:py-20">
        {announcement && <FolioAnnouncement label={announcement} link={announcementLink} />}
        <h1 className={head}>{plain(title)}</h1>
        <p className="max-w-xl text-[16px] leading-relaxed text-(--fo-soft)">{description}</p>
        <Actions primaryCta={primaryCta} secondaryCta={secondaryCta} command={command} />
        <WorksWith items={list(worksWith)} />
        <div className="mt-6 aspect-[2.4/1] w-full overflow-hidden">
          <DitherField shape={art} cell={4} animate={animate} />
        </div>
      </div>
    </FolioRoot>
  )
}
