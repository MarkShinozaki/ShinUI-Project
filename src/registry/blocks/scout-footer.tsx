'use client'

import { useState } from 'react'
import { Cross, Mono, ScoutMark } from '@/registry/blocks/scout-kit'
import { cn } from '@/lib/utils'

const LINKS = [
  ['GitHub', 'Changelog', 'Discussions', 'Showcase'],
  ['Blocks', 'Kits', 'Contact', 'Licence'],
]

export interface ScoutFooterProps {
  brand?: string
  className?: string
}

/** A grid footer: signup on the left, a large mark in the middle, links on the right. */
export function ScoutFooter({ brand = 'shinUI', className }: ScoutFooterProps) {
  const [sent, setSent] = useState(false)
  return (
    <footer className={cn('relative border-t border-(--sc-line)', className)}>
      <Cross className="top-0 left-1/3 hidden md:block" />
      <Cross className="top-0 left-2/3 hidden md:block" />
      <div className="grid md:grid-cols-3">
        <div className="flex flex-col justify-between gap-8 border-b border-(--sc-line) p-6 md:border-r md:border-b-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
            className="flex flex-col gap-2"
          >
            <label htmlFor="sc-email" className="text-[12.5px] text-(--sc-dim)">
              Get new blocks in your inbox
            </label>
            <div className="flex">
              <input id="sc-email" type="email" required placeholder="you@studio.dev" className="h-9 min-w-0 flex-1 border border-(--sc-line) bg-transparent px-3 text-[13px] placeholder:text-(--sc-faint) focus:border-(--sc-accent) focus:outline-none" />
              <button type="submit" aria-label="Subscribe" className="h-9 w-9 bg-(--sc-accent) text-(--sc-accent-ink)">
                →
              </button>
            </div>
            <span aria-live="polite" className="h-4 text-[12px] text-(--sc-accent)">{sent ? 'Thanks, you are on the list.' : ''}</span>
          </form>
          <Mono className="text-(--sc-faint)">Made in the open</Mono>
        </div>
        <div className="grid min-h-56 place-items-center border-b border-(--sc-line) md:border-r md:border-b-0">
          <ScoutMark className="size-20" />
        </div>
        <div className="grid grid-cols-2 gap-2 p-6">
          {LINKS.map((col, i) => (
            <nav key={i} aria-label={i ? 'Product' : 'Community'} className="flex flex-col gap-2">
              {col.map((l) => (
                <a key={l} href="#" className="w-fit text-[14px] text-(--sc-dim) hover:text-(--sc-fg)">{l}</a>
              ))}
            </nav>
          ))}
        </div>
      </div>
      <div className="flex justify-between border-t border-(--sc-line) px-6 py-3 text-(--sc-faint)">
        <Mono>© {brand}</Mono>
        <Mono>MIT licence</Mono>
      </div>
    </footer>
  )
}
