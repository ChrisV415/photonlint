# PhotonLint CI Integration

Run PhotonLint DRC checks automatically on every pull request or push using the included GitHub Action.

---

## 1 — Generate an API key

1. Sign in to PhotonLint and go to **Settings → API Keys**
2. Click **Create API key**, give it a label (e.g. `GitHub Actions – my-repo`), and click **Create key**
3. Copy the key — it starts with `plk_` and is shown **once only**
4. In your GitHub repository go to **Settings → Secrets and variables → Actions** and create a new secret:
   - Name: `PHOTONLINT_API_KEY`
   - Value: the `plk_…` key you just copied

---

## 2 — Add the workflow file

Create `.github/workflows/drc.yml` in your repository:

```yaml
name: DRC Check

on:
  push:
    branches: [main]
  pull_request:

jobs:
  drc:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: PhotonLint DRC
        uses: ChrisV415/drc-action@v1
        with:
          api_key: ${{ secrets.PHOTONLINT_API_KEY }}
          gds_file: path/to/your/design.gds
          foundry_id: gf-45spclo           # see foundry IDs below
          api_url: https://photon-lint.replit.app/api
          fail_on_violations: "true"       # set "false" to report-only
```

---
## Foundry IDs

| ID              | Foundry                          |
|-----------------|----------------------------------|
| `gf-45spclo`    | GlobalFoundries 45SPCLO          |
| `aim-photonics` | AIM Photonics                    |
| `imec-isipp50g` | imec iSiPP50G                    |
| `tower-semi`    | Tower Semiconductor              |

---
## Outputs

The action sets these step outputs:

| Output            | Description                                     |
|-------------------|-------------------------------------------------|
| `status`          | `pass`, `fail`, or `error`                      |
| `violation_count` | Number of DRC violations found                  |
| `run_id`          | UUID — append to the PhotonLint URL to view the full report |

Example — post a comment with the results:

```yaml
      - name: PhotonLint DRC
        id: drc
        uses: ChrisV415/drc-action@v1
        with:
          api_key: ${{ secrets.PHOTONLINT_API_KEY }}
          gds_file: design.gds
          foundry_id: aim-photonics
          api_url: https://photon-lint.replit.app/api
          fail_on_violations: "false"   # don't fail yet — post a comment first

      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `**PhotonLint DRC:** ${{ steps.drc.outputs.status }} · ${{ steps.drc.outputs.violation_count }} violations`
            })
```

---
## API reference

All requests require an `Authorization: Bearer plk_…` header.

### `POST /drc/check`

Upload a GDS file and run DRC.

**Request** — multipart/form-data:
| Field       | Type   | Required | Description                     |
|-------------|--------|----------|---------------------------------|
| `file`      | file   | ✓        | GDSII file (`.gds` or `.gdsii`) |
| `foundryId` | string | ✓        | Foundry ID from the table above |

**Response** — JSON: see the `DrcResult` shape in `artifacts/api-server/src/routes/drc.ts`

### `GET /api-keys`
List your API keys (no raw key values — hashes are never returned).

### `POST /api-keys`
Create a new key. Body: `{ "label": "string" }`. Returns `{ key, id, label, createdAt }` — the raw key is only returned here.

### `DELETE /api-keys/:id`
Revoke a key by its ID.

---

## Revoking a key

Go to **Settings → API Keys** in PhotonLint and click the trash icon next to the key, or call:

```bash
curl -X DELETE https://photon-lint.replit.app/api/api-keys/<key-id> \
  -H "Authorization: Bearer plk_…"   # use a different valid key or your browser session
```
