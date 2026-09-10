"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Error recovery must work when client routing fails. */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#edf2f7",
          color: "#182331",
          fontFamily: "sans-serif",
          padding: "10vw",
        }}
      >
        <h1>Something went wrong.</h1>
        <p>Something didn’t load. Please try again.</p>
        <button onClick={reset}>Try again</button>
        <p>
          <a style={{ color: "inherit" }} href="/">
            Return home
          </a>
        </p>
      </body>
    </html>
  );
}
