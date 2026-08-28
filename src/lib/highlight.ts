export type Token = { text: string; type: string };

const KEYWORDS = new Set([
  "import", "from", "export", "default", "const", "let", "var", "function",
  "return", "if", "else", "for", "while", "of", "in", "new", "class",
  "extends", "type", "interface", "as", "async", "await", "try", "catch",
  "finally", "throw", "typeof", "instanceof", "void", "delete", "yield",
  "switch", "case", "break", "continue", "do", "this", "super", "keyof",
  "readonly", "satisfies", "implements", "enum", "namespace", "declare",
]);

const LITERALS = new Set(["true", "false", "null", "undefined", "NaN"]);

/**
 * A deliberately small single-pass tokenizer. It is not a TypeScript parser —
 * it only needs to be right often enough to make a snippet readable, and it
 * keeps the page free of a syntax-highlighting dependency.
 */
const PATTERN = new RegExp(
  [
    "(?<comment>\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)",
    "(?<string>`(?:\\\\.|[^`\\\\])*`|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')",
    "(?<tag><\\/?[A-Z][\\w.]*|<\\/?[a-z][\\w-]*(?=[\\s/>]))",
    "(?<number>\\b\\d+(?:\\.\\d+)?\\b)",
    "(?<word>[A-Za-z_$][\\w$]*)",
  ].join("|"),
  "g"
);

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;

  for (const match of code.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, index), type: "plain" });
    }

    const groups = match.groups ?? {};
    const text = match[0];

    if (groups.comment) tokens.push({ text, type: "comment" });
    else if (groups.string) tokens.push({ text, type: "string" });
    else if (groups.tag) tokens.push({ text, type: "tag" });
    else if (groups.number) tokens.push({ text, type: "number" });
    else if (groups.word) {
      if (KEYWORDS.has(text)) tokens.push({ text, type: "keyword" });
      else if (LITERALS.has(text)) tokens.push({ text, type: "literal" });
      else if (/^[A-Z]/.test(text)) tokens.push({ text, type: "type" });
      else tokens.push({ text, type: "plain" });
    }

    lastIndex = index + text.length;
  }

  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), type: "plain" });
  }

  return tokens;
}

export const tokenClass: Record<string, string> = {
  comment: "text-muted-foreground/70 italic",
  string: "text-emerald-600 dark:text-emerald-400",
  keyword: "text-violet-600 dark:text-violet-400",
  literal: "text-orange-600 dark:text-orange-400",
  number: "text-orange-600 dark:text-orange-400",
  tag: "text-sky-600 dark:text-sky-400",
  type: "text-amber-600 dark:text-amber-300",
  plain: "",
};
