import { TerminalHint } from "@/components/terminal";
import { contactLinks } from "@/lib/data";

/* Contact lives where contact lives on a real drawing: the title block,
   bottom-right of the sheet. */
export function TitleBlock() {
  return (
    <section id="contact" className="cv-auto mt-24 sm:mt-32">
      <div className="flex items-center gap-3">
        <span className="border-[1.5px] border-ink px-2 py-1 font-mono text-label uppercase text-ink">
          tb
        </span>
        <span className="h-[1.5px] min-w-6 flex-1 bg-ink" aria-hidden />
        <span className="font-mono text-micro uppercase text-dim">
          title block
        </span>
      </div>

      <div className="tblock mt-8 grid sm:mt-10 sm:grid-cols-2">
        <div className="border-b p-5 sm:border-r sm:p-6">
          <h3 className="font-mono text-micro uppercase text-dim">title</h3>
          <p className="mt-1 font-mono text-meta uppercase text-ink">
            Personal systems — section A–A′
          </p>
        </div>
        <div className="border-b p-5 sm:p-6">
          <h3 className="font-mono text-micro uppercase text-dim">drawn by</h3>
          <p className="mt-1 font-mono text-meta uppercase text-ink">
            Roy Luo · 2026
          </p>
        </div>
        <div className="border-b p-5 sm:border-b-0 sm:border-r sm:p-6">
          <h3 className="font-mono text-micro uppercase text-dim">contact</h3>
          <ul className="mt-2 space-y-2">
            {contactLinks.map((link) => (
              <li key={link.label} className="flex items-baseline gap-3">
                <span className="w-16 shrink-0 font-mono text-micro uppercase text-dim">
                  {link.label}
                </span>
                <a
                  href={link.href}
                  target={
                    link.href.startsWith("mailto") ? undefined : "_blank"
                  }
                  rel="noopener noreferrer"
                  className="font-mono text-meta break-all text-pen transition-colors hover:text-signal"
                >
                  {link.value}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 sm:p-6">
          <h3 className="font-mono text-micro uppercase text-dim">notes</h3>
          <p className="mt-1 text-body text-dim">Email is fastest.</p>
          <div className="mt-3">
            <TerminalHint />
          </div>
        </div>
      </div>

      <footer className="mt-6 flex flex-wrap items-baseline justify-between gap-2 font-mono text-micro uppercase text-dim/70">
        <span>© 2026 Roy Luo · Big Shoulders, Archivo & Martian Mono</span>
        <span>sheet 1 of 1</span>
      </footer>
    </section>
  );
}
