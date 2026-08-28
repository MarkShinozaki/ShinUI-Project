"use client";

import { cn } from "@/lib/utils";

export function FlipCard({
  front,
  back,
  className,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("group h-44 w-full max-w-xs [perspective:1000px]", className)}
    >
      <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] motion-reduce:transition-none motion-reduce:group-hover:[transform:none]">
        <div className="bg-card absolute inset-0 flex flex-col justify-center rounded-xl border p-5 [backface-visibility:hidden]">
          {front}
        </div>
        <div className="bg-card absolute inset-0 flex flex-col justify-center rounded-xl border p-5 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {back}
        </div>
      </div>
    </div>
  );
}
