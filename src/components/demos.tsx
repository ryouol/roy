"use client";

import { useRef, useState } from "react";
import { Modal } from "./modal";

/* Media sit inside Fig frames (which own the border + duotone); these
   components only handle interaction. Preview is a small muted loop;
   the full version streams only when the modal opens. */

export function VideoDemo({
  preview,
  full,
  poster,
  title,
}: {
  preview: string;
  full: string;
  poster: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const previewRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      <button
        className="group relative block w-full text-left"
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
          className="aspect-video w-full object-cover"
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
        <span className="absolute bottom-2 left-2 border border-ink bg-bg px-1.5 py-0.5 font-mono text-micro uppercase text-ink transition-colors group-hover:text-signal">
          ▶ run
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
  poster,
}: {
  id: string;
  title: string;
  /** static facade — the iframe loads only on click */
  poster: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="group relative block w-full text-left"
        onClick={() => setOpen(true)}
        aria-label={`Play demo — ${title}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local static facade */}
        <img
          src={poster}
          alt=""
          width={800}
          height={519}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover object-top"
        />
        <span className="absolute bottom-2 left-2 border border-ink bg-bg px-1.5 py-0.5 font-mono text-micro uppercase text-ink transition-colors group-hover:text-signal">
          ▶ run
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
