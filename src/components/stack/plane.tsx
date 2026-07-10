"use client";

import type { Layer } from "@/lib/projects";

/* Client shell around server-rendered plate content. In static mode this
   is a plain flow section; the pinned traversal adds projection transforms. */
export function Plane({
  layer,
  children,
}: {
  layer: Layer;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`layer-${layer.id}`}
      data-layer={layer.id}
      className="stack-plane"
    >
      <div className="stack-conveyor">{children}</div>
    </section>
  );
}
