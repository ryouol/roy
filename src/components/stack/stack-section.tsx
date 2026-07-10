"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  LazyMotion,
  domAnimation,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { LayerId } from "@/lib/projects";
import {
  FOCUS_ENTER,
  FOCUS_EXIT,
  TRAVEL_VH,
  cameraKeypoints,
  progressForLayer,
  segments,
} from "@/lib/timeline";
import { Atmosphere, ScrubbedAtmosphere } from "./atmosphere";
import { DepthRail } from "./depth-rail";

interface StackContextValue {
  camera: MotionValue<number>;
  progress: MotionValue<number>;
  stageHeight: MotionValue<number>;
  focusedDepth: number | null;
  enhanced: boolean;
}

const StackContext = createContext<StackContextValue | null>(null);

export function useStack() {
  const value = useContext(StackContext);
  if (!value) throw new Error("useStack must be used inside StackSection");
  return value;
}

/* The track. Static-first: SSR and the first client render emit the
   sequential flow layout; js-stack switches on the pinned traversal in a
   pre-paint layout effect (≥768px, motion-ok only). All per-frame work
   lives in MotionValues — React renders only at focus crossings. */
export function StackSection({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [focusedDepth, setFocusedDepth] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const camera = useTransform(
    scrollYProgress,
    cameraKeypoints.progress,
    cameraKeypoints.camera
  );
  const stageHeight = useMotionValue(0);

  /* Enhancement gate — flips before paint, so SSR markup never shifts
     visibly. Reacts live to viewport and reduced-motion changes. */
  useLayoutEffect(() => {
    const mq = matchMedia("(min-width: 768px)");
    const update = () => setEnhanced(mq.matches && !reduced);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  /* Stage height feeds the conveyors (overflow math) without renders. */
  useEffect(() => {
    if (!enhanced) return;
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => stageHeight.set(stage.clientHeight);
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    measure();
    return () => ro.disconnect();
  }, [enhanced, stageHeight]);

  /* data-stack-pinned on <html> gates will-change and the nav's
     backdrop-blur swap to whenever the traversal is actually on screen. */
  useEffect(() => {
    const root = document.documentElement;
    if (!enhanced) {
      root.removeAttribute("data-stack-pinned");
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    // Trigger only once the track is genuinely entering the viewport, so the
    // depth rail and will-change promotion don't fire while still in the hero.
    const io = new IntersectionObserver(
      ([entry]) => {
        setPinned(entry.isIntersecting);
        root.toggleAttribute("data-stack-pinned", entry.isIntersecting);
      },
      { rootMargin: "0px 0px -55% 0px" }
    );
    io.observe(track);
    return () => {
      io.disconnect();
      root.removeAttribute("data-stack-pinned");
    };
  }, [enhanced]);

  /* Focus with hysteresis — the only per-frame → React bridge, and it
     bails unless the focused layer actually changes. */
  useMotionValueEvent(camera, "change", (c) => {
    setFocusedDepth((current) => {
      if (current !== null && Math.abs(c - current) < FOCUS_EXIT) {
        return current;
      }
      const next = segments.find((s) => Math.abs(c - s.depth) < FOCUS_ENTER);
      return next?.depth ?? null;
    });
  });

  /* Layers are timeline positions, not document offsets — resolve a
     layer to its dwell midpoint inside the pin. */
  const jumpTo = useCallback(
    (id: LayerId) => {
      const track = trackRef.current;
      if (!track) return;
      const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!enhanced) {
        document
          .getElementById(`layer-${id}`)
          ?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
        return;
      }
      const stageH = stageRef.current?.clientHeight ?? window.innerHeight;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const travel = track.offsetHeight - stageH;
      window.scrollTo({
        top: top + progressForLayer(id) * travel,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [enhanced]
  );

  useEffect(() => {
    const onJump = (e: Event) => jumpTo((e as CustomEvent<LayerId>).detail);
    window.addEventListener("stack:jump", onJump);
    return () => window.removeEventListener("stack:jump", onJump);
  }, [jumpTo]);

  /* Focus-follows-keyboard: tabbing (or find-in-page) into a non-focused
     plane drives the camera there instead of leaving focus in a blur. */
  useEffect(() => {
    if (!enhanced) return;
    const track = trackRef.current;
    if (!track) return;
    const onFocusIn = (e: FocusEvent) => {
      const plane = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-layer]"
      );
      if (!plane) return;
      const id = plane.dataset.layer as LayerId;
      const depth = segments.find((s) => s.id === id)?.depth;
      if (depth !== undefined && depth !== focusedDepth) jumpTo(id);
    };
    track.addEventListener("focusin", onFocusIn);
    return () => track.removeEventListener("focusin", onFocusIn);
  }, [enhanced, focusedDepth, jumpTo]);

  return (
    <LazyMotion features={domAnimation} strict>
      <StackContext.Provider
        value={{
          camera,
          progress: scrollYProgress,
          stageHeight,
          focusedDepth,
          enhanced,
        }}
      >
        <section
          id="projects"
          ref={trackRef}
          className={`stack-track${enhanced ? " js-stack" : ""}`}
          style={enhanced ? { height: `${TRAVEL_VH + 100}vh` } : undefined}
        >
          {enhanced ? <ScrubbedAtmosphere camera={camera} /> : <Atmosphere />}
          {enhanced && (
            <DepthRail
              focusedDepth={focusedDepth}
              pinned={pinned}
              onJump={jumpTo}
            />
          )}
          <div
            ref={stageRef}
            className="stack-stage"
            data-pinned={pinned || undefined}
          >
            <div className="stack-scene">{children}</div>
          </div>
        </section>
      </StackContext.Provider>
    </LazyMotion>
  );
}
