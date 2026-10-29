import type { ReactNode } from 'react'
import { DiaHeading, Eyebrow } from '@/registry/blocks/dia-kit'
import { cn } from '@/lib/utils'

export interface DiaBentoProps {
  title?: string
  className?: string
}

function Card({ label, title, body, wide, children }: { label: string; title: string; body: string; wide?: boolean; children: ReactNode }) {
  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-(--di-line) bg-(--di-card) transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgb(60_40_0/0.45)]',
        wide && 'md:col-span-2',
      )}
    >
      <div className="relative h-44 overflow-hidden border-b border-(--di-line) bg-(--di-paper)">{children}</div>
      <div className="flex flex-col gap-1.5 p-5">
        <Eyebrow>{label}</Eyebrow>
        <h3 className="font-(family-name:--di-serif) text-[21px] tracking-tight">{title}</h3>
        <p className="text-[14px] leading-relaxed text-(--di-soft)">{body}</p>
      </div>
    </article>
  )
}

const pill = 'rounded-md border border-(--di-line) bg-(--di-card) px-2 py-1 text-[11px] shadow-sm'

export function DiaBento({ title = 'Shaped around a working day', className }: DiaBentoProps) {
  return (
    <section className={cn('px-6 py-24', className)}>
      <div className="mx-auto max-w-6xl">
        <DiaHeading className="text-center text-[34px] leading-tight sm:text-[42px]">{title}</DiaHeading>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <Card wide label="Spaces" title="Work, side project, home" body="Keep separate sets of tabs, sign-ins and history, and slide between them without logging out of anything.">
            <div className="absolute inset-0 flex items-center justify-center gap-3 p-6">
              {[
                ['Studio', 'bg-(--di-honey)'],
                ['Side quest', 'bg-(--di-lime)'],
                ['Home', 'bg-(--di-chip)'],
              ].map(([n, c], i) => (
                <div key={n} className={cn('flex h-28 w-36 flex-col justify-end rounded-xl p-3 text-[12px] font-medium transition-transform duration-500 group-hover:-translate-y-1', c)} style={{ transitionDelay: `${i * 60}ms` }}>
                  {n}
                </div>
              ))}
            </div>
          </Card>
          <Card label="Live props" title="Tweak, then copy" body="Change a block’s props in place and copy exactly what you see.">
            <div className="absolute inset-0 flex flex-col justify-center gap-2 px-8">
              {[72, 40, 88].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-(--di-chip)">
                  <div className="h-full rounded-full bg-(--di-ink) transition-[width] duration-700 group-hover:w-full" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
          </Card>
          <Card label="Side by side" title="Preview next to source" body="Split the window and your layout is remembered for next time.">
            <div className="absolute inset-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[linear-gradient(160deg,var(--di-honey),var(--di-cream))]" />
              <div className="space-y-1.5 rounded-lg border border-(--di-line) bg-(--di-card) p-3">
                {[90, 70, 80, 50, 65].map((w, i) => (
                  <div key={i} className="h-1 rounded bg-(--di-ink)/15" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </Card>
          <Card label="Before the call" title="The right page, already open" body="Meeting notes and the files under discussion open a minute early, with a quiet countdown.">
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-2">
                <span className="font-(family-name:--di-serif) text-[44px] leading-none tracking-tight">0:58</span>
                <span className={pill}>Design review · starting soon</span>
              </div>
            </div>
          </Card>
          <Card label="Tidy tabs" title="Named groups, not a strip of icons" body="Related tabs gather under one plain name so you see “Pricing page” instead of twelve favicons.">
            <div className="absolute inset-0 flex flex-col justify-center gap-2 px-6">
              {['Pricing page · 4', 'Footer kit · 3', 'Reading · 6'].map((g, i) => (
                <span key={g} className={cn(pill, 'w-fit transition-transform duration-500 group-hover:translate-x-2')} style={{ transitionDelay: `${i * 70}ms` }}>
                  {g}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
