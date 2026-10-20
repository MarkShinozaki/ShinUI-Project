import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.env.OUT_DIR ?? "/opt/cursor/artifacts/screenshots";

const pages = [
  { name: "home", path: "/" },
  { name: "portfolios", path: "/portfolios" },
  { name: "design-tools", path: "/design-tools" },
  { name: "favicon-studio", path: "/design-tools/favicon-studio" },
];

async function shot(page, file, { theme, width, height }) {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ colorScheme: theme });
  await page.evaluate((t) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(t);
  }, theme);
  await page.waitForTimeout(400);
  await page.screenshot({ path: file, fullPage: false });
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const { name, path } of pages) {
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await shot(page, `${OUT}/${name}-desktop-light.png`, {
      theme: "light",
      width: 1440,
      height: 900,
    });
    await shot(page, `${OUT}/${name}-desktop-dark.png`, {
      theme: "dark",
      width: 1440,
      height: 900,
    });
    if (name === "home") {
      await shot(page, `${OUT}/${name}-mobile-light.png`, {
        theme: "light",
        width: 390,
        height: 844,
      });
    }
  }

  await browser.close();
  console.log("Saved to", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
