import { DetailPlate } from "@/components/drawing/detail-plate";
import { DepthScale } from "@/components/drawing/depth-scale";
import { SheetHeader } from "@/components/drawing/header";
import { LayerSection } from "@/components/drawing/layer-section";
import { ParallaxEngine } from "@/components/drawing/parallax-engine";
import { RevisionTable } from "@/components/drawing/rev-table";
import { TitleBlock } from "@/components/drawing/title-block";
import { EasterEggs } from "@/components/eggs";
import { SiteNav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { Terminal } from "@/components/terminal";
import { layers, projectsFor } from "@/lib/projects";

/* Details and figures number sequentially down the sheet. Static data →
   computed once at module scope (render stays pure). */
const NUMBERED = (() => {
  let detail = 0;
  let fig = 0;
  return layers.map((layer) => {
    const items = projectsFor(layer.id);
    return {
      layer,
      plateFactor: 0.06 + layer.index * 0.04,
      full: items
        .filter((p) => !p.compact)
        .map((p) => {
          detail += 1;
          const figStart = fig + 1;
          fig += p.media?.length ?? 0;
          return { p, n: detail, figStart };
        }),
      compact: items
        .filter((p) => p.compact)
        .map((p) => {
          detail += 1;
          return { p, n: detail };
        }),
    };
  });
})();

export default function Home() {
  return (
    <div className="pb-20">
      <a className="skip-link" href="#work">
        skip to revisions
      </a>
      <div className="sheet-frame" aria-hidden />
      <SiteNav />
      <DepthScale />
      <ParallaxEngine />

      <main className="mx-auto max-w-[920px] px-5 sm:px-10">
        <SheetHeader />

        {NUMBERED.map(({ layer, plateFactor, full, compact }) => (
          <LayerSection key={layer.id} layer={layer}>
            {full.map(({ p, n, figStart }) => (
              <Reveal key={p.slug}>
                <DetailPlate
                  project={p}
                  n={n}
                  figStart={figStart}
                  factor={plateFactor}
                />
              </Reveal>
            ))}
            {compact.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                {compact.map(({ p, n }) => (
                  <Reveal key={p.slug}>
                    <DetailPlate
                      project={p}
                      n={n}
                      figStart={0}
                      factor={plateFactor + 0.03}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </LayerSection>
        ))}

        <RevisionTable />
        <TitleBlock />
      </main>

      <Terminal />
      <EasterEggs />
    </div>
  );
}
