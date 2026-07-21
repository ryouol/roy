import { LoomDemo, VideoDemo } from "@/components/demos";
import { ExternalLink } from "@/components/external-link";
import type { Project } from "@/lib/projects";
import { Fig, Still } from "./figure";
import { Px } from "./px";

/* A project rendered as a DETAIL view on the drawing. The plate drifts
   at its layer's depth; the leader-line annotation rides the foreground
   band, sliding over the plate it labels. */
export function DetailPlate({
  project,
  n,
  figStart,
  factor = 0.08,
}: {
  project: Project;
  n: number;
  figStart: number;
  factor?: number;
}) {
  const media = project.media ?? [];
  const looms = media.filter((m) => m.kind === "loom");

  return (
    <div className={`relative ${project.note ? "sm:pt-9" : ""}`}>
      {project.note && (
        <Px
          factor={factor + 0.28}
          className="pointer-events-none absolute right-6 top-0 z-10 hidden sm:block"
        >
          <div className="flex items-start gap-1.5 text-dim" aria-hidden>
            <span className="font-mono text-micro uppercase">
              {project.note}
            </span>
            <svg width="34" height="26" viewBox="0 0 34 26" aria-hidden>
              <path
                d="M1 4 H12 L31 22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="31" cy="22" r="2" fill="currentColor" />
            </svg>
          </div>
        </Px>
      )}

      <Px factor={factor}>
        <article className="plate p-5 sm:p-7">
          <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="shrink-0 font-mono text-label uppercase text-pen">
              detail {n}
            </span>
            <h3 className="text-panel text-ink">{project.title}</h3>
            {project.stack && (
              <span className="ml-auto font-mono text-micro uppercase text-dim">
                {project.stack}
              </span>
            )}
          </header>

          <p className="mt-3 max-w-[560px] text-body text-dim">
            {project.blurb}
          </p>

          {project.links && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {project.links.map((link) => (
                <ExternalLink key={link.href} href={link.href}>
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          )}

          {media.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {media.map((m, i) => {
                const n = figStart + i;
                if (m.kind === "video") {
                  return (
                    <Fig key={m.preview} n={n} label="demo">
                      <VideoDemo
                        preview={m.preview}
                        full={m.full}
                        poster={m.poster}
                        title={project.title}
                      />
                    </Fig>
                  );
                }
                if (m.kind === "still") {
                  return (
                    <Fig key={m.base} n={n} label={m.label}>
                      <Still
                        base={m.base}
                        alt={m.alt}
                        width={m.width}
                        height={m.height}
                      />
                    </Fig>
                  );
                }
                return (
                  <Fig key={m.id} n={n} label={`${m.title} — ${m.caption}`}>
                    <LoomDemo id={m.id} title={m.title} poster={m.poster} />
                  </Fig>
                );
              })}
              {/* keep loom pairs on one row */}
              {looms.length === 1 && <div className="hidden sm:block" />}
            </div>
          )}
        </article>
      </Px>
    </div>
  );
}
