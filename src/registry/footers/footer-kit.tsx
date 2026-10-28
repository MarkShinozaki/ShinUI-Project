'use client'

import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { cn } from '@/lib/utils'

/**
 * Footer Kit: shared pieces behind the shinUI "Footers" blocks.
 *
 * Link columns, a socials row, a copyright line, a tiny placeholder mark,
 * light/dark palette variables, and the hooks the animated footers share:
 * reduced-motion and dark-mode detection plus a canvas loop that sizes itself
 * with layout (not transformed) pixels, pauses offscreen and cleans up.
 */

export type FooterLink = { label: string; href?: string; badge?: string }
export type FooterColumn = { title: string; links: FooterLink[] }

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Product',
    links: [{ label: 'Overview' }, { label: 'Pricing' }, { label: 'Changelog' }, { label: 'Integrations', badge: 'New' }, { label: 'Roadmap' }],
  },
  {
    title: 'Developers',
    links: [{ label: 'Docs' }, { label: 'API reference' }, { label: 'CLI' }, { label: 'Examples' }, { label: 'Status' }],
  },
  {
    title: 'Company',
    links: [{ label: 'About' }, { label: 'Customers' }, { label: 'Careers' }, { label: 'Blog' }, { label: 'Press kit' }],
  },
  {
    title: 'Legal',
    links: [{ label: 'Privacy' }, { label: 'Terms' }, { label: 'Security' }, { label: 'Cookies' }],
  },
]

export const YEAR = new Date().getFullYear()

/** Light/dark palette. Pass `accent` to set --ft-accent. */
const VARS = [
  '[--ft-bg:#fbfbfa] [--ft-panel:#ffffff] [--ft-ink:#141414] [--ft-soft:rgb(20_20_20/0.62)] [--ft-faint:rgb(20_20_20/0.4)] [--ft-line:rgb(20_20_20/0.1)]',
  'dark:[--ft-bg:#0a0a0b] dark:[--ft-panel:#111113] dark:[--ft-ink:#f2f2f0] dark:[--ft-soft:rgb(242_242_240/0.62)] dark:[--ft-faint:rgb(242_242_240/0.38)] dark:[--ft-line:rgb(255_255_255/0.1)]',
].join(' ')

const KEYFRAMES = `
@keyframes ft-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes ft-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes ft-drift{from{transform:translateX(-10%)}to{transform:translateX(110%)}}
@keyframes ft-pulse{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
@media (prefers-reduced-motion:reduce){.ft-anim{animation:none!important}}
`

export interface FooterRootProps extends ComponentProps<'footer'> {
  accent?: string
}

/** <footer> with the palette, keyframes and an optional accent color. */
export function FooterRoot({ accent, className, style, children, ...props }: FooterRootProps) {
  return (
    <footer
      className={cn(VARS, '@container relative isolate overflow-hidden bg-(--ft-bg) font-sans text-(--ft-ink) antialiased', className)}
      style={{ ...(accent ? ({ '--ft-accent': accent } as CSSProperties) : null), ...style }}
      {...props}
    >
      <style>{KEYFRAMES}</style>
      {children}
    </footer>
  )
}

/** Pins a footer to the bottom of a preview so cards show its art, not empty space. */
export function FooterStage({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex min-h-0 flex-1 flex-col justify-end overflow-hidden [&>*]:shrink-0', className)}>{children}</div>
}

/** Placeholder mark: a quarter-circle in a rounded square. Swap in your own logo. */
export function FooterMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('size-5 shrink-0', className)}>
      <rect x="1" y="1" width="22" height="22" rx="6" fill="currentColor" />
      <path d="M7 17V11a4 4 0 0 1 4-4h6" fill="none" stroke="var(--ft-bg)" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function Brand({ brand, className }: { brand: string; className?: string }) {
  return (
    <a href="#" className={cn('inline-flex items-center gap-2 font-display text-[17px] font-semibold tracking-[-0.02em]', className)}>
      <FooterMark className="text-(--ft-accent,currentColor)" />
      {brand}
    </a>
  )
}

export interface FooterColumnsProps {
  columns?: FooterColumn[]
  className?: string
  headingClassName?: string
  linkClassName?: string
  /** Show a ↗ that slides in on hover. */
  arrows?: boolean
}

/** Link columns: 2 across on phones, one per column from md up. */
export function FooterColumns({ columns = FOOTER_COLUMNS, className, headingClassName, linkClassName, arrows }: FooterColumnsProps) {
  return (
    <nav aria-label="Footer" className={cn('grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4', className)}>
      {columns.map((col) => (
        <div key={col.title}>
          <p className={cn('text-[13px] font-medium text-(--ft-ink)', headingClassName)}>{col.title}</p>
          <ul className="mt-3.5 flex flex-col gap-2.5">
            {col.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href ?? '#'}
                  className={cn('group/link inline-flex items-center gap-1.5 text-[13.5px] text-(--ft-soft) transition-colors hover:text-(--ft-ink)', linkClassName)}
                >
                  {link.label}
                  {link.badge && (
                    <span className="rounded-full border border-(--ft-line) px-1.5 py-px text-[10px] leading-4 text-(--ft-faint)">{link.badge}</span>
                  )}
                  {arrows && (
                    <span aria-hidden className="-translate-x-1 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100">
                      ↗
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

type SocialName = 'x' | 'github' | 'linkedin' | 'youtube' | 'rss'
const SOCIAL_LABEL: Record<SocialName, string> = { x: 'X', github: 'GitHub', linkedin: 'LinkedIn', youtube: 'YouTube', rss: 'RSS feed' }

/** Simple stroke icons, drawn for this kit. */
export function SocialIcon({ name, className }: { name: SocialName; className?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('size-4', className)}>
      {name === 'x' && (
        <g {...p}>
          <path d="M5 4l14 16M19 4L5 20" />
        </g>
      )}
      {name === 'github' && (
        <g {...p}>
          <path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.5 2.6 5.5 2.9 5.5 2.9a4.3 4.3 0 0 0-.1 3.2A4.7 4.7 0 0 0 4.1 9.3c0 4.6 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21" />
        </g>
      )}
      {name === 'linkedin' && (
        <g {...p}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10.5V17M8 7.2v.1M12 17v-6.5M12 13.3c0-1.7 1-2.8 2.4-2.8s2.1 1 2.1 2.8V17" />
        </g>
      )}
      {name === 'youtube' && (
        <g {...p}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10.5 9.5v5l4-2.5z" />
        </g>
      )}
      {name === 'rss' && (
        <g {...p}>
          <path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14" />
          <circle cx="6" cy="18" r="1" />
        </g>
      )}
    </svg>
  )
}

export function Socials({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  return (
    <ul className={cn('flex items-center gap-1', className)}>
      {(Object.keys(SOCIAL_LABEL) as SocialName[]).map((name) => (
        <li key={name}>
          <a
            href="#"
            aria-label={SOCIAL_LABEL[name]}
            className={cn('grid size-8 place-items-center rounded-full text-(--ft-soft) transition-colors hover:bg-(--ft-line) hover:text-(--ft-ink)', itemClassName)}
          >
            <SocialIcon name={name} />
          </a>
        </li>
      ))}
    </ul>
  )
}

export function Copyright({ brand, className, children }: { brand: string; className?: string; children?: ReactNode }) {
  return (
    <p className={cn('text-[12.5px] text-(--ft-faint)', className)}>
      © {YEAR} {brand}, Inc. {children}
    </p>
  )
}

/** Bottom bar: copyright left, socials right; stacks on phones. */
export function BottomBar({ brand, className, children }: { brand: string; className?: string; children?: ReactNode }) {
  return (
    <div className={cn('flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <Copyright brand={brand}>{children}</Copyright>
      <Socials className="-ml-2 sm:ml-0" />
    </div>
  )
}

/** Live `prefers-reduced-motion: reduce`. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Whether the element's document root has the `.dark` class (works inside the preview iframe too). */
export function useIsDark(ref: RefObject<Element | null>) {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const root = (ref.current?.ownerDocument ?? document).documentElement
    const read = () => setDark(root.classList.contains('dark'))
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [ref])
  return dark
}

export interface CanvasFrame {
  ctx: CanvasRenderingContext2D
  /** CSS-pixel size of the canvas (layout size, unaffected by CSS transforms). */
  w: number
  h: number
  /** Seconds since start (frozen when not animating). */
  t: number
  /** Seconds since the previous frame. */
  dt: number
}

/**
 * Drive a 2D canvas: HiDPI sizing from offsetWidth/offsetHeight via ResizeObserver,
 * rAF while `animate` is on and the canvas is on screen, one still frame otherwise.
 * `draw` is read through a ref, so it can close over fresh props without restarting.
 */
export function useCanvasLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draw: (frame: CanvasFrame) => void,
  { animate = true, fps = 60 }: { animate?: boolean; fps?: number } = {},
) {
  const drawRef = useRef(draw)
  useEffect(() => {
    drawRef.current = draw
  })
  const reduced = useReducedMotion()
  const running = animate && !reduced

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    let t = 0
    let last = performance.now()
    let acc = 0
    const step = 1 / fps

    const paint = (dt: number) => {
      if (!w || !h) return
      ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0)
      drawRef.current({ ctx, w, h, t, dt })
    }
    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      paint(0)
    }
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      acc += dt
      if (acc < step * 0.9) return
      t += acc
      paint(acc)
      acc = 0
    }
    const start = () => {
      cancelAnimationFrame(raf)
      if (running && visible) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    io.observe(canvas)
    resize()
    start()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [canvasRef, running, fps])

  return running
}

/** Pointer position in the element's own (untransformed) pixels, or null when outside. */
export function usePointer(ref: RefObject<HTMLElement | null>) {
  const pointer = useRef<{ x: number; y: number; down: number } | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const sx = el.offsetWidth / (r.width || 1)
      const sy = el.offsetHeight / (r.height || 1)
      pointer.current = { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy, down: pointer.current?.down ?? 0 }
    }
    const leave = () => {
      pointer.current = null
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerdown', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerdown', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref])
  return pointer
}

/**
 * Rasterize text to fill a w×h (CSS px) box and return a sampler: coverage 0..1 at (x, y) in CSS px.
 * Drawn at half resolution, which is plenty for dots and glyph cells.
 */
export function rasterizeText(
  text: string,
  w: number,
  h: number,
  { font = '800 100px "Space Grotesk", Inter, system-ui, sans-serif', fill = 0.92, align = 'center' as 'center' | 'bottom' } = {},
) {
  const k = 0.5
  const cw = Math.max(1, Math.round(w * k))
  const ch = Math.max(1, Math.round(h * k))
  const c = document.createElement('canvas')
  c.width = cw
  c.height = ch
  const ctx = c.getContext('2d', { willReadFrequently: true })
  if (!ctx || !text) return () => 0
  ctx.font = font
  const m = ctx.measureText(text)
  const asc = m.actualBoundingBoxAscent || 72
  const desc = m.actualBoundingBoxDescent || 0
  const left = m.actualBoundingBoxLeft || 0
  const tw = (m.actualBoundingBoxRight || m.width) + left || 1
  const scale = Math.min((cw * fill) / tw, (ch * fill) / (asc + desc))
  const top = align === 'bottom' ? ch - (asc + desc) * scale - ch * 0.04 : (ch - (asc + desc) * scale) / 2
  ctx.setTransform(scale, 0, 0, scale, (cw - tw * scale) / 2 + left * scale, top + asc * scale)
  ctx.fillStyle = '#fff'
  ctx.fillText(text, 0, 0)
  const data = ctx.getImageData(0, 0, cw, ch).data
  return (x: number, y: number) => {
    const px = Math.floor(x * k)
    const py = Math.floor(y * k)
    if (px < 0 || py < 0 || px >= cw || py >= ch) return 0
    return data[(py * cw + px) * 4 + 3] / 255
  }
}
