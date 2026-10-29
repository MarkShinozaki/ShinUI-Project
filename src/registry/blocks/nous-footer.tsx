'use client'

import { useEffect, useRef } from 'react'
import { Eyebrow, Halftone, NousDisplay, NousMark } from '@/registry/blocks/nous-kit'
import { cn } from '@/lib/utils'

const COLUMNS = [
  ['Library', ['Blocks', 'Kits', 'Templates', 'Changelog']],
  ['Lab', ['Studies', 'Motion', 'Accessibility']],
  ['Community', ['GitHub', 'Discussions', 'Showcase']],
] as const

/**
 * Finds the nearest scrolling ancestor (or the window) and writes how much of
 * the footer is uncovered, 0 to 1, into --nr-reveal.
 */
function useReveal() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let sp: HTMLElement | null = el.parentElement
    while (sp && !/(auto|scroll)/.test(getComputedStyle(sp).overflowY)) sp = sp.parentElement
    const target: HTMLElement | Window = sp ?? window
    const update = () => {
      const prev = el.previousElementSibling
      if (!prev) return el.style.setProperty('--nr-reveal', '1')
      const bottom = sp ? sp.getBoundingClientRect().bottom : window.innerHeight
      const r = Math.min(1, Math.max(0, (bottom - prev.getBoundingClientRect().bottom) / el.offsetHeight))
      el.style.setProperty('--nr-reveal', r.toFixed(3))
    }
    update()
    target.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      target.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return ref
}

export interface NousFooterProps {
  brand?: string
  wordmark?: string
  tagline?: string
  animate?: boolean
  className?: string
}

/**
 * A sticky reveal footer. It sits at `bottom: 0` underneath the page, so the
 * content above (give it `relative z-10` and a background) slides up off it,
 * and it fades and lifts in as it is uncovered. Place it as the last child of
 * the scrolling page, right after the content wrapper.
 */
export function NousFooter({ brand = 'shinUI', wordmark = 'Open Blocks', tagline = 'Interface, in the open.', animate = true, className }: NousFooterProps) {
  const ref = useReveal()
  return (
    <footer ref={ref} className={cn('sticky bottom-0 z-0 overflow-hidden bg-(--nr-blue) text-(--nr-on-blue) [--nr-reveal:1]', className)}>
      <div className="nr-anim relative isolate px-6 pt-10 pb-6 transition-[opacity,transform] duration-75" style={{ opacity: 'calc(0.3 + 0.7 * var(--nr-reveal))', transform: animate ? 'translateY(calc((1 - var(--nr-reveal)) * 40px))' : undefined }}>
        <Halftone shape="fade" animate={animate} dot={1.1} className="-z-10 opacity-25 [--nr-blue:var(--nr-on-blue)]" />
        <NousDisplay as="p" stretch={1.6} className="pointer-events-none text-[clamp(56px,12vw,170px)] text-transparent [-webkit-text-stroke:1px_var(--nr-on-blue)] opacity-60" >
          {wordmark}
        </NousDisplay>
        <div className="mx-auto mt-8 grid max-w-6xl gap-8 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-3">
            <NousMark className="text-(--nr-on-blue)" />
            <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase">{tagline}</span>
          </div>
          {COLUMNS.map(([h, links]) => (
            <nav key={h} aria-label={h} className="flex flex-col gap-2">
              <Eyebrow className="text-(--nr-on-blue) opacity-70">{h}</Eyebrow>
              {links.map((l) => (
                <a key={l} href="#" className="w-fit text-[14px] underline-offset-4 hover:underline">
                  {l}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-3 border-t border-(--nr-on-blue)/30 pt-4 font-mono text-[10px] tracking-[0.16em] uppercase opacity-80">
          <span>© {brand}</span>
          <span>MIT licence</span>
        </div>
      </div>
    </footer>
  )
}
