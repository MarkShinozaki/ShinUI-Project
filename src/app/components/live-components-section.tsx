import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegistryDemo } from "@/registry/demo-map";
import { registry } from "@/registry";

export function LiveComponentsSection() {
  const showcase = registry.slice(0, 4);

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading
          title="Live components"
          description="Not screenshots. These render right here, and the source is one tab away."
          href="/components"
          linkLabel="All components"
        />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {showcase.map((item) => (
            <Link
              key={item.slug}
              href={`/components/${item.slug}`}
              className="group bg-background overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
            >
              <div className="flex min-h-44 items-center justify-center overflow-hidden p-6">
                <div className="pointer-events-none w-full">
                  <div className="flex w-full justify-center">
                    <RegistryDemo name={item.demoExport} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {item.tags.slice(0, 3).join(" · ")}
                  </p>
                </div>
                <ArrowRight className="text-muted-foreground ml-auto size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  title,
  description,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link href={href}>
          {linkLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}