"use client";

import { useEffect, useRef, useState } from "react";
import { sections } from "@/lib/data";
import { ThemeToggle } from "./theme";

export function SiteNav() {
  const [shown, setShown] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const navHeight = navRef.current?.offsetHeight ?? 48;
    const observer = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      { rootMargin: `-${navHeight}px 0px 0px 0px` }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Site"
      className={`site-nav fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-xl transition-all duration-500 motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex h-(--nav-h) max-w-[720px] items-center justify-between px-6">
        <a href="#top" className="text-sm font-medium">
          Roy Luo
        </a>
        <div className="flex items-center gap-5 font-mono text-xs">
          {sections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="text-dim transition-colors hover:text-ink"
            >
              {section}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
