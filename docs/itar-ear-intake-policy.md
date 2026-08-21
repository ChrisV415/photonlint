# PhotonLint — ITAR / EAR Intake Policy

**Document type:** Internal compliance policy  
**Version:** 1.0  
**Effective date:** August 10, 2026  
**Owner:** PhotonLint operator  
**Review cadence:** Annually, or before signing any non-US customer or university lab

---

## Purpose

This document describes PhotonLint's intake controls for files that may be subject to the
International Traffic in Arms Regulations (ITAR) or the Export Administration Regulations (EAR).
It exists so that, if PhotonLint is ever questioned by a regulator or customer about its export
compliance posture, it can demonstrate a documented process was in place.

---

## What PhotonLint is and is not

PhotonLint is a pre-tape-out layout linting tool for silicon photonics GDSII files. It is:

- A commercial cloud SaaS tool hosted in the United States (Replit infrastructure)
- Not registered as a defense service provider
- Not cleared for processing ITAR-controlled technical data
- Not in possession of facility clearance or personnel clearances

PhotonLint **is not** an authorized processor of:
- ITAR-controlled technical data (22 C.F.R. Parts 120–130, USML Categories)
- EAR-controlled technology requiring an export license (EAR99 items are acceptable;
  items with a non-EAR99 ECCN and no license exception available are not)

---

## Controls in place

### 1. Terms of Service prohibition (legal)

Section 4 of the PhotonLint Terms of Service explicitly prohibits uploading files that are
controlled under ITAR or that require an EAR export license for cloud processing. Users accept
these terms before accessing the tool.

### 2. Upload-screen warning (UI)

The upload card subtitle reads:
> "Do not upload files subject to ITAR or EAR export-license requirements."

This warning is visible at the point of upload without requiring the user to recall the ToS.

### 3. Per-upload attestation checkbox (UI — strongest control)

Before submitting a DRC run, users must check a box confirming:
> "I confirm this file is not subject to ITAR or EAR export-license requirements."

The Run DRC Check button is disabled until this box is checked. This creates an active,
per-upload acknowledgment rather than a one-time ToS acceptance.

---

## What PhotonLint cannot do

PhotonLint has no technical means to detect whether a GDSII file is ITAR-controlled or
EAR-classified. Only the uploader and their organization can make that determination based
on the nature of the underlying design, its end-use, and the classifications assigned to
their program. The controls above shift legal responsibility to the uploader for any
misrepresentation.

---

## Customer screening

Before onboarding any of the following customer types, seek written legal advice from a
US export attorney:

| Customer type | Risk level | Action required before signing |
|---|---|---|
| US company, commercial photonics | Low | None — proceed |
| US university lab, US-citizen researchers | Low | None — proceed |
| US university lab, international researchers | Medium | EAR attorney review |
| Non-US company or individual | Medium–High | EAR attorney review |
| Defense contractor or defense-adjacent | High | ITAR/EAR attorney review; likely decline |
| Foreign government or state entity | High | Do not proceed without counsel |

---

## Incident response

If PhotonLint becomes aware that a user uploaded a file that may be ITAR-controlled or
EAR-restricted without authorization:

1. Immediately disable the account
2. Delete all associated run data and any stored artifacts
3. Consult a US export attorney within 24 hours
4. Do not contact the user until legal counsel has been obtained
5. Preserve server logs for the relevant sessions

---

## Record keeping

This document, the Terms of Service, and the Privacy Policy together constitute PhotonLint's
export compliance documentation. Keep all three current. Review this policy annually and
whenever the product, customer profile, or hosting arrangement changes materially.

---

*This document is confidential. Do not publish it in the application or share it externally
without legal review.*
