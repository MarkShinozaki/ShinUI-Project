"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Code2, Eye, Monitor, Moon, RotateCw, Smartphone, Sun, Tablet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { PropsPlayground } from "@/components/props-playground";
import { RegistryDemo } from "@/registry/demo-map";
import { defaultProps, usageFromValues, type Controls, type PropValue } from "@/registry/playground";
import { cn } from "@/lib/utils";

const viewports = [
  { id: "phone", label: "Phone", width: 390, Icon: Smartphone },
  { id: "tablet", label: "Tablet", width: 768, Icon: Tablet },
  { id: "full", label: "Full width", width: null, Icon: Monitor },
] as const;

type ViewportId = (typeof viewports)[number]["id"];
type Theme = "light" | "dark";

/**
 * Theme for one preview: follows the site until it is flipped here, then
 * only this stage changes (see `[data-preview-theme]` in globals.css).
 */
function usePreviewTheme() {
  const { resolvedTheme } = useTheme();
  const site: Theme | undefined = resolvedTheme === "dark" ? "dark" : resolvedTheme === "light" ? "light" : undefined;
  const [override, setOverride] = React.useState<Theme | null>(null);
  const theme = override ?? site;
  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Flipping back to the site's theme drops the override, so the preview follows the site again.
    setOverride(next === site ? null : next);
  };
  return { theme, overridden: override !== null, toggle };
}

/** Props for the element that scopes a preview's theme. */
function themeScope(theme: Theme | undefined): { "data-preview-theme"?: Theme; style?: React.CSSProperties } {
  if (!theme) return {};
  return {
    "data-preview-theme": theme,
    style: { colorScheme: theme } as React.CSSProperties,
  };
}

export function ComponentPreview({
  demoName,
  code,
  filename,
  previewClassName,
  align = "center",
  fullPage = false,
  controls,
  componentName,
  importPath,
}: {
  demoName: string;
  code: string | null;
  filename: string;
  previewClassName?: string;
  align?: "center" | "start";
  /**
   * A whole page composed from blocks: rendered at full width in a tall,
   * scrollable frame instead of a centred stage.
   */
  fullPage?: boolean;
  /** Playground controls; their values are passed to the demo as props. */
  controls?: Controls;
  /** Exported component name and import path, for the usage snippet built from the playground. */
  componentName?: string;
  importPath?: string;
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [viewport, setViewport] = React.useState<ViewportId>("full");
  const [replayKey, setReplayKey] = React.useState(0);
  const { theme, overridden, toggle } = usePreviewTheme();

  const hasControls = !!controls && Object.keys(controls).length > 0;
  const [values, setValues] = React.useState(() => defaultProps(controls));
  // Sliders and color pickers fire on every tick; let the (WebGL) demo trail behind the inputs.
  const demoProps = React.useDeferredValue(values);
  const setValue = React.useCallback(
    (key: string, value: PropValue) => setValues((v) => ({ ...v, [key]: value })),
    []
  );
  const resetValues = React.useCallback(() => setValues(defaultProps(controls)), [controls]);

  const usage =
    hasControls && componentName && importPath
      ? usageFromValues(componentName, importPath, controls!, values)
      : null;

  const width = viewports.find((v) => v.id === viewport)?.width ?? null;
  const scope = themeScope(theme);
  const demo = <RegistryDemo name={demoName} props={hasControls ? demoProps : undefined} />;

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="bg-muted/40 flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <div className="bg-background inline-flex rounded-lg border p-0.5">
          {(
            [
              { id: "preview", label: "Preview", Icon: Eye },
              { id: "code", label: "Code", Icon: Code2 },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                tab === item.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.Icon className="size-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          {tab === "preview" && (
            <>
              <div className="bg-background hidden rounded-lg border p-0.5 sm:inline-flex">
                {viewports.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setViewport(item.id)}
                    title={item.label}
                    aria-label={item.label}
                    aria-pressed={viewport === item.id}
                    className={cn(
                      "rounded-md p-1.5 transition-colors",
                      viewport === item.id
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.Icon className="size-3.5" />
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggle}
                disabled={!theme}
                aria-label={`Preview in ${theme === "dark" ? "light" : "dark"} mode`}
                aria-pressed={overridden}
                title={
                  overridden
                    ? `Preview in ${theme === "dark" ? "light" : "dark"} mode (back to the site theme)`
                    : `Preview in ${theme === "dark" ? "light" : "dark"} mode (this preview only)`
                }
                className={cn(overridden && "text-(--fo-accent)")}
              >
                {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setReplayKey((k) => k + 1)}
                aria-label="Replay animation"
              >
                <RotateCw className="size-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {tab === "preview" && fullPage ? (
        <div className="checker-pattern flex justify-center p-2 sm:p-4">
          <div
            {...scope}
            className={cn(
              "bg-background text-foreground h-[min(80vh,900px)] w-full overflow-y-auto overscroll-contain rounded-lg border transition-[max-width] duration-300",
              theme === "dark" && "dark"
            )}
            style={{ ...scope.style, maxWidth: width ?? undefined }}
            tabIndex={0}
            aria-label="Full page preview, scrollable"
          >
            <div key={replayKey} className="flex min-h-full w-full flex-col">
              {demo}
            </div>
          </div>
        </div>
      ) : tab === "preview" ? (
        <div className="checker-pattern flex justify-center overflow-auto p-4 sm:p-8">
          <div
            {...scope}
            className={cn(
              "bg-background text-foreground flex min-h-56 w-full items-center rounded-lg border p-6 transition-[max-width] duration-300",
              align === "center" ? "justify-center" : "justify-start",
              theme === "dark" && "dark",
              previewClassName
            )}
            style={{ ...scope.style, maxWidth: width ?? undefined }}
          >
            <div key={replayKey} className="w-full">
              <div
                className={cn(
                  "flex w-full",
                  align === "center" ? "justify-center" : "justify-start"
                )}
              >
                {demo}
              </div>
            </div>
          </div>
        </div>
      ) : code ? (
        <div>
          {usage && (
            <div className="border-b">
              <p className="text-muted-foreground px-4 pt-3 text-xs">
                Usage with the playground values. Props left at their defaults are omitted.
              </p>
              <CodeBlock code={usage} filename="usage.tsx" maxHeight={null} className="rounded-none border-0" />
            </div>
          )}
          <CodeBlock code={code} filename={filename} className="rounded-none border-0" />
        </div>
      ) : (
        <p className="text-muted-foreground p-6 text-sm">
          Source unavailable for this component.
        </p>
      )}

      {hasControls && (
        <PropsPlayground controls={controls!} values={values} onChange={setValue} onReset={resetValues} />
      )}
    </div>
  );
}
