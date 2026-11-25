/**
 * Props playground schema. A registry item lists `controls`; each key is the
 * prop it drives. Kept as plain data so the server page can hand it to the
 * client preview.
 */
export type Control =
  | {
      type: "text";
      label?: string;
      default: string;
      placeholder?: string;
      maxLength?: number;
    }
  | { type: "number"; label?: string; default: number; min: number; max: number; step?: number; unit?: string }
  | { type: "boolean"; label?: string; default: boolean }
  | { type: "select"; label?: string; default: string; options: readonly string[] }
  | {
      type: "color";
      label?: string;
      default: string;
      /** Allow an empty value, which means "use the component's own color". */
      auto?: boolean;
    };

export type Controls = Record<string, Control>;
export type PropValue = string | number | boolean;
export type PropValues = Record<string, PropValue>;

export function defaultProps(controls: Controls = {}): PropValues {
  return Object.fromEntries(Object.entries(controls).map(([key, control]) => [key, control.default]));
}

/** "waitTime" -> "Wait time", unless the control names itself. */
export function controlLabel(key: string, control: Control): string {
  if (control.label) return control.label;
  const words = key.replace(/([A-Z])/g, " $1");
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
}

/** TypeScript-ish type of a control, for the props table. */
export function controlType(control: Control): string {
  switch (control.type) {
    case "select":
      return control.options.map((o) => `"${o}"`).join(" | ");
    case "text":
    case "color":
      return "string";
    default:
      return control.type;
  }
}

function jsxProp(key: string, value: PropValue): string {
  if (typeof value === "string") return `${key}=${JSON.stringify(value)}`;
  if (value === true) return key;
  return `${key}={${String(value)}}`;
}

/**
 * JSX for the current playground values. Props still at their playground
 * default are left out, as are empty "auto" values.
 */
export function usageFromValues(componentName: string, importPath: string, controls: Controls, values: PropValues): string {
  const props = Object.entries(controls)
    .filter(([key, control]) => {
      const value = values[key] ?? control.default;
      if (value === control.default) return false;
      return !(typeof value === "string" && value === "" && (control.type === "color" || control.type === "text"));
    })
    .map(([key, control]) => jsxProp(key, values[key] ?? control.default));

  const tag =
    props.length === 0
      ? `<${componentName} />`
      : props.join(" ").length <= 48
        ? `<${componentName} ${props.join(" ")} />`
        : [`<${componentName}`, ...props.map((p) => `      ${p}`), "    />"].join("\n");

  return [
    `import { ${componentName} } from "${importPath}";`,
    "",
    "export function Example() {",
    "  return (",
    `    ${tag}`,
    "  );",
    "}",
  ].join("\n");
}
