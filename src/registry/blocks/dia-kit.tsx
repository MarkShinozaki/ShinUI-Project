'use client'

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Dia Kit: shared pieces behind the shinUI "Dia" blocks.
 *
 * A calm, sunlit workday look: warm paper background, a honey-gold glow that
 * rises behind the hero, soft serif headlines with tight tracking over a
 * plain sans body, ink pill buttons, white cards with hairline borders, and
 * a browser window mockup built in plain markup. Wrap blocks in <DiaRoot>.
 */

const VARS = [
  '[--di-paper:#fbfaf6] [--di-card:#ffffff] [--di-ink:#1b1a17] [--di-soft:rgb(27_26_23/0.64)] [--di-faint:rgb(27_26_23/0.42)] [--di-line:rgb(27_26_23/0.09)]',
  '[--di-sun:#ffc93d] [--di-honey:#ffe27a] [--di-cream:#fff4cc] [--di-chip:#f2f0e8] [--di-lime:#eef9b8]',
  '[--di-serif:ui-serif,"Iowan_Old_Style","Palatino_Linotype",Georgia,serif]',
  'dark:[--di-paper:#14130f] dark:[--di-card:#1d1c17] dark:[--di-ink:#f6f3ea] dark:[--di-soft:rgb(246_243_234/0.66)] dark:[--di-faint:rgb(246_243_234/0.42)] dark:[--di-line:rgb(255_255_255/0.09)]',
  'dark:[--di-sun:#e2a516] dark:[--di-honey:#8a6a1c] dark:[--di-cream:#2a2416] dark:[--di-chip:#24221c] dark:[--di-lime:#2e3315]',
].join(' ')

const KEYFRAMES = `
@keyframes di-drift{0%,100%{transform:translate3d(-3%,0,0) scale(1)}50%{transform:translate3d(3%,-4%,0) scale(1.06)}}
@keyframes di-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes di-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes di-caret{50%{opacity:0}}
@keyframes di-fill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@media (prefers-reduced-motion:reduce){.di-anim{animation:none!important}}
`

export function DiaRoot({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(VARS, 'bg-(--di-paper) font-sans text-(--di-ink) antialiased', className)} {...props}>
      <style>{KEYFRAMES}</style>
      {children}
    </div>
  )
}

/** Soft serif headline with tight tracking. */
export function DiaHeading({ as: Tag = 'h2', className, children }: { as?: 'h1' | 'h2' | 'h3'; className?: string; children: ReactNode }) {
  return <Tag className={cn('font-(family-name:--di-serif) font-normal tracking-[-0.035em] text-balance', className)}>{children}</Tag>
}

/** Splits on "\n" so authors control line breaks. */
export function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </>
  )
}

export function DiaButton({ variant = 'ink', className, children, ...props }: ComponentProps<'a'> & { variant?: 'ink' | 'light' | 'ghost' }) {
  return (
    <a
      href="#"
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-[14px] font-medium whitespace-nowrap transition-[transform,background-color,box-shadow] duration-300 ease-out hover:-translate-y-px active:translate-y-0 focus-visible:ring-2 focus-visible:ring-(--di-sun) focus-visible:outline-none',
        variant === 'ink' && 'bg-(--di-ink) text-(--di-paper) shadow-[0_10px_24px_-12px_rgb(0_0_0/0.5)] hover:shadow-[0_16px_30px_-14px_rgb(0_0_0/0.55)]',
        variant === 'light' && 'border border-(--di-line) bg-(--di-card) text-(--di-ink)',
        variant === 'ghost' && 'px-3 text-(--di-soft) hover:text-(--di-ink)',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

/** Original mark: a half sun resting on a line. */
export function DiaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn('size-5', className)} fill="none" aria-hidden>
      <path d="M3.5 13a6.5 6.5 0 0113 0z" fill="currentColor" />
      <path d="M1.5 15.5h17" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  )
}

/** A warm glow that slowly drifts, with a cream horizon curve at the bottom. */
export function Sunrise({ animate = true, horizon = true, className }: { animate?: boolean; horizon?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--di-sun)_0%,var(--di-honey)_45%,var(--di-cream)_80%)]" />
      <div
        className={cn('absolute -inset-x-1/4 top-[10%] h-[80%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255/0.75),transparent)] blur-2xl', animate && 'di-anim')}
        style={{ animation: animate ? 'di-drift 14s ease-in-out infinite' : undefined }}
      />
      <div
        className={cn('absolute -right-1/4 -bottom-1/4 size-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(255_170_0/0.45),transparent)] blur-3xl', animate && 'di-anim')}
        style={{ animation: animate ? 'di-drift 18s ease-in-out -6s infinite reverse' : undefined }}
      />
      {horizon && <div className="absolute -inset-x-[20%] -bottom-[38%] h-[60%] rounded-[50%] bg-(--di-paper)" />}
    </div>
  )
}

/** A browser window with traffic lights and a tab strip; content is yours. */
export function WindowFrame({ tabs = ['Today'], active = 0, className, children }: { tabs?: string[]; active?: number; className?: string; children: ReactNode }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-(--di-line) bg-(--di-card) shadow-[0_40px_90px_-40px_rgb(60_40_0/0.45)]', className)}>
      <div className="flex items-center gap-3 border-b border-(--di-line) bg-(--di-chip) px-3 py-2">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-(--di-ink)/15" />
          ))}
        </span>
        <span className="flex min-w-0 gap-1">
          {tabs.map((t, i) => (
            <span key={t} className={cn('truncate rounded-md px-2.5 py-1 text-[11px]', i === active ? 'bg-(--di-card) text-(--di-ink) shadow-sm' : 'text-(--di-faint)')}>
              {t}
            </span>
          ))}
        </span>
      </div>
      {children}
    </div>
  )
}

/** Small mono label used for numbers and eyebrows. */
export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn('font-mono text-[11px] tracking-[0.14em] text-(--di-faint) uppercase', className)}>{children}</span>
}
