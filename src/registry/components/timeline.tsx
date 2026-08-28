import { cn } from "@/lib/utils";

export type TimelineItem = {
  title: string;
  date: string;
  description?: string;
};

export function Timeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-6 border-l pl-6", className)}>
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="relative">
          <span
            aria-hidden
            className="bg-brand absolute top-1.5 -left-[calc(0.75rem+1px)] size-3 rounded-full ring-4 ring-background"
          />
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {item.date}
          </p>
          <p className="mt-1 font-semibold tracking-tight">{item.title}</p>
          {item.description && (
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {item.description}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
