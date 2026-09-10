# How the directions fit together

Inspected `main` at `ec37488`, [PR #2](https://github.com/ryouol/roy/pull/2) at `17656af`, and [PR #3](https://github.com/ryouol/roy/pull/3) at `23255f5`. Both existing PRs target main. PR #3 contains PR #2 plus twelve more commits, so they are successive explorations rather than independent patches to merge together.

| Version | Approach | Ideas carried forward | Ideas deliberately left behind |
| --- | --- | --- | --- |
| Main | Four-slide portfolio with direct project demos and concise personal context. | Real contact/project destinations and the emphasis on showing working software. | Slide controls and forced page-by-page progression interrupt a scenic scroll. |
| PR #2 — Rework portfolio: single-page with terminal easter egg | Calm continuous page; Waterloo term-code ledger; glass navigation; light/dark themes; hidden terminal; lazy media. | One continuous journey, the six-term experience ledger, a small terminal, on-demand demos, optimized media. | Multiple visual themes, Konami mode, clock controls and the larger terminal command surface add competing interactions. |
| PR #3 — Redesign/parallax stack | Iterated from layer plates and depth traversal through a pinned hero/cascade into an annotated engineering section drawing. | Scroll as the main interaction, depth through overlapping planes, a pinned passage, foreground/background separation, and the improved asset pipeline. | Engineering annotations and a depth rail make the page feel like a technical diagram; they do not serve the requested landscape experience. |
| This PR — Scenic journey | Alpine blue hour, warm paper, oversized editorial type, mountain and forest scenes, reversible desktop choreography. | Combines the continuous structure and personal details of #2 with the spatial ambition and optimized assets of #3. | No extra animation engines, dashboard components, horizontal gallery or WebGL renderer without a scene that requires them. |

## Sequence

1. A mountain lake opens behind a two-line heading; separate ridgelines and copy move at different speeds.
2. A quiet introduction gives the scene breathing room.
3. A forest river enters a pinned split-screen passage with three short states and readable pauses.
4. Three project cards recede as the next card arrives, then release into the page.
5. Experience details unfold through familiar disclosure rows.
6. The lake returns for a clear email invitation.

The home route remains the portfolio. `/scroll-demo` is an isolated study using the same components. Small screens and reduced motion use normal document flow. Existing project information is retained; original generated scenery is documented in `artwork.md`.

The chosen stack is Next.js/React, Tailwind 4 plus custom CSS, Lenis, GSAP/ScrollTrigger, `@gsap/react`, and SplitType. The motion constants and switches live in `src/lib/motion.ts`. There is no backend or database, and hosting remains Vercel.
