#!/usr/bin/env bash
set -euo pipefail

# ── Validate inputs ───────────────────────────────────────────────────────────
if [[ -z "${INPUT_API_KEY:-}" ]]; then
  echo "::error::PHOTONLINT: api_key input is required."
  exit 1
fi
if [[ -z "${INPUT_GDS_FILE:-}" ]]; then
  echo "::error::PHOTONLINT: gds_file input is required."
  exit 1
fi
if [[ ! -f "${INPUT_GDS_FILE}" ]]; then
  echo "::error::PHOTONLINT: File not found: ${INPUT_GDS_FILE}"
  exit 1
fi
if [[ -z "${INPUT_FOUNDRY_ID:-}" ]]; then
  echo "::error::PHOTONLINT: foundry_id input is required."
  exit 1
fi
if [[ -z "${INPUT_API_URL:-}" ]]; then
  echo "::error::PHOTONLINT: api_url input is required."
  exit 1
fi

ENDPOINT="${INPUT_API_URL}/drc/check"
echo "::notice::PhotonLint: submitting ${INPUT_GDS_FILE} → ${INPUT_FOUNDRY_ID}"

# ── Submit DRC check ──────────────────────────────────────────────────────────
HTTP_CODE=$(curl -s -o /tmp/photonlint_response.json -w "%{http_code}" \
  -H "Authorization: Bearer ${INPUT_API_KEY}" \
  -F "file=@${INPUT_GDS_FILE}" \
  -F "foundryId=${INPUT_FOUNDRY_ID}" \
  "${ENDPOINT}")

if [[ "${HTTP_CODE}" -eq 401 ]]; then
  echo "::error::PhotonLint: authentication failed — check that PHOTONLINT_API_KEY is set correctly."
  exit 1
fi
if [[ "${HTTP_CODE}" -eq 429 ]]; then
  echo "::error::PhotonLint: rate limit exceeded — reduce concurrent DRC submissions."
  exit 1
fi
if [[ "${HTTP_CODE}" -ne 200 ]]; then
  ERROR=$(jq -r '.error // "unknown error"' /tmp/photonlint_response.json 2>/dev/null || echo "HTTP ${HTTP_CODE}")
  echo "::error::PhotonLint: DRC check failed — ${ERROR}"
  exit 1
fi

# ── Parse response ────────────────────────────────────────────────────────────
STATUS=$(jq -r '.status' /tmp/photonlint_response.json)
VIOLATION_COUNT=$(jq -r '.violationCount' /tmp/photonlint_response.json)
RUN_ID=$(jq -r '.id' /tmp/photonlint_response.json)

# Emit outputs
{
  echo "status=${STATUS}"
  echo "violation_count=${VIOLATION_COUNT}"
  echo "run_id=${RUN_ID}"
} >> "${GITHUB_OUTPUT}"

echo "::notice::PhotonLint DRC: status=${STATUS}, violations=${VIOLATION_COUNT}, run_id=${RUN_ID}"

# ── Annotate violations ───────────────────────────────────────────────────────
if [[ "${VIOLATION_COUNT}" -gt 0 ]]; then
  # Emit the first 10 violations as warning annotations
  jq -r '.violations[:10] | .[] | "::warning::" + .rule + " — " + .location + ": " + .details' \
    /tmp/photonlint_response.json 2>/dev/null || true
fi

# ── Pass/fail ─────────────────────────────────────────────────────────────────
if [[ "${INPUT_FAIL_ON_VIOLATIONS:-true}" == "true" ]] && [[ "${STATUS}" != "pass" ]]; then
  echo "::error::PhotonLint DRC check did not pass (status: ${STATUS}, violations: ${VIOLATION_COUNT})."
  exit 1
fi
