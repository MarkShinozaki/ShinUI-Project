import { Eyebrow, Rails } from '@/registry/blocks/aside-kit'
import { cn } from '@/lib/utils'

export interface AsideCapabilitiesProps {
  eyebrow?: string
  heading?: string
  animate?: boolean
  className?: string
}

const TILES = ['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#0ea5e9', '#111827', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#22c55e', '#e11d48', '#0f766e', '#a855f7', '#3b82f6']
const GLYPHS = ['M4 8h16M4 12h10M4 16h13', 'M5 5h14v14H5z', 'M12 4l8 16H4z', 'M12 4a8 8 0 1 0 0.01 0', 'M4 12h16M12 4v16', 'M5 17 10 7l4 7 2-3 3 6']

const CARDS: [string, string, string][] = [
  ['Signing in', 'Works inside the accounts you already use, from mail to dashboards.', 'linear-gradient(135deg,#fde2f3,#e0e7ff)'],
  ['Messages', 'Drafts replies and follow-ups, then waits for your nod.', 'linear-gradient(135deg,#dcfce7,#e0f2fe)'],
  ['Files', 'Opens, edits and saves the documents on your machine.', 'linear-gradient(135deg,#fef3c7,#fce7f3)'],
]

/** A drifting wall of app tiles above three cards with tinted previews. */
export function AsideCapabilities({ eyebrow = 'No integrations needed', heading = 'If you can click it, it can do it.', animate = true, className }: AsideCapabilitiesProps) {
  return (
    <section className={className}>
      <Rails className="bg-(--as-soft) px-6 py-24 text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mx-auto mt-4 max-w-xl text-[clamp(1.9rem,4vw,3rem)] leading-[1.08] font-medium tracking-[-0.035em]">{heading}</h2>
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-8 gap-3 max-sm:grid-cols-4">
          {TILES.map((c, i) => (
            <span
              key={c + i}
              aria-hidden
              className="grid aspect-square place-items-center rounded-[22%] shadow-[0_10px_20px_-12px_rgba(0,0,0,0.45)]"
              style={{ background: c, animation: animate ? `as-bob ${3 + (i % 4) * 0.6}s ${-(i % 5) * 0.7}s ease-in-out infinite` : undefined, marginTop: i % 2 ? 18 : 0 }}
            >
              <svg viewBox="0 0 24 24" className="size-1/2 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={GLYPHS[i % GLYPHS.length]} />
              </svg>
            </span>
          ))}
        </div>
        <div className="mt-16 grid gap-4 text-left md:grid-cols-3">
          {CARDS.map(([t, d, bg]) => (
            <div key={t} className="overflow-hidden rounded-xl border border-(--as-line) bg-white">
              <div className="grid h-36 place-items-center" style={{ background: bg }}>
                <div className="w-3/4 space-y-1.5 rounded-lg bg-white/80 p-3 shadow-sm">
                  <span className="block h-1.5 w-2/3 rounded bg-black/15" />
                  <span className="block h-1.5 w-1/2 rounded bg-black/10" />
                  <span className="block h-1.5 w-3/4 rounded bg-black/10" />
                </div>
              </div>
              <p className={cn('p-4 text-[13.5px] leading-relaxed text-(--as-dim)')}>
                <b className="font-medium text-(--as-ink)">{t}</b> {d}
              </p>
            </div>
          ))}
        </div>
      </Rails>
    </section>
  )
}
