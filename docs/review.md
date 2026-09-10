# Simplify and code review

The requested simplify pass used separate reuse, quality, and efficiency reviewers. The final code review used the breaking-changes, testing, context, and change-size skill reviewers. Findings are preserved below, including resolved issues and the size exception. No review comments were posted to GitHub.

## Final code-review findings

1. **P2 — Hash navigation competed with Lenis and pin setup. Fixed.** `src/components/scroll-provider.tsx:35`: one owner now handles section links, waits for journey readiness, refreshes measurements, and aligns initial/cross-route fragments. Navigation links opt out of Next's competing automatic scroll. Desktop initial fragments, successive links, browser history, cross-route links, and mobile fragments have regression coverage. The breaking-changes reviewer reread the fix and found no remaining actionable issues.
2. **P2 — Hover previews ignored reduced motion. Fixed.** `src/components/media-demo.tsx:44`: hover playback checks the preference; a live preference listener pauses an already playing preview. Explicitly requested full-video playback remains available. Browser coverage verifies both initial and live reduced-motion behavior.
3. **P3 — No-JavaScript contact visibility result was discarded. Fixed.** `tests/journey.spec.ts:382`: the check now uses an assertion, so hidden or missing contact navigation fails the test.
4. **P2 — Aggregate change exceeds the 800-line review guidance. Scope exception recorded.** `src/app/globals.css:1`, `src/app/page.tsx:1`: the review snapshot contained 5,363 changed text lines, 4,240 excluding the lockfile. The user explicitly requested one complete PR spanning security, site foundations, a new scenic experience, and QA. Changes are grouped into dependency/security foundations, the integrated site, and QA/documentation commits. This improves review order; it does not make the aggregate change meet the size guideline. A future narrowly scoped change should remain under the guidance.

5. **P2 — Pending feedback disappeared with the mobile dialog. Fixed.** `src/components/site-link.tsx:8`: the pending indicator is portaled to the document body, so it remains visible after mobile navigation closes its dialog and is unaffected by transformed link ancestors. A delayed cross-route mobile test verifies both the closed menu and visible loading feedback.

The context reviewer reported N/A: this site constructs no model inference requests. The local terminal bounds input length to 120 characters and history to 40 lines.

## Simplify findings and dispositions

1. **Duplicate project metadata:** removed the newly created, unused `src/lib/projects.ts`; `src/components/project-stack.tsx:1` is the actual rendered project definition. The dead file also referred to nonexistent media frames.
2. **Duplicate/stale contact and section data:** removed unused exports from `src/lib/data.ts:1`; contact and social destinations now come from `src/lib/site.ts:1`.
3. **Unused assets:** removed both original approximately 35 MB demo copies, starter SVGs, and an unused extracted thumbnail. The optimized preview, full video and used poster remain under `public/`.
4. **Duplicate font/image refresh work:** `src/components/scroll-provider.tsx:92` owns one coalesced refresh scheduler. The journey wrapper signals readiness; it does not install a second refresh loop. Listeners and pending frames are removed on route cleanup.
5. **Prototype-property terminal crash:** `src/components/terminal.tsx:48` uses `Object.hasOwn` before reading a reply. The `__proto__` regression now produces the ordinary unknown-command reply.
6. **Keyboard focus hidden beneath stacked cards:** `src/app/globals.css:565` exposes the focused card. A subsequent media-recovery check found that it could then cover the next card after a modal closed; focused cards now return to normal flow as well. The regression test verifies visibility and opening the following demo.
7. **Dialogs positioned at the corner:** `src/app/globals.css:113` explicitly centers native dialogs. The media test checks positive horizontal and vertical offsets.
8. **Unavailable Loom embed lacked recovery:** `src/components/media-demo.tsx:138` always provides a direct watch link when the embed is open. A blocked-embed test verifies that link remains available; a blocked local video tests its error state.
9. **Terminal keyboard focus began at the wrong control:** `src/components/terminal.tsx:85` focuses its input on opening.
10. **Scattered animation tuning:** `src/lib/motion.ts:1` owns effect switches, distances, durations, easing, scales and trigger positions. Home and the isolated study share those values.

The visual QA pass also corrected insufficient contrast in the green project's description. Automated accessibility checks then reported no WCAG A/AA violations on the tested routes and mobile menu.

The performance pass detected layout shifts when ScrollTrigger changed positioning modes at the pin boundaries. `src/components/journey-motion.tsx:117` now selects transform pinning, preserving one positioning mode; the forward/reverse measurement is recorded in `qa.md`. The mobile pass also corrected undersized inline contact/privacy links and selected higher-resolution scenery for tall viewport crops.

A repeated no-JavaScript check exposed a streaming-loading boundary that could leave the page behind its loading fallback. Removed the route-level fallback and use `useLinkStatus` in `src/components/site-link.tsx:6` for pending navigation feedback. Essential page content is delivered directly in the server HTML.

The final screenshot pass found translucent receding card surfaces allowing underlying text to bleed through. `src/components/journey-motion.tsx:192` now dims card contents while leaving the surfaces opaque; the browser suite asserts opaque card surfaces. The forest image also selects a source sized for its tall desktop crop.
