# Mountain navigation and reading layout QA

Updated 2026-09-10. Current application checks passed.

## Latest pass: compact Experience

The user requested much less vertical scrolling and summaries revealed horizontally. Experience now has six compact rows with company, title, date and location. Each row swipes independently to its summary, with Details/Back buttons and left/right keyboard navigation. The scene timing accommodates the shorter section without collapsed camera stops.

At 1448×1086, Experience is 791px high and Projects begins 922px after its start, versus roughly 4072px before (about 77% less scrolling). At 390×844 those values are 956px and 1058px. At 320px wide, all metadata fits and Projects begins after 1090px. No document horizontal overflow was observed.

All 13 Playwright cases pass, including native horizontal-wheel navigation, Details/Back, focus, arrow keys, independent rows and ordinary vertical scrolling over the rail. Additional browser checks verified an emulated touch swipe reveals details without moving the page, vertical touch swipes advance toward Projects, and native horizontal scrolling exposes summaries with JavaScript disabled. Sampled camera progress remains monotone through Experience into Work. Production build/TypeScript, ESLint and whitespace checks pass.

Before/after Experience screenshots were opened together. The ledger glow was adjusted for readable lower rows, and keyboard detail panels have an inset focus indicator. Current captures are `/tmp/roy-compact-qa/experience-1448.png`, `details-1448.png`, `experience-390.png`, `details-390.png`, and the 320px variants; browser results are in `/tmp/roy-compact-qa/results.json`. Browser plugin unavailable; used the existing Playwright Chromium with Metal. These are desktop browser and emulated touch checks, not physical-device/Safari verification.

Commands: `npm run build`, `npm run lint`, `git diff --check`, `npx playwright test --reporter=line --output=/tmp/roy-compact-regression`. Terrain assets, sky and geometric camera route remain unchanged.

The following records the preceding mountain-navigation pass; its screenshots and test count are historical.

## Scope

- Removed the RL/top navigation and Squint landing caption; education now reads UWaterloo.
- Experience, Work and Contact are native links attached to separate visible ridges. Their positions follow the live camera. Paused motion uses static link positions so returning to the top cannot hide navigation.
- Replaced solid reading boxes with open timelines and feathered local shading across Experience, Work and Contact. Company links, six short term summaries and Cambridge, MA remain intact.
- Removed the placeholder Terms route. Kept concise Privacy information for hosting, optional analytics and click-to-load Loom videos. Analytics defaults off, with its controls on Privacy instead of a banner or floating button.
- Preserved the accepted terrain, camera route, imagery, sky and lighting. Higher-resolution scenery research is parked in `docs/scenery-backlog.md`.

## Environment and comparison

Preview: http://127.0.0.1:3000/ using the existing Next.js development server. Browser plugin not available after the workspace resumed; the Playwright MCP expected a Chrome installation that was absent. Used the repo's installed Playwright Chromium, with the Mac Metal renderer. Its default SwiftShader software renderer caused animation timeouts; the native renderer completed those same navigation checks.

Viewports: 1448×1086, 1280×720, 820×1180 and 390×844. The selected reference and current 1448×1086 hero were opened together. The centered typography and light palette remain. The removed header/caption, UWaterloo wording and three peak labels are intentional changes requested by the user. The live Swiss terrain remains less photographic than the original reference; terrain refinement is parked.

## Verification

- URL/title and meaningful page content verified; no framework error overlay, no page errors or console errors in the screenshot session.
- All three peak links reach their sections at all four sizes, with no horizontal overflow. Desktop anchor padding is 32px and mobile is 24px; Contact respects the end of the document.
- Back to top restores the hero navigation. Work → Pause motion → Back to top → Experience keeps links usable and camera position frozen. Resume advances along the continuous route.
- Lazy demo loading, Escape dismissal and focus restoration pass.
- Emulated reduced motion keeps the static landscape, six terms and destinations; axe WCAG A/AA scan reports no violations in that state.
- JavaScript-disabled HTML retains experience, company links and the matching poster.
- Security/header and public-asset checks pass; the deleted /terms route returns 404.
- Privacy Off → On → Off passes, including SDK removal after opting out. Opt-out also works in memory when preference storage writes/removal are blocked. Analytics network requests are intercepted in the final privacy checks.
- Production build and TypeScript pass; ESLint and whitespace checks pass.

The full browser run passed 10 of 11 cases. The remaining analytics test initially matched only the production script URL; it was corrected to cover the SDK's development URL too. Both analytics cases then passed on a focused rerun. All 11 cases therefore have passing current results; no application code changed after the successful production build.

Commands: `npm run build`, `npm run lint`, `git diff --check`, `npx playwright test --reporter=line --output=/tmp/roy-journey-qa`, then `npx playwright test --grep analytics --reporter=line --output=/tmp/roy-privacy-qa`.

Current screenshots are outside the repo in `/tmp/roy-ui-qa/`: `hero-desktop.png`, `experience-desktop.png`, `work-desktop.png`, `contact-desktop.png`, `hero-tablet.png`, `hero-mobile.png`, `experience-mobile.png`, and `privacy-mobile.png`. The mobile hero was recaptured at flight progress 0 after the resize capture. Earlier `docs/visual-qa/continuous-*` images describe the previous layout and are not evidence of this pass.

## Limits

Browser coverage is Chromium on this Mac with emulated viewport sizes, not physical iOS/Android or Safari/Firefox. Simulated context loss and physical-device GPU benchmarks remain untested. External company/social destinations and live Loom playback were not exercised; their links are preserved. Analytics delivery was mocked rather than sent to Vercel. The storage-blocked opt-out is retained for the current page lifetime if the browser cannot persist the choice.

Everything remains local. No commit, push or deployment was performed.
