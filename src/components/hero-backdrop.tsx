/**
 * Full-bleed sakura mesh backdrop for the home hero.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sakura-blush/40 via-background to-background dark:from-sakura-bloom/10" />
      <div className="bg-mesh-sakura absolute inset-0 opacity-90" />

      <div className="hidden md:block absolute -top-[38%] left-[8%] size-[min(88vw,40rem)]">
        <div className="bg-sakura-rose/25 dark:bg-sakura-bloom/20 hero-orb size-full rounded-full blur-[80px]" />
      </div>

      <div className="hidden md:block absolute -top-[28%] -right-[12%] size-[min(76vw,34rem)]">
        <div className="hero-orb hero-orb-b size-full rounded-full bg-sakura-bloom/25 blur-[90px] dark:bg-sakura-bloom/15" />
      </div>

      <div className="hidden md:block absolute top-[18%] left-1/2 size-[min(64vw,26rem)] -translate-x-1/2">
        <div className="hero-orb hero-orb-c size-full rounded-full bg-sakura-petal/30 blur-[70px] dark:bg-sakura-rose/15" />
      </div>

      <div className="hidden md:block absolute -right-[6%] bottom-[8%] size-[min(52vw,22rem)]">
        <div className="hero-orb hero-orb-d size-full rounded-full bg-sakura-blush/40 blur-[60px] dark:bg-sakura-plum/30" />
      </div>

      <div className="folio-grid absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_85%_75%_at_50%_-10%,black,transparent)] dark:opacity-[0.28]" />

      <div className="via-brand/25 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="from-background absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent sm:h-32" />

      <style>{`
        @keyframes hero-drift-a {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(18%, 22%, 0) scale(1.15); }
        }
        @keyframes hero-drift-b {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-20%, 16%, 0) scale(1.1); }
        }
        @keyframes hero-drift-c {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(14%, -12%, 0) scale(1.12); }
        }
        @keyframes hero-drift-d {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-16%, -18%, 0) scale(1.08); }
        }
        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          .hero-orb {
            animation: hero-drift-a 16s ease-in-out infinite;
            will-change: transform;
          }
          .hero-orb-b {
            animation: hero-drift-b 20s ease-in-out infinite;
            will-change: transform;
          }
          .hero-orb-c {
            animation: hero-drift-c 18s ease-in-out infinite;
            will-change: transform;
          }
          .hero-orb-d {
            animation: hero-drift-d 14s ease-in-out infinite;
            will-change: transform;
          }
        }
      `}</style>
    </div>
  );
}
