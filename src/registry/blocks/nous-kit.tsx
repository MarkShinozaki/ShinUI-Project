'use client'

import { useEffect, useState, type CSSProperties, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Nous Kit: shared pieces behind the shinUI "Nous" blocks.
 *
 * A two-colour research-lab look: cool paper and one electric blue, very tall
 * stretched uppercase display type, mono eyebrows, hairline rules, and
 * halftone dot fields (pure CSS, masked into shapes) instead of images.
 * Wrap blocks in <NousRoot>.
 */

const VARS = [
  '[--nr-paper:#f2f2ef] [--nr-card:#ffffff] [--nr-blue:#1f1fff] [--nr-blue-ink:#0b0bb8] [--nr-on-blue:#f4f4ff]',
  '[--nr-ink:#10104a] [--nr-soft:rgb(16_16_74/0.66)] [--nr-line:rgb(31_31_255/0.18)]',
  'dark:[--nr-paper:#07072a] dark:[--nr-card:#0d0d3a] dark:[--nr-blue:#5a5aff] dark:[--nr-blue-ink:#8c8cff] dark:[--nr-on-blue:#07072a]',
  'dark:[--nr-ink:#e9e9ff] dark:[--nr-soft:rgb(233_233_255/0.66)] dark:[--nr-line:rgb(140_140_255/0.22)]',
].join(' ')

const KEYFRAMES = `
@keyframes nr-drift{0%,100%{-webkit-mask-position:0% 50%;mask-position:0% 50%}50%{-webkit-mask-position:100% 50%;mask-position:100% 50%}}
@keyframes nr-caret{50%{opacity:0}}
@keyframes nr-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.nr-anim{animation:none!important;transition:none!important}}
`

export function NousRoot({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(VARS, 'bg-(--nr-paper) font-sans text-(--nr-ink) antialiased selection:bg-(--nr-blue) selection:text-(--nr-on-blue)', className)} {...props}>
      <style>{KEYFRAMES}</style>
      {children}
    </div>
  )
}

/**
 * Very tall uppercase display type. The stretch is a vertical scale on a light
 * sans, so no special font is needed; `stretch` sets how tall it gets.
 */
export function NousDisplay({ as: Tag = 'h2', stretch = 1.7, align = 'center', className, children }: { as?: 'h1' | 'h2' | 'h3' | 'p'; stretch?: number; align?: 'center' | 'left'; className?: string; children: ReactNode }) {
  return (
    <Tag className={cn('leading-none font-extralight tracking-[-0.06em] text-(--nr-blue) uppercase', align === 'center' ? 'text-center' : 'text-left', className)} style={{ paddingTop: `${(stretch - 1) * 0.8 + 0.05}em`, marginBottom: `-${0.2 * stretch}em` }}>
      <span className={cn('inline-block', align === 'center' ? 'origin-bottom' : 'origin-bottom-left')} style={{ transform: `scaleY(${stretch})` }}>
        {children}
      </span>
    </Tag>
  )
}

export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn('font-mono text-[10.5px] tracking-[0.16em] text-(--nr-blue) uppercase', className)}>{children}</span>
}

export function NousButton({ variant = 'solid', className, children, ...props }: ComponentProps<'a'> & { variant?: 'solid' | 'outline' | 'paper' }) {
  return (
    <a
      href="#"
      className={cn(
        'inline-flex h-9 items-center justify-center gap-2 px-4 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--nr-blue)',
        variant === 'solid' && 'bg-(--nr-blue) text-(--nr-on-blue) hover:bg-(--nr-blue-ink)',
        variant === 'outline' && 'border border-(--nr-blue) text-(--nr-blue) hover:bg-(--nr-blue) hover:text-(--nr-on-blue)',
        variant === 'paper' && 'bg-(--nr-on-blue) text-(--nr-blue) hover:opacity-85',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}

/** Original monogram: a stretched N in a square with a corner notch. */
export function NousMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 40" aria-hidden className={cn('h-8 w-auto text-(--nr-blue)', className)}>
      <path d="M1 1h24l6 6v32H1z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 31V9l16 22V9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="bevel" />
      <path d="M25 1v6h6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

const SHAPES = {
  glow: 'radial-gradient(60% 70% at 50% 60%, #000 0%, rgb(0 0 0/0.55) 45%, transparent 75%)',
  ridge: 'linear-gradient(160deg, transparent 20%, #000 48%, rgb(0 0 0/0.35) 62%, transparent 85%), radial-gradient(40% 50% at 70% 40%, #000, transparent 70%)',
  rings: 'repeating-radial-gradient(circle at 30% 70%, #000 0 14px, transparent 14px 30px)',
  wave: 'repeating-linear-gradient(115deg, #000 0 18px, rgb(0 0 0/0.25) 18px 36px, transparent 36px 60px)',
  fade: 'linear-gradient(180deg, transparent, #000 70%)',
} as const
export type HalftoneShape = keyof typeof SHAPES

/**
 * A halftone dot field masked into a shape: the stand-in for dithered
 * imagery. Two dot sizes are layered so the tone varies. Purely decorative.
 */
export function Halftone({ shape = 'glow', animate = true, dot = 1.2, gap = 7, className, style }: { shape?: HalftoneShape; animate?: boolean; dot?: number; gap?: number; className?: string; style?: CSSProperties }) {
  const mask = SHAPES[shape]
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', animate && 'nr-anim', className)}
      style={{
        backgroundImage: `radial-gradient(circle, var(--nr-blue) ${dot}px, transparent ${dot + 0.7}px), radial-gradient(circle, var(--nr-blue) ${dot * 0.55}px, transparent ${dot * 0.55 + 0.6}px)`,
        backgroundSize: `${gap}px ${gap}px, ${gap}px ${gap}px`,
        backgroundPosition: `0 0, ${gap / 2}px ${gap / 2}px`,
        maskImage: mask,
        WebkitMaskImage: mask,
        maskSize: '200% 100%',
        WebkitMaskSize: '200% 100%',
        animation: animate ? 'nr-drift 18s ease-in-out infinite' : undefined,
        ...style,
      }}
    />
  )
}

/** Types each string, holds, erases, moves to the next. Static under reduced motion. */
export function useCycleTyped(list: string[], animate = true) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  const [back, setBack] = useState(false)
  const [still, setStill] = useState(!animate)
  const word = list[i % list.length] ?? ''
  useEffect(() => {
    if (still || !word) return
    const t = setTimeout(
      () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setStill(true)
        if (!back && n < word.length) setN(n + 1)
        else if (!back) setBack(true)
        else if (n > 0) setN(n - 1)
        else {
          setBack(false)
          setI(i + 1)
        }
      },
      !back && n === word.length ? 1800 : back ? 18 : 42,
    )
    return () => clearTimeout(t)
  }, [n, back, word, i, still])
  return { text: still ? word : word.slice(0, n), typing: !still }
}

/** A command bar: a square glyph, a typed question and a key hint. */
export function CommandBar({ questions = ['Which block fits a pricing page?'], animate = true, className }: { questions?: string[]; animate?: boolean; className?: string }) {
  const { text, typing } = useCycleTyped(questions, animate)
  return (
    <div className={cn('flex h-10 w-full max-w-xl items-center gap-3 border border-(--nr-line) bg-(--nr-card) px-3 shadow-[0_10px_30px_-18px_var(--nr-blue)]', className)}>
      <NousMark className="h-4" />
      <span className="min-w-0 flex-1 truncate text-left text-[13px] text-(--nr-soft)">
        <span className="sr-only">Example question: </span>
        {text}
        {typing && <span aria-hidden className="nr-anim ml-px inline-block h-3.5 w-px translate-y-0.5 bg-(--nr-blue) [animation:nr-caret_1s_steps(1)_infinite]" />}
      </span>
      <kbd className="border border-(--nr-line) px-1.5 py-0.5 font-mono text-[10px] text-(--nr-blue)">⌘K</kbd>
    </div>
  )
}
