'use client'

import { RomaButton, RomaMark, RomaRoot } from '@/registry/blocks/roma-kit'
import { cn } from '@/lib/utils'

export interface RomaFooterProps {
  /** statement: black footer with a giant serif slogan. simple: one line. columns: light link columns. */
  variant?: 'statement' | 'simple' | 'columns'
  brand?: string
  /** Separate the slogan's lines with ". " — each sentence gets its own line. */
  slogan?: string
  primaryCta?: string
  secondaryCta?: string
  className?: string
}

const YEAR = new Date().getFullYear()
const LINKS = ['Changelog', 'Blocks', 'Privacy', 'Terms', 'GitHub', 'X']
const COLUMNS: [string, string[]][] = [
  ['Product', ['Blocks', 'Families', 'CLI', 'Changelog']],
  ['Learn', ['Docs', 'Guides', 'Examples']],
  ['Company', ['About', 'Contact', 'Privacy']],
]

/** Roma footer in three variants. */
export function RomaFooter({
  variant = 'statement',
  brand = 'shinUI',
  slogan = 'Pick it. Tweak it. Ship it.',
  primaryCta = 'Browse blocks',
  secondaryCta = 'Install the CLI',
  className,
}: RomaFooterProps) {
  const lines = slogan.split(/(?<=[.!?])\s+/).filter(Boolean)
  const links = (cls: string) => (
    <div className={cn('flex flex-wrap gap-x-6 gap-y-2 text-[13px]', cls)}>
      {LINKS.map((l) => (
        <a key={l} href="#" className="transition-opacity hover:opacity-100">
          {l}
        </a>
      ))}
    </div>
  )

  if (variant === 'simple') {
    return (
      <RomaRoot className={cn('border-t border-(--rm-line)', className)}>
        <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
          <span className="flex items-center gap-2 font-display text-[17px] font-medium tracking-[-0.03em]">
            <RomaMark /> {brand}
          </span>
          {links('text-(--rm-soft) [&_a]:opacity-80')}
          <span className="text-[12px] text-(--rm-faint)">© {YEAR}</span>
        </footer>
      </RomaRoot>
    )
  }

  if (variant === 'columns') {
    return (
      <RomaRoot className={cn('bg-(--rm-card)', className)}>
        <footer className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-10">
          <div className="flex flex-col items-start gap-5">
            <span className="flex items-center gap-2 font-display text-[19px] font-medium tracking-[-0.03em]">
              <RomaMark /> {brand}
            </span>
            <p className="max-w-xs text-[14px] leading-relaxed text-(--rm-soft)">{slogan}</p>
            <RomaButton variant="black" className="h-9 text-[13px]">{primaryCta}</RomaButton>
          </div>
          {COLUMNS.map(([h, items]) => (
            <div key={h} className="text-[14px]">
              <p className="font-semibold">{h}</p>
              <ul className="mt-3 flex flex-col gap-2 text-(--rm-soft)">
                {items.map((i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-(--rm-ink)">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-[12px] text-(--rm-faint) md:col-span-4">© {YEAR} {brand}. Original blocks, MIT licensed.</p>
        </footer>
      </RomaRoot>
    )
  }

  return (
    <RomaRoot className={cn('bg-black text-white', className)}>
      <footer className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-24 pb-10 text-center md:px-10 md:pt-32">
        <p className="font-serif text-[clamp(3rem,11vw,8.5rem)] leading-[0.9] tracking-[-0.02em] uppercase">
          {lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {primaryCta && <RomaButton icon="laptop">{primaryCta}</RomaButton>}
          {secondaryCta && <RomaButton icon="arrow" className="bg-white/10 text-white">{secondaryCta}</RomaButton>}
        </div>
        <div className="mt-24 flex w-full flex-col items-center gap-4 border-t border-white/10 pt-6 md:flex-row md:justify-between">
          <span className="flex items-center gap-2 text-[14px]">
            <RomaMark /> {brand} © {YEAR}
          </span>
          {links('justify-center text-white/60 [&_a:hover]:text-white')}
        </div>
      </footer>
    </RomaRoot>
  )
}
