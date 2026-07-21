"use client";

import { useEffect, useState } from "react";

/* The drawing's depth scale: L0 datum through the strata to the title
   block. Doubles as keyboard navigation — ↑/↓ jump between marks,
   1/2/3 go straight to a layer. Progressive enhancement over native
   scroll; the wheel is never touched. */

const MARKS = [
  { id: "top", label: "L0", name: "datum" },
  { id: "perception", label: "L1", name: "perception" },
  { id: "infrastructure", label: "L2", name: "infrastructure" },
  { id: "execution", label: "L3", name: "execution" },
  { id: "work", label: "REV", name: "revisions" },
  { id: "contact", label: "TB", name: "title block" },
];

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}

export function DepthScale() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = MARKS.findIndex((m) => m.id === e.target.id);
          if (i >= 0) setCurrent(i);
        }
      },
      { rootMargin: "-42% 0px -42% 0px" }
    );
    for (const m of MARKS) {
      const el = document.getElementById(m.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement;
      if (
        t.tagName === "INPUT" ||
        t.tagName === "TEXTAREA" ||
        t.isContentEditable
      )
        return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const next =
          e.key === "ArrowDown"
            ? Math.min(current + 1, MARKS.length - 1)
            : Math.max(current - 1, 0);
        jump(MARKS[next].id);
      } else if (e.key >= "1" && e.key <= "3") {
        jump(MARKS[Number(e.key)].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  return (
    <nav
      aria-label="Section depth"
      className="fixed top-1/2 z-20 hidden -translate-y-1/2 lg:block"
      style={{ left: "calc(var(--frame) + 10px)" }}
    >
      <ul className="flex flex-col gap-5">
        {MARKS.map((m, i) => (
          <li key={m.id}>
            <button
              onClick={() => jump(m.id)}
              aria-label={`Go to ${m.name}`}
              aria-current={i === current ? "true" : undefined}
              className="group flex min-h-6 items-center gap-2"
            >
              <span
                aria-hidden
                className={`h-px transition-all duration-200 ${
                  i === current ? "w-6 bg-signal" : "w-3.5 bg-dim/50 group-hover:bg-ink"
                }`}
                style={i === current ? { height: 2 } : undefined}
              />
              <span
                className={`font-mono text-micro uppercase transition-colors ${
                  i === current ? "text-signal" : "text-dim/60 group-hover:text-ink"
                }`}
              >
                {m.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
