"use client";

import { useEffect, useRef, useState } from "react";
import { links, sections, workHistory } from "@/lib/data";
import { layers } from "@/lib/projects";
import { applyTheme, togglePhosphor } from "./theme";

interface Line {
  text: string;
  kind: "in" | "out";
}

const OPEN_EVENT = "open-terminal";

const HELP = `help          this list
whoami        who is roy
neofetch      system info
uptime        time in industry
work          jump to work
projects      jump to projects
contact       jump to contact
<layer>       ${layers.map((l) => l.id).join(" · ")}
open <site>   ${Object.keys(links).join(" · ")}
theme <mode>  light · dark
phosphor      you'll see
clear         wipe history
exit          close`;

const NEOFETCH = `   ▄▄▄▄▄▄▄▄    roy@sf
   █ ▄▄▄▄ █    ------
   █ ▀▀▀▀ █    role      swe intern @ squint (s26)
   ▀▀████▀▀    edu       waterloo ee
               stack     ts · py · rust · c++
               interests inference · multimodal
               shell     this one, apparently`;

function uptime(): string {
  const start = new Date(2024, 0, 1); // W24, first co-op term
  const months = Math.floor(
    (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.4)
  );
  return `${Math.floor(months / 12)}y ${months % 12}m in industry — ${workHistory.length} co-op terms and counting`;
}

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "`") return;
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      e.preventDefault();
      setOpen(true);
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      returnFocusRef.current = document.activeElement as HTMLElement;
      inputRef.current?.focus();
    } else {
      returnFocusRef.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const print = (text: string) =>
    setLines((prev) => [...prev, { text, kind: "out" }]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((prev) => [...prev, { text: `❯ ${cmd}`, kind: "in" }]);
    const [name, ...rest] = cmd.split(/\s+/);

    if (name === "top" || (sections as readonly string[]).includes(name)) {
      setOpen(false);
      document.getElementById(name)?.scrollIntoView();
      return;
    }

    if (layers.some((l) => l.id === name)) {
      setOpen(false);
      window.dispatchEvent(new CustomEvent("stack:jump", { detail: name }));
      return;
    }

    switch (name) {
      case "":
        break;
      case "help":
        print(HELP);
        break;
      case "whoami":
        print(
          "roy luo — software engineer intern @ squint (s26).\nwaterloo ee. inference systems, backend plumbing,\nand the occasional sailboat."
        );
        break;
      case "neofetch":
        print(NEOFETCH);
        break;
      case "uptime":
        print(uptime());
        break;
      case "open": {
        const target = rest[0] as keyof typeof links;
        const href = target && links[target];
        if (href) {
          print(`opening ${target}…`);
          if (href.startsWith("mailto")) window.location.href = href;
          else window.open(href, "_blank", "noopener,noreferrer");
        } else {
          print(`open what? try: ${Object.keys(links).join(" · ")}`);
        }
        break;
      }
      case "theme": {
        const mode = rest[0];
        if (mode === "light" || mode === "dark") {
          applyTheme(mode === "light");
          print(`theme set to ${mode}`);
        } else {
          print("usage: theme light | dark");
        }
        break;
      }
      case "phosphor":
        print(
          togglePhosphor()
            ? "phosphor mode on. easy on the eyes, 1978 style."
            : "phosphor mode off."
        );
        break;
      case "sudo":
        if (rest.join(" ").includes("hire")) {
          print("ok. drafting the offer…");
          window.location.href = `${links.email}?subject=Hiring%20Roy`;
        } else {
          print("you are not in the sudoers file. this incident will be reported.");
        }
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        setOpen(false);
        break;
      default:
        print(`command not found: ${name} — try help`);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="mx-auto mt-[14vh] w-[calc(100%-2rem)] max-w-[560px] overflow-hidden rounded-xl border border-line bg-well/90 shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[11px] text-dim">
          <span>roy@sf — zsh</span>
          <span>esc to close</span>
        </div>
        <div
          ref={scrollRef}
          className="max-h-[320px] overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed"
        >
          {lines.length === 0 && (
            <div className="text-dim">roy-os 2.0 — type help</div>
          )}
          {lines.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap ${line.kind === "in" ? "text-dim" : ""}`}
            >
              {line.text}
            </div>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
              setValue("");
            }}
            className="flex items-center gap-2 pt-1"
          >
            <span className="text-signal" aria-hidden>
              ❯
            </span>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-transparent caret-signal focus-visible:outline-none"
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal command"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export function TerminalHint() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="font-mono text-[11px] text-dim/70 transition-colors hover:text-signal"
    >
      press ` for the terminal
    </button>
  );
}
