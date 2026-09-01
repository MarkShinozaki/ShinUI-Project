import { validateUrlPolicy } from "@/lib/url-policy";

export type SavedItemKind = "resource" | "component" | "catalog";

const STORAGE_KEY = "shinui-saved-items";

/** `${kind}:${id}` → ISO date saved */
export type SavedItems = Record<string, string>;

export type ToggleSavedResult =
  | { ok: true; saved: boolean }
  | { ok: false; reason: string };

const EMPTY_SAVED: SavedItems = Object.freeze({});

let cachedRaw: string | null | undefined;
let cachedSnapshot: SavedItems = EMPTY_SAVED;

export function savedKey(kind: SavedItemKind, id: string) {
  return `${kind}:${id}`;
}

export function catalogSavedId(sourceId: string, name: string) {
  return `${sourceId}/${name}`;
}

function readSaved(): SavedItems {
  if (typeof window === "undefined") return EMPTY_SAVED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = EMPTY_SAVED;
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      cachedSnapshot = EMPTY_SAVED;
      return cachedSnapshot;
    }
    cachedSnapshot = parsed as SavedItems;
    return cachedSnapshot;
  } catch {
    cachedSnapshot = EMPTY_SAVED;
    cachedRaw = null;
    return cachedSnapshot;
  }
}

function writeSaved(items: SavedItems) {
  const raw = JSON.stringify(items);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedSnapshot = items;
  window.dispatchEvent(new Event("shinui-saved"));
}

export function isSaved(kind: SavedItemKind, id: string): boolean {
  return savedKey(kind, id) in readSaved();
}

export function toggleSaved(
  kind: SavedItemKind,
  id: string,
  url?: string
): ToggleSavedResult {
  const key = savedKey(kind, id);
  const items = { ...readSaved() };
  const removing = key in items;

  if (!removing && kind === "resource" && url) {
    const policy = validateUrlPolicy(url);
    if (!policy.allowed) {
      return { ok: false, reason: policy.reason };
    }
  }

  if (removing) {
    delete items[key];
  } else {
    items[key] = new Date().toISOString();
  }
  writeSaved(items);
  return { ok: true, saved: !removing };
}

export function getSavedAt(kind: SavedItemKind, id: string): string | null {
  return readSaved()[savedKey(kind, id)] ?? null;
}

export function subscribeSaved(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("shinui-saved", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("shinui-saved", handler);
    window.removeEventListener("storage", handler);
  };
}

export function getSavedSnapshot(): SavedItems {
  return readSaved();
}

export function getServerSavedSnapshot(): SavedItems {
  return EMPTY_SAVED;
}

export function getSavedCount(): number {
  return Object.keys(readSaved()).length;
}
