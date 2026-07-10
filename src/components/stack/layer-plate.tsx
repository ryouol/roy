import { projectsFor, type Layer } from "@/lib/projects";
import { ProjectPanel } from "./project-panel";

/* One plane's content: eyebrow, thesis, panels. Server-rendered. */
export function LayerPlate({ layer }: { layer: Layer }) {
  const items = projectsFor(layer.id);
  const full = items.filter((p) => !p.compact);
  const compact = items.filter((p) => p.compact);

  /* --pi staggers the focus cascade: eyebrow, thesis, then each panel. */
  const pi = (n: number) => ({ ["--pi" as string]: n });

  return (
    <div className="plane-sheet p-8 sm:p-10">
      <p className="plate-item font-mono text-label uppercase" style={pi(0)}>
        <span className="text-signal">0{layer.index + 1}</span>
        <span className="text-dim"> / {layer.name}</span>
      </p>
      <h2
        className="plate-item mt-3 max-w-[560px] text-thesis text-ink"
        style={pi(1)}
      >
        {layer.thesis}
      </h2>

      <div className="mt-8 space-y-5">
        {full.map((p, i) => (
          <div key={p.slug} className="plate-item" style={pi(2 + i)}>
            <ProjectPanel project={p} />
          </div>
        ))}
        {compact.length > 0 && (
          <div
            className="plate-item grid gap-5 sm:grid-cols-2"
            style={pi(2 + full.length)}
          >
            {compact.map((p) => (
              <ProjectPanel key={p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
