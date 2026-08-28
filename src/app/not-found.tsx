import Link from "next/link";
import { Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center px-4 text-center">
      <div>
        <p className="text-muted-foreground font-mono text-sm">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Nothing indexed here
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          That resource or component is not in the index. Try searching with
          ⌘K, or start from the browse page.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <Home className="size-4" />
              Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/browse">
              <Compass className="size-4" />
              Browse
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
