"use client";

import { useEffect, useRef, useState } from "react";
import { email } from "@/lib/data";
import { togglePhosphor } from "./theme";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function EasterEggs() {
  const [toast, setToast] = useState<string | null>(null);
  const progress = useRef(0);

  useEffect(() => {
    console.log(
      `%c❯ roy-os 2.0%c\n\nyou found the console. press \` on the page for the real terminal,\nor skip the tour: ${email}`,
      "color:#ffb454;font-family:monospace;font-weight:bold;font-size:14px",
      "color:inherit;font-family:monospace"
    );
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onKey = (e: KeyboardEvent) => {
      progress.current = e.key === KONAMI[progress.current] ? progress.current + 1 : 0;
      if (progress.current === KONAMI.length) {
        progress.current = 0;
        setToast(togglePhosphor() ? "▲ phosphor mode" : "phosphor mode off");
        clearTimeout(timeout);
        timeout = setTimeout(() => setToast(null), 2500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timeout);
    };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-md border border-line bg-well/90 px-4 py-2 font-mono text-xs text-signal backdrop-blur">
      {toast}
    </div>
  );
}
