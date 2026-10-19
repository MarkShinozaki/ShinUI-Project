import { NextResponse } from "next/server";

/** Exposes whether a server-side OpenRouter key exists — never the key itself. */
export async function GET() {
  return NextResponse.json({
    serverKeyConfigured: Boolean(process.env.OPENROUTER?.trim()),
  });
}
