'use client'

import { useId, useRef, useState, type ComponentProps, type CSSProperties, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'

export interface LavaLampProps extends ComponentProps<'div'> {
  /** Blob colors, top to bottom of the gradient. */
  from?: string
  to?: string
  /** Lamp glass color. */
  glass?: string
  /** Number of rising blobs. */
  blobs?: number
  /** A blob follows the pointer and melts into the others. */
  interactive?: boolean
  animate?: boolean
}

const KEYFRAMES = `
@keyframes ll-rise{0%{translate:0 110%}50%{translate:var(--ll-dx) -10%}100%{translate:0 110%}}
@keyframes ll-squish{0%,100%{scale:1 1}50%{scale:1.15 .85}}
@media (prefers-reduced-motion: reduce){.ll-anim{animation:none!important}}
`

/** Gooey wax blobs that rise, stretch and merge like a lava lamp, with one blob riding the cursor. */
export function LavaLamp({ from = '#ff7a59', to = '#ff2d87', glass = '#2a0f3d', blobs = 9, interactive = true, animate = true, className, style, children, ...props }: LavaLampProps) {
  const id = useId().replace(/:/g, '')
  const box = useRef<HTMLDivElement>(null)
  const [p, setP] = useState<{ x: number; y: number } | null>(null)
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return
    const r = box.current!.getBoundingClientRect()
    setP({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div
      ref={box}
      onPointerMove={move}
      onPointerLeave={() => setP(null)}
      className={cn('relative isolate overflow-hidden', className)}
      style={{ '--ll-from': from, '--ll-to': to, '--ll-glass': glass, background: 'radial-gradient(90% 70% at 50% 100%, color-mix(in oklab, var(--ll-glass), var(--ll-to) 25%), var(--ll-glass))', ...style } as CSSProperties}
      {...props}
    >
      <style>{KEYFRAMES}</style>
      <svg aria-hidden className="absolute size-0">
        <filter id={`goo-${id}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </svg>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ filter: `url(#goo-${id})` }}>
        <div className="absolute inset-x-0 bottom-0 h-[14%] bg-[linear-gradient(var(--ll-from),var(--ll-to))]" />
        {Array.from({ length: blobs }, (_, i) => {
          const s = 8 + ((i * 7) % 9)
          return (
            <span
              key={i}
              className={cn('absolute bottom-0 h-full', animate && 'll-anim')}
              style={{ left: `${(i * 83) % 92}%`, width: `${s}%`, animation: animate ? `ll-rise ${14 + ((i * 5) % 10)}s ${-i * 2.3}s ease-in-out infinite` : undefined, ['--ll-dx' as string]: `${((i * 41) % 60) - 30}%`, translate: animate ? undefined : `0 ${20 + ((i * 29) % 70)}%` }}
            >
              <span
                className={cn('block aspect-square w-full rounded-full bg-[linear-gradient(var(--ll-from),var(--ll-to))]', animate && 'll-anim')}
                style={{ animation: animate ? `ll-squish ${3 + (i % 3)}s ease-in-out infinite` : undefined }}
              />
            </span>
          )
        })}
        {p && <span className="absolute aspect-square w-[12%] -translate-1/2 rounded-full bg-[linear-gradient(var(--ll-from),var(--ll-to))] transition-[left,top] duration-300 ease-out" style={{ left: `${p.x}%`, top: `${p.y}%` }} />}
      </div>
      {children}
    </div>
  )
}
