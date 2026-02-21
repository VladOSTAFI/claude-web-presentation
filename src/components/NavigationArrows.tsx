"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useCallback } from "react";
import { navigationItems } from "@/lib/content";

const routes = navigationItems.map((item) => item.path);

export default function NavigationArrows() {
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = routes.indexOf(pathname);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < routes.length - 1;

  const goBack = useCallback(() => {
    if (canGoBack) {
      router.push(routes[currentIndex - 1]);
    }
  }, [canGoBack, currentIndex, router]);

  const goForward = useCallback(() => {
    if (canGoForward) {
      router.push(routes[currentIndex + 1]);
    }
  }, [canGoForward, currentIndex, router]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        goBack();
      } else if (event.key === "ArrowRight") {
        goForward();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goBack, goForward]);

  return (
    <>
      {canGoBack && (
        <button
          onClick={goBack}
          aria-label="Go to previous section"
          className="fixed left-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-text-primary/10 text-text-primary/70 backdrop-blur-sm transition-all duration-300 hover:bg-text-primary/20 hover:text-text-primary md:left-6 md:h-14 md:w-14"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {canGoForward && (
        <button
          onClick={goForward}
          aria-label="Go to next section"
          className="fixed right-4 top-1/2 z-50 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-text-primary/10 text-text-primary/70 backdrop-blur-sm transition-all duration-300 hover:bg-text-primary/20 hover:text-text-primary md:right-6 md:h-14 md:w-14"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>
      )}
    </>
  );
}
