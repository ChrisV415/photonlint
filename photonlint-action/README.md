# PhotonLint DRC Action

Run a **PhotonLint design-rule check** on a GDSII file directly in GitHub Actions. The job fails automatically if violations are found, keeping fabrication-bound designs clean on every commit.

```yaml
- name: PhotonLint DRC
  uses: ChrisV415/drc-action@v1
  with:
    api_key: ${{ secrets.PHOTONLINT_API_KEY }}
    gds_file: path/to/your/design.gds
    foundry_id: gf-45spclo
    api_url: https://photon-lint.replit.app/api
```

---

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `api_key` | ✓ | — | PhotonLint API key (starts with `plk_`). Store as a repository secret. |
| `gds_file` | ✓ | — | Path to the GDSII file to check, relative to the repository root. |
| `foundry_id` | ✓ | — | Foundry rule set to check against — see [Foundry IDs](#foundry-ids) below. |
| `api_url` | ✓ | — | Base URL of the PhotonLint API server, no trailing slash. |
| `fail_on_violations` | | `"true"` | Set to `"false"` to report violations without failing the step. |

## Outputs

| Output | Description |
|--------|-------------|
| `status` | `pass`, `fail`, or `error` |
| `violation_count` | Number of DRC violations found |
| `run_id` | UUID of the DRC run — append to the PhotonLint URL to view the full report |

---

## Foundry IDs

| ID | Foundry |
|----|---------|
| `gf-45spclo` | GlobalFoundries 45SPCLO |
| `aim-photonics` | AIM Photonics |
| `imec-isipp50g` | imec iSiPP50G |
| `tower-semi` | Tower Semiconductor |

---

## Full example workflow

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
          gds_file: layout/top.gds
          foundry_id: gf-45spclo
          api_url: https://photon-lint.replit.app/api
          fail_on_violations: "true"
```

### Report-only mode with PR comment

```yaml
      - name: PhotonLint DRC
        id: drc
        uses: ChrisV415/drc-action@v1
        with:
          api_key: ${{ secrets.PHOTONLINT_API_KEY }}
          gds_file: layout/top.gds
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

## Setting up an API key

1. Sign in to PhotonLint and go to **Settings → API Keys**
2. Click **Create API key**, give it a label (e.g. `GitHub Actions – my-repo`), and click **Create key**
3. Copy the key — it starts with `plk_` and is shown **once only**
4. In your GitHub repository go to **Settings → Secrets and variables → Actions** and create a new secret:
   - Name: `PHOTONLINT_API_KEY`
   - Value: the `plk_…` key you copied

---

## License

MIT
