import { LocalTime } from "@/components/clock";
import { LoomDemo, VideoDemo } from "@/components/demos";
import { Atmosphere } from "@/components/stack/atmosphere";
import { EasterEggs } from "@/components/eggs";
import { SiteNav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { Terminal, TerminalHint } from "@/components/terminal";
import { ThemeToggle } from "@/components/theme";
import { contactLinks, links, workHistory } from "@/lib/data";

function SectionLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-dim">
        {children}
      </h2>
      {hint && (
        <span className="font-mono text-[11px] text-dim/70">{hint}</span>
      )}
    </div>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = !href.startsWith("mailto:");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="font-mono text-[13px] text-dim transition-colors hover:text-signal"
    >
      {children} ↗
    </a>
  );
}

function Project({
  title,
  stack,
  blurb,
  children,
}: {
  title: string;
  stack: string;
  blurb: string;
  children?: React.ReactNode;
}) {
  return (
    <article>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[17px] font-medium">{title}</h3>
        <span className="font-mono text-xs text-dim/70">{stack}</span>
      </div>
      <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-dim">
        {blurb}
      </p>
      {children}
    </article>
  );
}

export default function Home() {
  return (
    <div className="mx-auto max-w-[720px] px-6 pb-24 pt-20 sm:pt-28">
      <Atmosphere />
      <SiteNav />

      {/* ————— Hero ————— */}
      <header id="top">
        <div className="rise flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h1 className="text-[40px] font-semibold tracking-[-0.02em] sm:text-[44px]">
            Roy Luo
          </h1>
          <span className="flex items-center gap-4">
            <LocalTime />
            <ThemeToggle />
          </span>
        </div>
        <p
          className="rise mt-1 text-[17px] text-dim"
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
          className="rise mt-9 space-y-4 text-[15.5px] leading-relaxed text-dim"
          style={{ animationDelay: "160ms" }}
        >
          <p>
            I work on the systems side of AI products — inference, pipelines,
            and the backend plumbing that makes them fast. Right now that means
            agents for the physical world at Squint.
          </p>
          <p>
            Electrical engineering at Waterloo. Six co-op terms across Tesla,
            Squint, Aditum Bio, and AES. Away from a terminal: sailing, skiing,
            mountain bikes.
          </p>
        </div>

        <div
          className="rise mt-9 flex flex-wrap gap-x-6 gap-y-2"
          style={{ animationDelay: "240ms" }}
        >
          {contactLinks.map((link) => (
            <ExternalLink key={link.label} href={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      </header>

      {/* ————— Work ————— */}
      <section id="work" className="mt-24">
        <Reveal>
          <SectionLabel hint="waterloo co-op calendar">Work</SectionLabel>
        </Reveal>

        <div className="divide-y divide-line">
          {workHistory.map((term, i) => (
            <Reveal key={term.code} delay={Math.min(i * 50, 200)}>
              <article className="group -mx-4 grid grid-cols-[64px_1fr] gap-x-5 rounded-lg px-4 py-5 transition-colors hover:bg-well/50 sm:grid-cols-[72px_1fr_auto]">
                <span
                  className={`pt-0.5 font-mono text-[13px] transition-colors ${
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
                    <span className="text-[13px] text-dim">{term.role}</span>
                    {term.current && (
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-signal">
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
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— Projects ————— */}
      <section id="projects" className="mt-24">
        <Reveal>
          <SectionLabel>Projects</SectionLabel>
        </Reveal>

        <div className="space-y-16 pt-8">
          <Reveal>
            <Project
              title="Polymarket for Startups"
              stack="React · TypeScript · Rust"
              blurb="Prediction markets for startup ideas. Swipe on anonymized pitches, take positions, trade on conviction."
            >
              <div className="mt-5 max-w-[560px]">
                <VideoDemo
                  src="/LimitlessDemo.mp4"
                  poster="/limitless-poster.jpg"
                  title="Polymarket for Startups"
                />
              </div>
            </Project>
          </Reveal>

          <Reveal>
            <Project
              title="VC Fund OS"
              stack="React · Go · Python"
              blurb="One platform for the whole fund: GP deal flow and diligence, an LP investment portal, and portfolio-company dashboards."
            >
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <LoomDemo
                  id="0ebacafae02c436b8324024a3a44bebc"
                  title="GP tools"
                  caption="Deal flow & due diligence"
                />
                <LoomDemo
                  id="de3de4a9c1b4418a87f01c9119b38025"
                  title="LP portal & portco"
                  caption="Robinhood for VC"
                />
              </div>
            </Project>
          </Reveal>

          <Reveal>
            <Project
              title="Kalshi BTC price predictor"
              stack="Next.js · Rust · WebAssembly"
              blurb="Real-time pricing for Kalshi's BTC markets: 50,000-path Monte Carlo with Heston volatility and Merton jump diffusion, compiled to WebAssembly."
            >
              <div className="mt-3">
                <ExternalLink href="https://github.com/ryouol/Kalshi-BTC">
                  github.com/ryouol/Kalshi-BTC
                </ExternalLink>
              </div>
            </Project>
          </Reveal>

          <Reveal>
            <article>
              <h3 className="text-[17px] font-medium">
                Lower down the stack
              </h3>
              <ul className="mt-3 space-y-2.5">
                <li className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <ExternalLink href="https://github.com/ryouol/gRPCNvidia-Work">
                    gRPCNvidia-Work
                  </ExternalLink>
                  <span className="text-[13px] text-dim">
                    gRPC serving on NVIDIA Xavier AGX — C++, CUDA
                  </span>
                </li>
                <li className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <ExternalLink href="https://github.com/ryouol/wla-distibutor">
                    wla-distributor
                  </ExternalLink>
                  <span className="text-[13px] text-dim">
                    Distributed workload allocator — C++, gRPC
                  </span>
                </li>
              </ul>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ————— Contact ————— */}
      <section id="contact" className="mt-24">
        <Reveal>
          <SectionLabel>Contact</SectionLabel>
        </Reveal>
        <Reveal>
          <p className="max-w-[560px] pt-8 text-[15px] leading-relaxed text-dim">
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

      <footer className="mt-28 flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-6 font-mono text-[11px] text-dim/70">
        <span>© 2026 Roy Luo · Instrument Sans & IBM Plex Mono</span>
        <TerminalHint />
      </footer>

      <Terminal />
      <EasterEggs />
    </div>
  );
}
