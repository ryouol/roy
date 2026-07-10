"use client";

import { layers, type LayerId } from "@/lib/projects";

/* Instrument marking, not navigation chrome: three ticks on the right
   edge, current one in signal. Labels surface on hover/focus only. */
export function DepthRail({
  focusedDepth,
  pinned,
  onJump,
}: {
  focusedDepth: number | null;
  pinned: boolean;
  onJump: (id: LayerId) => void;
}) {
  const current = layers.find((l) => l.index === focusedDepth);

  return (
    <nav
      aria-label="Stack depth"
      className="depth-rail"
      data-visible={pinned || undefined}
    >
      {layers.map((layer) => (
        <button
          key={layer.id}
          type="button"
          className="depth-tick"
          data-current={layer.index === focusedDepth || undefined}
          onClick={() => onJump(layer.id)}
          aria-label={`Go to ${layer.name} layer`}
        >
          <span className="depth-tick-label font-mono text-micro text-dim">
            {layer.name}
          </span>
          <span className="depth-tick-mark" aria-hidden />
        </button>
      ))}
      <span className="sr-only" aria-live="polite">
        {current
          ? `Layer ${current.index + 1} of ${layers.length} — ${current.name}`
          : ""}
      </span>
    </nav>
  );
}
