const REPO_API = "https://api.github.com/repos/MarkShinozaki/ShinUI-Project";

/**
 * Star count for the ShinUI repo, fetched server-side without a token and cached for an
 * hour. Resolves to null on any failure (network, timeout, rate limit, bad payload) so the
 * UI can fall back to the plain GitHub icon.
 */
export async function getGitHubStars(): Promise<number | null> {
  try {
    const res = await fetch(REPO_API, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "shinui-site" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: unknown };
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}
