"use client";

import * as React from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  getSavedSnapshot,
  getServerSavedSnapshot,
  isSaved,
  subscribeSaved,
  toggleSaved,
  type SavedItemKind,
} from "@/lib/saved-items";
import { canSaveResourceUrl } from "@/lib/url-policy";
import { cn } from "@/lib/utils";

export function useSavedItems() {
  return React.useSyncExternalStore(
    subscribeSaved,
    getSavedSnapshot,
    getServerSavedSnapshot
  );
}

function savedKeyInStore(
  saved: Record<string, string>,
  kind: SavedItemKind,
  id: string
) {
  return `${kind}:${id}` in saved;
}

export function SaveButton({
  kind,
  id,
  url,
  label,
  className,
  size = "icon-sm",
  showLabel = false,
}: {
  kind: SavedItemKind;
  id: string;
  /** Required for resource saves — used for domain policy checks. */
  url?: string;
  label?: string;
  className?: string;
  size?: "icon-sm" | "sm";
  showLabel?: boolean;
}) {
  const saved = useSavedItems();
  const active = savedKeyInStore(saved, kind, id);
  const text = label ?? (kind === "resource" ? "Save site" : "Save component");
  const blocked =
    kind === "resource" && url ? !canSaveResourceUrl(url) && !active : false;

  if (blocked) return null;

  function handle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const result = toggleSaved(kind, id, url);
    if (!result.ok) {
      toast.error(result.reason);
      return;
    }
    toast.message(
      result.saved ? "Saved in your browser" : "Removed from saved"
    );
  }

  return (
    <Button
      type="button"
      variant={active ? "default" : "ghost"}
      size={size}
      aria-label={active ? `Unsave ${text.toLowerCase()}` : text}
      aria-pressed={active}
      onClick={handle}
      className={cn("relative z-10 shrink-0", className)}
    >
      <Bookmark className={cn("size-3.5", active && "fill-current")} />
      {showLabel && (active ? "Saved" : "Save")}
    </Button>
  );
}

export function SavedPanel({
  kind,
  id,
  url,
  label,
}: {
  kind: SavedItemKind;
  id: string;
  url?: string;
  label?: string;
}) {
  const text =
    label ??
    (kind === "resource"
      ? "Bookmark this site in your browser — only you see it, stored locally on this device."
      : "Bookmark this component in your browser — only you see it, stored locally on this device.");

  const blocked = kind === "resource" && url && !canSaveResourceUrl(url);

  if (blocked) return null;

  return (
    <div className="bg-card rounded-xl border p-4">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        Saved
      </p>
      <p className="text-muted-foreground mt-1 text-sm">{text}</p>
      <div className="mt-3">
        <SaveButton kind={kind} id={id} url={url} showLabel size="sm" />
      </div>
    </div>
  );
}

/** Non-React helper for one-off checks. */
export { isSaved };
