# Scenic journey — implementation and release checklist

The work preserves the existing Next.js/React/Tailwind application and portfolio content while replacing the four-slide interaction with a continuous scenic journey. Branch: `codex/scenic-journey`, based on `main`. Optimized project videos and experience data are reused from PR #3; the terminal idea comes from PR #2. This PR does not merge either earlier redesign.

## Phase 1 — Security

- ✅ Exposed keys: no sensitive keys found in tracked source on main or either redesign tip; none relocated. `docs/security-audit.md` records scope.
- ➖ Unsecured business endpoints: none exist. Metadata/image routes return deliberately public data.
- ➖ Row-level security: no database/collections.
- ✅ Broken auth gates: no disabled guards or bypass flags found.
- ➖ Object buckets: no configured cloud storage; bundled portfolio media is intentionally public.
- ✅ Dependency advisories: patched framework/transitive dependencies; full and production-only npm audits clean at installation.
- ✅ Added nonce CSP and browser headers in `src/proxy.ts`, `next.config.ts`.

## Phase 2 — Production foundations

- ✅ Custom 404, route error boundary, and root error boundary: `src/app/not-found.tsx`, `error.tsx`, `global-error.tsx`.
- ✅ Above-fold CTA: Explore the journey and email contact, `src/app/page.tsx`.
- ✅ Page titles/descriptions: home, motion study, privacy and terms; shared helper `src/lib/site.ts`.
- ✅ Open Graph/Twitter metadata and generated default image: `src/app/opengraph-image.tsx`.
- ✅ favicon.ico, 16/32 PNGs, Apple icon, 192/512 icons, SVG mark and manifest: `scripts/prepare-assets.mjs`, `public`, `src/app/manifest.ts`.
- ✅ robots.txt and sitemap.xml: metadata routes. Draft legal pages and the motion study are excluded from indexing.
- ✅ Images have descriptive alt text or empty alt when scenery is decorative and described by adjacent headings. Video previews have accessible labels.
- ✅ Existing Vercel Analytics preserved, opt-in; no measurement ID required by this integration. `src/components/consent.tsx`.
- ⚠️ Privacy and terms routes scaffolded and visibly awaiting owner-approved text; not invented. Analytics preference banner offers equal access to allow/decline; withdrawal reloads to remove an already loaded tracker.
- ➖ Thank-you page: no submission form or business backend. Mailto opens the visitor's email app; no false success message.
- ✅ Existing real email is clickable, with GitHub and LinkedIn links.
- ⚠️ Phone and physical address: not provided. Intentionally not fabricated or published. Optional contact fields await the owner if these should be public.

<!-- TODO: provide a public contact phone number and physical mailing address, or confirm these should remain omitted for this personal portfolio -->

## Phase 3 — States and dead ends

- ✅ Route loading feedback: `src/components/site-link.tsx`; video loading/error feedback: `src/components/media-demo.tsx`.
- ➖ Contact form validation, submission success/error, and thank-you: no contact form. Terminal input is trimmed/normalized and reports unknown commands; it never submits externally.
- ✅ Dialog close/escape/backdrop paths, menu navigation, project demos, terminal commands and links have concrete actions.
- ✅ Home mark links to `/`; footer uses real routes and anchors.
- ✅ No unused navigation entries or generic placeholder copy; only explicitly flagged legal scaffolds remain.
- ✅ Copyright year uses the current year at render time.
- ✅ Internal routes/assets checked in browser tests; GitHub repository destinations, LinkedIn, and both Loom share URLs were reachable. Playback availability remains controlled by the external provider.

## Phase 4 — Mobile and performance

- ✅ Responsive layout across all routes, collapsed mobile navigation, native dialog focus trapping, escape close, close on navigation.
- ✅ Mobile contact action stays within thumb reach.
- ✅ Responsive AVIF/WebP scenery in 800/1600 widths; below-fold artwork/thumbnail lazy loading. Hero image is high priority.
- ✅ Reused 1.9 MB muted hover preview and separate 10.8 MB full demo; no full video request until opening.
- ✅ Desktop-only Lenis/pinning/stacking; phones/tablets retain natural document flow. Reduced motion removes animations at any width, including live preference changes.
- ✅ Transform/opacity-only animation loops; observers/listeners/ticker/animations clean up on unmount. Image/font load triggers refresh.
- ✅ Desktop, mobile, reduced-motion, focus, media failure, consent and no-JavaScript checks are covered in `tests/journey.spec.ts`; final evidence and limits are recorded in `docs/qa.md`.

## Phase 5 — UX constraints applied

| Principle | Implemented decision |
| --- | --- |
| Hick / Occam / Tesler | Three main navigation choices; experience detail collapses behind familiar disclosure rows. |
| Fitts | Large hero/email buttons, thumb-reachable mobile contact, generous interactive targets. |
| Jakob / Similarity / Connectedness | Conventional links, native dialogs, consistent demo controls and shared card structure. |
| Proximity / Prägnanz | Project metadata remains with its project; typography and spacing distinguish scene, heading and details. |
| Miller | Three navigation entries and three project cards; six experience rows. |
| Doherty | Immediate dialog feedback and loading state; terminal replies locally without a network round trip. |
| Von Restorff | One filled primary action in the closing scene. |
| Serial Position | Journey begins navigation, about closes it, contact remains independently visible. |
| Peak-End | Scenic closing view ends with a direct contact path. |
| Zeigarnik | ➖ No multi-step task; no artificial completion/progress requirement. Chapter labels provide orientation. |
| Postel | Terminal trims whitespace, normalizes case and rejects unknown commands without evaluating code. |
| Pareto | Home journey, selected work, and contact receive the bulk of design/QA effort. |

## Phase 6 — Visual direction and animation

- ✅ Proposed before coding: alpine journey at blue hour, quiet editorial typography, deep green/blue landscape, warm paper interlude.
- ✅ Original scenic artwork generated using built-in ImageGen and copied into `public/scenery`; prompt provenance in `docs/artwork.md`.
- ✅ Global desktop smooth scroll (Lenis), line-split hero reveal (SplitType), parallax, pinned split-screen passage, receding card stack, section reveals (GSAP + ScrollTrigger + @gsap/react).
- ✅ Isolated `/scroll-demo` demonstrates all effects using the same implementation components.
- ✅ Central controls: `src/lib/motion.ts`. Set any `effects` flag false; numeric settings adjust timing/speed. Reduced motion disables all effects regardless of flags.
- ➖ Horizontal gallery: optional and not needed for the vertical journey.
- ➖ Magic UI, R3F/Threlte, Anime.js, Motion, Kokonut, Bklit: not needed for these specific effects. The explicitly requested GSAP/Lenis stack owns all animation.
- ➖ Vectary/Jitter: no dependency installation; exported artwork could replace a scenic image in `Landscape` later.

## Release needs input

1. Owner-approved privacy policy and processing details (`src/app/privacy/page.tsx`).
2. Owner-approved terms/jurisdiction/media usage permissions (`src/app/terms/page.tsx`).
3. Public phone/address only if desired (TODO above).

Keep the PR as a draft until legal copy is approved and the owner has reviewed the experience. Do not merge or deploy to the production branch automatically.
