"use client";

import { useEffect, useRef, useState } from "react";

function Modal({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 p-4 backdrop-blur-sm sm:p-10"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl overflow-hidden rounded-md border border-line bg-black"
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
    </div>
  );
}

export function VideoDemo({
  src,
  poster,
  title,
}: {
  src: string;
  poster: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      <button
        className="group relative block w-full overflow-hidden rounded-md border border-line bg-well text-left transition-colors hover:border-dim/40"
        onClick={() => setOpen(true)}
        onMouseEnter={() => previewRef.current?.play().catch(() => {})}
        onMouseLeave={() => {
          const v = previewRef.current;
          if (v) {
            v.pause();
            v.currentTime = 0;
          }
        }}
        aria-label={`Play demo — ${title}`}
      >
        <video
          ref={previewRef}
          className="aspect-video w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-[1.015] group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          muted
          playsInline
          loop
          preload="none"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
        <span className="absolute bottom-3 left-3 rounded-sm bg-bg/80 px-2 py-1 font-mono text-[11px] text-dim backdrop-blur transition-colors group-hover:text-signal">
          ▶ demo
        </span>
      </button>
      {open && (
        <Modal label={`${title} demo`} onClose={() => setOpen(false)}>
          <video
            className="aspect-video w-full"
            controls
            autoPlay
            playsInline
            poster={poster}
          >
            <source src={src} type="video/mp4" />
          </video>
        </Modal>
      )}
    </>
  );
}

export function LoomDemo({
  id,
  title,
  caption,
}: {
  id: string;
  title: string;
  caption: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="group w-full rounded-md border border-line bg-well text-left transition-colors hover:border-dim/40"
        onClick={() => setOpen(true)}
      >
        <span className="flex aspect-video flex-col items-start justify-between p-4">
          <span className="font-mono text-[11px] text-dim transition-colors group-hover:text-signal">
            ▶ demo
          </span>
          <span>
            <span className="block text-sm font-medium text-ink">{title}</span>
            <span className="mt-0.5 block text-[13px] text-dim">{caption}</span>
          </span>
        </span>
      </button>
      {open && (
        <Modal label={`${title} demo`} onClose={() => setOpen(false)}>
          <iframe
            src={`https://www.loom.com/embed/${id}?autoplay=1`}
            allowFullScreen
            allow="autoplay"
            className="aspect-video w-full"
            title={`${title} demo`}
          />
        </Modal>
      )}
    </>
  );
}
