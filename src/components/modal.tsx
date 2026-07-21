"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/* Portaled to <body>: planes in the stack carry transform/filter, which
   would otherwise become the containing block for position: fixed and
   render the modal clipped, scaled, and blurred. */
export function Modal({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      returnFocusRef.current?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 p-4 sm:p-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden border-[1.5px] border-ink bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute right-5 top-5 font-mono text-xs text-dim transition-colors hover:text-ink"
      >
        esc — close
      </button>
    </div>,
    document.body
  );
}
