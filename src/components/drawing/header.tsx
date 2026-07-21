import { LocalTime } from "@/components/clock";
import { ThemeToggle } from "@/components/theme";
import { contactLinks, links, workHistory } from "@/lib/data";

/* Section arrows point down: the direction the cut is viewed from. */
function CutAA() {
  return (
    <div className="flex items-end gap-3" aria-hidden>
      <span className="font-display text-[30px] font-semibold leading-none text-ink">
        A
      </span>
      <div className="flex flex-1 flex-col gap-1.5 pb-0.5">
        <div className="flex items-center justify-between px-0.5">
          <svg width="11" height="12" viewBox="0 0 11 12" className="text-ink">
            <path d="M5.5 12 L0 1 H11 Z" fill="currentColor" />
          </svg>
          <span className="font-mono text-micro uppercase text-dim">
            section cut — read downward
          </span>
          <svg width="11" height="12" viewBox="0 0 11 12" className="text-ink">
            <path d="M5.5 12 L0 1 H11 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="h-[1.5px] w-full bg-ink" />
      </div>
      <span className="font-display text-[30px] font-semibold leading-none text-ink">
        A′
      </span>
    </div>
  );
}

/* The sheet header: drawing number strip, title block lettering, header
   fields. Left-set like a real drawing sheet — never centered. */
export function SheetHeader() {
  const current = workHistory.find((t) => t.current);

  return (
    <header id="top" className="pt-14 sm:pt-16">
      <div className="rise flex items-center justify-between font-mono text-micro uppercase text-dim">
        <span>dwg 001 — personal systems</span>
        <span className="flex items-center gap-4">
          <LocalTime />
          <ThemeToggle />
        </span>
      </div>

      <div className="mt-8 border-y-[1.5px] border-ink py-6 sm:mt-10 sm:py-8">
        <h1 className="rise font-display text-[17vw] font-bold uppercase leading-[0.92] tracking-[0.01em] text-ink sm:text-[104px]">
          Roy Luo
        </h1>
        <p
          className="rise mt-4 max-w-[520px] text-body text-dim"
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
          . Electrical engineering at Waterloo. What follows is a vertical
          section through the systems I build.
        </p>
      </div>

      <dl
        className="rise grid grid-cols-2 gap-x-6 gap-y-4 border-b-[1.5px] border-ink py-4 sm:grid-cols-[1fr_1fr_1.5fr_0.6fr]"
        style={{ animationDelay: "160ms" }}
      >
        {contactLinks.map((link) => (
          <div key={link.label}>
            <dt className="font-mono text-micro uppercase text-dim">
              {link.label}
            </dt>
            <dd className="mt-1">
              <a
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="font-mono text-meta break-all text-pen transition-colors hover:text-signal"
              >
                {link.value}
              </a>
            </dd>
          </div>
        ))}
        <div>
          <dt className="font-mono text-micro uppercase text-dim">rev</dt>
          <dd className="mt-1 flex items-center gap-2 font-mono text-meta text-ink">
            {current?.code ?? "—"}
            <span className="now-dot" aria-hidden />
          </dd>
        </div>
      </dl>

      <div className="rise mt-16 sm:mt-24" style={{ animationDelay: "240ms" }}>
        <CutAA />
      </div>
    </header>
  );
}
