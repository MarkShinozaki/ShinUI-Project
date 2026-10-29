'use client'

import { DitherField, FolioLabel, FolioLink, FolioRoot, FolioSectionHead } from '@/registry/blocks/folio-kit'
import { cn } from '@/lib/utils'

export interface FolioFeaturesProps {
  /** list: dithered tiles beside short paragraphs. table: a ruled comparison. pipeline: one input, many outputs, in mono. */
  variant?: 'list' | 'table' | 'pipeline'
  eyebrow?: string
  title?: string
  lede?: string
  /** Cobalt relation tags in the pipeline variant. */
  showTags?: boolean
  animate?: boolean
  /** Column width: narrow (docs column) or wide. */
  width?: 'narrow' | 'wide'
  className?: string
}

const FEATURES = [
  {
    title: 'Original, not remixed.',
    body: 'Every block starts from a blank file and a single idea, then gets tuned in the studio until it holds up on a phone and in the dark.',
    shape: 'orb' as const,
  },
  {
    title: 'Plain files you own.',
    body: 'No runtime, no wrapper package. Each piece is one React file and a few tokens, so you can read it in a minute and change anything.',
    shape: 'field' as const,
  },
  {
    title: 'The boring parts, handled.',
    body: 'Responsive layouts, light and dark palettes, reduced motion and keyboard focus are done before anything ships to the registry.',
    shape: 'wave' as const,
  },
]

const ROWS: [string, string, string][] = [
  ['Starting point', 'A screenshot and a guess', 'A tuned, original block'],
  ['Ownership', 'Copied snippets', 'One file in your repo'],
  ['Theming', 'Hard-coded colors', 'Tokens, light and dark'],
  ['Updates', 'Hunt through old tabs', 'Re-run one install command'],
]

const OUTPUTS: [string, string?][] = [
  ['Hero, editorial layout'],
  ['Navbar with a scrollspy index', 'extends'],
  ['Dithered art panel', 'derived'],
  ['Footer with a writing list', 'pairs with'],
]

/** Folio content section in three variants. */
export function FolioFeatures({
  variant = 'list',
  eyebrow = 'What it is',
  title = 'A small library that keeps growing.',
  lede = 'Three rules sit behind every piece, so blocks you mix still look like they came from the same hand.',
  showTags = true,
  animate = true,
  width = 'narrow',
  className,
}: FolioFeaturesProps) {
  const wrap = cn('mx-auto px-6 py-12 md:py-14', width === 'narrow' ? 'max-w-[44rem]' : 'max-w-6xl md:px-10')

  return (
    <FolioRoot className={cn('w-full', className)}>
      <section className={wrap}>
        <FolioSectionHead eyebrow={eyebrow} title={title} lede={lede} />

        {variant === 'list' && (
          <ul className={cn('mt-10 grid gap-8', width === 'wide' && 'md:grid-cols-3')}>
            {FEATURES.map((f) => (
              <li key={f.title} className={cn('group flex gap-5', width === 'wide' && 'md:flex-col')}>
                <div className="size-14 shrink-0 overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5">
                  <DitherField shape={f.shape} cell={2} animate={animate} inverse />
                </div>
                <div>
                  <h3 className="text-[15.5px] font-medium tracking-[-0.01em]">{f.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-(--fo-soft)">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {variant === 'table' && (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-dashed border-(--fo-line-strong)">
                  <th className="w-[24%] py-3 font-normal" />
                  {['Without', 'With shinUI'].map((h, i) => (
                    <th key={h} className="py-3 pr-4 font-normal">
                      <FolioLabel className={cn(i === 1 && 'text-(--fo-blue)')}>{h}</FolioLabel>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, a, b]) => (
                  <tr key={label} className="border-b border-(--fo-line) transition-colors hover:bg-(--fo-tint)">
                    <th className="py-3.5 pr-4 font-medium">{label}</th>
                    <td className="py-3.5 pr-4 text-(--fo-faint) line-through decoration-(--fo-line-strong)">{a}</td>
                    <td className="py-3.5 pr-4 text-(--fo-soft)">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-6 text-[14.5px] leading-relaxed text-(--fo-soft)">
              Each block ships with its tokens, so it <FolioLink>inherits your theme</FolioLink> instead of fighting it.
            </p>
          </div>
        )}

        {variant === 'pipeline' && (
          <div className="mt-10 border border-(--fo-line) bg-(--fo-paper) p-5 font-mono text-[12px] leading-relaxed">
            <FolioLabel>One brief in</FolioLabel>
            <p className="mt-2 text-(--fo-soft)">
              “A calm landing page for a note-taking tool. Docs-like, lots of white, one accent color, nothing that glows.”
            </p>
            <FolioLabel className="mt-6">Four blocks out</FolioLabel>
            <ul className="mt-2">
              {OUTPUTS.map(([text, tag], i) => (
                <li
                  key={text}
                  className="flex items-center gap-3 border-b border-(--fo-line) py-2 last:border-b-0 [animation:fo-rise_.5s_ease-out_both] fo-anim"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <span className="w-4 text-(--fo-faint)">{i === OUTPUTS.length - 1 ? '→' : i + 1}</span>
                  <span>{text}</span>
                  {showTags && tag && <span className="text-(--fo-blue)">{tag}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </FolioRoot>
  )
}
