---
name: Clerk auth implementation
description: How Clerk auth is wired in PhotonLint — key decisions, file locations, and gotchas.
---

# Clerk Auth — PhotonLint

## Architecture
- Replit-managed Clerk (provisioned via `setupClerkWhitelabelAuth()`)
- Web only — no Expo mobile
- Cookie-based session on the browser side; no bearer token / `setAuthTokenGetter` on web
- Proxy middleware: `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts` (production only)

## Server wiring (`artifacts/api-server/src/app.ts`)
1. `app.use(CLERK_PROXY_PATH, clerkProxyMiddleware())` — BEFORE body parsers
2. `cors({ credentials: true, … })` — must have `credentials: true`
3. `app.use(clerkMiddleware(…))` — after CORS, resolves key from host via `publishableKeyFromHost`
4. Body parsers after that

## Route protection (`artifacts/api-server/src/routes/drc.ts`)
- `requireAuth` middleware calls `getAuth(req)` from `@clerk/express`; 401s if no userId
- Applied to: POST /drc/check, GET /drc/runs, GET /drc/stats, GET /drc/runs/:id, GET /drc/runs/:id/report.pdf
- Order in POST /drc/check: rate-limiter → requireAuth → multer (so files aren't parsed for unauthed requests)

## Database
- `userId text("user_id")` column on `drc_runs` is **nullable** — rows created before auth have null owner and are invisible to all users (intentional)
- All queries filter with `eq(drcRunsTable.userId, userId!)`; cross-user reads return 404

## Frontend (`artifacts/photonlint/src/App.tsx`)
- `publishableKeyFromHost(window.location.hostname, VITE_CLERK_PUBLISHABLE_KEY)` — required, do not inline env var
- `clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL` — empty in dev (intentional), auto-set in prod; never gate on NODE_ENV
- Routes: `/sign-in/*?` and `/sign-up/*?` (the `/*?` wildcard is mandatory for OAuth sub-paths)
- `/` shows `LandingPage` for signed-out users, `Home` for signed-in — never redirects signed-out to /sign-in from "/"
- `AuthGuard` wraps `/results/:id`, `/history`, `/stats` — redirects to `/sign-in` when not loaded+signed in

## CSS (Tailwind v4 + Clerk)
- `@layer theme, base, clerk, components, utilities;` must appear BEFORE `@import 'tailwindcss'` in index.css
- `@import '@clerk/themes/shadcn.css'` after tailwindcss import
- `tailwindcss({ optimize: false })` in vite.config.ts — prevents Clerk UI breaking in prod builds

**Why `optimize: false`:** Lightning CSS in Tailwind v4 reorders nested @layer imports from @clerk/themes/*.css at build time, making Clerk UI render correctly in dev but broken in prod.

## Layout (`artifacts/photonlint/src/components/layout.tsx`)
- `useUser()` + `useClerk()` show user name/email + a sign-out button at the bottom of the sidebar
- `signOut({ redirectUrl: basePath || '/' })` redirects to landing after logout

## Dead code to clean up
- `artifacts/photonlint/src/components/beta-gate.tsx` — no longer used (Clerk replaced it)
- `VITE_BETA_PASSPHRASE` secret — can be deleted
