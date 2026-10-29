'use client'

import { OroButton, OroHeading, OroMark, OroRoot } from '@/registry/blocks/oro-kit'
import { cn } from '@/lib/utils'

export interface OroFooterProps {
  /** cta: dark green call-to-action card, a "backed by" row and a slim bar. simple: the slim bar only. columns: link columns on sand. */
  variant?: 'cta' | 'simple' | 'columns'
  brand?: string
  ctaTitle?: string
  ctaBody?: string
  ctaLabel?: string
  /** Comma separated names for the "backed by" row (cta). Empty hides it. */
  backers?: string
  className?: string
}

const YEAR = new Date().getFullYear()

function Bar({ brand }: { brand: string }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-6 text-[13px] text-(--oro-soft) sm:flex-row sm:justify-between md:px-8">
      <a href="#" aria-label={brand} className="text-(--oro-ink)">
        <OroMark className="h-4 w-10" />
      </a>
      <div className="flex gap-5">
        {['Journal', 'Privacy', 'Terms', 'GitHub'].map((l) => (
          <a key={l} href="#" className="transition-colors hover:text-(--oro-ink)">
            {l}
          </a>
        ))}
      </div>
      <span className="text-[12px]">
        © {YEAR} {brand}
      </span>
    </div>
  )
}

/** ORO footer in three variants. */
export function OroFooter({
  variant = 'cta',
  brand = 'shinui',
  ctaTitle = 'See how your pages score.',
  ctaBody = 'Tell us what you are building. We will send back the blocks that won on briefs like yours.',
  ctaLabel = 'Request a sample',
  backers = 'Northwind, Paperlane, Tidepool, Kiln & Co',
  className,
}: OroFooterProps) {
  if (variant === 'simple') {
    return (
      <OroRoot className={cn('border-t border-(--oro-line)', className)}>
        <Bar brand={brand} />
      </OroRoot>
    )
  }

  if (variant === 'columns') {
    return (
      <OroRoot className={cn('bg-(--oro-sand)', className)}>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
          <div>
            <a href="#" className="flex items-center gap-2 font-display text-[22px] font-semibold tracking-[-0.03em]">
              <OroMark />
              {brand}
            </a>
            <p className="mt-4 max-w-xs text-[14px] text-(--oro-soft)">Blocks that won on real pages, free to use.</p>
          </div>
          {[
            ['Library', ['Blocks', 'Backgrounds', 'Pixel art']],
            ['Research', ['Method', 'Rounds', 'Data']],
            ['Studio', ['Journal', 'Contact', 'License']],
          ].map(([h, ls]) => (
            <div key={h as string}>
              <p className="font-display text-[14px] font-bold">{h as string}</p>
              <ul className="mt-4 space-y-2.5 text-[14px] text-(--oro-soft)">
                {(ls as string[]).map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-(--oro-ink)">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-(--oro-line)">
          <Bar brand={brand} />
        </div>
      </OroRoot>
    )
  }

  const names = backers
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    <OroRoot className={className}>
      <div className="mx-auto max-w-6xl px-6 pt-16 md:px-8">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-(--oro-panel) px-6 py-14 text-center text-(--oro-panel-ink) md:px-16">
          <div aria-hidden className="absolute -right-16 -bottom-20 size-56 rounded-full opacity-40 blur-3xl" style={{ background: 'var(--oro-amber)' }} />
          <OroHeading className="relative text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05]">{ctaTitle}</OroHeading>
          <p className="relative mx-auto mt-4 max-w-md text-[16px] text-white/75">{ctaBody}</p>
          <OroButton variant="light" className="relative mt-8">
            {ctaLabel}
          </OroButton>
        </div>
        {names.length > 0 && (
          <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-5 border-t border-(--oro-line) pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10.5px] tracking-wider text-(--oro-orange) uppercase">Trusted by</p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {names.map((n) => (
                <span key={n} className="font-display text-[16px] font-bold tracking-[-0.02em] text-(--oro-ink)/60">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-14 border-t border-(--oro-line)">
        <Bar brand={brand} />
      </div>
    </OroRoot>
  )
}
