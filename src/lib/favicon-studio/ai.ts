import { loadSourceFromUrl } from "./load";
import type { SourceImage } from "./types";

const KEY_STORAGE = "favicon-studio-openrouter-key";
const MODEL_STORAGE = "favicon-studio-openrouter-model";
const LEGACY_KEY_STORAGE = "favicon-studio-openai-key";
const LEGACY_PROVIDER_STORAGE = "favicon-studio-ai-provider";

export interface AiModelOption {
  id: string;
  label: string;
}

function publicModel(envKey: string, fallback: string): string {
  const raw = process.env[envKey]?.trim();
  return raw || fallback;
}

function labelFor(id: string): string {
  const slug = id.split("/").pop() ?? id;
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Models offered in the picker — from NEXT_PUBLIC_FAVICON_STUDIO_MODEL* at build time. */
export function getAiModels(): AiModelOption[] {
  const ids = [
    publicModel(
      "NEXT_PUBLIC_FAVICON_STUDIO_MODEL1",
      "tencent/hy-image-v3.5-preview"
    ),
    publicModel(
      "NEXT_PUBLIC_FAVICON_STUDIO_MODEL2",
      "google/gemini-2.5-flash-image"
    ),
    publicModel(
      "NEXT_PUBLIC_FAVICON_STUDIO_MODEL3",
      "microsoft/mai-image-2.6-flash"
    ),
  ];
  const seen = new Set<string>();
  return ids
    .filter((id) => {
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((id) => ({ id, label: labelFor(id) }));
}

export async function fetchOpenRouterConfig(): Promise<{
  serverKeyConfigured: boolean;
}> {
  try {
    const res = await fetch("/api/favicon-studio/openrouter-config");
    if (!res.ok) return { serverKeyConfigured: false };
    return (await res.json()) as { serverKeyConfigured: boolean };
  } catch {
    return { serverKeyConfigured: false };
  }
}

export function loadSavedApiKey(): string {
  try {
    const current = localStorage.getItem(KEY_STORAGE);
    if (current) return current;
    const legacy = localStorage.getItem(LEGACY_KEY_STORAGE);
    if (legacy) {
      localStorage.setItem(KEY_STORAGE, legacy);
      localStorage.removeItem(LEGACY_KEY_STORAGE);
      localStorage.removeItem(LEGACY_PROVIDER_STORAGE);
      return legacy;
    }
    return "";
  } catch {
    return "";
  }
}

export function saveApiKey(key: string): void {
  try {
    if (key.trim()) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
    localStorage.removeItem(LEGACY_KEY_STORAGE);
    localStorage.removeItem(LEGACY_PROVIDER_STORAGE);
  } catch {
    /* private mode / blocked storage */
  }
}

export function loadSavedModel(models: AiModelOption[]): string {
  try {
    const saved = localStorage.getItem(MODEL_STORAGE);
    if (saved && models.some((m) => m.id === saved)) return saved;
  } catch {
    /* ignore */
  }
  return models[0]?.id ?? "";
}

export function saveModel(model: string): void {
  try {
    if (model) localStorage.setItem(MODEL_STORAGE, model);
  } catch {
    /* ignore */
  }
}

export type AiPurpose = "icon" | "background";

function enhancePrompt(prompt: string, purpose: AiPurpose): string {
  const trimmed = prompt.trim();
  if (purpose === "background") {
    const suffix =
      "Seamless square background texture or pattern for an app icon, no centered subject, no text, no logo, soft or bold abstract fill that works behind a foreground mark";
    const already = /background|texture|pattern|gradient|wallpaper/i.test(trimmed);
    return already ? trimmed : `${trimmed}. ${suffix}`;
  }
  const suffix =
    "Simple, bold favicon or app icon, centered subject, clean edges, high contrast, square composition, no text unless requested";
  return /favicon|icon/i.test(trimmed) ? trimmed : `${trimmed}. ${suffix}`;
}

function proxyHint(status: number): string | null {
  if (status === 404 || status === 502) {
    return "OpenRouter proxy unavailable. Deploy the /api/openrouter route or paste your own API key.";
  }
  return null;
}

async function fromB64(
  b64: string,
  mediaType?: string,
  name = "ai-image.png"
): Promise<SourceImage> {
  const mime = mediaType?.startsWith("image/") ? mediaType : "image/png";
  const url = b64.startsWith("data:") ? b64 : `data:${mime};base64,${b64}`;
  return loadSourceFromUrl(url, name, mime);
}

function openRouterHeaders(manualKey: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "HTTP-Referer":
      typeof window !== "undefined"
        ? window.location.origin
        : "https://shinui.local",
    "X-Title": "Favicon Studio (Shin UI)",
  };
  const trimmed = manualKey.trim();
  if (trimmed) headers.Authorization = `Bearer ${trimmed}`;
  return headers;
}

/** Dedicated OpenRouter Images API (via same-origin proxy). */
async function generateViaImagesApi(
  prompt: string,
  manualKey: string,
  model: string,
  purpose: AiPurpose
): Promise<SourceImage> {
  const res = await fetch("/api/openrouter/api/v1/images", {
    method: "POST",
    headers: openRouterHeaders(manualKey),
    body: JSON.stringify({
      model,
      prompt: enhancePrompt(prompt, purpose),
      aspect_ratio: "1:1",
      size: "1024x1024",
      output_format: "png",
      n: 1,
    }),
  });

  const body = (await res.json().catch(() => null)) as {
    error?: { message?: string };
    data?: { b64_json?: string; media_type?: string }[];
  } | null;

  if (!res.ok) {
    throw new Error(
      proxyHint(res.status) ||
        body?.error?.message ||
        `OpenRouter error (${res.status})`
    );
  }

  const item = body?.data?.[0];
  if (!item?.b64_json) throw new Error("OpenRouter returned no image data");
  return fromB64(
    item.b64_json,
    item.media_type,
    purpose === "background" ? "ai-background.png" : "ai-favicon.png"
  );
}

async function generateViaChat(
  prompt: string,
  manualKey: string,
  model: string,
  purpose: AiPurpose
): Promise<SourceImage> {
  const fileName =
    purpose === "background" ? "ai-background.png" : "ai-favicon.png";
  const res = await fetch("/api/openrouter/api/v1/chat/completions", {
    method: "POST",
    headers: openRouterHeaders(manualKey),
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: enhancePrompt(prompt, purpose) }],
      modalities: ["image", "text"],
    }),
  });

  const body = (await res.json().catch(() => null)) as {
    error?: { message?: string };
    choices?: {
      message?: {
        images?: { image_url?: { url?: string }; url?: string }[];
        content?: string | { type?: string; image_url?: { url?: string } }[];
      };
    }[];
  } | null;

  if (!res.ok) {
    throw new Error(
      proxyHint(res.status) ||
        body?.error?.message ||
        `OpenRouter error (${res.status})`
    );
  }

  const message = body?.choices?.[0]?.message;
  const fromImages =
    message?.images?.[0]?.image_url?.url || message?.images?.[0]?.url;
  if (fromImages) return fromB64(fromImages, undefined, fileName);

  const content = message?.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      const url = part?.image_url?.url;
      if (url) return fromB64(url, undefined, fileName);
    }
  }

  throw new Error("OpenRouter returned no image data for this model");
}

/**
 * OpenRouter image generation. User-pasted keys are sent in Authorization;
 * when empty, the server proxy may apply OPENROUTER from the environment.
 */
export async function generateAiImage(
  prompt: string,
  manualKey: string,
  model: string,
  purpose: AiPurpose = "icon",
  serverKeyConfigured = false
): Promise<SourceImage> {
  if (!prompt.trim()) {
    throw new Error(
      purpose === "background"
        ? "Enter a prompt for the background"
        : "Enter a prompt describing your icon"
    );
  }
  if (!manualKey.trim() && !serverKeyConfigured) {
    throw new Error(
      "Add your OpenRouter API key, or configure OPENROUTER on the server"
    );
  }
  if (!model.trim()) throw new Error("Pick a model");

  const modelId = model.trim();
  const preferChat = /gemini|flash-image/i.test(modelId);

  if (preferChat) {
    try {
      return await generateViaChat(prompt, manualKey, modelId, purpose);
    } catch (chatErr) {
      try {
        return await generateViaImagesApi(prompt, manualKey, modelId, purpose);
      } catch {
        throw chatErr;
      }
    }
  }

  try {
    return await generateViaImagesApi(prompt, manualKey, modelId, purpose);
  } catch (imagesErr) {
    try {
      return await generateViaChat(prompt, manualKey, modelId, purpose);
    } catch {
      throw imagesErr;
    }
  }
}
