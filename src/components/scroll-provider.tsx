"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionConfig as config } from "@/lib/motion";

export function ScrollProvider() {
  const path = usePathname();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const match = gsap.matchMedia();
    let lenis: Lenis | undefined;
    match.add(`${config.motionAllowed} and ${config.desktop}`, () => {
      if (!config.effects.smooth) return;
      const instance = new Lenis({
        ...config.lenis,
        prevent: (node) => node.closest("dialog") !== null,
      });
      lenis = instance;
      instance.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        instance.destroy();
        lenis = undefined;
      };
    });

    // One owner for hash scrolling: measure after pins, then stop any old inertia.
    const navigateToHash = (immediate: boolean) => {
      let id: string;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      const padding =
        parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop,
        ) || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - padding;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(y, { immediate, force: true });
      } else window.scrollTo({ top: y, behavior: "instant" });
      if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
      target.focus({ preventScroll: true });
    };
    let navigationFrame = 0;
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!link || link.target || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search ||
        !url.hash
      )
        return;
      event.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      cancelAnimationFrame(navigationFrame);
      // Let a mobile menu close before moving the document underneath it.
      navigationFrame = requestAnimationFrame(() => navigateToHash(false));
    };
    const onHashChange = () => navigateToHash(true);
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHashChange);

    let refreshFrame = 0;
    let initialNavigation = false;
    let alive = true;
    const refresh = () => {
      if (!refreshFrame)
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0;
          ScrollTrigger.refresh();
          lenis?.resize();
          const journey = document.querySelector<HTMLElement>("[data-journey]");
          if (initialNavigation && (!journey || journey.dataset.motionReady)) {
            initialNavigation = false;
            navigateToHash(true);
          }
        });
    };
    const imageLoaded = (event: Event) => {
      if (event.target instanceof HTMLImageElement) refresh();
    };
    const journeyReady = () => {
      initialNavigation = true;
      refresh();
    };
    document.addEventListener("load", imageLoaded, true);
    document.addEventListener("journey:ready", journeyReady);
    document.fonts.ready.then(() => {
      if (!alive) return;
      initialNavigation = true;
      refresh();
    });
    return () => {
      alive = false;
      cancelAnimationFrame(refreshFrame);
      cancelAnimationFrame(navigationFrame);
      document.removeEventListener("load", imageLoaded, true);
      document.removeEventListener("journey:ready", journeyReady);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
      match.revert();
    };
  }, [path]);
  return null;
}
