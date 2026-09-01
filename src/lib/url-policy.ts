/** Domains that cannot be saved or added by users. */
const BLOCKED_TLD_SUFFIXES = [
  ".ru",
  ".su",
  ".xxx",
  ".adult",
  ".porn",
  ".sex",
  ".sexy",
  ".cam",
] as const;

/** Hostname fragments associated with adult or illicit sites. */
const BLOCKED_HOST_TERMS = [
  "porn",
  "xxx",
  "hentai",
  "xvideo",
  "xvideos",
  "redtube",
  "youporn",
  "xnxx",
  "chaturbate",
  "livejasmin",
  "onlyfans",
  "brazzers",
  "bangbros",
  "eporner",
  "spankbang",
  "rule34",
] as const;

export type UrlPolicyResult =
  | { allowed: true }
  | { allowed: false; reason: string };

function normalizeHost(url: string) {
  const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
  return parsed.hostname.toLowerCase().replace(/^www\./, "");
}

function hostUsesBlockedTld(host: string) {
  return BLOCKED_TLD_SUFFIXES.some(
    (suffix) => host === suffix.slice(1) || host.endsWith(suffix)
  );
}

function hostMatchesBlockedTerm(host: string) {
  const labels = host.split(".");
  return BLOCKED_HOST_TERMS.some((term) =>
    labels.some((label) => label.includes(term))
  );
}

export function validateUrlPolicy(url: string): UrlPolicyResult {
  try {
    const host = normalizeHost(url);

    if (hostUsesBlockedTld(host)) {
      return {
        allowed: false,
        reason: "Sites on this domain cannot be saved or added.",
      };
    }

    if (hostMatchesBlockedTerm(host)) {
      return {
        allowed: false,
        reason: "Adult or restricted sites cannot be saved or added.",
      };
    }

    return { allowed: true };
  } catch {
    return { allowed: false, reason: "Enter a valid URL." };
  }
}

export function assertUrlAllowed(url: string) {
  const result = validateUrlPolicy(url);
  if (!result.allowed) {
    throw new Error(result.reason);
  }
}

export function canSaveResourceUrl(url: string) {
  return validateUrlPolicy(url).allowed;
}
