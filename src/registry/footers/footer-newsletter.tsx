'use client'

import { useId, useState, type FormEvent } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterNewsletterProps {
  brand?: string
  headline?: string
  accent?: string
  /** split: signup beside the columns. stacked: a full-width signup band above them. */
  layout?: 'split' | 'stacked'
  /** Paper-grain strength, 0 to 1. */
  noise?: number
  /** Trust badges row. */
  showBadges?: boolean
  /** "What's new" card. */
  showCard?: boolean
  className?: string
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")"

const BADGES = ['SOC 2 Type II', 'GDPR ready', 'ISO 27001', '99.99% uptime']

/** A paper-textured footer that leads with a newsletter signup, a trust row and a "what's new" card. */
export function FooterNewsletter({
  brand = 'lumen',
  headline = 'One useful email a month. No fluff.',
  accent = '#e8590c',
  layout = 'split',
  noise = 0.5,
  showBadges = true,
  showCard = true,
  className,
}: FooterNewsletterProps) {
  const inputId = useId()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (/.+@.+\..+/.test(email)) setSent(true)
  }

  const form = (
    <div className="flex flex-col items-start gap-4">
      <p className="font-display text-[clamp(1.5rem,2.6cqw,2rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-balance">{headline}</p>
      {sent ? (
        <p role="status" className="inline-flex h-11 items-center gap-2 rounded-full bg-(--ft-accent)/12 px-4 text-[14px] text-(--ft-accent)">
          ✓ You&apos;re on the list. Check your inbox.
        </p>
      ) : (
        <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor={inputId}>
            Email address
          </label>
          <input
            id={inputId}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="h-11 min-w-0 flex-1 rounded-full border border-(--ft-line) bg-(--ft-panel) px-4 text-[14px] outline-none placeholder:text-(--ft-faint) focus:border-(--ft-accent) focus:ring-4 focus:ring-(--ft-accent)/15"
          />
          <button type="submit" className="h-11 shrink-0 cursor-pointer rounded-full bg-(--ft-accent) px-5 text-[14px] font-medium text-white transition-transform active:scale-[0.97]">
            Subscribe
          </button>
        </form>
      )}
      <p className="text-[12px] text-(--ft-faint)">Unsubscribe in one click. We never share your address.</p>
    </div>
  )

  const card = showCard && (
    <a
      href="#"
      className="group flex items-center gap-4 rounded-2xl border border-(--ft-line) bg-(--ft-panel) p-3 pr-5 transition-colors hover:border-(--ft-accent)/50"
    >
      <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-xl bg-(--ft-accent) font-display text-xl font-bold text-white">
        2.4
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[11px] tracking-[0.12em] text-(--ft-faint) uppercase">What&apos;s new</span>
        <span className="truncate text-[14px] font-medium">Offline sync, faster search and a quieter inbox</span>
      </span>
      <span aria-hidden className="ml-auto text-(--ft-faint) transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </a>
  )

  return (
    <FooterRoot accent={accent} className={cn('bg-[#f6f1e9] dark:bg-[#15120f]', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 mix-blend-multiply dark:mix-blend-screen" style={{ backgroundImage: GRAIN, opacity: Math.max(0, Math.min(1, noise)) * 0.35 }} />
      <div className="mx-auto max-w-6xl px-6 pt-16 md:px-10 md:pt-20">
        {layout === 'stacked' ? (
          <>
            <div className="grid gap-8 rounded-3xl border border-(--ft-line) bg-(--ft-panel)/60 p-6 md:grid-cols-[1.3fr_1fr] md:items-center md:p-10">
              {form}
              {card}
            </div>
            <div className="mt-14 grid gap-10 md:grid-cols-[1fr_2fr]">
              <Brand brand={brand} />
              <FooterColumns />
            </div>
          </>
        ) : (
          <div className="grid gap-14 md:grid-cols-[1.2fr_2fr]">
            <div className="flex flex-col gap-8">
              <Brand brand={brand} />
              {form}
              {card}
            </div>
            <FooterColumns className="md:pt-12" />
          </div>
        )}
        {showBadges && (
          <ul className="mt-14 flex flex-wrap gap-2 border-t border-(--ft-line) pt-6">
            {BADGES.map((b) => (
              <li key={b} className="inline-flex items-center gap-1.5 rounded-full border border-(--ft-line) bg-(--ft-panel)/70 px-3 py-1 text-[12px] text-(--ft-soft)">
                <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 text-(--ft-accent)">
                  <path d="M8 1.5l5 2v4c0 3.2-2.1 5.6-5 7-2.9-1.4-5-3.8-5-7v-4z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <path d="M5.6 8.1l1.7 1.7 3.2-3.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
        <BottomBar brand={brand} className={cn(!showBadges && 'border-t border-(--ft-line) pt-5')} />
      </div>
    </FooterRoot>
  )
}
