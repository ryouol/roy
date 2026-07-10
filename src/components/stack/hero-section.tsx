"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/* Extra scroll the hero stays pinned for (vh) while the headline recedes. */
const TRAVEL_VH = 60;

/* Apple-style pinned open: the hero holds while the headline fades and
   scales away; the figure stays, grows slightly, and is then pushed off
   naturally by the incoming stack. Static-first like StackSection —
   mobile / reduced-motion / no-JS get the plain flow hero. */
export function HeroSection({
  utility,
  headline,
  figure,
  cue,
}: {
  utility: React.ReactNode;
  headline: React.ReactNode;
  figure: React.ReactNode;
  cue: React.ReactNode;
}) {
  const trackRef = useRef<HTMLElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const mq = matchMedia("(min-width: 768px)");
    const update = () => setEnhanced(mq.matches && !reduced);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /* Sprung progress, matching the traversal's camera feel. The spring is
     also load-bearing: raw scroll-linked opacity gets routed onto a
     ViewTimeline WAAPI animation whose progress ignores our target
     offsets — sprung values stay on the frame-driven path. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.3,
  });

  const utilityOpacity = useTransform(progress, [0, 0.4], [1, 0]);
  const utilityY = useTransform(progress, [0, 0.4], [0, -8]);
  const headOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const headY = useTransform(progress, [0, 0.5], [0, -40]);
  const headScale = useTransform(progress, [0, 0.5], [1, 0.965]);
  const cueOpacity = useTransform(progress, [0, 0.3], [1, 0]);
  const cueY = useTransform(progress, [0, 0.3], [0, -12]);
  const figScale = useTransform(progress, [0, 1], [1, 1.12]);
  const figY = useTransform(progress, [0, 1], ["0vh", "-2.5vh"]);

  return (
    <LazyMotion features={domAnimation} strict>
      <header
        id="top"
        ref={trackRef}
        className={`hero-track${enhanced ? " js-hero" : ""}`}
        style={
          enhanced ? { height: `calc(100svh + ${TRAVEL_VH}vh)` } : undefined
        }
      >
        <div className="hero-stage">
          <div className="hero-col mx-auto max-w-[720px] px-6 pt-10 sm:pt-12">
            <m.div
              style={
                enhanced ? { opacity: utilityOpacity, y: utilityY } : undefined
              }
            >
              {utility}
            </m.div>
            <m.div
              className="hero-head mt-16 text-center sm:mt-20"
              style={
                enhanced
                  ? { opacity: headOpacity, y: headY, scale: headScale }
                  : undefined
              }
            >
              {headline}
            </m.div>
            <m.div
              className="mt-2"
              style={enhanced ? { scale: figScale, y: figY } : undefined}
            >
              {figure}
            </m.div>
            <m.div
              style={enhanced ? { opacity: cueOpacity, y: cueY } : undefined}
            >
              {cue}
            </m.div>
          </div>
        </div>
      </header>
    </LazyMotion>
  );
}
