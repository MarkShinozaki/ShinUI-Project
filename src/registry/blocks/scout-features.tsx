'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const ITEMS = [
  { title: 'Plain-language edits', points: ['Ask for changes the way you would ask a teammate.', 'Props and tokens update together.'], cmd: 'make the map darker at night', reply: 'Done. 3 tokens changed, contrast still AA.' },
  { title: 'Works offline', points: ['No runtime, no network calls, no tracking.', 'Everything ships as static source.'], cmd: 'will this run without a connection?', reply: 'Yes. Nothing in the block calls out.' },
  { title: 'Any framework that renders React', points: ['Next.js, Vite, Remix and friends.', 'Tailwind-first, tokens as CSS variables.'], cmd: 'add the console to my vite app', reply: 'Copied 2 files. Import ScoutConsole.' },
  { title: 'Light on the wire', points: ['No images: scenes are drawn in SVG and CSS.', 'Animations pause for reduced motion.'], cmd: 'how heavy is the hero?', reply: 'About 4 KB of markup, zero image requests.' },
]

export interface ScoutFeaturesProps {
  heading?: string
  className?: string
}

/** An accordion list beside a console card that answers for the open item. */
export function ScoutFeatures({ heading = 'Built to hold up', className }: ScoutFeaturesProps) {
  const [open, setOpen] = useState(0)
  const item = ITEMS[open]
  return (
    <section className={cn('grid gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr]', className)}>
      <div className="flex flex-col gap-6">
        <h2 className="text-[34px] leading-tight tracking-[-0.02em]">{heading}</h2>
        <div className="border border-(--sc-line) bg-(--sc-panel) p-4 font-mono text-[12px]" aria-live="polite">
          <div className="flex gap-3">
            <span className="w-16 shrink-0 text-(--sc-faint)">COMMAND</span>
            <span>{item.cmd}</span>
          </div>
          <div className="mt-3 flex gap-3">
            <span className="w-16 shrink-0 text-(--sc-faint)">REPLY</span>
            <span className="text-(--sc-accent)">
              {item.reply}
              <span aria-hidden className="sc-anim ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-current [animation:sc-blink_1s_steps(1)_infinite]" />
            </span>
          </div>
        </div>
      </div>
      <ul className="border-t border-(--sc-line)">
        {ITEMS.map((it, i) => (
          <li key={it.title} className="border-b border-(--sc-line)">
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(i)} className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] hover:text-(--sc-accent)">
              {it.title}
              <span aria-hidden className={cn('sc-anim text-lg transition-transform', open === i && 'rotate-45 text-(--sc-accent)')}>+</span>
            </button>
            <div className={cn('sc-anim grid transition-[grid-template-rows] duration-300', open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <ul className="overflow-hidden text-[13.5px] text-(--sc-dim)">
                {it.points.map((p) => (
                  <li key={p} className="pb-2 pl-4 before:mr-2 before:text-(--sc-accent) before:content-['—']">{p}</li>
                ))}
                <li className="pb-4" />
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
