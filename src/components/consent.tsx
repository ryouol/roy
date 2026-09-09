"use client";
import { Analytics } from "@vercel/analytics/next";
import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
type Choice = "accepted" | "declined" | null;
let memoryChoice: Choice = null;
const eventName = "roy-consent-change";
function readChoice(): Choice | "server" {
  try {
    const value = localStorage.getItem("roy-analytics");
    return value === "accepted" || value === "declined" ? value : memoryChoice;
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
export function Consent() {
  const choice = useSyncExternalStore(subscribe, readChoice, () => "server");
  const [editing, setEditing] = useState(false);
  const choose = (value: Exclude<Choice, null>) => {
    memoryChoice = value;
    try {
      localStorage.setItem("roy-analytics", value);
    } catch {}
    window.dispatchEvent(new Event(eventName));
    setEditing(false);
    if (choice === "accepted" && value === "declined") window.location.reload();
  };
  return (
    <>
      {choice === "accepted" && (
        <Analytics
          beforeSend={(event) => (readChoice() === "accepted" ? event : null)}
        />
      )}
      <button className="privacy-settings" onClick={() => setEditing(true)}>
        Privacy choices
      </button>
      {choice !== "server" && (choice === null || editing) && (
        <aside className="consent" aria-label="Analytics preference">
          <p>
            Just the essentials?
            <span>
              Optional visit analytics stay off until you choose.{" "}
              <Link href="/privacy">Privacy details</Link>
            </span>
          </p>
          <div>
            <button onClick={() => choose("declined")}>No thanks</button>
            <button onClick={() => choose("accepted")}>Allow analytics</button>
          </div>
        </aside>
      )}
    </>
  );
}
