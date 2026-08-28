import { cn } from "@/lib/utils";

export function GlowButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full px-6 text-sm font-medium",
        "bg-primary text-primary-foreground transition-transform active:scale-[0.97]",
        "focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,color-mix(in_oklch,var(--primary-foreground)_35%,transparent),transparent)] transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
      />
      <span
        aria-hidden
        className="absolute -inset-1 -z-10 rounded-full bg-brand/40 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}
