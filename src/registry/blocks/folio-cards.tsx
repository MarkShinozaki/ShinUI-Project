'use client'

import { ArrowUpRight, DitherField, FolioBrackets, FolioRoot, FolioSectionHead } from '@/registry/blocks/folio-kit'
import { cn } from '@/lib/utils'

export interface FolioCardsProps {
  /** numbered: three framed cards with dithered art and 001 indexes. index: a numbered reading list. */
  variant?: 'numbered' | 'index'
  eyebrow?: string
  title?: string
  lede?: string
  linkLabel?: string
  animate?: boolean
  width?: 'narrow' | 'wide'
  className?: string
}

const CARDS = [
  { title: 'In your repo', shape: 'field' as const },
  { title: 'In the registry', shape: 'orb' as const },
  { title: 'On your laptop', shape: 'wave' as const },
]

const POSTS = [
  'How a block goes from blank file to registry',
  'Dithering without images: pixels from a little math',
  'Why every Folio label is set in mono',
]

/** Folio card section: numbered showcase cards or a numbered index list. */
export function FolioCards({
  variant = 'numbered',
  eyebrow = 'Where it runs',
  title = 'Use it wherever your project lives.',
  lede = 'Each block is a plain file, so it works the same in a fresh Vite app, an old Next.js codebase or a weekend prototype.',
  linkLabel = 'See install options',
  animate = true,
  width = 'narrow',
  className,
}: FolioCardsProps) {
  const wrap = cn('mx-auto px-6 py-12 md:py-14', width === 'narrow' ? 'max-w-[44rem]' : 'max-w-6xl md:px-10')

  return (
    <FolioRoot className={cn('w-full', className)}>
      <section className={wrap}>
        <FolioSectionHead eyebrow={eyebrow} title={title} lede={lede} />
        {linkLabel && (
          <a href="#" className="mt-5 inline-flex items-center gap-1 text-[13.5px] font-medium transition-colors hover:text-(--fo-blue)">
            {linkLabel} <ArrowUpRight />
          </a>
        )}

        {variant === 'numbered' ? (
          <ol className="mt-8 grid gap-3 sm:grid-cols-3">
            {CARDS.map((c, i) => (
              <li key={c.title} className="group border border-(--fo-line) p-3 transition-colors duration-200 hover:border-(--fo-blue)">
                <div className="flex items-start justify-between gap-2 px-1 pt-1">
                  <h3 className="text-[14.5px] leading-snug font-medium">{c.title}</h3>
                  <span className="font-mono text-[10px] text-(--fo-faint) group-hover:text-(--fo-blue)">{String(i + 1).padStart(3, '0')}</span>
                </div>
                <div className="relative mt-4 aspect-[4/3.4] p-2.5">
                  <FolioBrackets />
                  <div className="size-full opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                    <DitherField shape={c.shape} cell={3} animate={animate} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="mt-8 border-t border-(--fo-line)">
            {POSTS.map((p, i) => (
              <li key={p}>
                <a href="#" className="group flex items-baseline gap-5 border-b border-(--fo-line) py-4 transition-colors duration-200 hover:bg-(--fo-tint)">
                  <span className="w-6 pl-1 font-mono text-[11px] text-(--fo-faint) group-hover:text-(--fo-blue)">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-[15px]">{p}</span>
                  <ArrowUpRight className="mr-2 text-(--fo-faint) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--fo-blue)" />
                </a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </FolioRoot>
  )
}
