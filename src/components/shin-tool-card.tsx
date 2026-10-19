import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ShinToolCard({
  href,
  title,
  description,
  badge = "Built on Shin UI",
  icon,
  className,
}: {
  href: string;
  title: string;
  description: string;
  badge?: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group bg-card relative flex flex-col rounded-xl border p-5 transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="bg-muted text-brand grid size-11 shrink-0 place-items-center rounded-lg border">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="leading-tight font-semibold tracking-tight">
              <Link href={href} className="after:absolute after:inset-0">
                {title}
              </Link>
            </h3>
            <Badge variant="secondary" className="text-[10px] font-normal">
              {badge}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm text-pretty">
            {description}
          </p>
        </div>
        <ArrowRight className="text-muted-foreground size-4 shrink-0 transition group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </article>
  );
}
