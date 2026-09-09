"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { motionConfig as c } from "@/lib/motion";

export function JourneyMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger, useGSAP);
      const match = gsap.matchMedia();
      match.add(c.motionAllowed, () => {
        const title =
          root.current?.querySelector<HTMLElement>("[data-hero-title]");
        let split: SplitType | undefined;
        if (title && c.effects.hero) {
          split = new SplitType(title, {
            types: "lines",
            lineClass: "title-line",
          });
          gsap.from(split.lines, {
            y: c.hero.distance,
            opacity: 0,
            duration: c.hero.duration,
            stagger: c.hero.stagger,
            ease: c.hero.ease,
          });
        }
        if (c.effects.reveals)
          gsap.utils
            .toArray<HTMLElement>("[data-reveal]", root.current)
            .forEach((el) => {
              gsap.from(el, {
                y: c.reveal.distance,
                opacity: 0,
                duration: c.reveal.duration,
                ease: c.reveal.ease,
                scrollTrigger: {
                  trigger: el,
                  start: c.reveal.start,
                  once: true,
                },
              });
            });
        return () => split?.revert();
      });
      match.add(`${c.motionAllowed} and ${c.desktop}`, () => {
        if (c.effects.parallax)
          gsap.utils
            .toArray<HTMLElement>("[data-parallax-scene]", root.current)
            .forEach((scene) => {
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: scene,
                  start: c.parallax.start,
                  end: c.parallax.end,
                  scrub: true,
                },
              });
              timeline.to(
                scene.querySelector(".landscape-picture"),
                {
                  yPercent: c.parallax.image,
                  scale: c.parallax.imageScale,
                  ease: "none",
                },
                0,
              );
              const far = scene.querySelector(".ridge-far");
              const near = scene.querySelector(".ridge-near");
              if (far)
                timeline.to(
                  far,
                  { yPercent: c.parallax.ridge, ease: "none" },
                  0,
                );
              if (near)
                timeline.to(
                  near,
                  { yPercent: c.parallax.foreground, ease: "none" },
                  0,
                );
              const copy = scene.querySelector(".hero-copy");
              if (copy)
                timeline.to(
                  copy,
                  { y: c.parallax.copy, opacity: 0, ease: "none" },
                  0,
                );
            });
        if (c.effects.story)
          gsap.utils
            .toArray<HTMLElement>("[data-story]", root.current)
            .forEach((story) => {
              const frame = story.querySelector<HTMLElement>(".story-frame")!;
              const steps = gsap.utils.toArray<HTMLElement>(
                ".story-step",
                story,
              );
              const mask = story.querySelector(".story-window");
              const picture = story.querySelector(
                ".story-window .landscape-picture",
              );
              gsap.set(steps.slice(1), { opacity: 0, y: c.story.distance });
              frame.classList.add("is-pinned");
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: frame,
                  start: "top top",
                  end: () => `+=${innerHeight * c.story.scrollScreens}`,
                  pin: true,
                  // Keep the frame in one positioning mode at both boundaries.
                  pinType: "transform",
                  scrub: c.story.scrub,
                  invalidateOnRefresh: true,
                },
              });
              if (mask && picture) {
                timeline.from(
                  mask,
                  {
                    xPercent: 100,
                    duration: c.story.maskDuration,
                    ease: "none",
                  },
                  0,
                );
                timeline.from(
                  picture,
                  {
                    xPercent: -100,
                    duration: c.story.maskDuration,
                    ease: "none",
                  },
                  0,
                );
                timeline.to(
                  picture,
                  {
                    scale: c.story.imageScale,
                    yPercent: c.story.imageTravel,
                    duration:
                      steps.length * c.story.stepDuration -
                      c.story.maskDuration,
                    ease: "none",
                  },
                  c.story.maskDuration,
                );
              }
              steps.forEach((step, i) => {
                if (i > 0)
                  timeline.to(
                    step,
                    { opacity: 1, y: 0, duration: c.story.transition },
                    i * c.story.stepDuration,
                  );
                if (i < steps.length - 1)
                  timeline.to(
                    step,
                    {
                      opacity: 0,
                      y: -c.story.distance,
                      duration: c.story.transition,
                    },
                    (i + 1) * c.story.stepDuration - c.story.transition,
                  );
              });
            });
        if (c.effects.stack)
          gsap.utils
            .toArray<HTMLElement>("[data-stack]", root.current)
            .forEach((stack) => {
              stack.classList.add("is-stacking");
              const cards = gsap.utils.toArray<HTMLElement>(
                ".project-card",
                stack,
              );
              cards.forEach((card, i) => {
                if (i === cards.length - 1) return;
                gsap.to(card, {
                  scale: c.stack.scale,
                  y: c.stack.offset,
                  opacity: c.stack.opacity,
                  ease: "none",
                  scrollTrigger: {
                    trigger: cards[i + 1],
                    start: c.stack.start,
                    end: c.stack.end,
                    scrub: c.stack.scrub,
                  },
                });
              });
            });
        return () =>
          root.current
            ?.querySelectorAll(".is-pinned, .is-stacking")
            .forEach((el) => el.classList.remove("is-pinned", "is-stacking"));
      });
      const element = root.current;
      if (element) element.dataset.motionReady = "true";
      document.dispatchEvent(new Event("journey:ready"));
      return () => {
        if (element) delete element.dataset.motionReady;
        match.revert();
      };
    },
    { scope: root },
  );
  return (
    <div ref={root} data-journey>
      {children}
    </div>
  );
}
