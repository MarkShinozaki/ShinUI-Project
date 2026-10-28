'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, FolioButton, FolioLabel, FolioMark, FolioRoot } from '@/registry/blocks/folio-kit'
import { cn } from '@/lib/utils'

/** Split a comma list prop into trimmed items. */
const list = (value: string | undefined) =>
  (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export interface FolioNavbarProps {
  /** sidebar: a sticky docs-style rail with an "on this page" index. topbar: a hairline bar. index: a centered mono bar with numbered links. */
  variant?: 'sidebar' | 'topbar' | 'index'
  brand?: string
  /** Comma separated page links. Add " ↗" to mark external ones. */
  links?: string
  /** The link shown as current. */
  active?: string
  /** Comma separated section ids/labels for the "on this page" index (sidebar). */
  sections?: string
  /** Two-option segmented switch under the brand (sidebar), e.g. "Design, Code". Empty hides it. */
  toggle?: string
  ctaLabel?: string
  /** Element to watch for scrollspy. Defaults to the window. */
  scrollRoot?: HTMLElement | null
  className?: string
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

function Brand({ brand }: { brand: string }) {
  return (
    <a href="#" className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em]">
      <FolioMark />
      {brand}
    </a>
  )
}

function NavText({ label }: { label: string }) {
  const external = label.endsWith('↗')
  return (
    <>
      {label.replace('↗', '').trim()}
      {external && <ArrowUpRight className="text-(--fo-faint)" />}
    </>
  )
}

function Segmented({ options }: { options: string[] }) {
  const [value, setValue] = useState(options[0])
  return (
    <div className="inline-flex border border-(--fo-line) bg-(--fo-well) p-0.5 text-[11px]">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => setValue(o)}
          className={cn(
            'cursor-pointer px-3 py-1 transition-colors',
            value === o ? 'bg-(--fo-paper) font-medium text-(--fo-ink) shadow-[0_0_0_1px_var(--fo-line)]' : 'text-(--fo-faint) hover:text-(--fo-ink)',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/** Highlights the section closest to the top of the viewport. */
function useScrollSpy(ids: string[], root?: HTMLElement | null) {
  const [current, setCurrent] = useState(ids[0])
  const key = ids.join('|')
  useEffect(() => {
    const els = key
      .split('|')
      .map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    if (els.length === 0) return
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setCurrent(hit.target.id)
      },
      { root: root ?? null, rootMargin: '0px 0px -65% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key, root])
  return current
}

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className="flex cursor-pointer items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-(--fo-soft) uppercase"
    >
      {open ? 'Close' : 'Menu'}
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden>
        {open ? <path d="M4 4l8 8M12 4l-8 8" /> : <path d="M2.5 6h11M2.5 10h11" />}
      </svg>
    </button>
  )
}

function MobileSheet({ items, active, cta }: { items: string[]; active: string; cta?: string }) {
  return (
    <div className="border-t border-(--fo-line) px-5 pt-2 pb-5 [animation:fo-rise_.2s_ease-out]">
      {items.map((label) => (
        <a key={label} href="#" className={cn('flex items-center gap-1.5 border-b border-(--fo-line) py-3 text-[15px]', label === active ? 'text-(--fo-ink)' : 'text-(--fo-soft)')}>
          <NavText label={label} />
        </a>
      ))}
      {cta && (
        <FolioButton className="mt-5 w-full justify-start" size="lg">
          {cta}
        </FolioButton>
      )}
    </div>
  )
}

/** The rail, without the page. Use inside a two-column layout (see Folio Landing). */
export function FolioSidebar({
  brand = 'shinUI',
  links = 'Home, Library, Journal, Changelog, Pricing, Docs ↗, Studio ↗',
  active = 'Home',
  sections = 'Overview, Principles, In use, Install, Notes',
  toggle = 'Design, Code',
  scrollRoot,
  className,
}: Omit<FolioNavbarProps, 'variant' | 'ctaLabel'>) {
  const items = list(links)
  const toc = list(sections)
  const ids = toc.map(slug)
  const current = useScrollSpy(ids, scrollRoot)
  const options = list(toggle).slice(0, 2)

  return (
    <nav className={cn('flex flex-col gap-8 px-8 py-10 text-[14px]', className)}>
      <div className="flex flex-col items-start gap-5">
        <Brand brand={brand} />
        {options.length === 2 && <Segmented options={options} />}
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map((label) => {
          const on = label === active
          return (
            <li key={label}>
              <a href="#" className={cn('relative flex items-center gap-1.5 py-1.5 transition-colors duration-200', on ? 'font-medium text-(--fo-ink)' : 'text-(--fo-soft) hover:text-(--fo-ink)')}>
                {on && <span className="absolute top-1/2 -left-3 size-1.5 -translate-y-1/2 bg-(--fo-blue)" />}
                <NavText label={label} />
              </a>
            </li>
          )
        })}
      </ul>
      {toc.length > 0 && (
        <div className="border-t border-dashed border-(--fo-line-strong) pt-6">
          <FolioLabel>On this page</FolioLabel>
          <ul className="mt-4 flex flex-col gap-0.5">
            {toc.map((label, i) => {
              const on = ids[i] === current
              return (
                <li key={label}>
                  <a
                    href={`#${ids[i]}`}
                    className={cn('flex items-center gap-4 py-1.5 transition-colors duration-200', on ? 'text-(--fo-ink)' : 'text-(--fo-faint) hover:text-(--fo-ink)')}
                  >
                    <span className={cn('h-px transition-all duration-300', on ? 'w-4 bg-(--fo-blue)' : 'w-2 bg-(--fo-line-strong)')} />
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </nav>
  )
}

/**
 * Folio navigation in three variants. All collapse to a "Menu" bar with a
 * stacked sheet on small screens.
 */
export function FolioNavbar({
  variant = 'topbar',
  brand = 'shinUI',
  links = 'Home, Library, Journal, Changelog, Pricing, Docs ↗',
  active = 'Home',
  sections = 'Overview, Principles, In use, Install, Notes',
  toggle = 'Design, Code',
  ctaLabel = 'Open the studio',
  scrollRoot,
  className,
}: FolioNavbarProps) {
  const [open, setOpen] = useState(false)
  const items = list(links)

  const mobile = (
    <div className="md:hidden">
      <div className="flex h-14 items-center justify-between px-5">
        <Brand brand={brand} />
        <MenuButton open={open} onClick={() => setOpen((o) => !o)} />
      </div>
      {open && <MobileSheet items={items} active={active} cta={ctaLabel} />}
    </div>
  )

  if (variant === 'sidebar') {
    return (
      <FolioRoot className={cn('border-(--fo-line) md:h-full md:border-r', className)}>
        {mobile}
        <FolioSidebar className="hidden md:flex" brand={brand} links={links} active={active} sections={sections} toggle={toggle} scrollRoot={scrollRoot} />
      </FolioRoot>
    )
  }

  if (variant === 'index') {
    return (
      <FolioRoot className={cn('border-b border-(--fo-line)', className)}>
        {mobile}
        <div className="mx-auto hidden h-16 max-w-6xl items-center gap-8 px-8 md:flex">
          <Brand brand={brand} />
          <ul className="flex flex-1 items-center justify-center gap-1">
            {items.map((label, i) => {
              const on = label === active
              return (
                <li key={label}>
                  <a
                    href="#"
                    className={cn(
                      'flex items-baseline gap-1.5 px-3 py-2 text-[13px] transition-colors duration-200',
                      on ? 'bg-(--fo-tint) text-(--fo-ink)' : 'text-(--fo-soft) hover:text-(--fo-ink)',
                    )}
                  >
                    <span className={cn('font-mono text-[9.5px]', on ? 'text-(--fo-blue)' : 'text-(--fo-faint)')}>{String(i + 1).padStart(2, '0')}</span>
                    <NavText label={label} />
                  </a>
                </li>
              )
            })}
          </ul>
          {ctaLabel && <FolioButton variant="secondary">{ctaLabel}</FolioButton>}
        </div>
      </FolioRoot>
    )
  }

  return (
    <FolioRoot className={cn('sticky top-0 z-20 border-b border-(--fo-line) bg-(--fo-paper)/90 backdrop-blur', className)}>
      {mobile}
      <div className="mx-auto hidden h-16 max-w-6xl items-center gap-10 px-8 md:flex">
        <Brand brand={brand} />
        <ul className="flex flex-1 items-center gap-6 text-[13.5px]">
          {items.map((label) => {
            const on = label === active
            return (
              <li key={label}>
                <a href="#" className={cn('relative flex items-center gap-1 py-5 transition-colors duration-200', on ? 'text-(--fo-ink)' : 'text-(--fo-soft) hover:text-(--fo-ink)')}>
                  <NavText label={label} />
                  {on && <span className="absolute inset-x-0 -bottom-px h-px bg-(--fo-blue)" />}
                </a>
              </li>
            )
          })}
        </ul>
        {ctaLabel && <FolioButton>{ctaLabel}</FolioButton>}
      </div>
    </FolioRoot>
  )
}
