/**
 * Subtle falling-petal motif for page backgrounds.
 * Disabled when prefers-reduced-motion is set (static petals only).
 */
export function SakuraPetals({ className }: { className?: string }) {
  const petals = [
    { left: "8%", delay: "0s", duration: "22s", size: 10 },
    { left: "22%", delay: "-4s", duration: "26s", size: 8 },
    { left: "38%", delay: "-9s", duration: "20s", size: 12 },
    { left: "55%", delay: "-2s", duration: "24s", size: 9 },
    { left: "71%", delay: "-11s", duration: "28s", size: 11 },
    { left: "86%", delay: "-6s", duration: "21s", size: 8 },
    { left: "94%", delay: "-14s", duration: "25s", size: 10 },
  ];

  return (
    <div
      aria-hidden
      className={`sakura-petals pointer-events-none fixed inset-0 z-0 overflow-hidden ${className ?? ""}`}
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="sakura-petal absolute top-[-5%] opacity-[0.35] dark:opacity-[0.22]"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.1,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
