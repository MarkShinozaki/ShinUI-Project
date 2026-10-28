"use client";

import type { ComponentType } from "react";

import * as demos from "./demos";
import * as footerDemos from "./demos/footers";

const demoMap = { ...demos, ...footerDemos } as unknown as Record<string, ComponentType>;

export function RegistryDemo({ name }: { name: string }) {
  const Demo = demoMap[name];
  if (!Demo) {
    return (
      <p className="text-sm text-muted-foreground">
        No preview registered for <code>{name}</code>.
      </p>
    );
  }
  return <Demo />;
}
