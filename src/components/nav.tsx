"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "./theme";

const LINKS = [
  { id: "perception", label: "01 perception" },
  { id: "infrastructure", label: "02 infrastructure" },
  { id: "execution", label: "03 execution" },
  { id: "work", label: "revisions" },
  { id: "contact", label: "title block" },
];

/* Sheet header bar — sits flush inside the drawing frame, opaque film,
   hard hairline. Appears once the sheet header scrolls away. */
export function SiteNav() {
  const [shown, setShown] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const navHeight = navRef.current?.offsetHeight ?? 44;
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
      className={`fixed z-40 border-b-[1.5px] border-ink bg-bg transition-all duration-500 motion-reduce:transition-none ${
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
      style={{ top: "var(--frame)", left: "var(--frame)", right: "var(--frame)" }}
    >
      <div className="flex h-(--nav-h) items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className="whitespace-nowrap font-mono text-meta font-medium uppercase"
        >
          R. Luo<span className="hidden sm:inline"> — Section A–A′</span>
        </a>
        <div className="flex items-center gap-4 font-mono text-micro uppercase sm:gap-5">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`whitespace-nowrap text-dim transition-colors hover:text-ink ${
                l.id === "work" || l.id === "contact" ? "" : "hidden md:inline"
              }`}
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
