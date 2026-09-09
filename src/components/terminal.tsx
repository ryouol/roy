"use client";
import { useEffect, useRef, useState } from "react";
import { email } from "@/lib/site";

export function Terminal() {
  const ref = useRef<HTMLDialogElement>(null);
  const [lines, setLines] = useState(["roy-os / type help to find your way"]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.key === "`" &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement) &&
        !(event.target as HTMLElement).isContentEditable &&
        !document.querySelector("dialog[open]")
      ) {
        event.preventDefault();
        ref.current?.showModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const run = (value: string) => {
    const command = value.trim().toLowerCase();
    const replies: Record<string, string> = {
      help: "whoami · work · about · contact · clear · exit",
      whoami:
        "Roy Luo. Software engineer. Waterloo EE. Inference systems, multimodal models, and the occasional sailboat.",
      contact: email,
    };
    if (command === "exit") {
      ref.current?.close();
      return;
    }
    if (command === "clear") {
      setLines([]);
      return;
    }
    if (command === "work" || command === "about") {
      ref.current?.close();
      document.getElementById(command)?.scrollIntoView();
      return;
    }
    setLines((old) => [
      ...old.slice(-38),
      `› ${value}`,
      Object.hasOwn(replies, command)
        ? replies[command]
        : "Unknown trail. Try help.",
    ]);
  };
  return (
    <>
      <button
        className="terminal-hint"
        onClick={() => ref.current?.showModal()}
      >
        press ` to take a shortcut
      </button>
      <dialog
        ref={ref}
        className="terminal-dialog"
        aria-label="Portfolio terminal"
      >
        <div className="terminal-bar">
          roy@somewhere{" "}
          <button onClick={() => ref.current?.close()}>Close ×</button>
        </div>
        <div className="terminal-output" role="log">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            run(String(new FormData(form).get("command") ?? ""));
            form.reset();
          }}
        >
          <label htmlFor="terminal-input">›</label>
          <input
            autoFocus
            id="terminal-input"
            name="command"
            aria-label="Terminal command"
            autoComplete="off"
            maxLength={120}
          />
        </form>
      </dialog>
    </>
  );
}
