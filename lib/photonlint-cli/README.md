# photonlint-cli

Run [PhotonLint](https://photonlint.com) DRC checks **locally** — your raw GDS file never leaves your machine. Only the structured violation report (rule names, counts, coordinates) is uploaded to the PhotonLint API so you can view results in the dashboard.

This is the recommended path for IP-sensitive layouts at hyperscalers, defense-adjacent teams, and any organisation with strict data-residency requirements.

---

## How it works

```
Your machine                           PhotonLint cloud
──────────────────────────────────     ─────────────────────
GDS file  ──►  DRC engine (local)
               (Python + gdspy)
               ↓
               Violations JSON  ──────►  POST /api/drc/runs/import
                                         (no raw geometry, just
                                          rule names + metadata)
                                         ↓
                                         Dashboard run ID + URL  ◄──
```

The GDS file is read only by the local Python process. The payload sent to the API contains rule names, violation counts, and approximate bounding-box coordinates — the same data shown in the web UI — but not the raw polygon vertices from your layout.

---

## Prerequisites

### Python dependencies

The DRC engine requires Python 3.8+ with:

```bash
pip install gdspy numpy shapely
```

Verify with:

```bash
python3 -c "import gdspy, numpy, shapely; print('OK')"
```

### PhotonLint API key

Generate an API key in the PhotonLint dashboard under **Settings → API Keys**, then either:

- Pass it as `--api-key plk_…`, or
- Set the `PHOTONLINT_API_KEY` environment variable.

---

## Installation

```bash
npm install -g photonlint-cli
```

Or run without installing:

```bash
npx photonlint-cli --gds-path ./layout.gds --foundry gf-45spclo --api-key plk_…
```

---

## Usage

```
photonlint [options]

Options:
  --gds-path   <path>   Path to the GDS or GDSII file to check    [required]
  --foundry    <id>     Foundry ID (see list below)                [required]
  --api-key    <key>    PhotonLint API key (plk_…)                 [required if env not set]
  --api-url    <url>    API base URL (default: https://photonlint.com/api)
  --include-layout      Upload polygon layout data (default: off)
  --no-color            Disable colour output
  --json                Print machine-readable JSON instead of human output
  --help                Show this help message
```

### Examples

```bash
# Basic check
photonlint --gds-path ./ring_resonator.gds --foundry gf-45spclo \
           --api-key plk_abc123…

# Read API key from environment variable
export PHOTONLINT_API_KEY=plk_abc123…
photonlint --gds-path ./mzi.gds --foundry aim-photonics

# Machine-readable output for CI pipelines
photonlint --gds-path ./layout.gds --foundry tower-semi --json

# Self-hosted PhotonLint instance
photonlint --gds-path ./layout.gds --foundry gf-45spclo \
           --api-url https://photonlint.internal.example.com/api \
           --api-key plk_…
```

### Available foundry IDs

| ID | Foundry |
|----|---------|
| `gf-45spclo` | GlobalFoundries 45SPCLO |
| `aim-photonics` | AIM Photonics |
| `tower-semi` | Tower Semiconductor |
| `imec-isipp50g` | imec iSiPP50G |

Run `photonlint --list-foundries` to fetch the current list from the API.

---

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | DRC passed — no critical violations |
| `1` | DRC failed — one or more critical violations |
| `2` | DRC engine error (bad GDS file, missing Python deps) |
| `3` | API error (bad key, network failure) |

Use exit codes in CI pipelines to gate tape-out approvals:

```yaml
# GitHub Actions example
- name: Run PhotonLint DRC
  run: photonlint --gds-path ./layout.gds --foundry gf-45spclo --json
  env:
    PHOTONLINT_API_KEY: ${{ secrets.PHOTONLINT_API_KEY }}
```

---

## Privacy details

**What is uploaded by default:**

- `foundryId` and `filename` (basename only — no directory path)
- `status` (`pass` / `fail` / `error`)
- Per-violation objects: rule name, requirement string, location string (e.g. `"Layer 1/0 polygon at (1.234, 5.678)"`), severity, and human-readable details
- `passedChecks`, `totalChecks`, `processingTimeMs`

**What is never uploaded by default:**

- The raw GDS file
- Polygon vertex arrays of any kind — including the `geometry` field that the DRC engine attaches to each violation and the full `layoutData` mesh. Both are stripped before upload unless you explicitly pass `--include-layout`.

**With `--include-layout`:**

Violation bounding boxes and the full polygon mesh are included, enabling the visual layout viewer in the dashboard. The uploaded coordinates are derived from your GDS file. Only use this flag if your data-residency policy permits uploading derived geometry to the PhotonLint cloud.

The uploaded payload is the same information shown in the PhotonLint web dashboard; it contains no proprietary geometry.
