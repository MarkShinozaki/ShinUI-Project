import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Folio kit, ported from Design Studio (`src/blocks/folio-kit.tsx`).
 *
 * Editorial, docs-like: paper, ink stepped down with opacity, one accent,
 * square corners, hairline rules, tiny uppercase mono labels and dithered
 * pixel art. On Shin UI the accent is sakura rose (light) / bloom (dark) and
 * every `--fo-*` token lives in `globals.css`, so no root wrapper is needed.
 */

/** Page-width wrapper used by every folio section. */
export function FolioWrap({
  width = "wide",
  className,
  children,
}: {
  width?: "narrow" | "wide";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6",
        width === "narrow" ? "max-w-[44rem]" : "max-w-6xl md:px-10",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Tiny uppercase mono label: eyebrows, table heads, captions. */
export function FolioLabel({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

/** A full-width hairline. */
export function FolioRule({
  dashed,
  className,
}: {
  dashed?: boolean;
  className?: string;
}) {
  return (
    <hr
      className={cn(
        "border-0 border-t border-(--fo-line)",
        dashed && "border-dashed",
        className
      )}
    />
  );
}

/** Four small L-shaped corners, like crop marks. Parent must be `relative`. */
export function FolioBrackets({
  className,
  inset = 0,
}: {
  className?: string;
  inset?: number;
}) {
  const base = "pointer-events-none absolute size-2.5 border-(--fo-line-strong)";
  const s = { margin: inset };
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span style={s} className={cn(base, "top-0 left-0 border-t border-l")} />
      <span style={s} className={cn(base, "top-0 right-0 border-t border-r")} />
      <span style={s} className={cn(base, "bottom-0 left-0 border-b border-l")} />
      <span style={s} className={cn(base, "right-0 bottom-0 border-r border-b")} />
    </span>
  );
}

/** The Folio mark: a folded-corner page glyph, in sakura. */
export function FolioMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("size-5 text-(--fo-accent)", className)} aria-hidden>
      <path d="M3 2h9l5 5v11H3z" fill="currentColor" />
      <path d="M12 2v5h5" fill="var(--fo-paper)" opacity={0.85} />
      <path d="M6 11h8M6 14h5" stroke="var(--fo-paper)" strokeWidth={1.4} />
    </svg>
  );
}

export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={cn("size-3", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      aria-hidden
    >
      <path d="M3.5 8.5l5-5M4.5 3.5h4v4" />
    </svg>
  );
}

export function SparkGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden
    >
      <path d="M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2" />
    </svg>
  );
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Next.js Link for internal routes, plain anchor (new tab) for external URLs. */
export function FolioAnchor({
  href,
  className,
  children,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { href: string }) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}

interface FolioButtonProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  /** Primary: a glyph in its own cell on the left. Others: a ↗ arrow. */
  icon?: boolean;
  size?: "md" | "lg";
}

/** Square, mono, uppercase. Primary is solid sakura; secondary is a tinted well with crop marks. */
export function FolioButton({
  href,
  variant = "primary",
  icon = true,
  size = "md",
  className,
  children,
  ...props
}: FolioButtonProps) {
  const h = size === "lg" ? "h-11" : "h-9";
  const text = "font-mono text-[11px] tracking-[0.1em] uppercase";
  const motion =
    "transition-[background-color,color,translate] duration-200 ease-[cubic-bezier(.25,.1,.25,1)]";
  if (variant === "primary") {
    return (
      <FolioAnchor
        href={href}
        className={cn(
          "group inline-flex items-stretch bg-(--fo-accent) text-(--fo-on-accent) hover:bg-(--fo-accent-press) active:translate-y-px",
          h,
          text,
          motion,
          className
        )}
        {...props}
      >
        {icon && (
          <span
            className={cn(
              "grid place-items-center border-r border-(--fo-paper)/25",
              size === "lg" ? "w-11" : "w-9"
            )}
          >
            <SparkGlyph className="transition-transform duration-500 group-hover:rotate-45" />
          </span>
        )}
        <span className="flex items-center px-4">{children}</span>
      </FolioAnchor>
    );
  }
  return (
    <FolioAnchor
      href={href}
      className={cn(
        "relative inline-flex items-center gap-2 px-4 active:translate-y-px",
        variant === "secondary"
          ? "bg-(--fo-tint) text-(--fo-ink) hover:bg-(--fo-tint-strong)"
          : "text-(--fo-ink) hover:text-(--fo-accent)",
        h,
        text,
        motion,
        className
      )}
      {...props}
    >
      {variant === "secondary" && <FolioBrackets />}
      {children}
      {icon && <ArrowUpRight />}
    </FolioAnchor>
  );
}

/** Inline accent link with a tiny boxed plus, like a footnote. */
export function FolioLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <FolioAnchor
      href={href}
      className={cn(
        "text-(--fo-accent) decoration-1 underline-offset-4 hover:underline",
        className
      )}
    >
      {children}
      <span
        aria-hidden
        className="ml-0.5 inline-grid size-2.5 translate-y-[-0.35em] place-items-center border border-current text-[7px] leading-none"
      >
        +
      </span>
    </FolioAnchor>
  );
}

/** Small announcement chip: pulsing dot, label, bordered link. */
export function FolioAnnouncement({
  label,
  link,
  href,
  className,
}: {
  label: string;
  link: string;
  href: string;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-stretch bg-(--fo-well) text-[11.5px]", className)}>
      <span className="flex items-center gap-2 px-3 py-1.5 text-(--fo-soft)">
        <span className="fo-anim size-1.5 rounded-full bg-(--fo-ok) [animation:fo-pulse_2.4s_ease-in-out_infinite]" />
        {label}
      </span>
      <FolioAnchor
        href={href}
        className="flex items-center gap-1.5 border border-(--fo-line-strong) bg-(--fo-paper) px-3 font-medium transition-colors hover:text-(--fo-accent)"
      >
        {link}
        <ArrowUpRight />
      </FolioAnchor>
    </div>
  );
}

/** A column chart drawn as stacked squares. One column can be highlighted. */
export function PixelBars({
  values,
  rows = 6,
  highlight = -1,
  className,
}: {
  values: number[];
  rows?: number;
  highlight?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-[3px]", className)} aria-hidden>
      {values.map((v, col) => {
        const filled = Math.max(1, Math.round(v * rows));
        return (
          <div key={col} className="flex flex-1 flex-col-reverse gap-[3px]">
            {Array.from({ length: rows }, (_, row) => (
              <span
                key={row}
                className={cn(
                  "aspect-square w-full",
                  row < filled
                    ? col === highlight
                      ? "bg-(--fo-accent)"
                      : "bg-(--fo-accent)/45"
                    : "bg-(--fo-line)"
                )}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** A dotted-grid panel for diagrams and figures, with an optional caption. */
export function FolioFigure({
  children,
  caption,
  className,
  dots = true,
}: {
  children: ReactNode;
  caption?: ReactNode;
  className?: string;
  dots?: boolean;
}) {
  return (
    <figure className={className}>
      <div className={cn("relative border border-(--fo-line)", dots && "fo-dots")}>{children}</div>
      {caption && (
        <figcaption className="mt-3 max-w-md text-[12px] leading-relaxed text-(--fo-faint)">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** "a *b* c" → muted text with inked emphasis. */
export function Inked({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") ? (
          <span key={i} className="text-(--fo-ink)">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Section opener: hairline, mono eyebrow, regular-weight title, muted lede, optional link. */
export function FolioSectionHead({
  eyebrow,
  title,
  lede,
  link,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  link?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cn("border-t border-(--fo-line) pt-10", className)}>
      {eyebrow && <FolioLabel className="mb-4">{eyebrow}</FolioLabel>}
      <h2 className="max-w-xl text-[clamp(1.4rem,2.6vw,1.75rem)] leading-tight font-normal tracking-[-0.02em] text-balance">
        {title}
      </h2>
      {lede && <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-(--fo-soft)">{lede}</p>}
      {link && (
        <FolioAnchor
          href={link.href}
          className="mt-5 inline-flex items-center gap-1 text-[13.5px] font-medium transition-colors hover:text-(--fo-accent)"
        >
          {link.label} <ArrowUpRight />
        </FolioAnchor>
      )}
    </div>
  );
}

/** Zero-padded index, folio style: 001, 002… */
export const pad = (n: number, width = 3) => String(n).padStart(width, "0");
