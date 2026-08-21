---
name: GitHub source sync
description: Constraints for syncing the local PhotonLint source tree to GitHub through the connected integration.
---

When GitHub authentication is provided through Replit’s connector rather than a local Git credential, use the GitHub Git Data API with a request pace below 10 requests per second. Do not ask the user to paste a token in chat.

**Why:** The connector proxy enforces a 10-RPS ceiling, and large generated archive blobs can be rejected even though they are not application source.

**How to apply:** Keep generated source ZIP exports out of Git and use an approximately 7-RPS, retrying upload flow for blobs before creating the tree, commit, and `main` ref update.