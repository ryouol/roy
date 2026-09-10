"use client";
import { useRef, useState } from "react";

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
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const source = loom
    ? `https://www.loom.com/share/${loom}`
    : "/limitless-full.mp4";
  const close = () => {
    dialog.current?.close();
    setOpen(false);
  };
  return (
    <>
      <a
        className="demo-link"
        href={source}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
            return;
          event.preventDefault();
          setStatus("loading");
          setOpen(true);
          dialog.current?.showModal();
        }}
        aria-label={`Watch ${title} demo`}
      >
        Watch demo
      </a>
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
          Close
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
                <a href={source} target="_blank" rel="noreferrer">
                  Open video
                </a>
              </p>
            )}
            {status !== "error" &&
              (loom ? (
                <iframe
                  title={`${title} video`}
                  src={`https://www.loom.com/embed/${loom}?autoplay=1`}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  onLoad={() => setStatus("ready")}
                  onError={() => setStatus("error")}
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
              ))}
          </div>
        )}
        {open && loom && (
          <p className="embed-help">
            Player not available?{" "}
            <a
              className="text-link"
              href={source}
              target="_blank"
              rel="noreferrer"
            >
              Watch on Loom
            </a>
          </p>
        )}
      </dialog>
    </>
  );
}
