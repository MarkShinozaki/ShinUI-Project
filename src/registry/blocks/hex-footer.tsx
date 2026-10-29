import { GridPaper, HexMark, Mono } from '@/registry/blocks/hex-kit'
import { cn } from '@/lib/utils'

export interface HexFooterProps {
  brand?: string
  className?: string
}

const COLS: [string, string[]][] = [
  ['Product', ['Notebooks', 'Ask', 'Apps', 'Models', 'Changelog']],
  ['Teams', ['Analysts', 'Product', 'Finance', 'Operations']],
  ['Learn', ['Docs', 'Guides', 'Templates', 'Community']],
  ['Company', ['About', 'Careers', 'Security', 'Contact']],
]

/** Brand cell, four link columns and a huge faded wordmark over graph paper. */
export function HexFooter({ brand = 'shinUI', className }: HexFooterProps) {
  return (
    <footer className={cn('relative isolate overflow-hidden border-t border-(--hx-line) px-6 pt-16', className)}>
      <GridPaper />
      <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <a href="#" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <HexMark /> {brand}
          </a>
          <p className="mt-3 max-w-[220px] text-[13px] leading-relaxed text-(--hx-dim)">A calmer place to work with data, together.</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-(--hx-line) bg-(--hx-paper) px-3 py-1 text-[11px] text-(--hx-dim)">
            <span className="size-1.5 rounded-full bg-(--hx-mint)" /> All systems normal
          </span>
        </div>
        {COLS.map(([h, ls]) => (
          <div key={h}>
            <Mono className="text-(--hx-faint)">{h}</Mono>
            <ul className="mt-4 space-y-2.5">
              {ls.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13.5px] text-(--hx-dim) transition-colors hover:text-(--hx-ink)">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div aria-hidden className="relative mt-16 text-center text-[clamp(5rem,19vw,15rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-transparent select-none" style={{ WebkitTextStroke: '1px var(--hx-line)' }}>
        {brand}
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-(--hx-line) py-5 font-mono text-[11px] text-(--hx-faint)">
        <span>© 2026 {brand}</span>
        <span className="flex gap-5">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Status</a>
        </span>
      </div>
    </footer>
  )
}
