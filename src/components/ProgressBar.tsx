"use client";

import { useRouter, usePathname } from "next/navigation";
import { navigationItems } from "@/lib/content";

export default function ProgressBar() {
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = navigationItems.findIndex((s) => s.path === pathname);

  return (
    <nav
      aria-label="Presentation progress"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-primary/80 px-4 py-3 backdrop-blur-md md:px-8 md:py-4"
    >
      <ol className="flex items-center gap-4 md:gap-8" role="list">
        {navigationItems.map((section, index) => {
          const isActive = index === currentIndex;
          const isVisited = index < currentIndex;

          return (
            <li key={section.path} className="flex flex-col items-center">
              <button
                onClick={() => router.push(section.path)}
                aria-label={`Go to ${section.label} section`}
                aria-current={isActive ? "step" : undefined}
                className="group flex cursor-pointer flex-col items-center gap-1.5"
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full transition-all duration-500 md:h-3 md:w-3 ${
                    isActive
                      ? "scale-125 bg-accent-purple shadow-[0_0_10px_rgba(127,86,217,0.6)]"
                      : isVisited
                        ? "bg-accent-purple/50 group-hover:bg-accent-purple/70"
                        : "bg-text-primary/20 group-hover:bg-text-primary/40"
                  }`}
                />
                <span
                  className={`hidden text-[10px] uppercase tracking-wider transition-colors duration-300 md:block ${
                    isActive
                      ? "text-accent-purple"
                      : isVisited
                        ? "text-text-secondary"
                        : "text-text-muted group-hover:text-text-secondary"
                  }`}
                >
                  {section.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
