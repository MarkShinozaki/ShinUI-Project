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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-(--fo-line) bg-(--fo-paper)/90 backdrop-blur md:hidden pb-safe"
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
                  "relative flex h-14 flex-col items-center justify-center gap-1 font-mono text-[9.5px] tracking-[0.1em] uppercase transition-colors",
                  active ? "text-(--fo-ink)" : "text-(--fo-faint)"
                )}
              >
                <span className="relative">
                  <Icon className="size-5" />
                  {active && (
                    <span className="absolute -top-[9px] left-1/2 size-1.5 -translate-x-1/2 bg-(--fo-accent)" />
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
