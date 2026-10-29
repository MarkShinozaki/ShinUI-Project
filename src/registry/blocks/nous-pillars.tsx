import { Eyebrow, Halftone, type HalftoneShape } from '@/registry/blocks/nous-kit'
import { cn } from '@/lib/utils'

const PILLARS: { tag: string; title: string; body: string; shape: HalftoneShape }[] = [
  { tag: 'Open code', title: 'Every block ships as readable source', body: 'No black boxes. Copy a file, read it top to bottom, change what you like and keep it forever.', shape: 'ridge' },
  { tag: 'Craft', title: 'Detail where hands actually touch', body: 'Focus rings, pause-on-hover, reduced motion and keyboard paths are part of the block, not an afterthought.', shape: 'rings' },
  { tag: 'Research', title: 'Studying what makes pages feel alive', body: 'We take sites we admire apart, learn why they work, then build something new from the lesson.', shape: 'wave' },
]

export interface NousPillarsProps {
  animate?: boolean
  className?: string
}

/** Alternating rows: a short statement beside a blue halftone panel. */
export function NousPillars({ animate = true, className }: NousPillarsProps) {
  return (
    <section className={cn('mx-auto flex max-w-6xl flex-col gap-px border-y border-(--nr-line) bg-(--nr-line)', className)}>
      {PILLARS.map((p, i) => (
        <article key={p.tag} className="grid bg-(--nr-paper) md:grid-cols-2">
          <div className={cn('flex flex-col justify-center gap-3 p-8 md:p-12', i % 2 && 'md:order-2')}>
            <Eyebrow>{p.tag}</Eyebrow>
            <h3 className="max-w-[18ch] text-[26px] leading-tight font-light tracking-[-0.02em] text-(--nr-blue)">{p.title}</h3>
            <p className="max-w-[44ch] text-[13.5px] leading-relaxed text-(--nr-soft)">{p.body}</p>
          </div>
          <div className="relative min-h-56 overflow-hidden bg-(--nr-card)">
            <Halftone shape={p.shape} animate={animate} />
            <span className="absolute bottom-3 left-3 font-mono text-[10px] text-(--nr-blue)">FIG. 0{i + 1}</span>
          </div>
        </article>
      ))}
    </section>
  )
}
