import type { Author } from "./types";

/**
 * Attribution is intentionally sparse: an entry only exists where the maker is
 * publicly and unambiguously credited on the project itself. Unverified
 * resources render without a byline rather than with a guess.
 */
export const authors: Author[] = [
  {
    id: "shadcn",
    name: "shadcn",
    handle: "@shadcn",
    x: "https://x.com/shadcn",
    github: "https://github.com/shadcn",
    site: "https://ui.shadcn.com",
  },
  {
    id: "workos",
    name: "WorkOS",
    handle: "@workos",
    x: "https://x.com/workos",
    site: "https://workos.com",
  },
  {
    id: "mui",
    name: "MUI",
    handle: "@MUI_hq",
    x: "https://x.com/MUI_hq",
    github: "https://github.com/mui",
    site: "https://mui.com",
  },
  {
    id: "saadeghi",
    name: "Pouya Saadeghi",
    handle: "@Saadeghi",
    x: "https://x.com/Saadeghi",
    github: "https://github.com/saadeghi",
  },
  {
    id: "manuarora",
    name: "Manu Arora",
    handle: "@mannupaaji",
    x: "https://x.com/mannupaaji",
    github: "https://github.com/manuarora700",
    site: "https://manuarora.in",
  },
  {
    id: "dillionverma",
    name: "Dillion Verma",
    handle: "@dillionverma",
    x: "https://x.com/dillionverma",
    github: "https://github.com/dillionverma",
  },
  {
    id: "davidhaz",
    name: "David Haz",
    handle: "@davidhdev",
    github: "https://github.com/DavidHDev",
    site: "https://www.davidhaz.com",
  },
  {
    id: "ibelick",
    name: "Julien Thibeaut",
    handle: "@ibelick",
    x: "https://x.com/ibelick",
    github: "https://github.com/ibelick",
    site: "https://ibelick.com",
  },
  {
    id: "emilkowalski",
    name: "Emil Kowalski",
    handle: "@emilkowalski_",
    x: "https://x.com/emilkowalski_",
    github: "https://github.com/emilkowalski",
    site: "https://emilkowal.ski",
  },
  {
    id: "mattperry",
    name: "Matt Perry",
    handle: "@mattgperry",
    x: "https://x.com/mattgperry",
    github: "https://github.com/mattgperry",
    site: "https://motion.dev",
  },
  {
    id: "greensock",
    name: "GreenSock",
    handle: "@greensock",
    x: "https://x.com/greensock",
    site: "https://gsap.com",
  },
  {
    id: "juliangarnier",
    name: "Julian Garnier",
    handle: "@juliangarnier",
    x: "https://x.com/juliangarnier",
    github: "https://github.com/juliangarnier",
  },
  {
    id: "pmndrs",
    name: "Poimandres",
    handle: "@pmndrs",
    github: "https://github.com/pmndrs",
    site: "https://pmnd.rs",
  },
  {
    id: "lucide",
    name: "Lucide Contributors",
    github: "https://github.com/lucide-icons/lucide",
    site: "https://lucide.dev",
  },
  {
    id: "phosphor",
    name: "Phosphor Icons",
    github: "https://github.com/phosphor-icons",
    site: "https://phosphoricons.com",
  },
  {
    id: "jainsahaj",
    name: "Sahaj Jain",
    handle: "@iamsahaj_xyz",
    x: "https://x.com/iamsahaj_xyz",
    github: "https://github.com/jnsahaj",
  },
  {
    id: "darkroom",
    name: "Darkroom Engineering",
    handle: "@darkroomengineering",
    github: "https://github.com/darkroomengineering",
    site: "https://darkroom.engineering",
  },
  {
    id: "osmo",
    name: "Osmo Supply",
    handle: "@osmo_supply",
    x: "https://x.com/osmo_supply",
    site: "https://www.osmo.supply",
  },
  {
    id: "barvian",
    name: "Maxwell Barvian",
    handle: "@barvian",
    github: "https://github.com/barvian",
    site: "https://barvian.me",
  },
  {
    id: "tldraw",
    name: "tldraw",
    handle: "@tldraw",
    x: "https://x.com/tldraw",
    github: "https://github.com/tldraw",
  },
  {
    id: "kaleidos",
    name: "Kaleidos",
    github: "https://github.com/penpot",
    site: "https://penpot.app",
  },
  {
    id: "clauderic",
    name: "Claudéric Demers",
    handle: "@clauderic",
    github: "https://github.com/clauderic",
  },
  {
    id: "davidjerleke",
    name: "David Jerleke",
    github: "https://github.com/davidjerleke",
    site: "https://www.embla-carousel.com",
  },
  {
    id: "formkit",
    name: "FormKit",
    handle: "@useformkit",
    github: "https://github.com/formkit",
    site: "https://formkit.com",
  },
  {
    id: "uretzkyzvi",
    name: "Zvi Uretzky",
    github: "https://github.com/UretzkyZvi",
  },
  {
    id: "tympanus",
    name: "Codrops",
    handle: "@codrops",
    x: "https://x.com/codrops",
    site: "https://tympanus.net/codrops",
  },
  {
    id: "vercel",
    name: "Vercel",
    handle: "@vercel",
    x: "https://x.com/vercel",
    github: "https://github.com/vercel",
    site: "https://vercel.com",
  },
  {
    id: "tanstack",
    name: "TanStack",
    handle: "@tan_stack",
    github: "https://github.com/TanStack",
    site: "https://tanstack.com",
  },
  {
    id: "mikemcbride",
    name: "Mike Bostock",
    handle: "@mbostock",
    github: "https://github.com/mbostock",
    site: "https://d3js.org",
  },
  {
    id: "shinozaki",
    name: "Mark Shinozaki",
    handle: "@MarkShinozaki",
    github: "https://github.com/MarkShinozaki",
  },
];

export const authorById = new Map(authors.map((a) => [a.id, a]));

export function getAuthor(id?: string) {
  return id ? authorById.get(id) : undefined;
}
