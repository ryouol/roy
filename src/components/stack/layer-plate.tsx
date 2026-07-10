import { projectsFor, type Layer } from "@/lib/projects";
import { ProjectPanel } from "./project-panel";

/* One plane's content: eyebrow, thesis, panels. Server-rendered. */
export function LayerPlate({ layer }: { layer: Layer }) {
  const items = projectsFor(layer.id);
  const full = items.filter((p) => !p.compact);
  const compact = items.filter((p) => p.compact);

  return (
    <div className="plane-sheet p-8 sm:p-10">
      <p className="font-mono text-label uppercase">
        <span className="text-signal">0{layer.index + 1}</span>
        <span className="text-dim"> / {layer.name}</span>
      </p>
      <h2 className="mt-3 max-w-[560px] text-thesis text-ink">{layer.thesis}</h2>

      <div className="mt-8 space-y-5">
        {full.map((p) => (
          <ProjectPanel key={p.slug} project={p} />
        ))}
        {compact.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {compact.map((p) => (
              <ProjectPanel key={p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
