'use client'

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Folio Kit: the shared pieces behind the shinUI "Folio" blocks.
 *
 * Folio is an editorial, docs-like look: white paper, near-black ink stepped
 * down with opacity instead of grays, one cobalt accent, square corners,
 * hairline rules, tiny uppercase mono labels and dithered pixel art instead
 * of gradients or glows. Wrap a page (or a single block) in <FolioRoot> to
 * get the palette, then use the helpers below.
 *
 *   <FolioRoot>
 *     <FolioLabel>Section</FolioLabel>
 *     <FolioButton icon>Get started</FolioButton>
 *   </FolioRoot>
 */

/** Palette as CSS variables, light and dark. Everything Folio reads `--fo-*`. */
const FOLIO_VARS = cn(
  '[--fo-paper:#ffffff] [--fo-ink:#0b1015] [--fo-blue:#0562ef] [--fo-blue-press:#0446c9] [--fo-on-blue:#ffffff]',
  '[--fo-soft:rgb(11_16_21/0.66)] [--fo-faint:rgb(11_16_21/0.45)] [--fo-line:rgb(11_16_21/0.12)] [--fo-line-strong:rgb(11_16_21/0.22)]',
  '[--fo-tint:rgb(5_98_239/0.07)] [--fo-tint-strong:rgb(5_98_239/0.14)] [--fo-well:#f4f5f7] [--fo-ok:#10a86a]',
  'dark:[--fo-paper:#0a0d12] dark:[--fo-ink:#e9edf3] dark:[--fo-blue:#4a8bff] dark:[--fo-blue-press:#2f74f5] dark:[--fo-on-blue:#ffffff]',
  'dark:[--fo-soft:rgb(233_237_243/0.68)] dark:[--fo-faint:rgb(233_237_243/0.44)] dark:[--fo-line:rgb(233_237_243/0.12)] dark:[--fo-line-strong:rgb(233_237_243/0.24)]',
  'dark:[--fo-tint:rgb(74_139_255/0.1)] dark:[--fo-tint-strong:rgb(74_139_255/0.2)] dark:[--fo-well:#12161d] dark:[--fo-ok:#2fd18e]',
)

const KEYFRAMES = `
@keyframes fo-pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes fo-rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes fo-dash{to{stroke-dashoffset:-16}}
@media (prefers-reduced-motion:reduce){.fo-anim{animation:none!important}}
`

/** Sets the Folio palette, paper and ink. Renders the keyframes once per root. */
export function FolioRoot({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(FOLIO_VARS, 'bg-(--fo-paper) font-sans text-(--fo-ink) antialiased', className)} {...props}>
      <style>{KEYFRAMES}</style>
      {children}
    </div>
  )
}

/** Tiny uppercase mono label: eyebrows, table heads, captions. */
export function FolioLabel({ className, children, ...props }: ComponentProps<'p'>) {
  return (
    <p className={cn('font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase', className)} {...props}>
      {children}
    </p>
  )
}

/** A full-width hairline. */
export function FolioRule({ dashed, className }: { dashed?: boolean; className?: string }) {
  return <hr className={cn('border-0 border-t border-(--fo-line)', dashed && 'border-dashed', className)} />
}

/** Four small L-shaped corners, like crop marks. Parent must be `relative`. */
export function FolioBrackets({ className, inset = 0 }: { className?: string; inset?: number }) {
  const base = 'pointer-events-none absolute size-2.5 border-(--fo-line-strong)'
  const s = { margin: inset }
  return (
    <span aria-hidden className={cn('pointer-events-none absolute inset-0', className)}>
      <span style={s} className={cn(base, 'top-0 left-0 border-t border-l')} />
      <span style={s} className={cn(base, 'top-0 right-0 border-t border-r')} />
      <span style={s} className={cn(base, 'bottom-0 left-0 border-b border-l')} />
      <span style={s} className={cn(base, 'right-0 bottom-0 border-r border-b')} />
    </span>
  )
}

/** The Folio mark: an original folded-corner page glyph. */
export function FolioMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn('size-5', className)} aria-hidden>
      <path d="M3 2h9l5 5v11H3z" fill="currentColor" />
      <path d="M12 2v5h5" fill="var(--fo-paper)" opacity={0.85} />
      <path d="M6 11h8M6 14h5" stroke="var(--fo-paper)" strokeWidth={1.4} />
    </svg>
  )
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={cn('size-3', className)} fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
      <path d="M3.5 8.5l5-5M4.5 3.5h4v4" />
    </svg>
  )
}

export function SparkGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn('size-4', className)} fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
      <path d="M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2" />
    </svg>
  )
}

interface FolioButtonProps extends ComponentProps<'a'> {
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Primary: shows a glyph in its own cell on the left. Others: a ↗ arrow. */
  icon?: boolean
  size?: 'md' | 'lg'
}

/** Square, mono, uppercase. Primary is solid cobalt; secondary is a tinted well with crop marks. */
export function FolioButton({ variant = 'primary', icon = true, size = 'md', className, children, ...props }: FolioButtonProps) {
  const h = size === 'lg' ? 'h-11' : 'h-9'
  const text = 'font-mono text-[11px] tracking-[0.1em] uppercase'
  const motion = 'transition-[background-color,color,translate] duration-200 ease-[cubic-bezier(.25,.1,.25,1)]'
  if (variant === 'primary') {
    return (
      <a
        href="#"
        className={cn('group inline-flex items-stretch bg-(--fo-blue) text-(--fo-on-blue) hover:bg-(--fo-blue-press) active:translate-y-px', h, text, motion, className)}
        {...props}
      >
        {icon && (
          <span className={cn('grid place-items-center border-r border-(--fo-paper)/25 bg-(--fo-blue)', size === 'lg' ? 'w-11' : 'w-9')}>
            <SparkGlyph className="transition-transform duration-500 group-hover:rotate-45" />
          </span>
        )}
        <span className="flex items-center px-4">{children}</span>
      </a>
    )
  }
  return (
    <a
      href="#"
      className={cn(
        'relative inline-flex items-center gap-2 px-4 active:translate-y-px',
        variant === 'secondary' ? 'bg-(--fo-tint) text-(--fo-ink) hover:bg-(--fo-tint-strong)' : 'text-(--fo-ink) hover:text-(--fo-blue)',
        h,
        text,
        motion,
        className,
      )}
      {...props}
    >
      {variant === 'secondary' && <FolioBrackets />}
      {children}
      {icon && <ArrowUpRight />}
    </a>
  )
}

/** Inline text link in cobalt with a tiny boxed plus, like a footnote. */
export function FolioLink({ children, className, ...props }: ComponentProps<'a'>) {
  return (
    <a href="#" className={cn('text-(--fo-blue) decoration-1 underline-offset-4 hover:underline', className)} {...props}>
      {children}
      <span aria-hidden className="ml-0.5 inline-grid size-2.5 translate-y-[-0.35em] place-items-center border border-current text-[7px] leading-none">
        +
      </span>
    </a>
  )
}

/** A hatched well with a mono command and a copy button. */
export function FolioCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div
      className={cn('flex h-9 items-stretch bg-(--fo-well) font-mono text-[11px] tracking-[0.08em] uppercase', className)}
      style={{ backgroundImage: 'repeating-linear-gradient(-45deg, var(--fo-line) 0 1px, transparent 1px 7px)' }}
    >
      <span className="flex min-w-0 flex-1 items-center truncate px-3">{command}</span>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(command).catch(() => {})
          setCopied(true)
          setTimeout(() => setCopied(false), 1200)
        }}
        className="grid w-9 cursor-pointer place-items-center border-l border-(--fo-line) text-(--fo-soft) transition-colors hover:text-(--fo-ink)"
        aria-label="Copy"
      >
        {copied ? (
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
            <path d="M3 8.5l3 3 7-7" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
            <rect x="5" y="5" width="8.5" height="8.5" />
            <path d="M3 10.5V2.5h8" />
          </svg>
        )}
      </button>
    </div>
  )
}

/** Small announcement chip: pulsing dot, label, bordered link. */
export function FolioAnnouncement({ label, link, className }: { label: string; link: string; className?: string }) {
  return (
    <div className={cn('inline-flex items-stretch bg-(--fo-well) text-[11.5px]', className)}>
      <span className="flex items-center gap-2 px-3 py-1.5 text-(--fo-soft)">
        <span className="fo-anim size-1.5 rounded-full bg-(--fo-ok) [animation:fo-pulse_2.4s_ease-in-out_infinite]" />
        {label}
      </span>
      <a href="#" className="flex items-center gap-1.5 border border-(--fo-line-strong) bg-(--fo-paper) px-3 font-medium transition-colors hover:text-(--fo-blue)">
        {link}
        <ArrowUpRight />
      </a>
    </div>
  )
}

/** Deterministic 0..1 hash, so pixel art looks the same on every render. */
function hash(x: number, y: number, seed = 1) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453
  return s - Math.floor(s)
}

/** A column chart drawn as stacked squares. One column can be highlighted. */
export function PixelBars({
  values,
  rows = 6,
  highlight = -1,
  className,
}: {
  values: number[]
  rows?: number
  highlight?: number
  className?: string
}) {
  return (
    <div className={cn('flex items-end gap-[3px]', className)} aria-hidden>
      {values.map((v, col) => {
        const filled = Math.max(1, Math.round(v * rows))
        return (
          <div key={col} className="flex flex-1 flex-col-reverse gap-[3px]">
            {Array.from({ length: rows }, (_, row) => (
              <span
                key={row}
                className={cn(
                  'aspect-square w-full',
                  row < filled ? (col === highlight ? 'bg-(--fo-blue)' : 'bg-(--fo-blue)/45') : 'bg-(--fo-line)',
                )}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)

/**
 * A slowly drifting field of cobalt pixels, ordered-dithered (Bayer 4x4) from
 * layered sine noise. Canvas, ~12fps, pauses offscreen and for reduced motion.
 */
export function DitherField({
  cell = 4,
  animate = true,
  shape = 'field',
  inverse = false,
  className,
}: {
  /** Light pixels on a cobalt ground instead of cobalt on paper. */
  inverse?: boolean
  /** Pixel size in CSS px. */
  cell?: number
  animate?: boolean
  /** field: full-bleed texture. orb: a dithered sphere. wave: horizon bands. */
  shape?: 'field' | 'orb' | 'wave'
  className?: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let last = 0
    let visible = true
    let t = 0

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = canvas
      const cols = Math.max(1, Math.ceil(w / cell))
      const rows = Math.max(1, Math.ceil(h / cell))
      if (canvas.width !== cols || canvas.height !== rows) {
        canvas.width = cols
        canvas.height = rows
      }
      const style = getComputedStyle(canvas)
      const blue = style.getPropertyValue('--fo-blue').trim() || '#0562ef'
      const paper = style.getPropertyValue('--fo-paper').trim() || '#ffffff'
      ctx.fillStyle = inverse ? blue : paper
      ctx.fillRect(0, 0, cols, rows)
      ctx.fillStyle = inverse ? 'rgba(255,255,255,0.82)' : blue
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const u = x / cols
          const v = y / rows
          let d: number
          if (shape === 'orb') {
            const dx = (u - 0.5) * (cols / rows)
            const dy = v - 0.5
            const r = Math.sqrt(dx * dx + dy * dy) / 0.42
            const light = 1 - Math.hypot(dx + 0.14, dy + 0.16) / 0.55
            d = r > 1 ? 0 : 0.25 + 0.75 * Math.max(0, light) + 0.08 * Math.sin(u * 22 + v * 9 - t * 1.4)
          } else if (shape === 'wave') {
            const crest = 0.55 + 0.12 * Math.sin(u * 6.5 + t * 0.8) + 0.05 * Math.sin(u * 17 - t * 1.3)
            d = v < crest ? 0 : 0.35 + 0.65 * Math.min(1, (v - crest) * 2.4) + 0.06 * Math.sin(u * 40 + v * 30 + t)
          } else {
            d =
              0.5 +
              0.28 * Math.sin(u * 5.1 + t * 0.6 + Math.sin(v * 4.2 - t * 0.4) * 1.6) +
              0.22 * Math.sin(v * 7.3 - u * 2.2 + t * 0.9) +
              0.05 * (hash(x, y) - 0.5)
          }
          if (d > BAYER[(y % 4) * 4 + (x % 4)]) ctx.fillRect(x, y, 1, 1)
        }
      }
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!visible || now - last < 80) return
      last = now
      t += 0.08
      draw()
    }

    draw()
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(canvas)
    const ro = new ResizeObserver(() => draw())
    ro.observe(canvas)
    // Re-read colors when the theme class flips.
    const mo = new MutationObserver(() => draw())
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    if (animate && !reduce) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
    }
  }, [cell, animate, shape, inverse])

  return <canvas ref={ref} aria-hidden className={cn('block size-full [image-rendering:pixelated]', className)} />
}

/** A dotted-grid panel for diagrams and figures, with an optional caption. */
export function FolioFigure({
  children,
  caption,
  className,
  dots = true,
}: {
  children: ReactNode
  caption?: ReactNode
  className?: string
  dots?: boolean
}) {
  return (
    <figure className={className}>
      <div
        className="relative border border-(--fo-line)"
        style={dots ? { backgroundImage: 'radial-gradient(var(--fo-line-strong) 1px, transparent 1px)', backgroundSize: '14px 14px' } : undefined}
      >
        {children}
      </div>
      {caption && <figcaption className="mt-3 max-w-md text-[12px] leading-relaxed text-(--fo-faint)">{caption}</figcaption>}
    </figure>
  )
}


/** Section opener: hairline, mono eyebrow, regular-weight title, muted lede. */
export function FolioSectionHead({
  eyebrow,
  title,
  lede,
  className,
}: {
  eyebrow?: string
  title: string
  lede?: string
  className?: string
}) {
  return (
    <div className={cn('border-t border-(--fo-line) pt-10', className)}>
      {eyebrow && <FolioLabel className="mb-4">{eyebrow}</FolioLabel>}
      <h2 className="max-w-xl text-[clamp(1.4rem,2.6vw,1.75rem)] leading-tight font-normal tracking-[-0.02em] text-balance">{title}</h2>
      {lede && <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-(--fo-soft)">{lede}</p>}
    </div>
  )
}
