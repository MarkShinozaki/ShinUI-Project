"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FaviconAiGenerate } from "@/components/favicon-studio/ai-generate";
import { FaviconDropzone } from "@/components/favicon-studio/dropzone";
import { FaviconExportPanel } from "@/components/favicon-studio/export-panel";
import { FaviconPreviews } from "@/components/favicon-studio/previews";
import {
  ColorField,
  RangeField,
  Segmented,
  TextField,
  ToggleRow,
  ToolCard,
} from "@/components/favicon-studio/controls";
import {
  buildAllFiles,
  buildHtmlSnippet,
  buildZip,
  canExportSvg,
  downloadBlob,
  type OutputFile,
} from "@/lib/favicon-studio/export";
import { loadSourceImage } from "@/lib/favicon-studio/load";
import { renderDataUrl, type RenderSources } from "@/lib/favicon-studio/render";
import {
  DEFAULT_SETTINGS,
  FONTS,
  PNG_OUTPUTS,
  type Settings,
  type SourceImage,
} from "@/lib/favicon-studio/types";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const EMOJI = [
  "🚀",
  "🔥",
  "✨",
  "⚡",
  "🎨",
  "💡",
  "🧠",
  "🌈",
  "🍕",
  "🦊",
  "🎧",
  "📚",
];
const SWATCHES = [
  "#7c3aed",
  "#2563eb",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#0f172a",
  "#ffffff",
];
const PREVIEW_SIZES = Array.from(
  new Set([...PNG_OUTPUTS.map((o) => o.size), 512])
);

export function FaviconStudioApp() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [main, setMain] = useState<SourceImage | null>(null);
  const [small, setSmall] = useState<SourceImage | null>(null);
  const [bgImage, setBgImage] = useState<SourceImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<OutputFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [zipping, setZipping] = useState(false);

  const set = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((s) => ({ ...s, [key]: value }));
    },
    []
  );

  const sources: RenderSources = useMemo(
    () => ({ main, small, background: bgImage }),
    [main, small, bgImage]
  );
  const deferredSettings = useDeferredValue(settings);

  const hasContent =
    settings.mode === "text"
      ? settings.text.trim().length > 0
      : Boolean(main);

  const previewUrls = useMemo(() => {
    const out: Record<number, string> = {};
    for (const size of PREVIEW_SIZES)
      out[size] = renderDataUrl(size, deferredSettings, sources);
    return out;
  }, [deferredSettings, sources]);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setBusy(true);
      try {
        const built = await buildAllFiles(settings, sources);
        if (!cancelled) setFiles(built);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [settings, sources]);

  const handleFile = useCallback(
    async (file: File, which: "main" | "small" | "background") => {
      setError(null);
      try {
        const img = await loadSourceImage(file);
        if (which === "main") {
          setMain(img);
          setSettings((s) => ({
            ...s,
            mode: "image",
            zoom: 1,
            offsetX: 0,
            offsetY: 0,
            background: "transparent",
          }));
        } else if (which === "background") {
          setBgImage(img);
          set("background", "image");
        } else {
          setSmall(img);
          set("useSmallImage", true);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    },
    [set]
  );

  const applyAiImage = useCallback((img: SourceImage) => {
    setMain(img);
    setSettings((s) => ({
      ...s,
      mode: "image",
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
      background: "transparent",
    }));
    setError(null);
  }, []);

  const applyAiBackground = useCallback(
    (img: SourceImage) => {
      setBgImage(img);
      set("background", "image");
      setError(null);
    },
    [set]
  );

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      )
        return;
      const file = Array.from(e.clipboardData?.files ?? []).find((f) =>
        f.type.startsWith("image/")
      );
      if (file) {
        e.preventDefault();
        void handleFile(file, "main");
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFile]);

  const snippet = useMemo(
    () => buildHtmlSnippet(settings, canExportSvg(settings, sources)),
    [settings, sources]
  );

  const downloadAll = async () => {
    setZipping(true);
    try {
      const latest = await buildAllFiles(settings, sources);
      downloadBlob(await buildZip(latest), "favicons.zip");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setZipping(false);
    }
  };

  const reset = () => {
    setSettings((s) => ({
      ...DEFAULT_SETTINGS,
      mode: s.mode,
      text: s.text,
      appName: s.appName,
      shortName: s.shortName,
    }));
    setBgImage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="gap-1.5 font-normal">
          <Sparkles className="size-3.5 text-brand" />
          100% in your browser
        </Badge>
        <span className="text-muted-foreground text-xs">
          Editing and export stay in your browser. AI generation (optional)
          sends only your prompt to the chosen provider.
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ToolCard title="Source">
            <div className="space-y-4">
              <Segmented
                value={settings.mode}
                onChange={(m) => set("mode", m)}
                options={[
                  { value: "image", label: "Image" },
                  { value: "text", label: "Text / Emoji" },
                ]}
              />

              {settings.mode === "image" ? (
                <div className="space-y-3">
                  <FaviconDropzone
                    image={main}
                    title="Drop an image or click to upload"
                    hint="PNG, JPG, SVG, WebP · or paste with Ctrl+V"
                    onFile={(f) => handleFile(f, "main")}
                    onClear={() => setMain(null)}
                  />
                  <FaviconAiGenerate onGenerated={applyAiImage} />
                  <div className="bg-muted/50 rounded-xl p-3">
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      Small sizes image{" "}
                      <span className="font-normal">
                        (optional, used for 16/32/48 px)
                      </span>
                    </p>
                    <FaviconDropzone
                      compact
                      image={small}
                      title="Simpler version for tiny sizes"
                      hint="e.g. just the logo mark, no wordmark"
                      onFile={(f) => handleFile(f, "small")}
                      onClear={() => setSmall(null)}
                    />
                    {small && (
                      <div className="mt-3">
                        <ToggleRow
                          label="Use for 16, 32, 48 px"
                          checked={settings.useSmallImage}
                          onChange={(v) => set("useSmallImage", v)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <TextField
                    label="Text (1–3 characters or an emoji)"
                    value={settings.text}
                    maxLength={8}
                    onChange={(v) => set("text", v)}
                    className="text-lg"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {EMOJI.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => set("text", e)}
                        className={cn(
                          "hover:bg-brand/10 h-9 w-9 rounded-lg text-lg transition",
                          settings.text === e
                            ? "bg-brand/15 ring-brand ring-1"
                            : "bg-muted"
                        )}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                  <div>
                    <Label className="mb-1.5 text-xs">Font</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {FONTS.map((f) => (
                        <button
                          key={f.label}
                          type="button"
                          onClick={() => set("font", f.stack)}
                          style={{ fontFamily: f.stack }}
                          className={cn(
                            "rounded-lg border px-2 py-1.5 text-sm transition",
                            settings.font === f.stack
                              ? "border-brand bg-brand/10 text-brand"
                              : "border-border hover:border-muted-foreground/30"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ColorField
                      label="Text color"
                      value={settings.textColor}
                      onChange={(v) => set("textColor", v)}
                    />
                    <div className="space-y-1.5">
                      <Label className="text-xs">Weight</Label>
                      <select
                        value={settings.fontWeight}
                        onChange={(e) =>
                          set("fontWeight", Number(e.target.value))
                        }
                        className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                      >
                        {[400, 500, 600, 700, 800, 900].map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <RangeField
                    label="Text size"
                    value={settings.textScale}
                    min={0.3}
                    max={1.2}
                    step={0.01}
                    format={(v) => `${Math.round(v * 100)}%`}
                    onChange={(v) => set("textScale", v)}
                  />
                </div>
              )}
            </div>
          </ToolCard>

          <ToolCard
            title="Adjust"
            actions={
              <button
                type="button"
                onClick={reset}
                className="text-muted-foreground hover:text-brand text-xs font-medium"
              >
                Reset
              </button>
            }
          >
            <div className="space-y-5">
              {settings.mode === "image" && (
                <div className="space-y-4">
                  <Segmented
                    size="sm"
                    value={settings.fit}
                    onChange={(v) => set("fit", v)}
                    options={[
                      { value: "cover", label: "Fill (crop)" },
                      { value: "contain", label: "Fit (whole image)" },
                    ]}
                  />
                  <RangeField
                    label="Zoom"
                    value={settings.zoom}
                    min={0.5}
                    max={4}
                    step={0.01}
                    format={(v) => `${v.toFixed(2)}×`}
                    onChange={(v) => set("zoom", v)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <RangeField
                      label="Horizontal"
                      value={settings.offsetX}
                      min={-1}
                      max={1}
                      step={0.01}
                      format={(v) => `${Math.round(v * 100)}`}
                      onChange={(v) => set("offsetX", v)}
                    />
                    <RangeField
                      label="Vertical"
                      value={settings.offsetY}
                      min={-1}
                      max={1}
                      step={0.01}
                      format={(v) => `${Math.round(v * 100)}`}
                      onChange={(v) => set("offsetY", v)}
                    />
                  </div>
                </div>
              )}

              <RangeField
                label="Padding"
                value={settings.padding}
                min={0}
                max={40}
                format={(v) => `${v}%`}
                onChange={(v) => set("padding", v)}
              />

              <div className="space-y-3">
                <Label className="text-xs">Background</Label>
                <Segmented
                  size="sm"
                  value={settings.background}
                  onChange={(v) => set("background", v)}
                  options={[
                    { value: "transparent", label: "Transparent" },
                    { value: "color", label: "Color" },
                    { value: "image", label: "Image" },
                  ]}
                />
                {(settings.background === "color" ||
                  settings.background === "image") && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {SWATCHES.map((c) => (
                        <button
                          key={c}
                          type="button"
                          title={c}
                          onClick={() => set("bgColor", c)}
                          style={{ background: c }}
                          className={cn(
                            "border-border h-7 w-7 rounded-full border transition hover:scale-110",
                            settings.bgColor === c &&
                              "ring-brand ring-2 ring-offset-2 ring-offset-background"
                          )}
                        />
                      ))}
                    </div>
                    <ColorField
                      label={
                        settings.background === "image"
                          ? "Fill under image"
                          : "Custom color"
                      }
                      value={settings.bgColor}
                      onChange={(v) => set("bgColor", v)}
                    />
                  </div>
                )}
                {settings.background === "image" && (
                  <div className="space-y-3">
                    <FaviconDropzone
                      compact
                      image={bgImage}
                      title="Background image"
                      hint="Upload · or generate with AI below"
                      onFile={(f) => handleFile(f, "background")}
                      onClear={() => setBgImage(null)}
                    />
                    <FaviconAiGenerate
                      purpose="background"
                      compact
                      onGenerated={applyAiBackground}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-xs">Shape</Label>
                <Segmented
                  size="sm"
                  value={settings.shape}
                  onChange={(v) => set("shape", v)}
                  options={[
                    { value: "square", label: "Square" },
                    { value: "rounded", label: "Rounded" },
                    { value: "circle", label: "Circle" },
                  ]}
                />
                {settings.shape === "rounded" && (
                  <RangeField
                    label="Corner radius"
                    value={settings.radius}
                    min={0}
                    max={50}
                    format={(v) => `${v}%`}
                    onChange={(v) => set("radius", v)}
                  />
                )}
              </div>
            </div>
          </ToolCard>

          <ToolCard
            title="App details"
            subtitle="Used in site.webmanifest and the HTML snippet"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="App name"
                  value={settings.appName}
                  onChange={(v) => set("appName", v)}
                />
                <TextField
                  label="Short name"
                  value={settings.shortName}
                  onChange={(v) => set("shortName", v)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ColorField
                  label="Theme color"
                  value={settings.themeColor}
                  onChange={(v) => set("themeColor", v)}
                />
                <TextField
                  label="Path prefix"
                  value={settings.pathPrefix}
                  onChange={(v) => set("pathPrefix", v)}
                  placeholder="/"
                />
              </div>
              {settings.background !== "color" && (
                <div className="bg-muted/50 space-y-2 rounded-xl p-3">
                  <ToggleRow
                    label="Solid background for apple-touch-icon"
                    hint="iOS shows transparent pixels as black"
                    checked={settings.appleSolidBg}
                    onChange={(v) => set("appleSolidBg", v)}
                  />
                  {settings.appleSolidBg && (
                    <ColorField
                      label="Apple icon background"
                      value={settings.appleBgColor}
                      onChange={(v) => set("appleBgColor", v)}
                    />
                  )}
                </div>
              )}
            </div>
          </ToolCard>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-between rounded-xl border px-4 py-3 text-sm">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs font-medium hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}
          <ToolCard
            title="Preview"
            subtitle="Small sizes are shown at actual pixel size"
          >
            <FaviconPreviews urls={previewUrls} title={settings.appName} />
          </ToolCard>
          <FaviconExportPanel
            files={files}
            snippet={snippet}
            busy={busy || zipping}
            disabled={!hasContent}
            onDownloadAll={downloadAll}
          />
        </div>
      </div>
    </div>
  );
}
