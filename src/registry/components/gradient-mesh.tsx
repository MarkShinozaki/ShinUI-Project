import { cn } from "@/lib/utils";

/**
 * Pure CSS mesh gradient — four drifting radial blobs behind a grain layer.
 * No canvas, no WebGL, safe to render on the server.
 */
export function GradientMesh({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-xl bg-zinc-950",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute -top-1/3 -left-1/4 size-[60%] rounded-full bg-violet-500/45 blur-3xl motion-safe:animate-[shinui-drift_14s_ease-in-out_infinite_alternate]"
      />
      <div
        aria-hidden
        className="absolute -right-1/4 -bottom-1/3 size-[65%] rounded-full bg-sky-500/40 blur-3xl motion-safe:animate-[shinui-drift_18s_ease-in-out_infinite_alternate-reverse]"
      />
      <div
        aria-hidden
        className="absolute top-1/4 right-1/4 size-[45%] rounded-full bg-fuchsia-500/35 blur-3xl motion-safe:animate-[shinui-drift_22s_ease-in-out_infinite_alternate]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/3 size-[40%] rounded-full bg-emerald-400/25 blur-3xl motion-safe:animate-[shinui-drift_16s_ease-in-out_infinite_alternate-reverse]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative">{children}</div>
      <style>{`
        @keyframes shinui-drift {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(12%, 10%, 0) scale(1.25); }
        }
      `}</style>
    </div>
  );
}
