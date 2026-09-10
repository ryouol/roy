"use client";

import { useEffect, useRef, useState } from "react";

/** Monotone interpolation keeps camera speed continuous between section anchors. */
function createFlightMapping(anchors: number[]) {
  const last = anchors.length - 1;
  const end = Math.max(last, anchors[last]);
  const stops = anchors.map((value, index) =>
    Math.max(index, Math.min(end - last + index, value)),
  );
  for (let index = 1; index <= last; index++) {
    stops[index] = Math.max(stops[index - 1] + 1, stops[index]);
  }
  const widths = stops.slice(1).map((stop, index) => stop - stops[index]);
  const slopes = widths.map((width) => 1 / (last * width));
  const tangents = stops.map((_, index) => {
    if (index === 0) return slopes[0];
    if (index === last) return slopes[last - 1];
    const previous = widths[index - 1];
    const next = widths[index];
    const firstWeight = 2 * next + previous;
    const secondWeight = next + 2 * previous;
    return (
      (firstWeight + secondWeight) /
      (firstWeight / slopes[index - 1] + secondWeight / slopes[index])
    );
  });
  return (y: number) => {
    if (y <= stops[0]) return 0;
    if (y >= stops[last]) return 1;
    let index = 0;
    while (index < last - 1 && y > stops[index + 1]) index++;
    const width = widths[index];
    const t = (y - stops[index]) / width;
    const t2 = t * t;
    const t3 = t2 * t;
    return Math.max(
      0,
      Math.min(
        1,
        (2 * t3 - 3 * t2 + 1) * (index / last) +
          (t3 - 2 * t2 + t) * width * tangents[index] +
          (-2 * t3 + 3 * t2) * ((index + 1) / last) +
          (t3 - t2) * width * tangents[index + 1],
      ),
    );
  };
}

/** Scroll directs one continuous flight through the same terrain from frame one. */
export function AlpineScene() {
  const host = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const refreshRef = useRef<(() => void) | null>(null);
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    if (
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(location.search).has("scene-capture")
    ) {
      document.documentElement.dataset.sceneCapture = "true";
    }
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let alive = true;
    let generation = 0;
    let dispose: (() => void) | undefined;
    const start = async () => {
      const run = ++generation;
      dispose?.();
      const controller = new AbortController();
      const cleanups: (() => void)[] = [() => controller.abort()];
      let disposed = false;
      const cleanup = () => {
        if (disposed) return;
        disposed = true;
        for (const release of cleanups.reverse()) release();
      };
      dispose = cleanup;
      const cancelled = () => !alive || run !== generation || disposed;
      const unavailable = () => {
        if (!cancelled()) {
          container.dataset.ready = "false";
          setAvailable(false);
        }
        cleanup();
      };
      container.dataset.ready = "false";
      setAvailable(false);
      if (preference.matches) return;
      try {
        const [THREE, { createAlpineWorld }] = await Promise.all([
          import("three"),
          import("@/lib/alpine-world"),
        ]);
        if (cancelled()) return;
        const renderer = new THREE.WebGLRenderer({
          alpha: false,
          antialias: true,
          powerPreference: "low-power",
        });
        cleanups.push(() => {
          renderer.dispose();
          renderer.domElement.remove();
        });
        const contextLost = () => unavailable();
        renderer.domElement.addEventListener("webglcontextlost", contextLost);
        cleanups.push(() =>
          renderer.domElement.removeEventListener(
            "webglcontextlost",
            contextLost,
          ),
        );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        const world = await createAlpineWorld(controller.signal);
        if (cancelled()) {
          world.dispose();
          return;
        }
        cleanups.push(() => world.dispose());
        container.appendChild(renderer.domElement);
        const hero = document.querySelector<HTMLElement>(".alpine-hero");
        const peakNavigation =
          document.querySelector<HTMLElement>(".peak-navigation");
        const peakLinks = Array.from(
          document.querySelectorAll<HTMLElement>(".peak-link"),
        );
        const progress = document.querySelector<HTMLElement>(
          ".scroll-progress span",
        );
        let frame = 0;
        let previous = 0;
        let currentY = scrollY;
        let height = innerHeight;
        let pageEnd = 1;
        let redraw = true;
        let scenePosition = 0;
        let flightAt: (y: number) => number = () => 0;
        const smooth = THREE.MathUtils.smoothstep;
        const resize = () => {
          if (cancelled()) return;
          height = Math.max(1, container.clientHeight);
          const width = Math.max(1, container.clientWidth);
          renderer.setPixelRatio(
            Math.min(
              devicePixelRatio,
              innerWidth < 700 ? 1.5 : 2,
              Math.sqrt(5_000_000 / (width * height)),
            ),
          );
          world.camera.aspect = width / height;
          world.camera.fov = innerWidth < 700 ? 57 : 48;
          world.camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          const experience = document.getElementById("experience");
          const work = document.getElementById("work");
          const contact = document.getElementById("contact");
          const at = (element: HTMLElement | null) =>
            element ? element.getBoundingClientRect().top + scrollY : 0;
          const experienceTop = at(experience);
          const workTop = at(work);
          const experienceMid =
            experienceTop + (experience?.offsetHeight ?? height) * 0.58;
          // Short reading sections must still leave room between camera stops.
          const workApproach =
            workTop - Math.min(height * 0.5, (workTop - experienceMid) * 0.5);
          pageEnd = Math.max(1, document.documentElement.scrollHeight - height);
          flightAt = createFlightMapping([
            0,
            height * 0.8,
            experienceTop - height * 0.35,
            experienceMid,
            workApproach,
            workTop + (work?.offsetHeight ?? height) * 0.55,
            at(contact) - height * 0.65,
            pageEnd,
          ]);
          redraw = true;
          schedule();
        };
        const updateContent = () => {
          hero?.style.setProperty(
            "--hero-fade",
            String(1 - smooth(currentY, 0, height * 0.45)),
          );
          if (peakNavigation) {
            const visibility =
              1 - smooth(currentY, height * 0.1, height * 0.75);
            peakNavigation.dataset.projected = "true";
            peakNavigation.style.opacity = String(visibility);
            peakNavigation.inert = visibility < 0.02;
            peakNavigation.setAttribute(
              "aria-hidden",
              String(visibility < 0.02),
            );
            if (pausedRef.current) {
              // A paused camera may face away from the opening peaks. Keep
              // the destinations usable when the reader returns to the hero.
              peakLinks.forEach((link) => {
                link.style.removeProperty("left");
                link.style.removeProperty("top");
                delete link.dataset.visible;
              });
            } else {
              world
                .projectLandmarks(container.clientWidth, height)
                .forEach((pin, index) => {
                  const link = peakLinks[index];
                  if (!link) return;
                  link.style.left = `${pin.x}px`;
                  link.style.top = `${pin.y}px`;
                  link.dataset.visible = String(pin.visible);
                });
            }
          }
          if (progress)
            progress.style.transform = `scaleY(${THREE.MathUtils.clamp(currentY / pageEnd, 0, 1)})`;
          container.dataset.flightProgress = scenePosition.toFixed(4);
        };
        const tick = (time: number) => {
          frame = 0;
          if (cancelled()) return;
          if (document.hidden) {
            previous = 0;
            return;
          }
          const dt = previous
            ? Math.min((time - previous) / 1000, 0.05)
            : 1 / 60;
          previous = time;
          currentY += (scrollY - currentY) * (1 - Math.exp(-dt * 9));
          try {
            if (!pausedRef.current) {
              scenePosition = flightAt(currentY);
              world.update(scenePosition);
            }
            updateContent();
            if (!pausedRef.current || redraw)
              renderer.render(world.scene, world.camera);
          } catch {
            unavailable();
            return;
          }
          redraw = false;
          if (Math.abs(scrollY - currentY) > 0.05) schedule();
          else previous = 0;
        };
        function schedule() {
          if (!cancelled() && !frame) frame = requestAnimationFrame(tick);
        }
        const refresh = () => {
          redraw = true;
          schedule();
        };
        refreshRef.current = refresh;
        const observer = new ResizeObserver(resize);
        cleanups.push(() => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          window.removeEventListener("scroll", schedule);
          document.removeEventListener("visibilitychange", schedule);
          if (refreshRef.current === refresh) refreshRef.current = null;
          hero?.style.removeProperty("--hero-fade");
          if (peakNavigation) {
            delete peakNavigation.dataset.projected;
            peakNavigation.style.removeProperty("opacity");
            peakNavigation.removeAttribute("aria-hidden");
            peakNavigation.inert = false;
          }
          peakLinks.forEach((link) => {
            link.style.removeProperty("left");
            link.style.removeProperty("top");
            delete link.dataset.visible;
          });
        });
        observer.observe(document.body);
        observer.observe(container);
        window.addEventListener("scroll", schedule, { passive: true });
        document.addEventListener("visibilitychange", schedule);
        resize();
        scenePosition = flightAt(currentY);
        world.update(scenePosition);
        updateContent();
        renderer.render(world.scene, world.camera);
        if (cancelled()) return;
        container.dataset.ready = "true";
        setAvailable(true);
        window.dispatchEvent(new Event("sceneryready"));
      } catch (error) {
        if (
          process.env.NODE_ENV === "development" &&
          !controller.signal.aborted
        )
          console.error("Scenery initialization", error);
        // The matching static frame and readable HTML remain available.
        unavailable();
      }
    };
    void start();
    preference.addEventListener("change", start);
    return () => {
      delete document.documentElement.dataset.sceneCapture;
      alive = false;
      ++generation;
      preference.removeEventListener("change", start);
      dispose?.();
    };
  }, []);

  return (
    <>
      <div className="alpine-scene" aria-hidden="true">
        <div className="scene-poster" />
        <div className="scene-webgl" ref={host} />
      </div>
      {available && (
        <button
          className="motion-toggle"
          aria-pressed={paused}
          onClick={() => {
            pausedRef.current = !pausedRef.current;
            setPaused(pausedRef.current);
            refreshRef.current?.();
          }}
        >
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      )}
      <div className="scroll-progress" aria-hidden="true">
        <span />
      </div>
    </>
  );
}
