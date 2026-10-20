import { cn } from "@/lib/utils";

/**
 * Folio section wrapper. Folio pages are plain paper with hairline rules, so
 * `grid` no longer paints a background; `bordered` adds top/bottom hairlines.
 */
export function FolioSection({
  children,
  className,
  bordered = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** @deprecated kept for older call sites; folio sections are plain paper. */
  grid?: boolean;
  bordered?: boolean;
}) {
  return (
    <section className={cn("relative", bordered && "border-y border-(--fo-line)", className)}>
      {children}
    </section>
  );
}

/** Folio page width: max-w-6xl, 24px gutters (40px from md). */
export function FolioContainer({
  children,
  className,
  narrow,
}: {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full px-6",
        narrow ? "max-w-[44rem]" : "max-w-6xl md:px-10",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Folio card: hairline border on paper, square corners, border steps up on hover. */
export function FolioBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  /** @deprecated folio has no glow. */
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative border border-(--fo-line) bg-(--fo-paper) p-5 transition-colors duration-200 hover:border-(--fo-line-strong) sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
