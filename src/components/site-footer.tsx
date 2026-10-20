import Link from "next/link";

import { GitHubIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { FolioCommand } from "@/components/folio/command";
import { GreatWave } from "@/components/folio/great-wave";
import { ArrowUpRight, FolioButton, FolioLabel, FolioMark } from "@/components/folio/kit";
import { categories } from "@/data/categories";
import { resources } from "@/data/resources";
import { primaryNav } from "@/lib/nav";
import { SITE } from "@/lib/site";

const YEAR = new Date().getFullYear();

const COLUMNS: { head: string; links: { href: string; label: string }[] }[] = [
  { head: "Site", links: primaryNav.map(({ href, label }) => ({ href, label })) },
  {
    head: "Categories",
    links: categories.slice(0, 6).map((c) => ({ href: `/categories/${c.slug}`, label: c.name })),
  },
  {
    head: "Studio",
    links: [
      { href: "/design-tools/favicon-studio", label: "Favicon Studio" },
      { href: "/components", label: "Live components" },
      { href: "/browse", label: "Saved resources" },
      { href: SITE.repo, label: "GitHub ↗" },
    ],
  },
];

function Status({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10.5px] tracking-[0.1em] text-(--fo-soft) uppercase">
      <span className="fo-anim size-1.5 rounded-full bg-(--fo-ok) [animation:fo-pulse_2.4s_ease-in-out_infinite]" />
      {label}
    </span>
  );
}

/**
 * Folio footer, `cta` variant (Design Studio `FolioFooter`): closing call to
 * action, brand + link columns, a status line and a pixel Great Wave strip.
 */
export function SiteFooter() {
  return (
    <div className="mt-16 w-full">
      <footer className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid gap-10 border-t border-(--fo-line) py-16 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div className="min-w-0">
            <h2 className="max-w-lg text-[clamp(1.6rem,3.4vw,2.4rem)] leading-tight font-normal tracking-[-0.03em] text-balance">
              Know something that belongs here?
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-(--fo-soft)">
              The index lives in a single typed file. Add an entry, open a pull request, and it
              shows up everywhere: search, categories, filters.
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-2 md:items-end">
            <FolioButton href={SITE.repo} size="lg">
              Contribute on GitHub
            </FolioButton>
            <FolioCommand
              command="git clone github.com/MarkShinozaki/ShinUI-Project"
              className="w-full md:max-w-[23rem]"
            />
          </div>
        </div>

        <div className="grid gap-10 border-t border-(--fo-line) py-12 md:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col items-start gap-3">
            <Link href="/" className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.02em]">
              <FolioMark />
              ShinUI
            </Link>
            <p className="max-w-xs text-[13.5px] leading-relaxed text-(--fo-soft)">{SITE.description}</p>
            <div className="mt-1 flex items-center gap-1">
              <ThemeToggle className="-ml-2" />
              <a
                href={SITE.repo}
                target="_blank"
                rel="noreferrer"
                aria-label="Source on GitHub"
                className="grid size-9 place-items-center text-(--fo-soft) transition-colors hover:text-(--fo-ink)"
              >
                <GitHubIcon className="size-4" />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map(({ head, links }) => (
              <div key={head}>
                <FolioLabel>{head}</FolioLabel>
                <ul className="mt-4 flex flex-col gap-2.5 text-[13.5px]">
                  {links.map((l) => {
                    const external = l.label.endsWith("↗");
                    const label = l.label.replace("↗", "").trim();
                    const cls =
                      "inline-flex items-center gap-1 text-(--fo-soft) transition-colors duration-200 hover:text-(--fo-ink)";
                    return (
                      <li key={l.href + l.label}>
                        {external ? (
                          <a href={l.href} target="_blank" rel="noreferrer" className={cls}>
                            {label}
                            <ArrowUpRight className="text-(--fo-faint)" />
                          </a>
                        ) : (
                          <Link href={l.href} className={cls}>
                            {label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-(--fo-line) py-6 text-[12px] text-(--fo-faint) sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {YEAR} {SITE.name} · {SITE.author.name}
          </span>
          <div className="flex flex-wrap items-center gap-5">
            <Status label={`${resources.length} resources indexed`} />
            <a href={SITE.author.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-(--fo-ink)">
              Author
            </a>
            <a href={SITE.repo} target="_blank" rel="noreferrer" className="transition-colors hover:text-(--fo-ink)">
              License
            </a>
          </div>
        </div>
      </footer>
      <div className="h-48 w-full overflow-hidden sm:h-96 xl:h-[576px]">
        <GreatWave />
      </div>
    </div>
  );
}
