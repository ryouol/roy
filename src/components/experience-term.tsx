"use client";

import { useRef, type KeyboardEvent } from "react";
import type { Term } from "@/lib/data";

export function ExperienceTerm({ term }: { term: Term }) {
  const rail = useRef<HTMLDivElement>(null);
  const label = `${term.company}, ${term.dates}`;

  const show = (details: boolean) => {
    const element = rail.current;
    if (!element) return;
    element.scrollTo({
      left: details ? element.clientWidth : 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    (element.children[details ? 1 : 0] as HTMLElement).focus({
      preventScroll: true,
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    show(event.key === "ArrowRight");
  };

  return (
    <article className="term" aria-labelledby={`company-${term.code}`}>
      <div
        className="term-track"
        ref={rail}
        role="group"
        aria-label={`${label}. Scroll sideways for details.`}
        tabIndex={0}
        data-lenis-prevent-horizontal
        onKeyDown={onKeyDown}
      >
        <div className="term-pane term-overview" tabIndex={-1}>
          <div className="term-summary">
            <div className="term-heading">
              <h3 id={`company-${term.code}`}>
                <a href={term.url} target="_blank" rel="noopener noreferrer">
                  {term.company}
                </a>
              </h3>
              <span>{term.location}</span>
            </div>
            <div className="term-meta">
              <span>{term.role}</span>
              <span>{term.dates}</span>
            </div>
          </div>
          <button
            className="term-action"
            aria-label={`Details for ${label}`}
            aria-controls={`details-${term.code}`}
            onClick={() => show(true)}
          >
            Details
          </button>
        </div>
        <div
          className="term-pane term-details"
          id={`details-${term.code}`}
          tabIndex={-1}
          role="group"
          aria-label={`Work at ${label}`}
        >
          <p>{term.note}</p>
          <button
            className="term-action"
            aria-label={`Back to ${label}`}
            onClick={() => show(false)}
          >
            Back
          </button>
        </div>
      </div>
    </article>
  );
}
