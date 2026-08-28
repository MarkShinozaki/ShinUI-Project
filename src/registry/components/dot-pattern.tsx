import { cn } from "@/lib/utils";

export function DotPattern({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-xl border", className)}
      style={{
        backgroundImage:
          "radial-gradient(circle, color-mix(in oklch, var(--foreground) 12%, transparent) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {children}
    </div>
  );
}
