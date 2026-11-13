import { sectionForGroup } from "@/lib/component-sections";
import {
  groupLabelOf,
  matchComponents,
  matchResources,
  termsFromQuery,
} from "@/lib/site-search";

export type AISuggestedComponent = {
  slug: string;
  name: string;
  group: string;
  section: string;
  description: string;
  href: string;
};

export type AISuggestedResource = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  href: string;
};

export type AIStepId = "understand" | "components" | "resources";

export type AIStep = {
  id: AIStepId;
  label: string;
};

export const AI_STEPS: AIStep[] = [
  { id: "understand", label: "Understanding your project" },
  { id: "components", label: "Finding components" },
  { id: "resources", label: "Finding resources" },
];

export const AI_MODEL_BADGE = "OpenRouter · free model — coming soon";

export const EXAMPLE_PROMPTS = [
  "A marketing landing page for a design tool, with a strong hero and footer",
  "An AI chat assistant with streaming replies and a thinking state",
  "A portfolio with pixel-art scenes and a dark theme",
  "A product dashboard with stats, charts and live status",
  "An iOS-style settings screen with toggles and segmented controls",
];

export type AIAnswer = {
  summary: string;
  components: AISuggestedComponent[];
  resources: AISuggestedResource[];
  /**
   * True when the answer came from the local keyword preview, not a model.
   * A future /api/search/ask route should set this to false.
   */
  preview: boolean;
  model?: string;
  intent?: string;
};

type Intent = {
  match: RegExp;
  label: string;
  extraTerms: string[];
};

const INTENTS: Intent[] = [
  {
    match: /\b(land(ing)?|market(ing)?|hero|startup|launch|saas|waitlist)\b/i,
    label: "a marketing or landing page",
    extraTerms: ["hero", "footer", "marquee", "glow", "folio", "cta", "button"],
  },
  {
    match: /\b(chat|assistant|agent|llm|copilot|prompt|streaming)\b/i,
    label: "an AI or chat product",
    extraTerms: ["thinking", "typing", "shimmer", "chat", "agent", "ai"],
  },
  {
    match: /\b(dashboard|analytics|chart|metric|admin|stats?)\b/i,
    label: "a dashboard or data view",
    extraTerms: ["counter", "progress", "stat", "bento", "status", "chart"],
  },
  {
    match: /\b(portfolio|personal site|resume|folio)\b/i,
    label: "a portfolio",
    extraTerms: ["folio", "hero", "pixel", "marquee"],
  },
  {
    match: /\b(ios|mobile|settings|toggle|iphone)\b/i,
    label: "a mobile or iOS-style interface",
    extraTerms: ["ios", "toggle", "segmented", "dock"],
  },
  {
    match: /\b(pixel|game|isometric|3d|diorama|sprite|scene)\b/i,
    label: "a pixel or 3D scene",
    extraTerms: ["pixel", "iso", "scene", "bus"],
  },
  {
    match: /\b(sound|audio|chime|music|sfx)\b/i,
    label: "a sound or audio experience",
    extraTerms: ["sound", "audio", "chime"],
  },
  {
    match: /\b(icon|glyph|svg|pictogram)\b/i,
    label: "an icon system",
    extraTerms: ["icon", "svg"],
  },
  {
    match: /\b(auth|login|sign[ -]?up|onboarding)\b/i,
    label: "an auth or onboarding flow",
    extraTerms: ["button", "form", "input", "toggle"],
  },
  {
    match: /\b(motion|animation|video|rive|remotion)\b/i,
    label: "a motion or video interface",
    extraTerms: ["motion", "animation", "rive", "video"],
  },
];

function detectIntent(prompt: string) {
  return INTENTS.find((intent) => intent.match.test(prompt)) ?? null;
}

function previewAnswer(prompt: string): AIAnswer {
  const intent = detectIntent(prompt);
  const terms = [...termsFromQuery(prompt), ...(intent?.extraTerms ?? [])];
  const uniqueTerms = [...new Set(terms)];

  const components = matchComponents(uniqueTerms)
    .slice(0, 4)
    .map(({ item }) => {
      const group = groupLabelOf(item);
      return {
        slug: item.slug,
        name: item.name,
        group,
        section: sectionForGroup(group).label,
        description: item.description,
        href: `/components/${item.slug}`,
      };
    });

  const resources = matchResources(uniqueTerms)
    .slice(0, 4)
    .map(({ resource }) => ({
      slug: resource.slug,
      name: resource.name,
      tagline: resource.tagline,
      category: resource.category,
      href: `/resource/${resource.slug}`,
    }));

  const short = prompt.length > 80 ? `${prompt.slice(0, 77).trimEnd()}…` : prompt;
  const found = components.length + resources.length;
  let summary: string;

  if (found === 0) {
    summary =
      "No close keyword match turned up in the index. Try naming a UI pattern (hero, chat, dashboard) or a resource type (icons, charts, motion). This preview is a simple keyword search, not a model.";
  } else if (intent) {
    summary = `This reads like ${intent.label}. Here are live components and curated resources from the Shin UI index that match those keywords.`;
  } else {
    summary = `Here are the closest components and resources in the Shin UI index for “${short}”.`;
  }

  if (found > 0) {
    summary +=
      " This is a preview from simple keyword matching — a live OpenRouter model will replace it later.";
  }

  return {
    summary,
    components,
    resources,
    preview: true,
    intent: intent?.label,
  };
}

/**
 * Ask the Shin UI index about a project the visitor is building.
 *
 * Today this returns a local keyword preview (`preview: true`). A future
 * `/api/search/ask` route should drop in here, for example:
 *
 *   const res = await fetch("/api/search/ask", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ prompt }),
 *   });
 *   if (!res.ok) throw new Error("Ask failed");
 *   return (await res.json()) as AIAnswer;
 */
export async function askAI(prompt: string): Promise<AIAnswer> {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return { summary: "", components: [], resources: [], preview: true };
  }
  return previewAnswer(trimmed);
}
