import { cn } from "@/lib/utils";

export function AvatarStack({
  people,
  max = 4,
  className,
}: {
  people: { name: string; src?: string }[];
  max?: number;
  className?: string;
}) {
  const shown = people.slice(0, max);
  const overflow = people.length - shown.length;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2.5">
        {shown.map((person) => (
          <div
            key={person.name}
            title={person.name}
            className="relative size-9 overflow-hidden rounded-full border-2 border-background bg-muted transition-transform hover:z-10 hover:-translate-y-1"
          >
            {person.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={person.src}
                alt={person.name}
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-xs font-medium">
                {person.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            )}
          </div>
        ))}
        {overflow > 0 && (
          <div className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground">
            +{overflow}
          </div>
        )}
      </div>
    </div>
  );
}
