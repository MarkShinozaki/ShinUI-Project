"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function CookieConsent({
  className,
  onAccept,
  onDecline,
}: {
  className?: string;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "bg-card flex max-w-md flex-col gap-3 rounded-xl border p-4 shadow-lg sm:flex-row sm:items-center",
        className
      )}
      role="dialog"
      aria-label="Cookie consent"
    >
      <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
        We use cookies to keep preferences like theme and improve the experience.
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => {
            onDecline?.();
            setVisible(false);
          }}
          className="hover:bg-muted h-9 rounded-lg border px-3 text-sm font-medium transition-colors"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => {
            onAccept?.();
            setVisible(false);
          }}
          className="bg-primary text-primary-foreground h-9 rounded-lg px-3 text-sm font-medium"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
