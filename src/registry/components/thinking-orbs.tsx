import { cn } from "@/lib/utils";

export function ThinkingOrbs({
  className,
  size = 6,
}: {
  className?: string;
  /** Dot diameter in pixels. */
  size?: number;
}) {
  const delays = ["0ms", "180ms", "360ms"];

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      role="status"
      aria-label="Thinking"
    >
      {delays.map((delay, i) => (
        <span
          key={i}
          className="rounded-full bg-brand motion-reduce:animate-none"
          style={{
            width: size,
            height: size,
            opacity: 0.35,
            animation: "shinui-orb 1.1s ease-in-out infinite",
            animationDelay: delay,
          }}
        />
      ))}
      <style>{`
        @keyframes shinui-orb {
          0%, 100% { transform: translateY(0); opacity: 0.35; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
