'use client'

import { useRef, useState } from 'react'
import { Mono, Terrain, useScrollVar } from '@/registry/blocks/scout-kit'
import { cn } from '@/lib/utils'

const STEPS = [
  { tag: '01 / Pick', title: 'Start from a block that already works', body: 'Every block arrives with states, focus styles and motion settings in place, so the first version is already usable.' },
  { tag: '02 / Tune', title: 'Describe the change in plain words', body: 'Ask for a calmer palette or a denser table. Props and tokens change together and the preview follows.' },
  { tag: '03 / Ship', title: 'Copy the source and take it anywhere', body: 'The code is yours: no runtime, no lock-in, nothing phoning home. Drop it into any React project.' },
]
const NODES = ['Input', 'Model', 'Action']

export interface ScoutPinnedProps {
  animate?: boolean
  className?: string
}

/**
 * A scroll-driven section: the scene and diagram stay pinned while the steps
 * scroll past, and each step lights up the matching part of the diagram.
 */
export function ScoutPinned({ animate = true, className }: ScoutPinnedProps) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  useScrollVar(ref, { mode: 'through', name: '--sc-pin', onChange: (p) => setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))) })
  return (
    <section ref={ref} className={cn('relative grid gap-10 px-6 py-16 md:grid-cols-2 [--sc-pin:0]', className)}>
      <div className="relative h-[420px] overflow-hidden border border-(--sc-line) md:sticky md:top-28">
        <Terrain animate={animate} parallaxVar="--sc-pin" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
          <div className="flex items-center gap-3">
            {NODES.map((n, i) => (
              <div key={n} className="flex items-center gap-3">
                <div className={cn('sc-anim grid h-16 w-24 place-items-center border transition-colors duration-500', i <= active ? 'border-(--sc-accent) bg-(--sc-accent)/10 text-(--sc-accent)' : 'border-(--sc-line) bg-(--sc-bg)/70 text-(--sc-faint)')}>
                  <Mono>{n}</Mono>
                </div>
                {i < NODES.length - 1 && <span className={cn('sc-anim h-px w-8 transition-colors duration-500', i < active ? 'bg-(--sc-accent)' : 'bg-(--sc-line)')} />}
              </div>
            ))}
          </div>
          <div className="h-1 w-60 bg-(--sc-line)">
            <div className="h-full origin-left bg-(--sc-accent)" style={{ transform: 'scaleX(var(--sc-pin))' }} />
          </div>
          <Mono className="text-(--sc-dim)">Step {active + 1} of {STEPS.length}</Mono>
        </div>
      </div>
      <ol className="flex flex-col">
        {STEPS.map((s, i) => (
          <li key={s.tag} className={cn('sc-anim flex min-h-[380px] flex-col justify-center gap-3 border-l pl-6 transition-[opacity,border-color] duration-500', i === active ? 'border-(--sc-accent) opacity-100' : 'border-(--sc-line) opacity-40')}>
            <Mono className="text-(--sc-accent)">{s.tag}</Mono>
            <h3 className="max-w-[20ch] text-[28px] leading-tight tracking-[-0.02em]">{s.title}</h3>
            <p className="max-w-[42ch] text-[14px] leading-relaxed text-(--sc-dim)">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
