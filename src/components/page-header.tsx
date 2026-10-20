import Link from "next/link";

import { FolioLabel } from "@/components/folio/kit";
import { cn } from "@/lib/utils";

/**
 * Folio page opener (Design Studio folio hero, editorial): mono breadcrumb /
 * eyebrow, a large regular-weight title, a muted lede and a closing hairline.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  actions,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  breadcrumbs?: { href: string; label: string }[];
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative border-b border-(--fo-line) pt-6 pb-10 md:pt-10", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                <Link
                  href={crumb.href}
                  aria-current={i === breadcrumbs.length - 1 ? "page" : undefined}
                  className={cn(
                    "transition-colors hover:text-(--fo-ink)",
                    i === breadcrumbs.length - 1 && "text-(--fo-accent)"
                  )}
                >
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          {typeof eyebrow === "string" ? <FolioLabel className="mb-5">{eyebrow}</FolioLabel> : eyebrow}
          <h1 className="text-[clamp(2rem,5vw,3.1rem)] leading-[1.08] font-normal tracking-[-0.03em] text-balance">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-pretty text-(--fo-soft)">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
