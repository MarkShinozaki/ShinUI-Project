/**
 * Full-bleed animated mesh backdrop for the home hero.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="from-brand/[0.07] via-background to-background absolute inset-0 bg-gradient-to-b dark:from-brand/[0.12]" />

      <div className="absolute -top-[38%] left-[8%] size-[min(88vw,40rem)]">
        <div className="bg-brand/30 dark:bg-brand/25 hero-orb size-full rounded-full blur-[110px]" />
      </div>

      <div className="absolute -top-[28%] -right-[12%] size-[min(76vw,34rem)]">
        <div className="hero-orb hero-orb-b size-full rounded-full bg-violet-500/20 blur-[120px] dark:bg-violet-400/15" />
      </div>

      <div className="absolute top-[18%] left-1/2 size-[min(64vw,26rem)] -translate-x-1/2">
        <div className="hero-orb hero-orb-c size-full rounded-full bg-fuchsia-500/15 blur-[100px] dark:bg-fuchsia-400/10" />
      </div>

      <div className="absolute -right-[6%] bottom-[8%] size-[min(52vw,22rem)]">
        <div className="hero-orb hero-orb-d size-full rounded-full bg-sky-500/15 blur-[90px] dark:bg-sky-400/10" />
      </div>

      <div className="grid-pattern absolute inset-0 opacity-[0.45] [mask-image:radial-gradient(ellipse_85%_75%_at_50%_-10%,black,transparent)] dark:opacity-[0.22]" />

      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-soft-light dark:opacity-[0.2] dark:mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="via-brand/5 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="from-background absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent sm:h-32" />

      <style>{`
        @keyframes hero-drift-a {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(18%, 22%, 0) scale(1.28); }
        }
        @keyframes hero-drift-b {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-20%, 16%, 0) scale(1.22); }
        }
        @keyframes hero-drift-c {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(14%, -12%, 0) scale(1.26); }
        }
        @keyframes hero-drift-d {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-16%, -18%, 0) scale(1.2); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .hero-orb {
            animation: hero-drift-a 16s ease-in-out infinite;
          }
          .hero-orb-b {
            animation: hero-drift-b 20s ease-in-out infinite;
          }
          .hero-orb-c {
            animation: hero-drift-c 18s ease-in-out infinite;
          }
          .hero-orb-d {
            animation: hero-drift-d 14s ease-in-out infinite;
          }
        }
      `}</style>
    </div>
  );
}
