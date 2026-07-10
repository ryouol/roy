"use client";

import { useEffect, useRef } from "react";
import { layers } from "@/lib/projects";

const BASE = "rotateX(56deg) rotateZ(-34deg)";

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
      <div ref={groupRef} className="figure-group">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={`figure-sheet plane-sheet z${layer.index}`}
          >
            <span className="figure-label font-mono text-label uppercase text-dim">
              {layer.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
