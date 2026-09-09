"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Error recovery must work when client routing fails. */
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="document-page">
      <p className="eyebrow">A pause in the journey</p>
      <h1>
        Let’s try
        <br />
        <em>that again.</em>
      </h1>
      <p>Something didn’t load as expected.</p>
      <button className="pill" onClick={reset}>
        Try again ↻
      </button>
      <a className="text-link" href="/">
        Return home
      </a>
    </main>
  );
}
