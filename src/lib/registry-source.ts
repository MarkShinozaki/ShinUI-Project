import fs from "node:fs/promises";
import path from "node:path";

/**
 * Reads a registry component straight off disk so the displayed source can
 * never drift from the component that renders in the preview above it.
 */
export async function readRegistrySource(relativePath: string) {
  try {
    const filePath = path.join(process.cwd(), "src", relativePath);
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}
