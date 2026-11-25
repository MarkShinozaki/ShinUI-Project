"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Blocks,
  BookOpen,
  Box,
  Check,
  Compass,
  Component,
  FileText,
  Home,
  LayoutGrid,
  LoaderCircle,
  PenTool,
  Search,
  Sparkles,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AI_MODEL_BADGE,
  AI_STEPS,
  EXAMPLE_PROMPTS,
  askAI,
  type AIAnswer,
} from "@/lib/ai-search";
import {
  SEARCH_COUNTS,
  SEARCH_SECTIONS,
  groupLabelOf,
  isComponentScope,
  matchComponents,
  matchPages,
  matchResources,
  sectionIdOf,
  termsFromQuery,
  type SearchScope,
} from "@/lib/site-search";
import { cn } from "@/lib/utils";

type Mode = "search" | "ai";
type AIStatus = "idle" | "thinking" | "ready" | "error";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function ScopeIcon({ id, className }: { id: SearchScope | "ai"; className?: string }) {
  const props = { className: cn("size-3.5 shrink-0", className) };
  if (id === "all") return <LayoutGrid {...props} />;
  if (id === "components") return <Component {...props} />;
  if (id === "blocks") return <Blocks {...props} />;
  if (id === "pixel-art") return <Box {...props} />;
  if (id === "resources") return <Compass {...props} />;
  if (id === "pages") return <BookOpen {...props} />;
  if (id === "ai") return <Sparkles {...props} />;
  return <FileText {...props} />;
}

function PageIcon({ href }: { href: string }) {
  if (href === "/") return <Home />;
  if (href.startsWith("/design-tools")) return <PenTool />;
  if (href === "/browse") return <Compass />;
  if (href.startsWith("/components")) return <Blocks />;
  if (href === "/portfolios" || href === "/categories") return <BookOpen />;
  return <FileText />;
}

function SectionAside({
  mode,
  scope,
  onSearch,
  onAI,
}: {
  mode: Mode;
  scope: SearchScope;
  onSearch: (scope: SearchScope) => void;
  onAI: () => void;
}) {
  return (
    <aside
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-(--fo-line) p-2 sm:w-48 sm:flex-col sm:overflow-y-auto sm:border-r sm:border-b-0"
      aria-label="Search sections"
    >
      {SEARCH_SECTIONS.map((item) => {
        const active = mode === "search" && scope === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSearch(item.id)}
            className={cn(
              "flex min-w-fit flex-1 items-center gap-2 rounded-sm border px-2.5 py-2 text-left transition-colors sm:w-full sm:min-w-0 sm:flex-none",
              active
                ? "border-(--fo-accent) bg-(--fo-tint) text-(--fo-ink)"
                : "border-transparent text-(--fo-soft) hover:bg-(--fo-tint) hover:text-(--fo-ink)"
            )}
          >
            <ScopeIcon id={item.id} />
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[11px] tracking-[0.1em] uppercase">
                {item.label}
              </span>
              <span className="mt-0.5 hidden text-[10px] text-(--fo-faint) sm:block">
                {item.hint}
              </span>
            </span>
            <span className="font-mono text-[10px] text-(--fo-faint)">
              {SEARCH_COUNTS[item.id]}
            </span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={onAI}
        aria-pressed={mode === "ai"}
        className={cn(
          "flex min-w-fit flex-1 items-center gap-2 rounded-sm border px-2.5 py-2 text-left transition-colors sm:mt-auto sm:w-full sm:min-w-0 sm:flex-none",
          mode === "ai"
            ? "border-(--fo-accent) bg-(--fo-tint) text-(--fo-ink)"
            : "border-dashed border-(--fo-line-strong) text-(--fo-soft) hover:border-(--fo-accent) hover:bg-(--fo-tint) hover:text-(--fo-ink)"
        )}
      >
        <ScopeIcon id="ai" className="text-(--fo-accent)" />
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[11px] tracking-[0.1em] uppercase">
            Ask AI
          </span>
          <span className="mt-0.5 hidden text-[10px] text-(--fo-faint) sm:block">
            Describe a project
          </span>
        </span>
      </button>
    </aside>
  );
}

export function CommandMenu({
  className,
  hotkey = true,
  variant = "field",
}: {
  className?: string;
  /** "field": search box trigger. "cell": filled accent cell for the grid navbar. */
  variant?: "field" | "cell";
  /** Listen for ⌘K / Ctrl+K. Only one mounted menu should own the shortcut. */
  hotkey?: boolean;
}) {
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [scope, setScope] = React.useState<SearchScope>("all");
  const [mode, setMode] = React.useState<Mode>("search");
  const [prompt, setPrompt] = React.useState("");
  const [aiStatus, setAiStatus] = React.useState<AIStatus>("idle");
  const [stepIndex, setStepIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState<AIAnswer | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const requestId = React.useRef(0);
  const promptRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (!hotkey) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hotkey]);

  const reset = React.useCallback(() => {
    requestId.current += 1;
    setQuery("");
    setScope("all");
    setMode("search");
    setPrompt("");
    setAnswer(null);
    setError(null);
    setAiStatus("idle");
    setStepIndex(0);
  }, []);

  const setOpenAndReset = React.useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) reset();
    },
    [reset]
  );

  const go = React.useCallback(
    (href: string) => {
      setOpenAndReset(false);
      router.push(href);
    },
    [router, setOpenAndReset]
  );

  const enterSearch = React.useCallback((nextScope: SearchScope = "all") => {
    setMode("search");
    setScope(nextScope);
  }, []);

  const enterAI = React.useCallback(() => {
    setMode("ai");
    window.setTimeout(() => promptRef.current?.focus(), 20);
  }, []);

  const terms = termsFromQuery(query);
  const searching = terms.length > 0;
  const showPages = scope === "all" || scope === "pages";
  const showResources = scope === "all" || scope === "resources";
  const showComponentGroups = scope === "all" || isComponentScope(scope);
  const pageHits = React.useMemo(() => {
    if (!showPages) return [];
    return matchPages(terms);
  }, [showPages, terms]);

  const resourceHits = React.useMemo(() => {
    if (!showResources) return [];
    const limit = searching ? 30 : 8;
    return matchResources(terms)
      .slice(0, limit)
      .map((row) => row.resource);
  }, [showResources, searching, terms]);

  const componentGroups = React.useMemo(() => {
    if (!showComponentGroups) return [];
    const sectionFilter = isComponentScope(scope) ? scope : "all";
    const ranked = matchComponents(terms, sectionFilter);
    const limit = searching ? 40 : scope === "all" ? 6 : 12;
    const items = ranked.slice(0, limit).map((row) => row.item);
    const order: SearchScope[] = ["components", "blocks", "pixel-art", "other"];
    return order
      .filter((id) => sectionFilter === "all" || sectionFilter === id)
      .map((id) => ({
        id,
        label:
          id === "components"
            ? searching
              ? "Components"
              : "Suggested components"
            : id === "blocks"
              ? searching
                ? "Blocks"
                : "Suggested blocks"
              : id === "pixel-art"
                ? searching
                  ? "Pixel Art"
                  : "Suggested pixel art"
                : searching
                  ? "Other"
                  : "Suggested",
        items: items.filter((item) => sectionIdOf(item) === id),
      }))
      .filter((group) => group.items.length > 0);
  }, [showComponentGroups, scope, searching, terms]);

  const resultCount =
    pageHits.length +
    resourceHits.length +
    componentGroups.reduce((sum, group) => sum + group.items.length, 0);

  const ask = React.useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const id = (requestId.current += 1);
      setPrompt(trimmed);
      setAiStatus("thinking");
      setAnswer(null);
      setError(null);
      setStepIndex(0);

      const pending = askAI(trimmed);
      const stepMs = reducedMotion ? 0 : 720;
      for (let i = 0; i < AI_STEPS.length; i += 1) {
        if (requestId.current !== id) return;
        setStepIndex(i);
        if (stepMs) await sleep(stepMs);
      }

      try {
        const result = await pending;
        if (requestId.current !== id) return;
        setAnswer(result);
        setAiStatus("ready");
        setStepIndex(AI_STEPS.length);
      } catch {
        if (requestId.current !== id) return;
        setError("The preview couldn't run. Try again.");
        setAiStatus("error");
      }
    },
    [reducedMotion]
  );

  const placeholder =
    scope === "pages"
      ? "Find a page…"
      : scope === "components"
        ? "Search UI pieces, backgrounds, footers…"
        : scope === "blocks"
          ? "Search page blocks and kits…"
          : scope === "pixel-art"
            ? "Search pixel art scenes…"
            : scope === "resources"
              ? "Search tools, libraries, sites…"
              : "Search the whole index…";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          variant === "cell"
            ? "relative flex cursor-pointer items-center gap-2.5 bg-(--fo-accent) px-5 font-mono text-[11px] tracking-wider whitespace-nowrap text-(--fo-on-accent) uppercase transition-opacity hover:opacity-90"
            : "relative flex h-9 w-full cursor-pointer items-center justify-start gap-2 border border-(--fo-line) bg-(--fo-well) pr-1.5 pl-3 text-left font-mono text-[11px] tracking-[0.08em] text-(--fo-soft) uppercase transition-colors hover:border-(--fo-line-strong) hover:text-(--fo-ink) sm:w-64",
          className
        )}
      >
        <Search className="size-3.5 shrink-0" />
        <span className="truncate">Search</span>
        <kbd
          className={cn(
            "pointer-events-none hidden h-5 items-center gap-0.5 border px-1.5 font-mono text-[10px] select-none sm:flex",
            variant === "cell"
              ? "border-(--fo-on-accent)/40 bg-transparent"
              : "ml-auto border-(--fo-line) bg-(--fo-paper)"
          )}
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpenAndReset}>
        <DialogContent
          showCloseButton={false}
          data-search-dialog=""
          data-search-mode={mode}
          data-ai-status={aiStatus}
          className={cn(
            "flex h-[min(640px,85dvh)] max-h-[85dvh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl",
            mode === "ai" && "border-(--fo-accent)/35"
          )}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{mode === "ai" ? "Ask Shin UI" : "Search Shin UI"}</DialogTitle>
            <DialogDescription>
              {mode === "ai"
                ? "Describe a project to preview matching components and resources"
                : "Search pages, live components and curated resources"}
            </DialogDescription>
          </DialogHeader>

          {mode === "ai" && (
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-16 size-72 rounded-full bg-(--fo-accent)/16 blur-3xl motion-safe:animate-pulse" />
              <div className="absolute -bottom-28 -left-20 size-64 rounded-full bg-(--fo-accent-2)/14 blur-3xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-(--fo-accent)/8 via-transparent to-(--fo-accent-2)/10" />
            </div>
          )}

          {mode === "search" ? (
            <Command
              shouldFilter={false}
              className="relative flex min-h-0 flex-1 flex-col rounded-none bg-transparent"
            >
              <header className="flex shrink-0 items-center gap-2 border-b border-(--fo-line) py-1 pr-3 pl-1 [&_[data-slot=command-input-wrapper]]:h-10 [&_[data-slot=command-input-wrapper]]:border-0">
                <div className="min-w-0 flex-1">
                  <CommandInput
                    placeholder={placeholder}
                    value={query}
                    onValueChange={setQuery}
                    className="font-mono text-[13px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={enterAI}
                  aria-pressed={false}
                  data-search-ai-toggle=""
                  className="inline-flex shrink-0 items-center gap-1.5 border border-(--fo-accent)/40 bg-(--fo-tint) px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-(--fo-ink) uppercase transition-colors hover:border-(--fo-accent)"
                >
                  <Sparkles className="size-3.5 text-(--fo-accent)" />
                  Ask AI
                </button>
              </header>

              <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
                <SectionAside
                  mode={mode}
                  scope={scope}
                  onSearch={enterSearch}
                  onAI={enterAI}
                />
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                  <CommandList className="max-h-none min-h-0 flex-1 overflow-y-auto px-1 py-2">
                    <CommandEmpty>
                      {searching
                        ? "Nothing matched that."
                        : "Pick a section or start typing."}
                    </CommandEmpty>

                    {showPages && pageHits.length > 0 && (
                      <>
                        <CommandGroup heading="Pages">
                          {pageHits.map(({ page }) => (
                            <CommandItem
                              key={page.href}
                              value={`page-${page.href}`}
                              onSelect={() => go(page.href)}
                            >
                              <PageIcon href={page.href} />
                              <span>{page.label}</span>
                              <span className="text-muted-foreground ml-auto max-w-[45%] truncate font-mono text-[10px] tracking-[0.08em] uppercase">
                                {page.href}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}

                    {showResources && !searching && resourceHits.length > 0 && (
                      <>
                        {(showPages && pageHits.length > 0) && <CommandSeparator />}
                        <CommandGroup heading="Suggested resources">
                          {resourceHits.map((resource) => (
                            <CommandItem
                              key={resource.slug}
                              value={`resource-${resource.slug}`}
                              onSelect={() => go(`/resource/${resource.slug}`)}
                            >
                              <Compass />
                              <span className="min-w-0 truncate">{resource.name}</span>
                              <span className="text-muted-foreground ml-auto max-w-[45%] truncate text-xs">
                                {resource.tagline}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}

                    {componentGroups.map((group, index) => (
                      <React.Fragment key={group.id}>
                        {((showPages && pageHits.length > 0) ||
                          (showResources && resourceHits.length > 0) ||
                          index > 0) && <CommandSeparator />}
                        <CommandGroup heading={group.label}>
                          {group.items.map((item) => (
                            <CommandItem
                              key={item.slug}
                              value={`component-${item.slug}`}
                              onSelect={() => go(`/components/${item.slug}`)}
                            >
                              <ScopeIcon id={group.id} />
                              <span className="min-w-0 truncate">{item.name}</span>
                              <span className="text-muted-foreground ml-auto max-w-[40%] truncate text-xs">
                                {groupLabelOf(item)}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </React.Fragment>
                    ))}

                    {showResources && searching && resourceHits.length > 0 && (
                      <>
                        <CommandSeparator />
                        <CommandGroup heading="Resources">
                          {resourceHits.map((resource) => (
                            <CommandItem
                              key={resource.slug}
                              value={`resource-${resource.slug}`}
                              onSelect={() => go(`/resource/${resource.slug}`)}
                            >
                              <Compass />
                              <span className="min-w-0 truncate">{resource.name}</span>
                              <span className="text-muted-foreground ml-auto max-w-[45%] truncate text-xs">
                                {resource.tagline}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                  <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-(--fo-line) px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-(--fo-faint) uppercase">
                    <span>
                      {searching
                        ? `${resultCount} ${resultCount === 1 ? "match" : "matches"}`
                        : `${SEARCH_COUNTS[scope]} in this section`}
                    </span>
                    <span className="hidden sm:inline">↑↓ move · ↵ open · esc close</span>
                  </footer>
                </div>
              </div>
            </Command>
          ) : (
            <div className="relative flex min-h-0 flex-1 flex-col">
              <header className="flex shrink-0 items-center gap-2 border-b border-(--fo-line) px-3 py-2">
                <div className="flex min-w-0 flex-1 items-center gap-2 py-1">
                  <Sparkles className="size-4 shrink-0 text-(--fo-accent)" />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] tracking-[0.12em] text-(--fo-ink) uppercase">
                      Ask AI
                    </p>
                    <p className="truncate text-[11px] text-(--fo-faint)">{AI_MODEL_BADGE}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => enterSearch(scope)}
                  aria-pressed={true}
                  data-search-ai-toggle=""
                  className="inline-flex shrink-0 items-center gap-1.5 border border-(--fo-line) bg-(--fo-paper)/70 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-(--fo-soft) uppercase transition-colors hover:text-(--fo-ink)"
                >
                  <Search className="size-3.5" />
                  Search
                </button>
              </header>
              <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
                <SectionAside
                  mode={mode}
                  scope={scope}
                  onSearch={enterSearch}
                  onAI={enterAI}
                />
                <AIPanel
                  prompt={prompt}
                  promptRef={promptRef}
                  status={aiStatus}
                  stepIndex={stepIndex}
                  answer={answer}
                  error={error}
                  onPromptChange={setPrompt}
                  onAsk={ask}
                  onReset={() => {
                    requestId.current += 1;
                    setAnswer(null);
                    setError(null);
                    setAiStatus("idle");
                    setStepIndex(0);
                    window.setTimeout(() => promptRef.current?.focus(), 20);
                  }}
                  onNavigate={go}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function AIPanel({
  prompt,
  promptRef,
  status,
  stepIndex,
  answer,
  error,
  onPromptChange,
  onAsk,
  onReset,
  onNavigate,
}: {
  prompt: string;
  promptRef: React.RefObject<HTMLTextAreaElement | null>;
  status: AIStatus;
  stepIndex: number;
  answer: AIAnswer | null;
  error: string | null;
  onPromptChange: (value: string) => void;
  onAsk: (text: string) => void;
  onReset: () => void;
  onNavigate: (href: string) => void;
}) {
  const showComposer = status === "idle" || status === "error";

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5" aria-live="polite">
        {showComposer && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onAsk(prompt);
            }}
            className="flex min-h-full flex-col"
          >
            <label
              htmlFor="shin-ai-prompt"
              className="font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase"
            >
              Describe what you&apos;re building
            </label>
            <textarea
              id="shin-ai-prompt"
              ref={promptRef}
              value={prompt}
              onChange={(event) => onPromptChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onAsk(prompt);
                }
              }}
              rows={6}
              placeholder="A landing page for a design tool, with a hero, a pricing table, and a quiet footer…"
              className="mt-2 min-h-[8.5rem] w-full resize-none border border-(--fo-line) bg-(--fo-paper)/80 px-3 py-3 text-[15px] leading-relaxed text-(--fo-ink) outline-none placeholder:text-(--fo-faint) focus:border-(--fo-accent)"
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {EXAMPLE_PROMPTS.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => {
                    onPromptChange(example);
                    promptRef.current?.focus();
                  }}
                  className="max-w-full truncate border border-(--fo-line) bg-(--fo-paper)/70 px-2.5 py-1 text-left text-[12px] text-(--fo-soft) transition-colors hover:border-(--fo-line-strong) hover:text-(--fo-ink)"
                >
                  {example}
                </button>
              ))}
            </div>
            {error && (
              <p className="mt-3 text-[13px] text-red-600 dark:text-red-400">{error}</p>
            )}
            <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[10px] tracking-[0.1em] text-(--fo-faint) uppercase">
                {AI_MODEL_BADGE}
              </p>
              <button
                type="submit"
                data-search-ai-submit=""
                disabled={!prompt.trim()}
                className="inline-flex items-center justify-center gap-2 bg-(--fo-accent) px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-(--fo-on-accent) uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles className="size-3.5" />
                Find matches
              </button>
            </div>
          </form>
        )}

        {status === "thinking" && <ThinkingSteps activeIndex={stepIndex} />}

        {status === "ready" && answer && (
          <div className="flex flex-col gap-5">
            <ThinkingSteps activeIndex={AI_STEPS.length} done />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase">
                  Suggested for this project
                </p>
                {answer.preview && (
                  <span className="border border-(--fo-line) bg-(--fo-paper)/70 px-1.5 py-0.5 font-mono text-[9.5px] tracking-[0.12em] text-(--fo-soft) uppercase">
                    Preview · not a model
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-(--fo-ink)">
                {answer.summary}
              </p>
            </div>

            {answer.components.length > 0 && (
              <section>
                <h3 className="font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase">
                  Suggested components
                </h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {answer.components.map((item) => (
                    <li key={item.slug}>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.href)}
                        className="flex h-full w-full flex-col border border-(--fo-line) bg-(--fo-paper)/80 p-3 text-left transition-colors hover:border-(--fo-line-strong) hover:bg-(--fo-tint)"
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-[13.5px] font-medium">{item.name}</span>
                          <span className="truncate font-mono text-[9.5px] tracking-[0.08em] text-(--fo-faint) uppercase">
                            {item.section}
                          </span>
                        </span>
                        <span className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-(--fo-soft)">
                          {item.description}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {answer.resources.length > 0 && (
              <section>
                <h3 className="font-mono text-[10.5px] tracking-[0.12em] text-(--fo-faint) uppercase">
                  Suggested resources
                </h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {answer.resources.map((item) => (
                    <li key={item.slug}>
                      <button
                        type="button"
                        onClick={() => onNavigate(item.href)}
                        className="flex h-full w-full flex-col border border-(--fo-line) bg-(--fo-paper)/80 p-3 text-left transition-colors hover:border-(--fo-line-strong) hover:bg-(--fo-tint)"
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="text-[13.5px] font-medium">{item.name}</span>
                          <span className="truncate font-mono text-[9.5px] tracking-[0.08em] text-(--fo-faint) uppercase">
                            {item.category}
                          </span>
                        </span>
                        <span className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-(--fo-soft)">
                          {item.tagline}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div>
              <button
                type="button"
                onClick={onReset}
                className="border border-(--fo-line) bg-(--fo-paper)/70 px-3 py-1.5 font-mono text-[10.5px] tracking-[0.12em] text-(--fo-soft) uppercase transition-colors hover:border-(--fo-line-strong) hover:text-(--fo-ink)"
              >
                Ask another
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-(--fo-line) px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-(--fo-faint) uppercase">
        <span>
          {status === "thinking"
            ? "Previewing matches…"
            : status === "ready"
              ? "Keyword preview"
              : "enter ask · shift+enter new line"}
        </span>
        <span className="hidden sm:inline">esc close</span>
      </footer>
    </div>
  );
}

function ThinkingSteps({
  activeIndex,
  done = false,
}: {
  activeIndex: number;
  done?: boolean;
}) {
  return (
    <ol className="mb-1 flex flex-col gap-1.5">
      {AI_STEPS.map((step, index) => {
        const complete = done || index < activeIndex;
        const current = !done && index === activeIndex;
        return (
          <li
            key={step.id}
            className={cn(
              "flex items-center gap-2.5 text-[13px] transition-colors",
              complete || current ? "text-(--fo-ink)" : "text-(--fo-faint)"
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center border",
                complete
                  ? "border-(--fo-accent) bg-(--fo-tint) text-(--fo-accent)"
                  : current
                    ? "border-(--fo-accent) text-(--fo-accent)"
                    : "border-(--fo-line) text-(--fo-faint)"
              )}
            >
              {complete ? (
                <Check className="size-3" />
              ) : current ? (
                <LoaderCircle className="size-3 motion-safe:animate-spin" />
              ) : (
                <span className="size-1 rounded-full bg-current" />
              )}
            </span>
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
