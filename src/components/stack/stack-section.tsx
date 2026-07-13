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
  m,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { LayerId } from "@/lib/projects";
import {
  FOCUS_ENTER,
  FOCUS_EXIT,
  TRAVEL_VH,
  cameraKeypoints,
  hero,
  progressForLayer,
  segments,
} from "@/lib/timeline";
import { Atmosphere, ScrubbedAtmosphere } from "./atmosphere";
import { DepthRail } from "./depth-rail";
import { StackFigure } from "./stack-figure";

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

/* Serializable slots only — page.tsx is a server component. The figure
   (which needs the dive MotionValue) is rendered here directly. */
interface HeroSlots {
  utility: React.ReactNode;
  headline: React.ReactNode;
  cue: React.ReactNode;
}

/* The track — hero included. One pinned timeline: the headline recedes
   (dwell), the camera dives INTO the figure (it un-tilts, spreads, and
   fades while the real plates rise through it), then the descent runs
   as before. Static-first: SSR and the first client render emit the
   sequential flow layout; js-stack switches everything on pre-paint. */
export function StackSection({
  heroSlots,
  children,
}: {
  heroSlots: HeroSlots;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [heroGone, setHeroGone] = useState(false);
  const [focusedDepth, setFocusedDepth] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /* Sprung sources: wheel steps become eased glides, and springs are
     load-bearing — raw scroll-linked opacity gets routed onto ViewTimeline
     WAAPI animations whose progress ignores our offsets. */
  const sp = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.3,
  });
  const rawCamera = useTransform(
    scrollYProgress,
    cameraKeypoints.progress,
    cameraKeypoints.camera
  );
  const camera = useSpring(rawCamera, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
  });
  const stageHeight = useMotionValue(0);

  /* ——— Hero choreography ——— */
  const { dwellEnd, diveEnd } = hero;
  const dive = useTransform(sp, [dwellEnd, diveEnd], [0, 1]);
  const utilityOpacity = useTransform(sp, [0, dwellEnd * 0.7], [1, 0]);
  const utilityY = useTransform(sp, [0, dwellEnd * 0.7], [0, -8]);
  const headOpacity = useTransform(sp, [0, dwellEnd], [1, 0]);
  const headY = useTransform(sp, [0, dwellEnd], [0, -40]);
  const headScale = useTransform(sp, [0, dwellEnd], [1, 0.965]);
  const cueOpacity = useTransform(sp, [0, dwellEnd * 0.5], [1, 0]);
  const cueY = useTransform(sp, [0, dwellEnd * 0.5], [0, -12]);
  const span = diveEnd - dwellEnd;
  const figScale = useTransform(sp, [dwellEnd, diveEnd], [1, 1.5]);
  const figY = useTransform(sp, [dwellEnd, diveEnd], ["0vh", "-4vh"]);
  const figOpacity = useTransform(
    sp,
    [dwellEnd + span * 0.3, dwellEnd + span * 0.72],
    [1, 0]
  );
  /* Plates hidden through the dwell; they rise in as the figure opens. */
  const sceneOpacity = useTransform(
    sp,
    [dwellEnd, dwellEnd + span * 0.6],
    [0, 1]
  );

  useMotionValueEvent(sp, "change", (v) => {
    setHeroGone(v > diveEnd);
  });

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
    const io = new IntersectionObserver(([entry]) => {
      setPinned(entry.isIntersecting);
      root.toggleAttribute("data-stack-pinned", entry.isIntersecting);
    });
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
          {/* Sentinel: keeps nav.tsx's #top observer and the terminal's
              `top` command working now that the hero shares this track. */}
          <div id="top" className="stack-top-sentinel" aria-hidden />
          {enhanced ? <ScrubbedAtmosphere camera={camera} /> : <Atmosphere />}
          {enhanced && (
            <DepthRail
              focusedDepth={focusedDepth}
              pinned={pinned && focusedDepth !== null}
              onJump={jumpTo}
            />
          )}
          <div
            ref={stageRef}
            className="stack-stage"
            data-pinned={pinned || undefined}
          >
            <div
              className="stack-hero"
              data-gone={(enhanced && heroGone) || undefined}
            >
              <div className="hero-col mx-auto max-w-[720px] px-6 pt-10 sm:pt-12">
                <m.div
                  style={
                    enhanced
                      ? { opacity: utilityOpacity, y: utilityY }
                      : undefined
                  }
                >
                  {heroSlots.utility}
                </m.div>
                <m.div
                  className="hero-head mt-16 text-center sm:mt-20"
                  style={
                    enhanced
                      ? { opacity: headOpacity, y: headY, scale: headScale }
                      : undefined
                  }
                >
                  {heroSlots.headline}
                </m.div>
                <m.div
                  className="mt-2"
                  style={
                    enhanced
                      ? { opacity: figOpacity, y: figY, scale: figScale }
                      : undefined
                  }
                >
                  <div className="rise" style={{ animationDelay: "240ms" }}>
                    <StackFigure dive={dive} />
                  </div>
                </m.div>
                <m.div
                  style={enhanced ? { opacity: cueOpacity, y: cueY } : undefined}
                >
                  {heroSlots.cue}
                </m.div>
              </div>
            </div>
            <m.div
              className="stack-scene"
              style={enhanced ? { opacity: sceneOpacity } : undefined}
            >
              {children}
            </m.div>
          </div>
        </section>
      </StackContext.Provider>
    </LazyMotion>
  );
}
