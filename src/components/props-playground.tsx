"use client";

import * as React from "react";

import { controlLabel, type Control, type Controls, type PropValue, type PropValues } from "@/registry/playground";
import { cn } from "@/lib/utils";

const field =
  "h-8 w-full min-w-0 border border-(--fo-line) bg-(--fo-paper) px-2.5 font-mono text-[12px] text-(--fo-ink) outline-none transition-colors placeholder:text-(--fo-faint) focus-visible:border-(--fo-accent) focus-visible:ring-2 focus-visible:ring-(--fo-accent)/25";

const chip =
  "inline-flex h-8 items-center border px-2.5 font-mono text-[10.5px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-(--fo-accent)";

function ControlInput({
  id,
  label,
  control,
  value,
  onChange,
}: {
  id: string;
  label: string;
  control: Control;
  value: PropValue;
  onChange: (value: PropValue) => void;
}) {
  switch (control.type) {
    case "text":
      return (
        <input
          id={id}
          type="text"
          value={String(value)}
          maxLength={control.maxLength}
          placeholder={control.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={field}
        />
      );
    case "number":
      return (
        <div className="flex h-8 items-center gap-3">
          <input
            id={id}
            type="range"
            min={control.min}
            max={control.max}
            step={control.step ?? 1}
            value={Number(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-1 min-w-0 flex-1 cursor-pointer accent-(--fo-accent)"
          />
          <span className="w-12 text-right font-mono text-[11px] text-(--fo-soft) tabular-nums">
            {value}
            {control.unit}
          </span>
        </div>
      );
    case "boolean":
      return (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className={cn(
            chip,
            "w-fit gap-2",
            value
              ? "border-(--fo-accent) bg-(--fo-accent) text-(--fo-on-accent)"
              : "border-(--fo-line) text-(--fo-soft) hover:bg-(--fo-tint) hover:text-(--fo-ink)"
          )}
        >
          <span aria-hidden className={cn("size-2 border", value ? "border-current bg-current" : "border-current")} />
          {value ? "On" : "Off"}
        </button>
      );
    case "select":
      return control.options.length <= 3 ? (
        <div role="radiogroup" aria-labelledby={`${id}-label`} className="flex flex-wrap gap-1">
          {control.options.map((option) => {
            const active = option === value;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange(option)}
                className={cn(
                  chip,
                  active
                    ? "border-(--fo-accent) bg-(--fo-accent) text-(--fo-on-accent)"
                    : "border-(--fo-line) text-(--fo-soft) hover:bg-(--fo-tint) hover:text-(--fo-ink)"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <select id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} className={cn(field, "cursor-pointer")}>
          {control.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case "color": {
      const hex = String(value);
      const isAuto = control.auto && hex === "";
      return (
        <div className="flex items-center gap-1.5">
          <input
            id={id}
            type="color"
            // An "auto" color has no value yet; show a neutral swatch until one is picked.
            value={isAuto ? "#888888" : hex}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "size-8 shrink-0 cursor-pointer border border-(--fo-line) bg-transparent p-0.5",
              isAuto && "opacity-50"
            )}
          />
          <input
            type="text"
            aria-label={`${label} hex value`}
            value={hex}
            placeholder={control.auto ? "auto" : undefined}
            onChange={(e) => onChange(e.target.value)}
            className={field}
          />
          {control.auto && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isAuto}
              className={cn(
                chip,
                "border-(--fo-line) text-(--fo-soft) hover:bg-(--fo-tint) hover:text-(--fo-ink) disabled:opacity-40 disabled:hover:bg-transparent"
              )}
            >
              Auto
            </button>
          )}
        </div>
      );
    }
  }
}

/** Live controls for a preview's props. Values are owned by the caller. */
export function PropsPlayground({
  controls,
  values,
  onChange,
  onReset,
  className,
}: {
  controls: Controls;
  values: PropValues;
  onChange: (key: string, value: PropValue) => void;
  onReset: () => void;
  className?: string;
}) {
  const uid = React.useId();
  return (
    <section aria-label="Props playground" className={cn("border-t border-(--fo-line) bg-(--fo-paper)", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-(--fo-line) px-4 py-2.5">
        <h3 className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-(--fo-ink) uppercase">
          <span aria-hidden className="size-1.5 bg-(--fo-accent)" />
          Props playground
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-[10.5px] tracking-[0.08em] text-(--fo-soft) uppercase transition-colors outline-none hover:text-(--fo-accent) focus-visible:text-(--fo-accent)"
        >
          Reset
        </button>
      </div>
      <div className="grid gap-x-6 gap-y-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(controls).map(([key, control]) => {
          const id = `${uid}-${key}`;
          return (
            <div key={key} className="flex min-w-0 flex-col gap-1.5">
              <label
                id={`${id}-label`}
                htmlFor={control.type === "select" && control.options.length <= 3 ? undefined : id}
                className="flex items-baseline justify-between gap-2 text-[12px] text-(--fo-soft)"
              >
                <span>{controlLabel(key, control)}</span>
                <code className="font-mono text-[10px] text-(--fo-faint)">{key}</code>
              </label>
              <ControlInput
                id={id}
                label={controlLabel(key, control)}
                control={control}
                value={values[key] ?? control.default}
                onChange={(value) => onChange(key, value)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
