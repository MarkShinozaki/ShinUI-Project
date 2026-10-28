'use client'

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { FOOTER_COLUMNS, FooterRoot, SocialIcon, YEAR, useReducedMotion } from '@/registry/footers/footer-kit'
import { cn } from '@/lib/utils'

export interface FooterTerminalProps {
  brand?: string
  accent?: string
  /** window: a framed terminal with traffic-light dots. flat: bare text on the page. */
  variant?: 'window' | 'flat'
  /** Type the boot lines in one character at a time. */
  animate?: boolean
  /** Shell prompt shown before each command. */
  prompt?: string
  className?: string
}

type Line = { kind: 'cmd' | 'out'; node: ReactNode; key: string }

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

/** A footer you can type into: links listed like files, a status line and a working little prompt. */
export function FooterTerminal({
  brand = 'lumen',
  accent = '#22c55e',
  variant = 'window',
  animate = true,
  prompt = '~',
  className,
}: FooterTerminalProps) {
  const reduced = useReducedMotion()
  const boot = `${brand} --footer`
  const typing = animate && !reduced
  const [typed, setTyped] = useState(0)
  const [history, setHistory] = useState<Line[]>([])
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const shown = typing ? typed : boot.length
  const done = shown >= boot.length

  useEffect(() => {
    if (!typing) return
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      setTyped(n)
      if (n >= boot.length) window.clearInterval(id)
    }, 70)
    return () => window.clearInterval(id)
  }, [typing, boot])

  const inputId = useId()
  const promptNode = (
    <span className="text-(--ft-faint)">
      <span className="text-(--ft-accent)">{brand}</span>:{prompt}$&nbsp;
    </span>
  )

  const run = (e: FormEvent) => {
    e.preventDefault()
    const cmd = value.trim()
    setValue('')
    if (!cmd) return
    if (cmd === 'clear') return setHistory([])
    const [name, ...rest] = cmd.split(/\s+/)
    const all = FOOTER_COLUMNS.flatMap((c) => c.links.map((l) => l.label))
    let out: ReactNode
    if (name === 'help') out = 'commands: ls · open <page> · socials · date · whoami · clear'
    else if (name === 'ls') out = FOOTER_COLUMNS.map((c) => `${slug(c.title)}/`).join('  ')
    else if (name === 'open') {
      const hit = all.find((l) => slug(l) === slug(rest.join(' ')))
      out = hit ? `opening ${hit}… (placeholder link)` : `open: no such page "${rest.join(' ')}". try ls`
    } else if (name === 'socials') out = 'x · github · linkedin · youtube · rss'
    else if (name === 'date') out = new Date().toString()
    else if (name === 'whoami') out = 'a visitor who scrolled all the way down. hi.'
    else out = `${name}: command not found. try help`
    const k = `${Date.now()}`
    setHistory((h) => [...h.slice(-5), { kind: 'cmd', node: cmd, key: `c${k}` }, { kind: 'out', node: out, key: `o${k}` }])
  }

  return (
    <FooterRoot accent={accent} className={cn('font-mono text-[13px]', className)}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div
          className={cn(variant === 'window' && 'overflow-hidden rounded-xl border border-(--ft-line) bg-(--ft-panel) shadow-[0_30px_80px_-40px_rgb(0_0_0/0.45)]')}
          onClick={() => inputRef.current?.focus({ preventScroll: true })}
        >
          {variant === 'window' && (
            <div className="flex items-center gap-2 border-b border-(--ft-line) px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 truncate text-[12px] text-(--ft-faint)">
                {brand} — footer — 80×24
              </span>
            </div>
          )}
          <div className={cn('flex flex-col gap-5 leading-relaxed', variant === 'window' ? 'p-5 sm:p-7' : 'py-2')}>
            <p>
              {promptNode}
              {boot.slice(0, shown)}
              {!done && <span className="ft-anim ml-px inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-(--ft-ink) animate-[ft-blink_1s_steps(1)_infinite]" />}
            </p>
            <div className={cn('grid grid-cols-2 gap-x-6 gap-y-6 transition-opacity duration-500 sm:grid-cols-4', done ? 'opacity-100' : 'opacity-0')}>
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title}>
                  <p className="text-(--ft-faint)">
                    <span className="text-(--ft-accent)">drwx</span> {slug(col.title)}/
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5 border-l border-(--ft-line) pl-3">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <a href={l.href ?? '#'} className="text-(--ft-soft) hover:text-(--ft-ink) hover:underline hover:decoration-(--ft-accent) hover:underline-offset-4">
                          {slug(l.label)}
                          {l.badge && <span className="ml-1 text-(--ft-accent)">*</span>}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className={cn('flex flex-col gap-1 text-(--ft-soft) transition-opacity delay-200 duration-500', done ? 'opacity-100' : 'opacity-0')}>
              <p>
                <span className="text-(--ft-accent)">✓</span> status: all systems normal · p50 38ms · uptime 99.99%
              </p>
              <p>
                <span className="text-(--ft-accent)">✓</span> certified: SOC 2 Type II · ISO 27001 · GDPR
              </p>
            </div>
            {history.map((l) =>
              l.kind === 'cmd' ? (
                <p key={l.key}>
                  {promptNode}
                  {l.node}
                </p>
              ) : (
                <p key={l.key} className="-mt-3 break-words text-(--ft-soft)">
                  {l.node}
                </p>
              ),
            )}
            <form onSubmit={run} className={cn('flex items-center', !done && 'invisible')}>
              <label htmlFor={inputId} className="shrink-0">
                {promptNode}
              </label>
              <input
                ref={inputRef}
                id={inputId}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="type help"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent caret-(--ft-accent) outline-none placeholder:text-(--ft-faint)"
              />
            </form>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-4 text-[12px] text-(--ft-faint) sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} {brand}, Inc. · exit 0
          </p>
          <ul className="flex items-center gap-1">
            {([['x', 'X'], ['github', 'GitHub'], ['linkedin', 'LinkedIn'], ['youtube', 'YouTube'], ['rss', 'RSS feed']] as const).map(([n, label]) => (
              <li key={n}>
                <a href="#" aria-label={label} className="grid size-8 place-items-center rounded-md text-(--ft-soft) hover:bg-(--ft-line) hover:text-(--ft-ink)">
                  <SocialIcon name={n} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FooterRoot>
  )
}
