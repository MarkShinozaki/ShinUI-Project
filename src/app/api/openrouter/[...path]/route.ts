import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_ORIGIN = "https://openrouter.ai";

function resolveApiKey(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  const bearer = auth?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (bearer) return bearer;
  const server = process.env.OPENROUTER?.trim();
  return server || null;
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const key = resolveApiKey(request);
  if (!key) {
    return NextResponse.json(
      { error: { message: "OpenRouter API key required" } },
      { status: 401 }
    );
  }

  const { path } = await context.params;
  const target = `${OPENROUTER_ORIGIN}/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${key}`);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const referer =
    request.headers.get("http-referer") || request.headers.get("referer");
  if (referer) headers.set("HTTP-Referer", referer);

  const title = request.headers.get("x-title");
  if (title) headers.set("X-Title", title);

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const upstream = await fetch(target, init);
  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") || "application/json",
    },
  });
}

export const GET = proxy;
export const POST = proxy;
