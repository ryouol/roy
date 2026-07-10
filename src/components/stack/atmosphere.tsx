"use client";

import { m, useTransform, type MotionValue } from "motion/react";

/* Static variant: depth 0 (the dusk surface) — what SSR, mobile, and
   reduced-motion see. CSS defaults already hide atmo-1/2. */
export function Atmosphere() {
  return (
    <div aria-hidden>
      <div className="atmo atmo-0" />
      <div className="atmo atmo-1" />
      <div className="atmo atmo-2" />
      <div className="atmo-grain" />
    </div>
  );
}

/* Scrubbed variant: cross-fades with the camera. Opacity-only —
   the gradients themselves are painted once. */
export function ScrubbedAtmosphere({ camera }: { camera: MotionValue<number> }) {
  const o0 = useTransform(camera, [0, 1], [1, 0]);
  const o1 = useTransform(camera, [0, 1, 2], [0, 1, 0]);
  const o2 = useTransform(camera, [1, 2], [0, 1]);

  return (
    <div aria-hidden>
      <m.div className="atmo atmo-0" style={{ opacity: o0 }} />
      <m.div className="atmo atmo-1" style={{ opacity: o1 }} />
      <m.div className="atmo atmo-2" style={{ opacity: o2 }} />
      <div className="atmo-grain" />
    </div>
  );
}
