"use client";

import { useEffect, useState } from "react";

export function applyTheme(light: boolean) {
  document.documentElement.classList.toggle("light", light);
  try {
    localStorage.setItem("theme", light ? "light" : "dark");
  } catch {}
}

export function togglePhosphor(): boolean {
  return document.documentElement.classList.toggle("phosphor");
}

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  // Track the html class rather than local state so the terminal's
  // `theme` command and this button stay in sync.
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setLight(el.classList.contains("light"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <button
      onClick={() => applyTheme(!light)}
      aria-label={light ? "Switch to dark theme" : "Switch to light theme"}
      className="text-dim transition-colors hover:text-ink"
    >
      {light ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
