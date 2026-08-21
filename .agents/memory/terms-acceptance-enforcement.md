---
name: Terms acceptance enforcement
description: Compliance boundary for authenticated DRC submission paths.
---

Every DRC submission path must require acceptance of the current terms version after identity has been resolved and before file parsing or DRC work begins.

**Why:** A client-side acceptance gate can be bypassed by direct requests, API keys, or automation, leaving the intake prohibition unenforced where it matters.

**How to apply:** When adding any endpoint that submits an uploaded layout or local-engine result, place the server-side terms guard immediately after its authentication middleware. Version changes must make prior acceptance insufficient.