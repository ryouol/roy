"use client";

import { useEffect, useState } from "react";

const CITIES = [
  { label: "San Francisco", tz: "America/Los_Angeles", suffix: " PT" },
  { label: "Waterloo", tz: "America/Toronto", suffix: " ET" },
  { label: "UTC", tz: "UTC", suffix: "" },
];

const formatters = CITIES.map(
  (city) =>
    new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: city.tz,
    })
);

export function LocalTime() {
  const [city, setCity] = useState(0);
  // Epoch minute rather than a Date: ticks that land in the same
  // minute bail out of re-rendering.
  const [minute, setMinute] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setMinute(Math.floor(Date.now() / 60_000));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <button
      onClick={() => setCity((c) => (c + 1) % CITIES.length)}
      title="Switch city"
      className="font-mono text-xs tabular-nums text-dim transition-colors hover:text-ink"
    >
      {CITIES[city].label}{" "}
      {minute === null ? "--:--" : formatters[city].format(new Date(minute * 60_000))}
      {CITIES[city].suffix}
    </button>
  );
}
