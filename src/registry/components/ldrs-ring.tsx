import { cn } from "@/lib/utils";

export function LdrsRing({
  className,
  size = 40,
  stroke = 3,
}: {
  className?: string;
  size?: number;
  stroke?: number;
}) {
  return (
    <div
      className={cn("inline-grid place-items-center", className)}
      role="status"
      aria-label="Loading"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        className="motion-reduce:animate-none"
        style={{ animation: "shinui-ldrs-spin 1s linear infinite" }}
      >
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/30"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray="28 85"
          className="text-brand"
        />
      </svg>
      <style>{`
        @keyframes shinui-ldrs-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
