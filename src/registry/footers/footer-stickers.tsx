'use client'

import { useRef, useState, type PointerEvent } from 'react'
import { BottomBar, Brand, FooterColumns, FooterRoot, useReducedMotion } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterStickersProps {
  brand?: string
  tagline?: string
  /** Sticker colors, cycled across the letters. */
  colors?: string[]
  animate?: boolean
  className?: string
}

const KEYFRAMES = `
@keyframes sk-wobble{0%,100%{rotate:var(--sk-r)}50%{rotate:calc(var(--sk-r) + 4deg)}}
`

type Pos = { x: number; y: number; r: number }

/** The brand as a pile of chunky die-cut stickers you can grab, drag and slap down anywhere on the footer. */
export function FooterStickers({
  brand = 'lumen',
  tagline = 'Stick around. It gets better.',
  colors = ['#facc15', '#22d3ee', '#f472b6', '#a3e635', '#fb923c', '#a78bfa'],
  animate = true,
  className,
}: FooterStickersProps) {
  const reduced = useReducedMotion()
  const letters = [...brand]
  const [pos, setPos] = useState<Pos[]>(() => letters.map((_, i) => ({ x: 8 + (i * 84) / Math.max(1, letters.length), y: 20 + ((i * 37) % 30), r: ((i * 53) % 30) - 15 })))
  const [drag, setDrag] = useState<number | null>(null)
  const [order, setOrder] = useState<number[]>(() => letters.map((_, i) => i))
  const area = useRef<HTMLDivElement>(null)
  const grab = useRef({ dx: 0, dy: 0 })
  const list = pos.length === letters.length ? pos : letters.map((_, i) => pos[i] ?? { x: 10 + i * 8, y: 30, r: 0 })

  const down = (i: number) => (e: PointerEvent<HTMLButtonElement>) => {
    const r = area.current!.getBoundingClientRect()
    grab.current = { dx: e.clientX - r.left - (list[i].x / 100) * r.width, dy: e.clientY - r.top - (list[i].y / 100) * r.height }
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag(i)
    setOrder((o) => [...o.filter((k) => k !== i), i])
  }
  const move = (i: number) => (e: PointerEvent<HTMLButtonElement>) => {
    if (drag !== i) return
    const r = area.current!.getBoundingClientRect()
    const x = Math.max(0, Math.min(92, ((e.clientX - r.left - grab.current.dx) / r.width) * 100))
    const y = Math.max(0, Math.min(70, ((e.clientY - r.top - grab.current.dy) / r.height) * 100))
    setPos(list.map((p, k) => (k === i ? { ...p, x, y } : p)))
  }
  const up = (i: number) => () => {
    if (drag !== i) return
    setDrag(null)
    setPos(list.map((p, k) => (k === i ? { ...p, r: Math.round(Math.random() * 36 - 18) } : p)))
  }

  return (
    <FooterRoot className={className}>
      <style>{KEYFRAMES}</style>
      <div className="mx-auto max-w-6xl px-6 pt-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col items-start gap-3">
            <Brand brand={brand} />
            <p className="max-w-xs text-sm text-(--ft-soft)">{tagline}</p>
          </div>
          <FooterColumns />
        </div>
        <div ref={area} className="relative mt-10 h-[clamp(200px,32cqw,300px)] touch-none rounded-3xl border-2 border-dashed border-(--ft-line)">
          <span className="absolute right-4 bottom-3 text-[12px] text-(--ft-faint)">Drag the stickers around</span>
          {list.map((p, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Sticker ${letters[i]}`}
              onPointerDown={down(i)}
              onPointerMove={move(i)}
              onPointerUp={up(i)}
              onPointerCancel={up(i)}
              className={cn(
                'absolute grid aspect-square w-[clamp(64px,11cqw,120px)] cursor-grab place-items-center rounded-[28%] border-[5px] border-white font-display text-[clamp(2.4rem,7cqw,5rem)] leading-none font-black text-black/85 uppercase shadow-[0_6px_0_rgb(0_0_0/0.12),0_10px_24px_rgb(0_0_0/0.15)] transition-[scale,box-shadow] select-none active:cursor-grabbing',
                drag === i && 'scale-110 shadow-[0_14px_0_rgb(0_0_0/0.1),0_24px_40px_rgb(0_0_0/0.2)]',
                !reduced && animate && drag !== i && 'ft-anim animate-[sk-wobble_3s_ease-in-out_infinite]',
              )}
              style={{ left: `${p.x}%`, top: `${p.y}%`, rotate: `${p.r}deg`, background: colors[i % colors.length], zIndex: order.indexOf(i) + 1, animationDelay: `${i * -0.4}s`, ['--sk-r' as string]: `${p.r}deg` }}
            >
              {letters[i]}
            </button>
          ))}
        </div>
        <BottomBar brand={brand} className="py-6" />
      </div>
    </FooterRoot>
  )
}
