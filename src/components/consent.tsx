"use client";
import { Analytics } from "@vercel/analytics/next";
import { useSyncExternalStore } from "react";
type Choice = "accepted" | "declined" | null;
let memoryChoice: Choice = null;
let memoryOverride = false;
const eventName = "roy-consent-change";
function readChoice(): Choice | "server" {
  if (memoryOverride) return memoryChoice;
  try {
    const value = localStorage.getItem("roy-analytics");
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return memoryChoice;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(eventName, callback);
  };
}
function serverChoice(): "server" {
  return "server";
}
function choose(value: Exclude<Choice, null>) {
  const previous = readChoice();
  memoryChoice = value;
  let persisted = false;
  try {
    localStorage.setItem("roy-analytics", value);
    persisted = true;
  } catch {
    // Removing an old opt-in can still succeed when storage is full.
    if (value === "declined") {
      try {
        localStorage.removeItem("roy-analytics");
        persisted = true;
      } catch {}
    }
  }
  memoryOverride = !persisted;
  window.dispatchEvent(new Event(eventName));
  if (previous === "accepted" && value === "declined" && persisted)
    window.location.reload();
}
export function Consent() {
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);
  return choice === "accepted" ? (
    <Analytics
      beforeSend={(event) => (readChoice() === "accepted" ? event : null)}
    />
  ) : null;
}
export function PrivacyPreferences() {
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);
  const loading = choice === "server";
  const enabled = choice === "accepted";
  return (
    <section className="privacy-preferences" aria-labelledby="analytics-title">
      <h2 id="analytics-title">Optional analytics</h2>
      <p role="status">
        {loading
          ? "Loading preference…"
          : `Analytics are ${enabled ? "On" : "Off"}.`}
      </p>
      <div role="group" aria-label="Analytics preference">
        <button
          type="button"
          aria-pressed={!loading && !enabled}
          disabled={loading}
          onClick={() => choose("declined")}
        >
          Turn off
        </button>
        <button
          type="button"
          aria-pressed={enabled}
          disabled={loading}
          onClick={() => choose("accepted")}
        >
          Turn on
        </button>
      </div>
      <noscript>Analytics are off while JavaScript is disabled.</noscript>
    </section>
  );
}
