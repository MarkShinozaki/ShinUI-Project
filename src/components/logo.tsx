import Image from "next/image";

import { SITE_ASSETS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src={SITE_ASSETS.favicon32}
      alt=""
      width={28}
      height={28}
      priority
      className={cn("size-7 shrink-0 rounded-[7px]", className)}
    />
  );
}
