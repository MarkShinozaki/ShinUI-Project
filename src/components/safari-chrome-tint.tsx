/**
 * Solid edge samples for iOS Safari 26+ Liquid Glass chrome.
 * Safari ignores theme-color and tints from fixed edge backgrounds that are
 * near the viewport (within ~4px), ≥80% wide, and a few pixels tall.
 */
export function SafariChromeTint() {
  return (
    <>
      <div
        aria-hidden
        className="bg-background pointer-events-none fixed inset-x-0 -top-2 z-[60] h-3 w-full md:hidden"
      />
      <div
        aria-hidden
        className="bg-background pointer-events-none fixed inset-x-0 -bottom-2 z-[60] h-3 w-full md:hidden"
      />
    </>
  );
}
