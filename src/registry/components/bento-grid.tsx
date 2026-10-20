import Link from "next/link";

import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[11rem]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  title,
  description,
  icon,
  span = 1,
  tall = false,
  href,
  className,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  span?: 1 | 2 | 3;
  tall?: boolean;
  href?: string;
  className?: string;
}) {
  const spanClass = cn(
    span === 2 && "lg:col-span-2",
    span === 3 && "lg:col-span-3",
    tall && "lg:row-span-2"
  );

  const inner = (
    <div
      className={cn(
        "folio-block group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card/90 p-5 transition-all hover:shadow-md",
        !href && spanClass,
        href && "hover:border-brand/30",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute -top-16 -right-16 size-40 rounded-full bg-brand/12 blur-2xl transition-transform duration-500 group-hover:scale-150"
      />
      {icon && (
        <div className="relative mb-3 flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground [&_svg]:size-4">
          {icon}
        </div>
      )}
      <div className="relative">
        <h3 className="font-semibold tracking-tight">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={spanClass}>
        {inner}
      </Link>
    );
  }

  return inner;
}
