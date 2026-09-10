"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { motionConfig as config } from "@/lib/motion";

export function ScrollProvider() {
  const path = usePathname();
  useEffect(() => {
    const preference = matchMedia(
      `${config.motionAllowed} and ${config.desktop}`,
    );
    let lenis: Lenis | undefined;
    const updateMotion = () => {
      lenis?.destroy();
      lenis = undefined;
      if (preference.matches && config.effects.smooth) {
        lenis = new Lenis({
          ...config.lenis,
          autoRaf: true,
          prevent: (node) => node.closest("dialog") !== null,
        });
      }
    };
    updateMotion();
    preference.addEventListener("change", updateMotion);

    // One owner for anchors, including keyboard focus and reversed navigation.
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
      // Complete the link action before moving the document.
      navigationFrame = requestAnimationFrame(() => navigateToHash(false));
    };
    const onHashChange = () => navigateToHash(true);
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHashChange);

    let refreshFrame = 0;
    let initialNavigation = false;
    let userMoved = false;
    const markMoved = () => {
      userMoved = true;
    };
    const onSceneryReady = () => {
      initialNavigation = !userMoved;
      refresh();
    };
    let alive = true;
    const refresh = () => {
      if (!refreshFrame)
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = 0;
          lenis?.resize();
          if (initialNavigation) {
            initialNavigation = false;
            navigateToHash(true);
          }
        });
    };
    const imageLoaded = (event: Event) => {
      if (event.target instanceof HTMLImageElement) refresh();
    };
    document.addEventListener("load", imageLoaded, true);
    window.addEventListener("sceneryready", onSceneryReady);
    window.addEventListener("wheel", markMoved, { passive: true });
    window.addEventListener("touchstart", markMoved, { passive: true });
    window.addEventListener("keydown", markMoved);
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
      window.removeEventListener("sceneryready", onSceneryReady);
      window.removeEventListener("wheel", markMoved);
      window.removeEventListener("touchstart", markMoved);
      window.removeEventListener("keydown", markMoved);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
      preference.removeEventListener("change", updateMotion);
      lenis?.destroy();
    };
  }, [path]);
  return null;
}
