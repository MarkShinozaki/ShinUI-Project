import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-[7px] bg-primary text-primary-foreground",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(135deg,var(--brand),transparent_65%)] opacity-70"
      />
      <span className="relative text-[13px] leading-none font-bold tracking-tight">
        S
      </span>
    </span>
  );
}
