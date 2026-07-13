import { LocalTime } from "@/components/clock";
import { EasterEggs } from "@/components/eggs";
import { ExternalLink } from "@/components/external-link";
import { SiteNav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { LayerPlate } from "@/components/stack/layer-plate";
import { Plane } from "@/components/stack/plane";
import { StackSection } from "@/components/stack/stack-section";
import { Terminal, TerminalHint } from "@/components/terminal";
import { ThemeToggle } from "@/components/theme";
import { contactLinks, links, workHistory } from "@/lib/data";
import { layers } from "@/lib/projects";

// The layer plates carry the numbered descent (01–03); the ground you
// land on is deliberately unnumbered — you've arrived, not stepped deeper.
function SectionLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-(--hairline) pb-3">
      <h2 className="font-mono text-label uppercase text-dim">{children}</h2>
      {hint && (
        <span className="font-mono text-micro text-dim/70">{hint}</span>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="pb-24">
      <a className="skip-link" href="#work">
        skip to work history
      </a>
      <SiteNav />

      {/* ————— Hero + the stack — one pinned timeline: the headline
          recedes, the camera dives into the figure, the plates rise
          through it, then the descent runs layer by layer. ————— */}
      <StackSection
        heroSlots={{
          utility: (
            <div className="rise flex items-center justify-between font-mono text-xs text-dim">
              <LocalTime />
              <ThemeToggle />
            </div>
          ),
          headline: (
            <>
              <h1 className="rise text-[44px] font-semibold leading-[1.02] tracking-[-0.022em] sm:text-[56px]">
                Roy Luo
              </h1>
              <p
                className="rise mt-3 text-[17px] text-dim sm:text-[18px]"
                style={{ animationDelay: "80ms" }}
              >
                Software engineer, currently at{" "}
                <a
                  href={links.squint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
                >
                  Squint
                </a>
                .
              </p>
              <div
                className="rise mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2"
                style={{ animationDelay: "160ms" }}
              >
                {contactLinks.map((link) => (
                  <ExternalLink key={link.label} href={link.href}>
                    {link.label}
                  </ExternalLink>
                ))}
              </div>
            </>
          ),
          cue: (
            <div className="rise" style={{ animationDelay: "320ms" }}>
              <div className="scroll-cue" aria-hidden />
              <p className="mt-4 text-center font-mono text-label uppercase">
                <span className="text-signal">01</span>
                <span className="text-dim"> / execution</span>
              </p>
            </div>
          ),
        }}
      >
        {layers.map((layer) => (
          <Plane key={layer.id} layer={layer}>
            <LayerPlate layer={layer} />
          </Plane>
        ))}
      </StackSection>

      {/* ————— Bedrock ————— */}
      <section className="cv-auto mx-auto mt-24 max-w-[720px] px-6">
        <Reveal>
          <div className="space-y-4 text-body text-dim">
            <p>
              I work on the systems side of AI products — inference, pipelines,
              and the backend plumbing that makes them fast. Right now that
              means agents for the physical world at Squint.
            </p>
            <p>
              Electrical engineering at Waterloo. Six co-op terms across Tesla,
              Squint, Aditum Bio, and AES. Away from a terminal: sailing,
              skiing, mountain bikes.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ————— Work ————— */}
      <section id="work" className="cv-auto mx-auto mt-24 max-w-[720px] px-6">
        <Reveal>
          <SectionLabel hint="waterloo co-op calendar">work</SectionLabel>
        </Reveal>

        <Reveal>
          <div className="bedrock-sheet mt-8 px-2 sm:px-4">
            <div className="divide-y divide-(--hairline)">
              {workHistory.map((term) => (
                <article
                  key={term.code}
                  className="group grid grid-cols-[64px_1fr] gap-x-5 px-4 py-5 transition-colors hover:bg-ink/[0.03] first:rounded-t-plane last:rounded-b-plane sm:grid-cols-[72px_1fr_auto]"
                >
                  <span
                    className={`pt-0.5 font-mono text-meta transition-colors ${
                      term.current
                        ? "text-signal"
                        : "text-dim/70 group-hover:text-signal"
                    }`}
                  >
                    {term.code}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-medium">{term.company}</h3>
                      <span className="text-meta text-dim">{term.role}</span>
                      {term.current && (
                        <span className="flex items-center gap-1.5 font-mono text-micro text-signal">
                          <span className="now-dot" aria-hidden />
                          now
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-xs text-dim/70">
                      {term.dates}
                      <span className="sm:hidden"> · {term.location}</span>
                    </p>
                    <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-dim">
                      {term.note}
                    </p>
                  </div>

                  <span className="hidden pt-0.5 font-mono text-xs text-dim/70 sm:block">
                    {term.location}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ————— Contact ————— */}
      <section id="contact" className="cv-auto mx-auto mt-24 max-w-[720px] px-6">
        <Reveal>
          <SectionLabel>contact</SectionLabel>
        </Reveal>
        <Reveal>
          <p className="max-w-[560px] pt-8 text-body text-dim">
            Email is fastest.
          </p>
          <ul className="mt-6 space-y-3">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group flex items-baseline gap-4"
                >
                  <span className="w-20 shrink-0 font-mono text-xs text-dim/70">
                    {link.label}
                  </span>
                  <span className="text-[15px] underline decoration-line underline-offset-4 transition-colors group-hover:decoration-signal">
                    {link.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <footer className="mx-auto mt-28 flex max-w-[720px] flex-wrap items-baseline justify-between gap-2 border-t border-(--hairline) px-6 pt-6 font-mono text-micro text-dim/70">
        <span>© 2026 Roy Luo · Instrument Sans & IBM Plex Mono</span>
        <TerminalHint />
      </footer>

      <Terminal />
      <EasterEggs />
    </div>
  );
}
