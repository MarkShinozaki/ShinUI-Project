import { Card, Mono, Serif } from '@/registry/blocks/hex-kit'
import { cn } from '@/lib/utils'

export interface HexIntegrationsProps {
  heading?: string
  accent?: string
  className?: string
}

const ITEMS: [string, string, 'stack' | 'tags' | 'plug' | 'git' | 'flow' | 'api'][] = [
  ['Runs on your warehouse', 'Queries go straight to where the data lives. Nothing is copied out.', 'stack'],
  ['Brings your definitions', 'Pull metrics and docs from the tools that already describe them.', 'tags'],
  ['Connects in a minute', 'Paste a connection string or sign in. Permissions carry over.', 'plug'],
  ['Versioned like code', 'Branch, review and roll back any notebook or app.', 'git'],
  ['Schedules and alerts', 'Refresh on a timer and ping a channel when a number moves.', 'flow'],
  ['Open API', 'Trigger runs and read results from your own services.', 'api'],
]

function Glyph({ k }: { k: (typeof ITEMS)[number][2] }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  const g = {
    stack: <><ellipse cx="40" cy="14" rx="16" ry="5" {...s} /><path d="M24 14v20c0 3 7 5 16 5s16-2 16-5V14M24 24c0 3 7 5 16 5s16-2 16-5" {...s} /></>,
    tags: <><rect x="12" y="10" width="26" height="12" rx="6" {...s} /><rect x="42" y="10" width="26" height="12" rx="6" {...s} /><rect x="26" y="28" width="28" height="12" rx="6" {...s} /></>,
    plug: <><path d="M14 25h18M48 25h18" {...s} /><rect x="32" y="17" width="16" height="16" rx="3" {...s} /><circle cx="14" cy="25" r="3" {...s} /><circle cx="66" cy="25" r="3" {...s} /></>,
    git: <><circle cx="22" cy="12" r="3.5" {...s} /><circle cx="22" cy="38" r="3.5" {...s} /><circle cx="56" cy="20" r="3.5" {...s} /><path d="M22 15.5v19M56 23.5c0 9-34 4-34 11" {...s} /></>,
    flow: <><rect x="8" y="18" width="18" height="14" rx="2" {...s} /><rect x="54" y="8" width="18" height="12" rx="2" {...s} /><rect x="54" y="30" width="18" height="12" rx="2" {...s} /><path d="M26 25h12M38 25V14h16M38 25v11h16" {...s} /></>,
    api: <><path d="M20 14l-8 11 8 11M60 14l8 11-8 11M46 10 34 40" {...s} /></>,
  }[k]
  return <svg viewBox="0 0 80 50" aria-hidden className="h-14 w-24 text-(--hx-violet)">{g}</svg>
}

/** Six even cards, each with a small line drawing above a title and a line of copy. */
export function HexIntegrations({ heading = 'Fits into the stack', accent = 'you already have', className }: HexIntegrationsProps) {
  return (
    <section className={cn('px-6 py-24', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Mono className="text-(--hx-faint)">Integrations</Mono>
          <h2 className="mt-3 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
            {heading} <Serif>{accent}</Serif>
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(([t, d, k]) => (
            <Card key={t} className="group p-5 transition-transform duration-300 hover:-translate-y-0.5">
              <div className="grid h-28 place-items-center rounded border border-dashed border-(--hx-line) bg-(--hx-bg)">
                <Glyph k={k} />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{t}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-(--hx-dim)">{d}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
