"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories } from "@/data/categories";
import type { Pricing } from "@/data/types";
import {
  addUserResource,
  buildUserResource,
  findCuratedByUrl,
  type SiteInspectResult,
} from "@/lib/user-resources";
import { validateUrlPolicy } from "@/lib/url-policy";

const pricingOptions: { value: Pricing; label: string }[] = [
  { value: "free", label: "Free" },
  { value: "open-source", label: "Open source" },
  { value: "freemium", label: "Freemium" },
  { value: "paid", label: "Paid" },
];

export function AddResourceDialog({ onAdded }: { onAdded?: () => void }) {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [inspect, setInspect] = React.useState<SiteInspectResult | null>(null);
  const [name, setName] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("inspiration");
  const [pricing, setPricing] = React.useState<Pricing>("free");

  function reset() {
    setUrl("");
    setInspect(null);
    setName("");
    setTagline("");
    setDescription("");
    setCategory("inspiration");
    setPricing("free");
    setLoading(false);
  }

  async function handleInspect() {
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error("Enter a URL first");
      return;
    }

    const policy = validateUrlPolicy(trimmed);
    if (!policy.allowed) {
      toast.error(policy.reason);
      return;
    }

    const curated = findCuratedByUrl(trimmed);
    if (curated) {
      setInspect({
        url: curated.url,
        name: curated.name,
        tagline: curated.tagline,
        description: curated.description,
        existingSlug: curated.slug,
      });
      setName(curated.name);
      setTagline(curated.tagline);
      setDescription(curated.description);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/site-inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = (await response.json()) as SiteInspectResult & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Could not inspect site");
      }
      setInspect(data);
      setName(data.name);
      setTagline(data.tagline);
      setDescription(data.description);
      if (data.existingSlug) {
        toast.message("Already in the curated index");
      } else if (data.registry) {
        toast.success(`Found installable registry (${data.registry.itemCount} items)`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Inspect failed");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!inspect || inspect.existingSlug) return;
    if (!name.trim() || !tagline.trim()) {
      toast.error("Name and tagline are required");
      return;
    }

    try {
      const resource = buildUserResource({
        url: inspect.url,
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim() || tagline.trim(),
        category,
        pricing,
        tags: inspect.registry ? ["user-added", "registry"] : ["user-added"],
        stack: inspect.registry ? ["React", "Registry"] : ["Web"],
      });
      addUserResource(resource);
      toast.success(`${resource.name} added to your browse list`);
      onAdded?.();
      setOpen(false);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10">
          <Plus className="size-4" />
          Add site
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a design site</DialogTitle>
          <DialogDescription>
            Paste a URL — ShinUI fetches the page title and description, then
            saves it to your browser only (not the public index).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-url">Site URL</Label>
            <div className="flex gap-2">
              <Input
                id="site-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.dev"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleInspect();
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => void handleInspect()}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Fetch
              </Button>
            </div>
          </div>

          {inspect?.existingSlug && (
            <div className="rounded-lg border border-dashed p-4 text-sm">
              <p className="font-medium">Already in the curated index</p>
              <p className="text-muted-foreground mt-1">
                {inspect.name} is already listed. You can save it from browse.
              </p>
              <Button asChild size="sm" className="mt-3">
                <Link href={`/resource/${inspect.existingSlug}`}>View resource</Link>
              </Button>
            </div>
          )}

          {inspect && !inspect.existingSlug && (
            <>
              <div className="space-y-2">
                <Label htmlFor="site-name">Name</Label>
                <Input
                  id="site-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-tagline">Tagline</Label>
                <Input
                  id="site-tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Description</Label>
                <textarea
                  id="site-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site-category">Category</Label>
                  <select
                    id="site-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-xs outline-none"
                  >
                    {categories.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-pricing">Pricing</Label>
                  <select
                    id="site-pricing"
                    value={pricing}
                    onChange={(e) => setPricing(e.target.value as Pricing)}
                    className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-xs outline-none"
                  >
                    {pricingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {inspect.registry && (
                <Badge variant="brand" className="text-xs">
                  Registry detected · {inspect.registry.itemCount} installable items
                </Badge>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!inspect || !!inspect.existingSlug}
          >
            Save to browse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
