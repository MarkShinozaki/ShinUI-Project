import { cn } from "@/lib/utils";

export function TypingDots({ className }: { className?: string }) {
  const delays = ["0ms", "160ms", "320ms"];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border bg-muted/60 px-3 py-2",
        className
      )}
      role="status"
      aria-label="Typing"
    >
      {delays.map((delay, i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground motion-reduce:animate-none"
          style={{
            animation: "shinui-typing 1s ease-in-out infinite",
            animationDelay: delay,
          }}
        />
      ))}
      <style>{`
        @keyframes shinui-typing {
          0%, 60%, 100% { opacity: 0.25; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}
