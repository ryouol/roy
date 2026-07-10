"use client";

import { useEffect, useRef } from "react";
import { layers, type LayerId } from "@/lib/projects";

const BASE = "rotateX(56deg) rotateZ(-34deg)";

/* Each plane carries the kind of computation that lives there, so the
   figure reads as a cross-section of a system rather than blank cards.
   The marks align into a vertical thread — sense → coordinate → act.
   Drawn flat on the sheet (foreshortened by the isometric rotation),
   so they read as etched into the surface. */
function Motif({ layer }: { layer: LayerId }) {
  const common = {
    viewBox: "0 0 340 220",
    preserveAspectRatio: "none" as const,
    className: "figure-motif",
    "aria-hidden": true,
  };

  // A signal ripples up through the stack, arriving at each plane's thread
  // point (210,88) in sequence: sense → coordinate → act. The staggered
  // delays make it climb the stack.
  if (layer === "perception") {
    // Signal emerging from noise: a dim dot field, a few brighter along a
    // diagonal, brightest at the thread point.
    const noise = [
      [48, 40], [92, 58], [140, 34], [70, 96], [116, 120], [44, 150],
      [168, 66], [200, 150], [250, 44], [286, 96], [300, 150], [258, 130],
      [88, 176], [150, 180], [216, 190], [128, 74], [186, 108], [270, 176],
      [36, 108], [312, 62], [232, 74], [104, 148],
    ];
    const signal = [[96, 168], [134, 142], [172, 116], [210, 88]];
    return (
      <svg {...common}>
        {noise.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.6} className="mk-faint" />
        ))}
        {signal.map(([x, y], i) => (
          <circle key={`s${i}`} cx={x} cy={y} r={2} className="mk-mid" />
        ))}
        <circle cx={210} cy={88} r={3} className="mk-bright" />
        <circle cx={210} cy={88} className="mk-ripple" style={{ ["--d" as string]: "0s" }} />
      </svg>
    );
  }

  if (layer === "infrastructure") {
    // Coordination mesh: nodes and edges, hub on the thread point.
    const nodes: [number, number][] = [
      [64, 156], [118, 84], [178, 128], [210, 88], [262, 58], [292, 140],
    ];
    const edges: [number, number][] = [
      [0, 1], [1, 3], [0, 2], [2, 3], [3, 4], [3, 5], [2, 5], [1, 2],
    ];
    return (
      <svg {...common}>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            className="mk-edge"
          />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 3 ? 4 : 2.6} className={i === 3 ? "mk-bright" : "mk-mid"} />
        ))}
        <circle cx={210} cy={88} className="mk-ripple" style={{ ["--d" as string]: "0.6s" }} />
      </svg>
    );
  }

  // execution — a decisive tick rising to the one amber point (the call).
  return (
    <svg {...common}>
      <line x1={40} y1={176} x2={300} y2={176} className="mk-base" />
      <polyline
        points="56,164 104,150 148,132 182,108 210,88"
        className="mk-line"
        fill="none"
      />
      <circle cx={210} cy={88} className="mk-ripple sig" style={{ ["--d" as string]: "1.2s" }} />
      <circle cx={210} cy={88} r={4} className="mk-signal" />
    </svg>
  );
}

/* Resting isometric stack — decorative, pointer-tilted ±2.5°.
   Direct style writes + a CSS transition; no per-frame React work. */
export function StackFigure() {
  const groupRef = useRef<HTMLDivElement>(null);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      matchMedia("(pointer: fine)").matches &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const group = groupRef.current;
    if (!enabled.current || !group) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    group.style.transform = `rotateX(${56 - ny * 2.5}deg) rotateZ(${-34 + nx * 2.5}deg)`;
  };

  const onLeave = () => {
    const group = groupRef.current;
    if (group) group.style.transform = BASE;
  };

  return (
    <div
      className="figure-wrap"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-hidden
    >
      <div className="figure-glow" />
      <div className="figure-shadow" />
      <div ref={groupRef} className="figure-group">
        {layers.map((layer) => (
          <div key={layer.id} className={`figure-sheet z${layer.index}`}>
            <Motif layer={layer.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
