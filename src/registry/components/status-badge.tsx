import { cn } from "@/lib/utils";

const tones = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  busy: "bg-rose-500",
  offline: "bg-muted-foreground/50",
} as const;

export function StatusBadge({
  status = "online",
  label,
  className,
}: {
  status?: keyof typeof tones;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-background/80 px-2.5 py-1 text-xs font-medium backdrop-blur",
        className
      )}
    >
      <span className="relative flex size-2">
        <span
          className={cn(
            "absolute inline-flex size-full rounded-full opacity-75 motion-reduce:animate-none",
            tones[status],
            status !== "offline" && "animate-ping"
          )}
        />
        <span
          className={cn("relative inline-flex size-2 rounded-full", tones[status])}
        />
      </span>
      {label}
    </span>
  );
}
