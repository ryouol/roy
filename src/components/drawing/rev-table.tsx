import { Reveal } from "@/components/reveal";
import { workHistory } from "@/lib/data";

/* Experience as the drawing's revision history — because that's what a
   co-op calendar is. General notes carry the bio. */
export function RevisionTable() {
  return (
    <section id="work" className="cv-auto relative mt-24 sm:mt-32">
      <div className="flex items-center gap-3">
        <span className="border-[1.5px] border-ink px-2 py-1 font-mono text-label uppercase text-ink">
          rev
        </span>
        <span className="h-[1.5px] min-w-6 flex-1 bg-ink" aria-hidden />
        <span className="font-mono text-micro uppercase text-dim">
          waterloo co-op calendar
        </span>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 sm:mt-10">
        <h2 className="font-display text-[44px] font-semibold uppercase leading-[0.95] tracking-[0.02em] text-ink sm:text-[64px]">
          Revisions
        </h2>
      </div>

      <Reveal>
        <div className="mt-8 border-[1.5px] border-ink p-5 sm:p-6">
          <h3 className="font-mono text-label uppercase text-pen">
            general notes
          </h3>
          <ol className="mt-3 max-w-[620px] list-none space-y-2">
            <li className="flex gap-3 text-body text-dim">
              <span className="shrink-0 font-mono text-meta text-ink">1.</span>
              <span>
                I work on the systems side of AI products — inference,
                pipelines, and the backend plumbing that makes them fast. Right
                now that means agents for the physical world at Squint.
              </span>
            </li>
            <li className="flex gap-3 text-body text-dim">
              <span className="shrink-0 font-mono text-meta text-ink">2.</span>
              <span>
                Electrical engineering at Waterloo. Six co-op terms across
                Tesla, Squint, Aditum Bio, and AES. Away from a terminal:
                sailing, skiing, mountain bikes.
              </span>
            </li>
          </ol>
        </div>
      </Reveal>

      <Reveal>
        <table className="rev-table mt-6 font-mono text-meta">
          <thead>
            <tr>
              <th className="font-mono text-micro uppercase text-dim">rev</th>
              <th className="font-mono text-micro uppercase text-dim">
                period
              </th>
              <th className="font-mono text-micro uppercase text-dim">
                description
              </th>
              <th className="hidden font-mono text-micro uppercase text-dim sm:table-cell">
                loc
              </th>
            </tr>
          </thead>
          <tbody>
            {workHistory.map((term) => (
              <tr key={term.code}>
                <td className="whitespace-nowrap">
                  <span
                    className={`flex items-center gap-2 ${
                      term.current ? "text-signal" : "text-ink"
                    }`}
                  >
                    {term.code}
                    {term.current && <span className="now-dot" aria-hidden />}
                  </span>
                </td>
                <td className="whitespace-nowrap text-dim">
                  {term.dates}
                  <span className="sm:hidden"> · {term.location}</span>
                </td>
                <td>
                  <span className="font-sans text-body font-medium text-ink">
                    {term.company}
                  </span>
                  <span className="font-sans text-body text-dim">
                    {" "}
                    — {term.role}.{" "}
                  </span>
                  <span className="font-sans text-body text-dim">
                    {term.note}
                  </span>
                </td>
                <td className="hidden whitespace-nowrap text-dim sm:table-cell">
                  {term.location}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}
