"use client";

import { useEffect, useRef } from "react";
import { m, useMotionValue, useTransform } from "motion/react";
import type { Layer } from "@/lib/projects";
import {
  planeState,
  projectOpacity,
  projectScale,
  projectYvh,
  segments,
} from "@/lib/timeline";
import { useStack } from "./stack-section";

/* Breathing room above/below a plate while its conveyor runs. */
const CONVEYOR_MARGIN = 96;

/* Client shell around server-rendered plate content. Static mode: a plain
   flow section. Pinned mode: transform/opacity scrub continuously per
   frame; filter switches only via data-state (CSS transition). */
export function Plane({
  layer,
  children,
}: {
  layer: Layer;
  children: React.ReactNode;
}) {
  const { camera, progress, stageHeight, focusedDepth, enhanced } = useStack();
  const depth = layer.index;
  const seg = segments.find((s) => s.depth === depth);

  const scale = useTransform(camera, (c) => projectScale(depth - c));
  const y = useTransform(camera, (c) => `${projectYvh(depth - c)}vh`);
  const opacity = useTransform(camera, (c) => projectOpacity(depth - c));

  /* Conveyor: when a focused plate is taller than the stage, its dwell
     progress pans it top → bottom. Overflow self-heals via ResizeObserver. */
  const overflow = useMotionValue(0);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enhanced) {
      overflow.set(0);
      return;
    }
    const inner = innerRef.current;
    if (!inner) return;
    const measure = () =>
      overflow.set(
        Math.max(0, inner.offsetHeight - (stageHeight.get() - CONVEYOR_MARGIN))
      );
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    const unsubscribe = stageHeight.on("change", measure);
    measure();
    return () => {
      ro.disconnect();
      unsubscribe();
    };
  }, [enhanced, overflow, stageHeight]);

  const dwell = useTransform(
    progress,
    [seg?.focusStart ?? 0, seg?.focusEnd ?? 1],
    [0, 1]
  );
  const conveyorY = useTransform(
    () => overflow.get() / 2 - dwell.get() * overflow.get()
  );

  /* Renders happen only at focus crossings, so reading camera here is a
     point-in-time snapshot taken exactly when states change. */
  const state = enhanced
    ? planeState(depth, camera.get(), focusedDepth)
    : undefined;

  return (
    <m.section
      id={`layer-${layer.id}`}
      data-layer={layer.id}
      data-state={state}
      className="stack-plane"
      style={enhanced ? { scale, y, opacity } : undefined}
    >
      <m.div
        ref={innerRef}
        className="stack-conveyor"
        style={enhanced ? { y: conveyorY } : undefined}
      >
        {children}
      </m.div>
    </m.section>
  );
}
