'use client'

import { ContextMark, ContextRoot, Joint, Pill } from '@/registry/blocks/context-kit'
import { cn } from '@/lib/utils'

export interface ContextFooterProps {
  /** night: dark footer with link columns and a giant dotted wordmark. light: the same on paper. minimal: one row. */
  variant?: 'night' | 'light' | 'minimal'
  brand?: string
  tagline?: string
  /** Giant dotted word at the bottom (night/light). Empty hides it. */
  wordmark?: string
  status?: string
  className?: string
}

const COLUMNS: [string, string[]][] = [
  ['Library', ['Blocks', 'Backgrounds', 'Components', 'Pixel art', 'Pricing']],
  ['Developers', ['Docs', 'Registry', 'CLI', 'MCP server', 'Changelog']],
  ['Resources', ['Journal', 'Showcase', 'Guides', 'Free tools']],
  ['Studio', ['About', 'Contact', 'Press kit', 'License']],
]

const YEAR = new Date().getFullYear()

/** Context footer in three variants. */
export function ContextFooter({
  variant = 'night',
  brand = 'shinUI',
  tagline = 'Original blocks for people who ship. Search it, preview it, install it.',
  wordmark = 'shinui',
  status = 'All systems normal',
  className,
}: ContextFooterProps) {
  const night = variant === 'night'
  const tone = night ? '[--cx-paper:var(--cx-night)] [--cx-ink:var(--cx-night-ink)] [--cx-soft:rgb(244_244_245/0.62)] [--cx-faint:rgb(244_244_245/0.4)] [--cx-line:rgb(255_255_255/0.1)] [--cx-rail:rgb(255_255_255/0.1)]' : ''

  if (variant === 'minimal') {
    return (
      <ContextRoot className={cn('border-t border-(--cx-line)', className)}>
        <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-[12.5px] text-(--cx-soft) sm:flex-row sm:items-center sm:justify-between md:px-10">
          <a href="#" className="flex items-center gap-2 text-[14px] text-(--cx-ink)">
            <ContextMark />
            {brand}
          </a>
          <div className="flex flex-wrap gap-5">
            {['Docs', 'Pricing', 'Terms', 'Privacy'].map((l) => (
              <a key={l} href="#" className="hover:text-(--cx-ink)">
                {l}
              </a>
            ))}
          </div>
          <span>
            © {YEAR} {brand}
          </span>
        </footer>
      </ContextRoot>
    )
  }

  return (
    <ContextRoot className={cn(tone, 'overflow-hidden', className)}>
      <footer className="relative mx-auto max-w-6xl border-x border-(--cx-rail)">
        <div className="flex flex-col gap-6 px-6 pt-14 pb-8 md:flex-row md:items-start md:justify-between md:px-10">
          <div>
            <a href="#" className="flex items-center gap-2 text-[16px]">
              <ContextMark />
              {brand}
            </a>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-(--cx-soft)">{tagline}</p>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-(--cx-soft)">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#4ade80]" />
              {status}
            </span>
            <Pill variant="outline" className="h-8 border-(--cx-line) bg-transparent text-[12px]">
              Get updates
            </Pill>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 border-t border-(--cx-line) px-6 py-10 sm:grid-cols-4 md:px-10">
          {COLUMNS.map(([head, links]) => (
            <div key={head}>
              <p className="text-[13px] text-(--cx-ink)">{head}</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-[12.5px] text-(--cx-soft)">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="transition-colors hover:text-(--cx-ink)">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="relative flex flex-col gap-2 border-t border-(--cx-rail) px-6 py-4 text-[12px] text-(--cx-faint) sm:flex-row sm:justify-between md:px-10">
          <Joint className="top-0 left-0" />
          <Joint className="top-0 left-full" />
          <span>
            © {YEAR} {brand}
          </span>
          <span>Made with care, one block at a time</span>
          <span className="flex gap-4">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </span>
        </div>
      </footer>
      {wordmark && (
        <div className="border-t border-(--cx-rail)">
          <p
            aria-hidden
            className="mx-auto max-w-6xl bg-clip-text px-4 text-center text-[clamp(5rem,21vw,17rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-transparent select-none"
            style={{ backgroundImage: 'radial-gradient(var(--cx-soft) 1.4px, transparent 1.6px)', backgroundSize: '6px 6px' }}
          >
            {wordmark}
          </p>
        </div>
      )}
    </ContextRoot>
  )
}
