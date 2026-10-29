import { Eyebrow, Rails } from '@/registry/blocks/aside-kit'

export interface AsidePrivacyProps {
  eyebrow?: string
  heading?: string
  className?: string
}

const ITEMS: [string, string, string][] = [
  ['Locked by default', 'New logins and payments always wait for your approval.', 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z'],
  ['Stays on device', 'Memory and history are stored locally and never sold.', 'M4 6h16v10H4zM9 20h6M12 16v4'],
  ['Sign in your way', 'Use passkeys or a password manager. We never see either.', 'M14 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM10 12l-6 6v2h3v-2h2v-2h2'],
  ['Bring your own key', 'Point it at the model provider you already pay for.', 'M12 3l7 4v5c0 4-3 7-7 9-4-2-7-5-7-9V7z'],
]

/** Centred heading over four quiet cards, each with a line icon. */
export function AsidePrivacy({ eyebrow = 'Private by design', heading = 'Safe enough for your real accounts.', className }: AsidePrivacyProps) {
  return (
    <section className={className}>
      <Rails className="bg-(--as-soft) px-6 py-24 text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mx-auto mt-4 max-w-lg text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.1] font-medium tracking-[-0.035em]">{heading}</h2>
        <div className="mt-14 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(([t, d, path]) => (
            <div key={t} className="rounded-xl border border-(--as-line) bg-white p-5">
              <div className="grid h-24 place-items-center rounded-lg bg-(--as-soft)">
                <svg viewBox="0 0 24 24" aria-hidden className="size-9 text-(--as-ink)" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d={path} />
                </svg>
              </div>
              <p className="mt-4 text-[13.5px] leading-relaxed text-(--as-dim)">
                <b className="font-medium text-(--as-ink)">{t}</b> {d}
              </p>
            </div>
          ))}
        </div>
      </Rails>
    </section>
  )
}
