# PhotonLint

Cloud-native Design Rule Checker (DRC) for Silicon Photonics — engineers upload `.gds` layout files and get instant violation reports before tape-out.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/photonlint run dev` — run the frontend (port varies)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind
- API: Express 5 (Node.js)
- DRC Engine: Python 3 + gdspy + numpy (spawned as subprocess from API)
- DB: PostgreSQL + Drizzle ORM (`lib/db/src/schema/drc.ts`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (single source of truth)
- `lib/db/src/schema/drc.ts` — DRC runs table schema
- `artifacts/api-server/src/lib/drc_engine.py` — Python DRC engine (gdspy)
- `artifacts/api-server/src/routes/foundries.ts` — foundry PDK static data
- `artifacts/api-server/src/routes/drc.ts` — DRC check, runs history, stats endpoints
- `artifacts/photonlint/src/` — React frontend

## Architecture decisions

- The DRC engine is a Python script (`gdspy`) spawned as a subprocess from Node.js; stdout is JSON. This keeps Python dependencies isolated from the Node.js server.
- Foundry PDKs are static data (no DB); easy to extend with real PDK rules.
- File uploads use `multer`; temp files are cleaned up after each DRC run.
- DRC runs are stored in `drc_runs` table with full violation JSON for history and stats.
- File upload to `/api/drc/check` is multipart/form-data with `file` + `foundryId` fields; frontend uses raw `fetch` (FormData), not the generated hook.

## Product

- Upload page: drag-and-drop .gds file, select foundry PDK, view live rule preview
- Results page: PASS/FAIL verdict, violations table (sortable by severity), CSV download
- History page: table of past runs with click-through to results
- Statistics page: pass rate, common violations breakdown

## Supported Foundries

- GlobalFoundries 45SPCLO
- AIM Photonics
- Tower Semiconductor PH18
- imec iSiPP50G

## User preferences

- **Full test suite on every agent return** — no spot-checking. Run the complete test suite (e.g. `pnpm test`) and all TypeScript builds before marking any task complete or declaring work done. Partial or sample validation is not acceptable.

## Gotchas

- DRC engine path: `process.cwd()` is `artifacts/api-server/` at runtime, so the Python script is referenced as `src/lib/drc_engine.py` relative to that.
- Python packages (gdspy, numpy, pandas) are installed in `.pythonlibs/` via uv.
- After any `lib/*` package change, run `pnpm run typecheck:libs` before checking artifact packages.
