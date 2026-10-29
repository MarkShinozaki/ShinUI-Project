import { SplitButton, Sky } from '@/registry/blocks/aside-kit'
import { cn } from '@/lib/utils'

export interface AsideCtaProps {
  title?: string
  subtitle?: string
  animate?: boolean
  className?: string
}

/** A sky card closing the page with a two-line line and the download pill. */
export function AsideCta({ title = 'Made for you and your agents.', subtitle = 'Try it this afternoon.', animate = true, className }: AsideCtaProps) {
  return (
    <section className={cn('px-3 py-3', className)}>
      <div className="relative isolate overflow-hidden rounded-2xl px-6 py-24 text-center">
        <Sky animate={animate} />
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] font-medium tracking-[-0.035em]">
          {title}
          <br />
          {subtitle}
        </h2>
        <div className="mt-8">
          <SplitButton />
        </div>
      </div>
    </section>
  )
}
