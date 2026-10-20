import type { ReactNode } from "react";
import Link from "next/link";

import { DitherField } from "@/components/folio/dither-field";
import { ArrowUpRight, FolioLabel } from "@/components/folio/kit";
import { cn } from "@/lib/utils";

/** A built-in tool, as a folio feature tile: dithered sakura swatch beside short copy. */
export function ShinToolCard({
  href,
  title,
  description,
  badge = "Built on Shin UI",
  icon,
  className,
}: {
  href: string;
  title: string;
  description: string;
  badge?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex gap-5 border border-(--fo-line) bg-(--fo-paper) p-5 transition-colors duration-200 hover:border-(--fo-accent)",
        className
      )}
    >
      <div className="relative size-14 shrink-0 overflow-hidden transition-transform duration-300 group-hover:-translate-y-0.5">
        <DitherField shape="orb" cell={2} inverse />
        {icon && (
          <span className="absolute inset-0 grid place-items-center text-(--fo-on-accent) [&_svg]:size-4">
            {icon}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <FolioLabel className="text-(--fo-accent)">{badge}</FolioLabel>
        <h3 className="mt-2 text-[15.5px] font-medium tracking-[-0.01em]">
          <Link href={href} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-pretty text-(--fo-soft)">{description}</p>
      </div>
      <ArrowUpRight className="size-3.5 shrink-0 text-(--fo-faint) transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--fo-accent)" />
    </article>
  );
}
