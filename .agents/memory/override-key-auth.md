---
name: Override key auth pattern
description: How the foundry override endpoints are protected with a shared API key.
---

## Rule
`PUT /foundries/:id/override` and `DELETE /foundries/:id/override` are gated by the `requireOverrideKey` middleware in `foundries.ts`.

Server reads `process.env["FOUNDRY_OVERRIDE_KEY"]`. If set, it compares against the `X-Override-Key` request header and returns 401 on mismatch. If not set, routes are open (dev fallback).

**Why:** Unauthenticated override endpoint lets anyone silently widen `minSpacing` to suppress real DRC violations on subsequent runs. CORS protects browser clients but not direct curl calls.

**How to apply:**
- Two secrets must match: `FOUNDRY_OVERRIDE_KEY` (server) and `VITE_FOUNDRY_OVERRIDE_KEY` (Vite client, same value).
- Frontend calls `setOverrideKey(import.meta.env.VITE_FOUNDRY_OVERRIDE_KEY ?? null)` in `main.tsx`.
- `setOverrideKey` is exported from `@workspace/api-client-react` and injects the header in `customFetch` for PUT/DELETE requests whose URL includes `/override`.
- If adding new mutation routes that should be similarly protected, reuse the `requireOverrideKey` middleware from `foundries.ts`.
