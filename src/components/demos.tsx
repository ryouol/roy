"use client";

import { useRef, useState } from "react";
import { Modal } from "./modal";

export function VideoDemo({
  preview,
  full,
  poster,
  title,
}: {
  /** small muted hover loop */
  preview: string;
  /** streamed only when the modal opens */
  full: string;
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
          width={880}
          height={517}
        >
          <source src={preview} type="video/mp4" />
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
            <source src={full} type="video/mp4" />
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
  poster,
}: {
  id: string;
  title: string;
  caption: string;
  /** static facade — the iframe loads only on click */
  poster: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="group relative block w-full overflow-hidden rounded-md border border-line bg-well text-left transition-colors hover:border-dim/40"
        onClick={() => setOpen(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local static facade */}
        <img
          src={poster}
          alt=""
          width={800}
          height={519}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover object-top opacity-70 transition-opacity group-hover:opacity-100"
        />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 pt-8" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent)" }}>
          <span>
            <span className="block text-sm font-medium text-white">
              {title}
            </span>
            <span className="mt-0.5 block text-[13px] text-white/70">
              {caption}
            </span>
          </span>
          <span className="font-mono text-[11px] text-white/70 transition-colors group-hover:text-signal">
            ▶ demo
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
