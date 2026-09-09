"use client";
/* eslint-disable @next/next/no-img-element -- Small local thumbnails are already optimized. */

import { useEffect, useRef, useState } from "react";
import { motionConfig } from "@/lib/motion";

export function MediaDemo({
  title,
  loom,
  poster = "/limitless-poster.jpg",
}: {
  title: string;
  loom?: string;
  poster?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    const preference = matchMedia(motionConfig.motionAllowed);
    const pauseWhenReduced = () => {
      if (!preference.matches) preview.current?.pause();
    };
    preference.addEventListener("change", pauseWhenReduced);
    return () => preference.removeEventListener("change", pauseWhenReduced);
  }, []);
  const close = () => {
    dialog.current?.close();
    setOpen(false);
  };
  return (
    <>
      <button
        className="demo-button"
        onClick={() => {
          preview.current?.pause();
          setStatus("loading");
          setOpen(true);
          dialog.current?.showModal();
        }}
        onMouseEnter={() => {
          if (matchMedia(motionConfig.motionAllowed).matches)
            preview.current?.play().catch(() => {});
        }}
        onMouseLeave={() => preview.current?.pause()}
        aria-label={`Watch ${title} demo`}
      >
        {loom ? (
          <img
            src={poster}
            alt={`${title} preview`}
            width={800}
            height={519}
            loading="lazy"
          />
        ) : (
          <video
            ref={preview}
            poster={poster}
            preload="none"
            muted
            playsInline
            loop
            width={880}
            height={517}
            aria-label={`${title} preview`}
          >
            <source src="/limitless-preview.mp4" type="video/mp4" />
          </video>
        )}
        <span className="play-button" aria-hidden>
          ↗
        </span>
        <span className="demo-caption">
          Watch the film <span aria-hidden>↗</span>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="media-modal"
        aria-label={`${title} demo`}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <button autoFocus className="modal-close" onClick={close}>
          Close ×
        </button>
        {open && (
          <div className="media-frame">
            {status === "loading" && (
              <p className="media-status" role="status">
                Loading demo…
              </p>
            )}
            {status === "error" && (
              <p className="media-status" role="alert">
                The video couldn’t load.{" "}
                <a
                  href={
                    loom
                      ? `https://www.loom.com/share/${loom}`
                      : "/limitless-full.mp4"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Open the demo directly ↗
                </a>
              </p>
            )}
            {loom ? (
              <iframe
                title={`${title} video`}
                src={`https://www.loom.com/embed/${loom}?autoplay=1`}
                allow="autoplay; fullscreen"
                allowFullScreen
                onLoad={() => setStatus("ready")}
              />
            ) : (
              <video
                controls
                autoPlay
                playsInline
                poster={poster}
                onCanPlay={() => setStatus("ready")}
                onError={() => setStatus("error")}
                src="/limitless-full.mp4"
              />
            )}
          </div>
        )}
        {open && loom && (
          <p className="embed-help">
            Player not available?{" "}
            <a
              className="text-link"
              href={`https://www.loom.com/share/${loom}`}
              target="_blank"
              rel="noreferrer"
            >
              Watch on Loom ↗
            </a>
          </p>
        )}
      </dialog>
    </>
  );
}
