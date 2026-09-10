# Security audit — 9 September 2026

Scope: main, both existing redesign branch tips, and the scenic-journey implementation. Public static portfolio; no user accounts or private data service.

1. **Fixed — high/critical dependency advisories.** The initial lockfile used Next.js 16.1.1 and vulnerable transitive dependencies. Updated Next.js/ESLint config to 16.3.4, React to 19.3.0, Sharp to 0.35.4, and applied compatible npm audit fixes. `npm audit` and `npm audit --omit=dev`: zero vulnerabilities after installation. No assertion that every advisory was exploitable on this portfolio.
2. **Fixed — browser security headers absent from source configuration.** `next.config.ts` adds frame denial, nosniff, referrer and permissions policies. `src/proxy.ts` generates per-request script nonces, restrictive script CSP, object/base/form restrictions. Inline styles remain allowed for React/GSAP; eval is allowed only for Next development tooling. Nonces require dynamic rendering, accepted for this small portfolio.
3. **No exposed credentials found.** Searched tracked source on all three branch tips for key/secret/password/credential/environment patterns. No sensitive keys to relocate. Public Loom video identifiers are content IDs, not credentials. No environment files committed.
4. **Endpoints: N/A.** No business API routes, Server Actions, or serverless data/mutation functions. New metadata routes serve public robots/sitemap/manifest/OG data and intentionally require no authentication.
5. **RLS / auth gates: N/A.** No database, authentication, disabled guards, or hardcoded bypasses found.
6. **Storage: N/A.** No S3, Supabase Storage, or Firebase integrations. Public scenic/demo assets intentionally ship with the portfolio. Cloud account configuration outside this repository has not been audited.

Analytics is opt-in. The client does not mount the analytics component before consent. Privacy/terms copy requires the owner's input before public release; the PR remains a draft for review.
