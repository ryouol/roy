"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { layers, type LayerId } from "@/lib/projects";

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

/* Resting isometric stack — decorative, pointer-tilted ±2.5°. When the
   camera dives in (dive: 0→1), the group un-tilts toward the viewer and
   its sheets spread apart, handing off to the real plates rising behind.
   Direct style writes composed from base pose + pointer; no per-frame
   React work. */
export function StackFigure({ dive }: { dive?: MotionValue<number> }) {
  const groupRef = useRef<HTMLDivElement>(null);
  const enabled = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const diveT = useRef(0);

  const apply = () => {
    const group = groupRef.current;
    if (!group) return;
    const t = diveT.current;
    const rx = 56 - 40 * t + pointer.current.y;
    const rz = -34 + 24 * t + pointer.current.x;
    group.style.transform = `rotateX(${rx}deg) rotateZ(${rz}deg)`;
    group.style.setProperty("--spread", `${1 + 0.55 * t}`);
  };

  useEffect(() => {
    enabled.current =
      matchMedia("(pointer: fine)").matches &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const still = useMotionValue(0);
  useMotionValueEvent(dive ?? still, "change", (t) => {
    diveT.current = t;
    apply();
  });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled.current || diveT.current > 0.15) return;
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: (((e.clientX - r.left) / r.width) * 2 - 1) * 2.5,
      y: -(((e.clientY - r.top) / r.height) * 2 - 1) * 2.5,
    };
    apply();
  };

  const onLeave = () => {
    pointer.current = { x: 0, y: 0 };
    apply();
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
