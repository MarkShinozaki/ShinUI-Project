/**
 * Top-level umbrellas on /components. Every registry group belongs to exactly
 * one umbrella; groups no umbrella claims land in "Other", so a new group can
 * never disappear from the page.
 */
export type SectionId = "components" | "blocks" | "pixel-art" | "other";

export type SectionDef = {
  id: SectionId;
  label: string;
  title: string;
  lede: string;
  /** Does this umbrella own the registry group with this display name? */
  match: (groupName: string) => boolean;
  /** Stripped from group names for the sub-tab chips, e.g. "Blocks \u00b7 Grid" -> "Grid". */
  prefix?: RegExp;
};

const COMPONENT_GROUPS = new Set(["Components", "Backgrounds", "Footers"]);

/** Chip labels that read better than the raw group name inside their umbrella. */
const CHIP_LABELS: Record<string, string> = {
  Components: "UI elements",
};

export const SECTIONS: SectionDef[] = [
  {
    id: "components",
    label: "Components",
    title: "Pieces you drop into any page.",
    lede: "UI elements, animated backgrounds and standalone footers.",
    match: (name) => COMPONENT_GROUPS.has(name),
  },
  {
    id: "blocks",
    label: "Blocks",
    title: "Full pages and the sections they are built from.",
    lede: "One design family per tab. Each opens with the full page, then its navbar, hero, sections, footer and kit.",
    match: (name) => /^blocks\b/i.test(name),
    prefix: /^blocks\b\W*/i,
  },
  {
    id: "pixel-art",
    label: "Pixel Art",
    title: "Animated scenes that set a mood.",
    lede: "Isometric 3D dioramas and flat 2D sprite scenes, each on its own kit.",
    match: (name) => /^pixel art\b/i.test(name),
    prefix: /^pixel art\b\W*/i,
  },
  {
    // Fallback: must stay last so it only catches what the others don't.
    id: "other",
    label: "Other",
    title: "Everything else.",
    lede: "Groups that don't belong to an umbrella yet.",
    match: () => true,
  },
];

export const DEFAULT_SECTION: SectionId = "components";

/** ?section=all shows every umbrella, one after another. */
export const ALL_SECTIONS = "all";

export function sectionForGroup(groupName: string): SectionDef {
  return SECTIONS.find((s) => s.match(groupName)) ?? SECTIONS[SECTIONS.length - 1];
}

export function isSectionId(value: string | null): value is SectionId {
  return SECTIONS.some((s) => s.id === value);
}

/** Short chip label for a group inside its umbrella. */
export function groupChipLabel(groupName: string, section: SectionDef = sectionForGroup(groupName)): string {
  if (CHIP_LABELS[groupName]) return CHIP_LABELS[groupName];
  const short = section.prefix ? groupName.replace(section.prefix, "").trim() : groupName;
  return short || groupName;
}
