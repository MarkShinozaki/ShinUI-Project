import { cn } from "@/lib/utils";

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border border-b-2 bg-muted/70 px-1.5 font-mono text-[11px] font-medium text-muted-foreground",
        className
      )}
    >
      {children}
    </kbd>
  );
}

export function KbdGroup({
  keys,
  className,
}: {
  keys: string[];
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((key, i) => (
        <Kbd key={`${key}-${i}`}>{key}</Kbd>
      ))}
    </span>
  );
}
