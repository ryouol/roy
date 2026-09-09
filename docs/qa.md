# QA record — 9 September 2026

Tested the production Webpack build on `http://127.0.0.1:3001`, with Playwright Chromium. The development server is also available on port 3000. No production branch merge or production deployment was performed.

## Build and security

- `npm run build`: passed, including Next's TypeScript check.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- Full `npm audit` and production-only `npm audit --omit=dev`: zero vulnerabilities.
- Final source credential-pattern check: no findings. Wider main/PR branch audit scope is in `security-audit.md`.

## Browser tests

`npm run test:e2e`: **12 passed in 1.3 minutes** on the final implementation.

1. Desktop forward/reverse parallax, pinned scene position and all three states, receding cards, sampled whole-page overflow, and page errors.
2. Mobile natural flow, menu focus trap/close, modal escape/focus restoration, terminal input normalization and prototype-property regression; widths 360, 390 and 768.
3. Live reduced-motion changes remove pins, transforms and Lenis; decorative hover playback is suppressed and an active preview is paused.
4. Initial desktop/mobile fragments, successive section links, browser history, and cross-route fragment alignment.
5. Titles/social tags, nonce CSP, security headers, consent default, route cleanup, metadata/icon endpoints and custom 404.
6. Axe WCAG 2 A/AA and 2.1 AA checks on home, motion study, privacy, terms and mobile menu: no reported violations.
7. Earlier stacked-card keyboard visibility, failed local-video recovery, blocked-Loom direct link, dialog centering, and moving to the next demo after closing.
8. Analytics opt-in/withdrawal and no video/embed/analytics request before visitor intent.
9. Three repeated visits with JavaScript disabled: essential content, all story states and contact navigation remain visible.
10. Delayed desktop route transition displays pending feedback.
11. Delayed cross-route mobile navigation keeps that feedback visible after its menu closes.
12. Supporting pages at 320px and 390px: no horizontal overflow and visible controls at least 44px in both dimensions.

## Visual and performance verification

Desktop and mobile screenshots were inspected for composition, spacing, readability and image cropping. The opening, pinned forest passage, card stack and closing scene have capture points in `scripts/measure-scroll.mjs`. Mobile scenery selects a higher-resolution source for the tall crop.

`npm run qa:measure` performs small forward/reverse wheel increments through the full page, collects layout shifts, long tasks, frame timing, video requests and console errors, and saves screenshots plus `test-results/performance.json`. It fails on CLS above 0.1, overflow, unsolicited video requests or browser errors. These are local lab observations without network/CPU throttling, not field Core Web Vitals or a performance guarantee for every device.

Final local measurement on the same implementation:

| Viewport | CLS | Scroll long tasks >50ms | 95th percentile frame gap | Unsolicited video requests | Browser errors |
| --- | ---: | ---: | ---: | ---: | ---: |
| Desktop 1440×900 | 0 | 0 | 17ms | 0 | 0 |
| Mobile 390×844 | 0 | 0 | 17ms | 0 | 0 |

Both runs also reported no horizontal overflow. Local LCP was 84ms / 120ms respectively; these loopback timings should not be compared to real visitor network timings.

## Coverage limits and follow-up

- Responsive browser emulation is covered; physical iOS/Android hardware and a full Safari/Firefox matrix were not tested. A touch-device spot check is recommended before release.
- Local analytics is stubbed to test consent gating; verify collection in the existing Vercel dashboard after an approved release.
- GitHub repository URLs resolved through GitHub's API. LinkedIn and the two Loom share URLs returned successful HTTP responses. Video account permissions and availability remain controlled by those providers.
- The error boundaries are implemented and compile; no deliberate production server crash was induced to trigger the root error boundary.
- Privacy/terms need owner-approved content. Phone and physical address remain optional owner inputs. Exact TODO markers are listed in `implementation-checklist.md` and the two legal route files.
- Review findings, fixes and the large-PR scope exception are preserved in `review.md`.

Generated test reports, traces and screenshots are intentionally ignored by Git; rerun the commands above to refresh them. The motion study route remains available for manual review of each effect.
