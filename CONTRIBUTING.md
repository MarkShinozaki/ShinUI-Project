# Contributing to ShinUI ✨

Hey — thanks for stopping by. **ShinUI** ([shinozaki.design](https://shinozaki.design)) is a searchable index of UI and design resources with live component previews. No database, no CMS — just typed data, good links, and credit where it’s due.

If you fix a typo, add a resource, or ship a live component preview, you’re officially part of the project. 🎌

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be kind, be factual, and keep discussions about the work.

## Local setup

This repo uses **pnpm** (see `packageManager` in `package.json`). Please don’t use `npm install` here.

```bash
git clone https://github.com/MarkShinozaki/ShinUI-Project.git
cd ShinUI-Project
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Handy scripts:

```bash
pnpm lint       # ESLint
pnpm typecheck  # TypeScript (tsc --noEmit)
pnpm test       # Vitest (unit tests)
pnpm build      # production build
```

CI runs lint, typecheck, and test on every pull request.

## What to contribute

| Goal | Where to look |
| --- | --- |
| Add a link to the index | `src/data/resources.ts` |
| Fix category metadata | `src/data/categories.ts` |
| Verified maker credit | `src/data/authors.ts` |
| Live component + demo | `src/registry/` |

## Adding a resource (most common PR)

1. Open `src/data/resources.ts` and append an object that matches the existing shape.
2. Use a **kebab-case** `slug` (unique, URL-safe).
3. Write **factual** `tagline` and `description` — what the tool/library *is* and when someone might use it. No hype, no “best-in-class” marketing.
4. Set `category` to a slug from `src/data/categories.ts`.
5. Set `addedAt` to today’s date (`YYYY-MM-DD`).
6. Leave **`featured: false`** unless you’re the maintainer — featured placement is curator-only.
7. Only set `authorId` if the maker is **publicly and unambiguously** credited on the project itself (see `authors.ts`).

Example:

```ts
{
  slug: "example-ui",
  name: "Example UI",
  tagline: "One neutral line on what it offers",
  description: "A short paragraph on scope and typical use — same tone as other entries.",
  url: "https://example.com/",
  category: "component-libraries",
  tags: ["react", "tailwind"],
  stack: ["React", "Tailwind"],
  pricing: "open-source",
  featured: false,
  addedAt: "2026-10-19",
}
```

### Affiliation & promotion

- If you **work on or are affiliated** with a product you add or edit, say so in the PR description.
- Don’t use ShinUI as a billboard: no keyword stuffing, affiliate links, or copy-paste from landing pages.
- PRs whose main purpose is SEO or ads for a single product may be closed without merge.

## Adding a live component

1. Create `src/registry/components/<slug>.tsx` with a named export.
2. Add a demo in `src/registry/demos/index.tsx`.
3. Register it in `src/registry/index.ts`.

See existing entries for patterns. Keep previews self-contained and respectful of licenses.

## Branch, commit, and PR flow

1. Fork the repo (or branch from `main` if you’re a collaborator).
2. Create a branch: `your-name/short-description` or `cursor/…` — anything clear works.
3. Make focused commits with plain messages (`Add resource: Example UI`).
4. Run `pnpm lint` and `pnpm typecheck` before pushing.
5. Open a pull request against **`main`**. Fill in the PR template.

Maintainer review is manual — thanks for patience. 💚

## What gets a PR closed (without drama, just policy)

- **`featured: true`** from non-maintainers
- Marketing fluff, inaccurate attribution, or resources that don’t fit the index
- Duplicate URLs or slugs
- Changes that break the build, types, or lint
- Large drive-by refactors unrelated to the stated goal
- Ignoring the [Code of Conduct](CODE_OF_CONDUCT.md)

Questions? Open a [Discussion](https://github.com/MarkShinozaki/ShinUI-Project/discussions) or a [resource suggestion issue](https://github.com/MarkShinozaki/ShinUI-Project/issues/new?template=resource_suggestion.yml).

**ありがとう** — see you in the queue. 🚀
