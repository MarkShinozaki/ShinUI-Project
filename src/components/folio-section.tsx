import { cn } from "@/lib/utils";

/** Editorial section wrapper with optional visible folio grid. */
export function FolioSection({
  children,
  className,
  grid = false,
  bordered = false,
}: {
  children: React.ReactNode;
  className?: string;
  grid?: boolean;
  bordered?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative",
        grid && "folio-grid",
        bordered && "border-y border-border/80",
        className
      )}
    >
      {children}
    </section>
  );
}

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
        "relative mx-auto max-w-7xl px-4 sm:px-6",
        narrow && "max-w-5xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function FolioBlock({
  children,
  className,
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "folio-block bg-card/80 relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm sm:p-6",
        glow && "gradient-border",
        className
      )}
    >
      {children}
    </div>
  );
}
