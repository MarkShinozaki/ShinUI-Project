"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  FieldRow,
  TextField,
  ToolButton,
} from "@/components/favicon-studio/controls";
import {
  fetchOpenRouterConfig,
  generateAiImage,
  getAiModels,
  loadSavedApiKey,
  loadSavedModel,
  saveApiKey,
  saveModel,
  type AiPurpose,
} from "@/lib/favicon-studio/ai";
import type { SourceImage } from "@/lib/favicon-studio/types";
import { cn } from "@/lib/utils";

interface Props {
  onGenerated: (image: SourceImage) => void;
  purpose?: AiPurpose;
  compact?: boolean;
}

export function FaviconAiGenerate({
  onGenerated,
  purpose = "icon",
  compact = false,
}: Props) {
  const models = useMemo(() => getAiModels(), []);
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState(() => loadSavedApiKey());
  const [model, setModel] = useState(() => loadSavedModel(models));
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(!compact);
  const [serverKeyConfigured, setServerKeyConfigured] = useState(false);

  useEffect(() => {
    void fetchOpenRouterConfig().then((c) =>
      setServerKeyConfigured(c.serverKeyConfigured)
    );
  }, []);

  const usingServerKey = serverKeyConfigured && !apiKey.trim();
  const effectiveKey = apiKey.trim() || serverKeyConfigured;
  const isBg = purpose === "background";

  const onModelChange = (id: string) => {
    setModel(id);
    saveModel(id);
  };

  const generate = async () => {
    setError(null);
    setBusy(true);
    try {
      if (remember && apiKey.trim()) saveApiKey(apiKey);
      else if (!remember) saveApiKey("");
      saveModel(model);
      const img = await generateAiImage(
        prompt,
        apiKey,
        model,
        purpose,
        serverKeyConfigured
      );
      onGenerated(img);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const form = (
    <div className={compact ? "space-y-2.5" : "space-y-3"}>
      {!compact && (
        <div>
          <p className="text-xs font-medium">Generate with AI</p>
          <p className="text-muted-foreground mt-0.5 text-[11px] leading-relaxed">
            Optional OpenRouter image models. Paste your own API key (stored in
            this browser only), or rely on a server{" "}
            <code className="bg-muted rounded px-1">OPENROUTER</code> key if the
            host configured one — the secret never ships to the client bundle.
          </p>
        </div>
      )}

      <FieldRow label="Prompt">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          placeholder={
            isBg
              ? "e.g. soft purple gradient, subtle noise, no subject"
              : "e.g. minimal orange fox face, flat vector, white background"
          }
          className="border-input bg-background focus-visible:ring-ring w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
        />
      </FieldRow>

      <FieldRow label="Model">
        <select
          value={model}
          onChange={(e) => onModelChange(e.target.value)}
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </FieldRow>

      <div className="space-y-2">
        <TextField
          label="OpenRouter API key"
          value={apiKey}
          onChange={setApiKey}
          placeholder={
            serverKeyConfigured
              ? "Using server key — or paste to override"
              : "sk-or-…"
          }
          type="password"
          autoComplete="off"
        />
        {usingServerKey && (
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Using OPENROUTER from server environment
          </p>
        )}
        <label className="text-muted-foreground flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="rounded border"
          />
          Remember pasted key on this device only
        </label>
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}

      <ToolButton
        variant="primary"
        disabled={busy || !prompt.trim() || !effectiveKey || !model}
        onClick={() => void generate()}
        className="w-full"
      >
        {busy ? "Generating…" : isBg ? "Generate background" : "Generate icon"}
      </ToolButton>
    </div>
  );

  if (compact) {
    return (
      <div className="rounded-lg border p-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left text-xs font-medium"
        >
          <span>Generate background with AI</span>
          {open ? (
            <ChevronUp className="text-muted-foreground size-4" />
          ) : (
            <ChevronDown className="text-muted-foreground size-4" />
          )}
        </button>
        {open && <div className="mt-3">{form}</div>}
      </div>
    );
  }

  return (
    <div className={cn("bg-muted/50 space-y-3 rounded-xl p-3")}>{form}</div>
  );
}
