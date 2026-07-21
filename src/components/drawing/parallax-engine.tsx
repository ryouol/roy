"use client";

import { useEffect } from "react";

/* The whole JS cost of the parallax system (~2KB): will-change gating
   near the viewport for every .px, plus a rAF + offset-progress fallback
   for browsers without CSS scroll-driven animations. Native scroll only —
   nothing here ever intercepts wheel or touch. */

let started = false;

function start() {
  if (started) return;
  started = true;

  const els = Array.from(document.querySelectorAll<HTMLElement>(".px"));
  if (!els.length) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const native = CSS.supports("animation-timeline: view()");

  const near = new Set<HTMLElement>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        el.classList.toggle("px-near", e.isIntersecting);
        if (e.isIntersecting) near.add(el);
        else near.delete(el);
      }
      if (!native && !reduced) schedule();
    },
    { rootMargin: "25% 0px" }
  );
  els.forEach((el) => io.observe(el));

  if (native || reduced) return;

  /* Fallback progress mirrors view(): 0 at enter-bottom, 1 at exit-top.
     offsetTop chains are unaffected by transforms — no feedback loop. */
  const meta = new Map<HTMLElement, { top: number; h: number; pf: number }>();
  const measure = () => {
    for (const el of els) {
      let top = 0;
      let node: HTMLElement | null = el;
      while (node) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      meta.set(el, {
        top,
        h: el.offsetHeight,
        pf: parseFloat(el.dataset.pf || "0"),
      });
    }
  };

  let raf = 0;
  const frame = () => {
    raf = 0;
    const vh = innerHeight;
    const unit = ((innerWidth <= 640 ? 9 : 22) * vh) / 100;
    for (const el of near) {
      const m = meta.get(el);
      if (!m) continue;
      const p = Math.min(1, Math.max(0, (scrollY + vh - m.top) / (vh + m.h)));
      el.style.transform = `translateY(${((1 - 2 * p) * m.pf * unit).toFixed(2)}px)`;
    }
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  measure();
  new ResizeObserver(() => {
    measure();
    schedule();
  }).observe(document.body);
  addEventListener("scroll", schedule, { passive: true });
  schedule();
}

export function ParallaxEngine() {
  useEffect(start, []);
  return null;
}
