import { cn } from "@/lib/utils";

export function ShimmerText({
  children,
  className,
  duration = 2.4,
}: {
  children: React.ReactNode;
  className?: string;
  /** Seconds per shimmer pass. */
  duration?: number;
}) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent motion-reduce:animate-none",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(110deg, var(--muted-foreground) 40%, var(--foreground) 50%, var(--muted-foreground) 60%)",
        backgroundSize: "220% 100%",
        animation: `shinui-shimmer ${duration}s linear infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes shinui-shimmer {
          from { background-position: 220% 0; }
          to { background-position: -20% 0; }
        }
      `}</style>
    </span>
  );
}
