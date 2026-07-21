import { LoomDemo, VideoDemo } from "@/components/demos";
import { ExternalLink } from "@/components/external-link";
import type { Project } from "@/lib/projects";

/* Server-rendered project panel — content stays in the initial HTML;
   client shells only wrap it with transforms. */
export function ProjectPanel({ project }: { project: Project }) {
  const looms = project.media?.filter((m) => m.kind === "loom") ?? [];
  const videos = project.media?.filter((m) => m.kind === "video") ?? [];

  return (
    <article className="panel p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-panel text-ink">{project.title}</h3>
        <span className="font-mono text-xs text-dim/70">{project.stack}</span>
      </div>
      <p className="mt-2 max-w-[560px] text-body text-dim">{project.blurb}</p>

      {project.links && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {project.links.map((link) => (
            <ExternalLink key={link.href} href={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      )}

      {videos.map((m) => (
        <div key={m.preview} className="mt-4 max-w-[560px]">
          <VideoDemo
            preview={m.preview}
            full={m.full}
            poster={m.poster}
            title={project.title}
          />
        </div>
      ))}

      {looms.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {looms.map((m) => (
            <LoomDemo
              key={m.id}
              id={m.id}
              title={m.title}
              caption={m.caption}
              poster={m.poster}
            />
          ))}
        </div>
      )}
    </article>
  );
}
