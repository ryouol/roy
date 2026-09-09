"use client";

import Link from "next/link";
import { useRef } from "react";
import { email } from "@/lib/site";

const destinations = [
  ["The journey", "/#journey"],
  ["Selected work", "/#work"],
  ["About", "/#about"],
] as const;
export function SiteNav() {
  const menu = useRef<HTMLDialogElement>(null);
  return (
    <>
      <header className="site-nav">
        <Link href="/" className="wordmark" aria-label="Roy Luo home">
          <span className="brand-mark" aria-hidden>
            ↟
          </span>{" "}
          roy luo<span className="wordmark-dot">.</span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {destinations.map(([label, href]) => (
            <Link key={label} href={href} scroll={false}>
              {label}
            </Link>
          ))}
        </nav>
        <a href={`mailto:${email}`} className="nav-contact">
          Let’s talk <span aria-hidden>↗</span>
        </a>
        <button
          className="menu-toggle"
          onClick={() => menu.current?.showModal()}
          aria-label="Open navigation"
        >
          ☰
        </button>
      </header>
      <dialog
        ref={menu}
        className="mobile-menu"
        aria-label="Navigation"
        onClick={(event) => {
          if (event.target === menu.current) menu.current.close();
        }}
      >
        <button
          className="menu-close"
          onClick={() => menu.current?.close()}
          aria-label="Close navigation"
        >
          Close ×
        </button>
        <nav aria-label="Mobile navigation">
          {destinations.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              scroll={false}
              onClick={() => menu.current?.close()}
            >
              {label} <span aria-hidden>↗</span>
            </Link>
          ))}
          <a href={`mailto:${email}`} onClick={() => menu.current?.close()}>
            Let’s talk ↗
          </a>
        </nav>
      </dialog>
    </>
  );
}
