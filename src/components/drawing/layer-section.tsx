import type { Layer } from "@/lib/projects";
import { Px } from "./px";

/* One stratum of the section cut. The boundary is a drawn cut rule with
   a level tag; behind the content, hatch fields counter-scroll (one
   mirrored — cross-hatch at depth). Factors scale with layer index:
   deeper strata sit closer to the viewer and move more. */
export function LayerSection({
  layer,
  children,
}: {
  layer: Layer;
  children: React.ReactNode;
}) {
  const num = `0${layer.index + 1}`;
  const lvl = `L${layer.index + 1}`;
  const far = -(0.15 + layer.index * 0.04);

  return (
    <section id={layer.id} className="relative mt-24 sm:mt-32">
      {/* far field — reverse parallax, mirrored duplicate for cross-hatch */}
      <div
        className="pointer-events-none absolute inset-x-[-4%] top-0 bottom-0 -z-10"
        aria-hidden
      >
        <Px
          factor={far}
          className="absolute right-0 top-[22%] h-[34%] max-h-72 w-[42%]"
        >
          <div className="hatch h-full w-full" />
        </Px>
        <Px
          factor={far - 0.05}
          mirror
          className="absolute bottom-[4%] left-0 h-[30%] max-h-56 w-[32%]"
        >
          <div className="hatch h-full w-full opacity-60" />
        </Px>
      </div>

      {/* boundary: level tag + cut rule */}
      <div className="flex items-center gap-3">
        <span className="border-[1.5px] border-ink px-2 py-1 font-mono text-label uppercase text-ink">
          {lvl}
        </span>
        <span className="h-[1.5px] min-w-6 flex-1 bg-ink" aria-hidden />
        <span className="font-mono text-micro uppercase text-dim">
          cut through — {layer.name}
        </span>
      </div>

      <div className="mt-8 grid items-end gap-x-10 gap-y-4 sm:mt-10 sm:grid-cols-[auto_minmax(0,340px)]">
        <h2 className="font-display text-[44px] font-semibold uppercase leading-[0.95] tracking-[0.02em] text-ink sm:text-[64px]">
          <span className="text-pen">{num}</span> {layer.name}
        </h2>
        <p className="pb-1 font-mono text-meta text-dim sm:justify-self-end sm:text-right">
          {layer.thesis}
        </p>
      </div>

      <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-14">{children}</div>
    </section>
  );
}
