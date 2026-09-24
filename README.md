# Roy — A little further

A scenic portfolio journey built with Next.js 16, React 19, TypeScript, Tailwind 4, GSAP/ScrollTrigger, Lenis and SplitType. Hosting remains Vercel. No backend, database or contact submission service.

## Run locally

```sh
npm ci
npm run dev -- --hostname 127.0.0.1
```

Open http://127.0.0.1:3000. `/scroll-demo` isolates the parallax, pinned passage, stacked cards and reveals.

```sh
npm run lint
npm run typecheck
npm run build
npm run start -- --hostname 127.0.0.1 --port 3001
# In a second terminal:
npm run test:e2e
npm run qa:measure
```

Playwright defaults to the production server at port 3001. Install its browser once with `npx playwright install chromium`. Set `QA_BASE_URL` to test another local server. Development and production builds use Webpack after Turbopack exhibited an IPC bind failure and stale CSS hot reloads in this environment.

## Tune the journey

`src/lib/motion.ts` is the single animation configuration file. Every `effects` boolean can be disabled independently:

- `smooth`: Lenis, once per route with GSAP ticker synchronization.
- `hero`: SplitType line reveal on the opening heading.
- `parallax`: image, foreground ridgeline and copy movement.
- `story`: pinned mask reveal and three story states.
- `stack`: sticky/receding cards; disabling restores normal document flow.
- `reveals`: small section entrance effects.

`hero`, `reveal`, `parallax`, `story` and `stack` groups control timing, distance, scale, easing and trigger positions. Desktop enhancement starts at 800px width / 600px height. Reduced motion disables all movement, including live preference changes. Mobile retains native scrolling. Browser dialogs trap focus and stop background scrolling. Essential content remains visible with JavaScript disabled.

The home page and `/scroll-demo` reuse `JourneyMotion`, `Story`, `Landscape`, and `ProjectStack`. Contact configuration lives in `src/lib/site.ts`, experience in `src/lib/data.ts`, and projects in `src/lib/projects.ts`. Project preview sources are recorded in `docs/project-previews.md`.

## Production details

- Canonical origin defaults to the repository's existing `https://roy-nu-three.vercel.app`; optionally set server-side `SITE_URL`.
- Nonce CSP requires request-time rendering. Images/fonts/scripts are same-origin; project and demo links open externally.
- Vercel Web Analytics counts visits by default, with an opt-out on `/privacy`. Existing saved opt-outs are respected. No measurement ID is needed; Web Analytics must be enabled in the Vercel project before deploying. When preference storage is unavailable, changes apply until the page reloads.
- `/privacy` explains the aggregate analytics collected and lets visitors change their browser preference.
- [Full phase checklist and outstanding input](docs/implementation-checklist.md)
- [Main and previous PR directions](docs/branch-direction.md)
- [Security audit](docs/security-audit.md)
- [Simplify and code-review findings](docs/review.md)
- [Artwork prompts and provenance](docs/artwork.md)
- [QA evidence](docs/qa.md)

Implementation references: [GSAP React lifecycle](https://gsap.com/resources/React/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Lenis integration](https://github.com/darkroomengineering/lenis), and the installed Next.js docs in `node_modules/next/dist/docs`.
