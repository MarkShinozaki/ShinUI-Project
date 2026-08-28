import { cn } from "@/lib/utils";

export function GradientBorder({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl p-px",
        "bg-[linear-gradient(135deg,var(--brand),color-mix(in_oklch,var(--brand)_30%,var(--foreground)),var(--brand))]",
        className
      )}
    >
      <div
        className={cn(
          "bg-card h-full rounded-[calc(var(--radius-xl)-1px)] p-5",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
