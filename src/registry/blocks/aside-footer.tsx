import { AsideMark } from '@/registry/blocks/aside-kit'
import { cn } from '@/lib/utils'

export interface AsideFooterProps {
  brand?: string
  className?: string
}

const COLS: [string, string[]][] = [
  ['Product', ['Assistant', 'Passwords', 'Memory', 'Download']],
  ['Use cases', ['Sales', 'Recruiting', 'Support', 'Research']],
  ['Resources', ['Guides', 'Changelog', 'Status', 'Help']],
  ['Company', ['About', 'Careers', 'Press', 'Contact']],
  ['Legal', ['Terms', 'Privacy', 'Security']],
]

/** Five plain link columns with a brand line and a slim bottom bar. */
export function AsideFooter({ brand = 'shinUI', className }: AsideFooterProps) {
  return (
    <footer className={cn('px-6 pt-16', className)}>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-6">
        <a href="#" className="col-span-2 flex items-start gap-2 text-[17px] font-semibold tracking-tight sm:col-span-3 md:col-span-1">
          <AsideMark /> {brand}
        </a>
        {COLS.map(([h, ls]) => (
          <div key={h}>
            <p className="text-[12px] text-(--as-dim)">{h}</p>
            <ul className="mt-3 space-y-2">
              {ls.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13.5px] text-(--as-ink)/85 hover:text-(--as-ink)">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-6xl justify-between border-t border-(--as-line) py-5 text-[12px] text-(--as-dim)">
        <span>© 2026 {brand}</span>
        <span>Made with care</span>
      </div>
    </footer>
  )
}
