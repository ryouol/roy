import Image from "next/image";
import { projects, repositoryProjects } from "@/lib/projects";

export function ProjectStack() {
  return (
    <section
      id="work"
      className="projects-section content-section"
      aria-labelledby="projects-title"
    >
      <div className="section-title">
        <span className="section-index">02</span>
        <h2 id="projects-title">Things I’ve built before</h2>
      </div>
      <div className="project-list">
        {projects.map((project, index) => (
          <article
            className="project-row"
            key={project.id}
            aria-labelledby={`project-${project.id}`}
          >
            <a
              className={`project-preview project-preview-${project.id}`}
              href={project.demo ?? project.live ?? project.github}
              target="_blank"
              rel="noreferrer"
              aria-label={
                project.demo
                  ? `Watch ${project.name} demo`
                  : `Explore ${project.name}`
              }
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 360px) 90px, (max-width: 600px) 112px, (max-width: 1100px) 36vw, 26vw"
                className="project-screenshot"
              />
              <span className="preview-action" aria-hidden="true">
                {project.demo ? (
                  <>
                    <span className="play-symbol">▶</span> Watch demo
                  </>
                ) : (
                  <>
                    Explore <span>↗</span>
                  </>
                )}
              </span>
            </a>
            <div className="project-copy">
              <div className="project-meta">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.category}</span>
              </div>
              <h3 id={`project-${project.id}`}>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-actions">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.name} demo`}
                  >
                    Demo <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Try ${project.name}`}
                  >
                    Try it <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.secondaryDemo && (
                  <a
                    href={project.secondaryDemo.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.name} ${project.secondaryDemo.label}`}
                  >
                    {project.secondaryDemo.label}{" "}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.name} on GitHub`}
                  >
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
        <div className="repository-work">
          <p className="repository-heading">Also on GitHub</p>
          <ul
            className="repository-projects"
            aria-label="More projects on GitHub"
            data-lenis-prevent-horizontal
          >
            {repositoryProjects.map((project) => (
              <li key={project.id}>
                <a
                  className="repository-card"
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.name} on GitHub`}
                >
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <span className="repository-link">
                    GitHub <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
