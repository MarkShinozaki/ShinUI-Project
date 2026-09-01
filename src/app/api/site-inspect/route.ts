import { NextResponse } from "next/server";

import { resources } from "@/data/resources";
import { normalizeResourceUrl } from "@/lib/user-resources";
import { validateUrlPolicy } from "@/lib/url-policy";

type InspectBody = { url?: string };

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function metaContent(html: string, key: string, attr: "name" | "property" = "name") {
  const pattern = new RegExp(
    `<meta[^>]+${attr}=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${key}["'][^>]*>`,
    "i"
  );
  return decodeHtml(html.match(pattern)?.[1] ?? html.match(alt)?.[1] ?? "");
}

function pageTitle(html: string) {
  const og = metaContent(html, "og:title", "property");
  if (og) return og;
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
  return decodeHtml(title ?? "");
}

function pageDescription(html: string) {
  const og = metaContent(html, "og:description", "property");
  if (og) return og;
  const description = metaContent(html, "description");
  if (description) return description;
  return metaContent(html, "twitter:description", "name");
}

async function probeRegistry(origin: string) {
  const candidates = ["/r/index.json", "/registry/index.json"];
  for (const path of candidates) {
    try {
      const response = await fetch(`${origin}${path}`, {
        signal: AbortSignal.timeout(6000),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) continue;
      const data = (await response.json()) as unknown;
      if (!Array.isArray(data)) continue;
      return {
        indexUrl: `${origin}${path}`,
        itemCount: data.length,
        format: "shadcn-index" as const,
      };
    } catch {
      // try next candidate
    }
  }
  return undefined;
}

export async function POST(request: Request) {
  let body: InspectBody;
  try {
    body = (await request.json()) as InspectBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = body.url?.trim();
  if (!raw) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error("Unsupported protocol");
    }
  } catch {
    return NextResponse.json({ error: "Enter a valid URL" }, { status: 400 });
  }

  const policy = validateUrlPolicy(parsed.toString());
  if (!policy.allowed) {
    return NextResponse.json({ error: policy.reason }, { status: 403 });
  }

  const normalized = normalizeResourceUrl(parsed.toString());
  const existing = resources.find(
    (r) => normalizeResourceUrl(r.url) === normalized
  );

  if (existing) {
    return NextResponse.json({
      url: existing.url,
      name: existing.name,
      tagline: existing.tagline,
      description: existing.description,
      existingSlug: existing.slug,
    });
  }

  try {
    const response = await fetch(parsed.toString(), {
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "ShinUI Site Inspector/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Could not fetch page (${response.status})` },
        { status: 422 }
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json(
        { error: "URL did not return an HTML page" },
        { status: 422 }
      );
    }

    const html = await response.text();
    const title = pageTitle(html);
    const description = pageDescription(html);
    const origin = parsed.origin;
    const registry = await probeRegistry(origin);

    const hostname = parsed.hostname.replace(/^www\./, "");
    const fallbackName =
      hostname.charAt(0).toUpperCase() + hostname.slice(1).split(".")[0];

    return NextResponse.json({
      url: parsed.toString(),
      name: title || fallbackName,
      tagline: description.slice(0, 140) || `Design resource at ${hostname}`,
      description:
        description ||
        `A design resource discovered at ${parsed.toString()}. Preview the site and add it to your personal browse list.`,
      registry,
    });
  } catch {
    return NextResponse.json(
      { error: "Timed out or failed while fetching the site" },
      { status: 422 }
    );
  }
}
