'use client'

import { useEffect, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Roma Kit: shared pieces behind the shinUI "Roma" blocks.
 *
 * A consumer-app look: pitch-black hero and footer over a mosaic of dark
 * tiles that slowly breathe, a loud orange band, big medium-weight grotesk
 * headlines with tight tracking, white pill buttons with icons, soft rounded
 * cards, and product mockups (phone, app window, chat) built in plain markup.
 * Wrap blocks in <RomaRoot> for the palette.
 */

const VARS = [
  '[--rm-paper:#fafafa] [--rm-card:#ffffff] [--rm-ink:#151515] [--rm-soft:rgb(21_21_21/0.62)] [--rm-faint:rgb(21_21_21/0.42)] [--rm-line:rgb(21_21_21/0.08)]',
  '[--rm-night:#000000] [--rm-orange:#ff531a] [--rm-stone:#9a9898] [--rm-chip:#f1f1f1]',
  'dark:[--rm-paper:#0b0b0b] dark:[--rm-card:#161616] dark:[--rm-ink:#f4f4f4] dark:[--rm-soft:rgb(244_244_244/0.64)] dark:[--rm-faint:rgb(244_244_244/0.42)] dark:[--rm-line:rgb(255_255_255/0.08)]',
  'dark:[--rm-stone:#3a3939] dark:[--rm-chip:#222222]',
].join(' ')

const KEYFRAMES = `
@keyframes rm-tile{0%,100%{opacity:.18}50%{opacity:.6}}
@keyframes rm-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes rm-check{from{transform:scale(0)}to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.rm-anim{animation:none!important}}
`

export function RomaRoot({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(VARS, 'bg-(--rm-paper) font-sans text-(--rm-ink) antialiased', className)} {...props}>
      <style>{KEYFRAMES}</style>
      {children}
    </div>
  )
}

/** Big medium-weight grotesk with tight tracking. */
export function RomaHeading({ as: Tag = 'h2', className, children }: { as?: 'h1' | 'h2' | 'h3'; className?: string; children: ReactNode }) {
  return <Tag className={cn('font-display font-medium tracking-[-0.035em] text-balance', className)}>{children}</Tag>
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

function hash(i: number) {
  const s = Math.sin(i * 12.9898) * 43758.5453
  return s - Math.floor(s)
}

/** A field of dark squares that slowly breathe. Static with reduced motion. */
export function Mosaic({ cols = 22, rows = 9, animate = true, className }: { cols?: number; rows?: number; animate?: boolean; className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none grid gap-[6px]', className)} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const n = hash(i)
        const fade = 1 - Math.floor(i / cols) / rows
        return (
          <span
            key={i}
            className={cn('aspect-square rounded-[3px] bg-white', animate && n > 0.55 && 'rm-anim')}
            style={{
              opacity: (0.05 + n * 0.14) * fade,
              animation: animate && n > 0.55 ? `rm-tile ${4 + n * 6}s ease-in-out ${-n * 9}s infinite` : undefined,
            }}
          />
        )
      })}
    </div>
  )
}

const ICONS = {
  laptop: <path d="M3 4.5h10v6.5H3zM1.5 12.5h13" />,
  phone: <path d="M5 1.5h6v13H5zM7.3 12.5h1.4" />,
  arrow: <path d="M3 8h10M9 4l4 4-4 4" />,
}

export function RomaButton({
  variant = 'white',
  icon,
  className,
  children,
  ...props
}: ComponentProps<'a'> & { variant?: 'white' | 'black' | 'orange' | 'ghost'; icon?: keyof typeof ICONS }) {
  return (
    <a
      href="#"
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium whitespace-nowrap transition-[transform,background-color,opacity] duration-200 hover:scale-[1.02] active:scale-[.98]',
        variant === 'white' && 'bg-white text-black',
        variant === 'black' && 'bg-(--rm-ink) text-(--rm-paper)',
        variant === 'orange' && 'bg-(--rm-orange) text-white',
        variant === 'ghost' && 'text-current opacity-75 hover:opacity-100',
        className,
      )}
      {...props}
    >
      {icon && (
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
          {ICONS[icon]}
        </svg>
      )}
      {children}
    </a>
  )
}

/** Original mark: a square split into a quarter-circle and a block. */
export function RomaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn('size-4', className)} fill="currentColor" aria-hidden>
      <path d="M0 0h7v7H0zM9 0a7 7 0 017 7H9zM0 9h7v7H0zM9 9h7v7H9z" />
    </svg>
  )
}

export interface Task {
  title: string
  due: string
  done?: boolean
  hot?: boolean
}

/** A task row with a round check, title and a due-date chip. */
export function TaskRow({ task, dark, delay = 0 }: { task: Task; dark?: boolean; delay?: number }) {
  return (
    <li
      className={cn(
        'rm-anim flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] [animation:rm-rise_.5s_ease-out_both]',
        dark ? 'bg-white/[0.07] text-white' : 'border border-(--rm-line) bg-(--rm-card)',
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={cn('grid size-4 shrink-0 place-items-center rounded-full border', dark ? 'border-white/40' : 'border-(--rm-faint)', task.done && 'border-transparent bg-(--rm-orange)')}>
        {task.done && <span className="rm-anim size-1.5 rounded-full bg-white [animation:rm-check_.3s_ease-out]" />}
      </span>
      <span className={cn('min-w-0 flex-1 truncate', task.done && 'line-through opacity-50')}>{task.title}</span>
      <span
        className={cn(
          'shrink-0 rounded-md px-1.5 py-0.5 text-[10.5px]',
          task.hot ? 'bg-(--rm-orange)/15 text-(--rm-orange)' : dark ? 'bg-white/10 text-white/60' : 'bg-(--rm-chip) text-(--rm-soft)',
        )}
      >
        {task.due}
      </span>
    </li>
  )
}

/** A phone frame with a dark task list that checks itself off over time. */
export function PhoneMock({ tasks, title = 'Today', animate = true, className }: { tasks: Task[]; title?: string; animate?: boolean; className?: string }) {
  const [done, setDone] = useState(0)
  useEffect(() => {
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setDone((d) => (d + 1) % (tasks.length + 2)), 1800)
    return () => window.clearInterval(id)
  }, [animate, tasks.length])
  return (
    <div className={cn('w-[270px] rounded-[44px] border-[6px] border-[#1d1d1f] bg-black p-3 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]', className)}>
      <div className="flex items-center justify-between px-3 pt-1 text-[10px] text-white/80">
        <span>9:41</span>
        <span className="h-5 w-20 rounded-full bg-[#1d1d1f]" />
        <span>100</span>
      </div>
      <div className="mt-4 flex items-center justify-between px-2 text-white">
        <span className="flex items-center gap-1.5 text-[12px]">
          <span className="size-5 rounded-full bg-(--rm-orange)" />
          Sam
        </span>
        <span className="flex gap-2 text-white/50">
          <span className="size-3.5 rounded border border-current" />
          <span className="size-3.5 rounded-full border border-current" />
        </span>
      </div>
      <p className="mt-4 px-2 font-mono text-[15px] tracking-[0.18em] text-white uppercase">{title}</p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {tasks.map((t, i) => (
          <TaskRow key={t.title} task={{ ...t, done: t.done || i < done }} dark delay={i * 120} />
        ))}
      </ul>
      <div className="mt-6 flex justify-around rounded-2xl bg-white/[0.07] py-2.5 text-[9px] text-white/50">
        {['Tasks', 'Assistant', 'More'].map((x, i) => (
          <span key={x} className={cn(i === 0 && 'text-white')}>
            {x}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Chat bubble with avatar, name and time. */
export function Bubble({ who, time, children, operator }: { who: string; time: string; children: ReactNode; operator?: boolean }) {
  return (
    <div className="flex gap-2.5">
      <span className={cn('mt-0.5 size-6 shrink-0 rounded-full', operator ? 'bg-(--rm-ink)' : 'bg-(--rm-orange)')} />
      <div className="min-w-0 text-[13px]">
        <p className="text-[12px]">
          <span className="font-semibold">{who}</span> <span className="text-(--rm-faint)">{time}</span>
        </p>
        <div className="mt-0.5 leading-relaxed text-(--rm-soft)">{children}</div>
      </div>
    </div>
  )
}
