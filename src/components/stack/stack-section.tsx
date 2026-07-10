"use client";

import { Atmosphere } from "./atmosphere";

/* The track. Static-first: renders layers as flow sections; the pinned
   traversal (js-stack) is layered on as a client enhancement. */
export function StackSection({ children }: { children: React.ReactNode }) {
  return (
    <section id="projects" className="stack-track">
      <Atmosphere />
      <div className="stack-stage">
        <div className="stack-scene">{children}</div>
      </div>
    </section>
  );
}
