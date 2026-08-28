"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Blocks, Compass, Home, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/browse", label: "Browse", Icon: Compass },
  { href: "/components", label: "Components", Icon: Blocks },
  { href: "/categories", label: "Categories", Icon: LayoutGrid },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bg-background/85 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ href, label, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span className="relative">
                  <Icon className="size-5" />
                  {active && (
                    <span className="bg-brand absolute -top-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full" />
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
