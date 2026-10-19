"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import {
  downloadBlob,
  type OutputFile,
} from "@/lib/favicon-studio/export";
import { CodeBlock } from "@/components/code-block";
import {
  ToolButton,
  ToolCard,
} from "@/components/favicon-studio/controls";

interface Props {
  files: OutputFile[];
  snippet: string;
  busy: boolean;
  disabled: boolean;
  onDownloadAll: () => void;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

export function FaviconExportPanel({
  files,
  snippet,
  busy,
  disabled,
  onDownloadAll,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = snippet;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <ToolCard
      title="Export"
      subtitle={
        busy
          ? "Updating files…"
          : `${files.length} files ready · generated in your browser`
      }
      actions={
        <ToolButton
          variant="primary"
          onClick={onDownloadAll}
          disabled={disabled || busy || files.length === 0}
        >
          <Download className="size-4" />
          Download all (.zip)
        </ToolButton>
      }
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <ul
          className={`divide-border divide-y overflow-hidden rounded-lg border transition ${busy ? "opacity-60" : ""}`}
        >
          {files.map((f) => (
            <li key={f.name} className="flex items-center gap-3 px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-xs font-medium">{f.name}</p>
                <p className="text-muted-foreground truncate text-[11px]">
                  {f.description} · {formatBytes(f.blob.size)}
                </p>
              </div>
              <button
                type="button"
                title={`Download ${f.name}`}
                disabled={disabled}
                onClick={() => downloadBlob(f.blob, f.name)}
                className="text-muted-foreground hover:text-brand rounded-md p-1.5 transition hover:bg-muted disabled:opacity-40"
              >
                <Download className="size-4" />
              </button>
            </li>
          ))}
          {files.length === 0 && (
            <li className="text-muted-foreground px-3 py-6 text-center text-xs">
              Add an image or some text to get started.
            </li>
          )}
        </ul>
        <div className="flex min-w-0 flex-col">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium">
              HTML for your{" "}
              <code className="bg-muted rounded px-1">&lt;head&gt;</code>
            </p>
            <ToolButton variant="ghost" onClick={copy} className="h-8 px-2 text-xs">
              {copied ? (
                <>
                  <Check className="size-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copy
                </>
              )}
            </ToolButton>
          </div>
          <CodeBlock code={snippet} language="html" className="text-[11px]" />
          <p className="text-muted-foreground mt-2 text-[11px]">
            Put the files in your site&apos;s public root (e.g.{" "}
            <code className="bg-muted rounded px-1">public/</code> in Vite or
            Next.js).
          </p>
        </div>
      </div>
    </ToolCard>
  );
}
