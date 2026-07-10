import { layers, projectsFor, type LayerId } from "./projects";

/* Scroll geometry — the single source of truth for the traversal.
   Pure and deterministic: identical on server and client.

   All spans are vh of scroll TRAVEL while pinned; the track's total
   height is TRAVEL_VH + one stage height (100vh). Segment lengths
   derive from panel counts, so adding a project stretches its layer. */

const APPROACH_VH = 40;
const LAYER_BASE_VH = 60;
const PER_PANEL_VH = 30;

/* Hysteresis: a layer focuses at |camera − depth| < ENTER and only
   unfocuses past EXIT — the dead band kills boundary flicker. */
export const FOCUS_ENTER = 0.45;
export const FOCUS_EXIT = 0.55;

export interface Segment {
  id: LayerId;
  depth: number;
  /* normalized [0, 1] progress through the pin */
  enter: number;
  focusStart: number;
  focusEnd: number;
  exit: number;
}

const spans = layers.map(
  (l) => LAYER_BASE_VH + PER_PANEL_VH * projectsFor(l.id).length
);

export const TRAVEL_VH = APPROACH_VH + spans.reduce((a, b) => a + b, 0);

export const segments: Segment[] = (() => {
  let cursor = APPROACH_VH;
  return layers.map((l, i) => {
    const enter = cursor / TRAVEL_VH;
    const exit = (cursor + spans[i]) / TRAVEL_VH;
    cursor += spans[i];
    const ramp = 0.2 * (exit - enter); // dwell = middle 60% of the segment
    return {
      id: l.id,
      depth: l.index,
      enter,
      focusStart: enter + ramp,
      focusEnd: exit - ramp,
      exit,
    };
  });
})();

/* Camera curve: one piecewise-linear map from pin progress to camera
   depth c ∈ [−0.5, 2]. Plateaus are dwells; ramps are fly-throughs. */
export const cameraKeypoints = (() => {
  const progress = [0, APPROACH_VH / TRAVEL_VH];
  const camera = [-0.5, -0.15];
  for (const seg of segments) {
    progress.push(seg.focusStart, seg.focusEnd);
    camera.push(seg.depth, seg.depth);
  }
  progress.push(1);
  camera.push(segments[segments.length - 1].depth);
  return { progress, camera };
})();

/* Fake-z projection — no CSS perspective. d = depth − camera.
   Each plane hits identity transform exactly when focused. */
export function projectScale(d: number): number {
  return d >= 0 ? 1 / (1 + 0.35 * d) : 1 + 0.5 * -d;
}

export function projectYvh(d: number): number {
  return d >= 0 ? 4 * Math.min(d, 2) : -14 * -d;
}

export function projectOpacity(d: number): number {
  return d >= 0
    ? Math.max(1 - 0.55 * Math.min(d, 1.2), 0.34)
    : Math.max(1 + d / 0.7, 0);
}

export type PlaneState = "focused" | "near" | "far" | "passed";

export function planeState(
  depth: number,
  camera: number,
  focused: number | null
): PlaneState {
  if (focused === depth) return "focused";
  const d = depth - camera;
  if (d < -0.5) return "passed";
  return Math.abs(d) <= 1.2 ? "near" : "far";
}

/* Scroll target for a layer: the middle of its dwell. */
export function progressForLayer(id: LayerId): number {
  const seg = segments.find((s) => s.id === id);
  if (!seg) return 0;
  return (seg.focusStart + seg.focusEnd) / 2;
}
